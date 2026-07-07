using IrisManager.Application.Dtos;

namespace IrisManager.Application.Contract
{
    public interface IServiceService
    {
        Task<IEnumerable<ServiceDto>> GetAllServicesAsync();
        Task<ServiceDto?> GetServiceByIdAsync(int id);
        Task<ServiceDto> CreateServiceAsync(ServiceCreateDto dto);
        Task<bool> UpdateServiceAsync(int id, ServiceUpdateDto dto);
        Task<bool> DeleteServiceAsync(int id);
    }
}
