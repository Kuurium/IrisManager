using IrisManager.API.DTOs;
using IrisManager.Application.Dtos;

namespace IrisManager.Application.Contract
{
    public interface IAppointmentService
    {
        Task<IEnumerable<AppointmentDto>> GetAllAppointmentsAsync();
        Task<AppointmentDto?> GetAppointmentByIdAsync(int id);
        Task<AppointmentDto> CreateAppointmentAsync(AppointmentCreateDto dto);
        Task<bool> UpdateAppointmentStatusAsync(int id, AppointmentUpdateStatusDto dto);
        Task<bool> DeleteAppointmentAsync(int id);
        Task UpdateAppointmentAsync(int id, AppointmentUpdateDto updateDto);
        Task<DashboardSummaryDto> GetDashboardSummaryAsync();
    }
}