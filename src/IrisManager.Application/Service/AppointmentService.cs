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
            return appointments.Select(a => new AppointmentDto
            {
                Id = a.Id,
                CustomerId = a.CustomerId,
                StylistId = a.StylistId,
                ServiceId = a.ServiceId,
                StartTime = a.StartTime,
                EndTime = a.EndTime,
                Status = a.Status
            });
        }

        public async Task<AppointmentDto?> GetAppointmentByIdAsync(int id)
        {
            var appointment = await _appointmentRepository.GetByIdAsync(id);
            if (appointment == null) return null;

            return new AppointmentDto
            {
                Id = appointment.Id,
                CustomerId = appointment.CustomerId,
                StylistId = appointment.StylistId,
                ServiceId = appointment.ServiceId,
                StartTime = appointment.StartTime,
                EndTime = appointment.EndTime,
                Status = appointment.Status
            };
        }

        public async Task<AppointmentDto> CreateAppointmentAsync(AppointmentCreateDto dto)
        {
            var service = await _serviceRepository.GetByIdAsync(dto.ServiceId);
            if (service == null) throw new ArgumentException("Service not found.");

            var calculatedEndTime = dto.StartTime.AddMinutes(service.DurationMinutes);

            var allAppointments = await _appointmentRepository.GetAllAsync();
            var hasConflict = allAppointments.Any(a =>
            a.StylistId == dto.StylistId &&
            a.Status != "Cancelled" &&
            dto.StartTime < a.EndTime &&
            calculatedEndTime > a.StartTime);

            if (hasConflict)
            {
                throw new InvalidOperationException("The stylist is already booked for this time slot");
            }

            var appointment = new Appointment
            {
                CustomerId = dto.CustomerId,
                StylistId = dto.StylistId,
                ServiceId = dto.ServiceId,
                StartTime = dto.StartTime,
                EndTime = calculatedEndTime,
                Status = "Scheduled"
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
                Status = appointment.Status
            };
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
    }
}
