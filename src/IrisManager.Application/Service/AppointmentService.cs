using IrisManager.Application.Contract;
using IrisManager.Application.Dtos;
using IrisManager.Domain.Entities;
using IrisManager.Domain.Interfaces;

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
                StylistId = a.StylistId,
                StylistName = a.Stylist?.Name ?? "N/A",
                ServiceId = a.ServiceId,
                ServiceName = a.Service?.Name ?? "N/A",
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
                StylistId = appointment.StylistId,
                StylistName = appointment.Stylist?.Name ?? "N/A",
                ServiceId = appointment.ServiceId,
                ServiceName = appointment.Service?.Name ?? "N/A",
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

            // Validate conflict before creating
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
    }
}