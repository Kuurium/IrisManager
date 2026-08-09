using IrisManager.API.DTOs;
using IrisManager.Application.Contract;
using IrisManager.Application.Dtos;
using IrisManager.Domain.Entities;
using IrisManager.Domain.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace IrisManager.Application.Service
{
    public class AppointmentService : IAppointmentService
    {
        private readonly IAppointmentRepository _appointmentRepository;
        private readonly IServiceRepository _serviceRepository;

        public AppointmentService(IAppointmentRepository appointmentRepository, IServiceRepository serviceRepository)
        {
            _appointmentRepository = appointmentRepository;
            _serviceRepository = serviceRepository;
        }

        public async Task<IEnumerable<AppointmentDto>> GetAllAppointmentsAsync()
        {
            var appointments = await _appointmentRepository.GetAllAsync();
            var inMemoryAppointments = appointments.ToList();

            return inMemoryAppointments.Select(a => new AppointmentDto
            {
                Id = a.Id,
                CustomerId = a.CustomerId,
                CustomerName = a.Customer?.Name ?? "N/A",
                IsCustomerActive = a.Customer?.IsActive ?? true,
                StylistId = a.StylistId,
                StylistName = a.Stylist?.Name ?? "N/A",
                ServiceId = a.ServiceId,
                ServiceName = a.Service?.Name ?? "N/A",
                ServicePrice = a.Service?.Price ?? 0,
                StartTime = a.StartTime,
                EndTime = a.EndTime,
                Status = a.Status,
                PaymentMethod = a.PaymentMethod
            }).ToList();
        }

        public async Task<AppointmentDto?> GetAppointmentByIdAsync(int id)
        {
            var appointment = await _appointmentRepository.GetByIdAsync(id);
            if (appointment == null) return null;

            return new AppointmentDto
            {
                Id = appointment.Id,
                CustomerId = appointment.CustomerId,
                CustomerName = appointment.Customer?.Name ?? "N/A",
                IsCustomerActive = appointment.Customer?.IsActive ?? true,
                StylistId = appointment.StylistId,
                StylistName = appointment.Stylist?.Name ?? "N/A",
                ServiceId = appointment.ServiceId,
                ServiceName = appointment.Service?.Name ?? "N/A",
                ServicePrice = appointment.Service?.Price ?? 0,
                StartTime = appointment.StartTime,
                EndTime = appointment.EndTime,
                Status = appointment.Status,
                PaymentMethod = appointment.PaymentMethod
            };
        }

        public async Task<AppointmentDto> CreateAppointmentAsync(AppointmentCreateDto dto)
        {
            var service = await _serviceRepository.GetByIdAsync(dto.ServiceId);
            if (service == null) throw new ArgumentException("Service not found.");

            var calculatedEndTime = dto.StartTime.AddMinutes(service.DurationMinutes);

            ValidateBusinessHours(dto.StartTime, calculatedEndTime);
            await ValidateStylistAvailabilityAsync(dto.StylistId, dto.StartTime, calculatedEndTime);

            var appointment = new Appointment
            {
                CustomerId = dto.CustomerId,
                StylistId = dto.StylistId,
                ServiceId = dto.ServiceId,
                StartTime = dto.StartTime,
                Status = string.IsNullOrWhiteSpace(dto.Status) ? "Scheduled" : dto.Status,
                EndTime = calculatedEndTime,
                PaymentMethod = dto.PaymentMethod
            };

            await _appointmentRepository.AddAsync(appointment);
            await _appointmentRepository.SaveChangesAsync();

            return new AppointmentDto
            {
                Id = appointment.Id,
                CustomerId = appointment.CustomerId,
                StylistId = appointment.StylistId,
                ServiceId = appointment.ServiceId,
                ServiceName = service.Name,
                ServicePrice = service.Price,
                StartTime = appointment.StartTime,
                EndTime = appointment.EndTime,
                Status = appointment.Status,
                PaymentMethod = appointment.PaymentMethod
            };
        }

        public async Task UpdateAppointmentAsync(int id, AppointmentUpdateDto updateDto)
        {
            var appointment = await _appointmentRepository.GetByIdAsync(id);
            if (appointment == null)
            {
                throw new KeyNotFoundException("The requested appointment does not exist.");
            }

            var service = await _serviceRepository.GetByIdAsync(updateDto.ServiceId);
            if (service == null)
            {
                throw new ArgumentException("Service not found.");
            }

            DateTime newStartTime = updateDto.StartTime;

            if (newStartTime == default)
            {
                throw new FormatException("Invalid date or time format.");
            }

            DateTime newEndTime = newStartTime.AddMinutes(service.DurationMinutes > 0 ? service.DurationMinutes : 30);

            ValidateBusinessHours(newStartTime, newEndTime);
            await ValidateStylistAvailabilityAsync(updateDto.StylistId, newStartTime, newEndTime, currentAppointmentId: id);

            appointment.StartTime = newStartTime;
            appointment.EndTime = newEndTime;
            appointment.CustomerId = updateDto.CustomerId;
            appointment.StylistId = updateDto.StylistId;
            appointment.ServiceId = updateDto.ServiceId;
            appointment.Notes = updateDto.Notes;
            appointment.Status = updateDto.Status ?? appointment.Status;
            appointment.PaymentMethod = updateDto.PaymentMethod ?? appointment.PaymentMethod;

            await _appointmentRepository.SaveChangesAsync();
        }

        public async Task<bool> UpdateAppointmentStatusAsync(int id, AppointmentUpdateStatusDto dto)
        {
            var appointment = await _appointmentRepository.GetByIdAsync(id);
            if (appointment == null) return false;

            appointment.Status = dto.Status;

            _appointmentRepository.Update(appointment);
            await _appointmentRepository.SaveChangesAsync();
            return true;
        }

        public async Task<bool> DeleteAppointmentAsync(int id)
        {
            var appointment = await _appointmentRepository.GetByIdAsync(id);
            if (appointment == null) return false;

            _appointmentRepository.Delete(appointment);
            await _appointmentRepository.SaveChangesAsync();
            return true;
        }

        private void ValidateBusinessHours(DateTime startTime, DateTime endTime)
        {
            var dayOfWeek = startTime.DayOfWeek;
            TimeSpan openTime;
            TimeSpan closeTime;

            switch (dayOfWeek)
            {
                case DayOfWeek.Monday:
                case DayOfWeek.Tuesday:
                case DayOfWeek.Wednesday:
                case DayOfWeek.Thursday:
                case DayOfWeek.Friday:
                    openTime = new TimeSpan(8, 0, 0);   // 8:00 AM
                    closeTime = new TimeSpan(19, 0, 0); // 7:00 PM
                    break;

                case DayOfWeek.Saturday:
                    openTime = new TimeSpan(8, 0, 0);   // 8:00 AM
                    closeTime = new TimeSpan(20, 0, 0);  // 8:00 PM
                    break;

                case DayOfWeek.Sunday:
                    openTime = new TimeSpan(9, 0, 0);   // 9:00 AM
                    closeTime = new TimeSpan(14, 0, 0);  // 2:00 PM
                    break;

                default:
                    throw new InvalidOperationException("Invalid day of the week.");
            }

            TimeSpan appointmentStart = startTime.TimeOfDay;
            TimeSpan appointmentEnd = endTime.TimeOfDay;

            if (appointmentStart < openTime || appointmentEnd > closeTime)
            {
                throw new InvalidOperationException(
                    $"The selected time is outside business hours. Opening hours for this day are from {openTime:hh\\:mm} to {closeTime:hh\\:mm}."
                );
            }
        }

        private async Task ValidateStylistAvailabilityAsync(int stylistId, DateTime startTime, DateTime endTime, int? currentAppointmentId = null)
        {
            var allAppointments = await _appointmentRepository.GetAllAsync();

            var activeStatuses = new[] { "Scheduled", "Programada", "Reprogramada", "Rescheduled", "In Process" };

            var hasConflict = allAppointments.Any(a =>
            {
                if (currentAppointmentId.HasValue && a.Id == currentAppointmentId.Value) return false;
                if (a.StylistId != stylistId) return false;
                if (!activeStatuses.Contains(a.Status, StringComparer.OrdinalIgnoreCase)) return false;

                DateTime existingStart = a.StartTime;
                DateTime existingEnd = a.EndTime != default
                    ? a.EndTime
                    : existingStart.AddMinutes(a.Service?.DurationMinutes > 0 ? a.Service.DurationMinutes : 30);

                return startTime < existingEnd && endTime > existingStart;
            });

            if (hasConflict)
            {
                throw new InvalidOperationException("The stylist is already booked for this time slot.");
            }
        }

        public async Task<DashboardSummaryDto> GetDashboardSummaryAsync()
        {
            var today = DateTime.Today;

            int diff = (7 + (today.DayOfWeek - DayOfWeek.Monday)) % 7;
            var startOfWeek = today.AddDays(-1 * diff).Date;
            var endOfWeek = startOfWeek.AddDays(7).AddTicks(-1);

            var startOfMonth = new DateTime(today.Year, today.Month, 1);
            var endOfMonth = startOfMonth.AddMonths(1).AddTicks(-1);

            var allAppointments = (await _appointmentRepository.GetAllAsync()).ToList();

            var todayAppointments = allAppointments.Where(a => a.StartTime.Date == today).ToList();
            var weekAppointments = allAppointments.Where(a => a.StartTime >= startOfWeek && a.StartTime <= endOfWeek).ToList();
            var monthAppointments = allAppointments.Where(a => a.StartTime >= startOfMonth && a.StartTime <= endOfMonth).ToList();

            var activeStylists = todayAppointments
                .Where(a => a.Stylist != null)
                .GroupBy(a => new { a.StylistId, Name = a.Stylist?.Name ?? "Sin nombre" })
                .Select(g => new StylistDailySummaryDto
                {
                    StylistId = g.Key.StylistId,
                    StylistName = g.Key.Name ?? "Sin nombre",
                    AppointmentsCount = g.Count()
                })
                .ToList();

            var topService = monthAppointments
                .GroupBy(a => a.Service?.Name)
                .OrderByDescending(g => g.Count())
                .Select(g => g.Key)
                .FirstOrDefault() ?? "Sin registros";

            var topPayment = monthAppointments
                .GroupBy(a => a.PaymentMethod)
                .OrderByDescending(g => g.Count())
                .Select(g => g.Key)
                .FirstOrDefault() ?? "N/A";

            return new DashboardSummaryDto
            {
                AppointmentsToday = todayAppointments.Count,
                AppointmentsThisWeek = weekAppointments.Count,
                TodayDayName = today.ToString("dddd", new System.Globalization.CultureInfo("es-ES")),
                ScheduledCount = allAppointments.Count(a => a.Status == "Scheduled" || a.Status == "Programada"),
                RescheduledCount = allAppointments.Count(a => a.Status == "Rescheduled" || a.Status == "Reprogramada"),
                CompletedCount = allAppointments.Count(a => a.Status == "Completed" || a.Status == "Completada"),
                CancelledCount = allAppointments.Count(a => a.Status == "Cancelled" || a.Status == "Cancelada"),
                TotalRevenueMonth = monthAppointments
                    .Where(a => a.Status == "Completed" || a.Status == "Completada")
                    .Sum(a => a.Service?.Price ?? 0),
                MostPopularService = topService,
                PreferredPaymentMethod = topPayment,
                ActiveStylistsToday = activeStylists
            };
        }
    }
}