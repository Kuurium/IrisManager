using IrisManager.Application.Contract;
using IrisManager.Application.Dtos;
using IrisManager.Domain.Entities;
using IrisManager.Domain.Interfaces;

namespace IrisManager.Application.Service
{
    public class ServiceService : IServiceService
    {
        private readonly IServiceRepository _serviceRepository;

        public ServiceService(IServiceRepository serviceRepository)
        {
            _serviceRepository = serviceRepository;
        }

        public async Task<IEnumerable<ServiceDto>> GetAllServicesAsync()
        {
            var services = await _serviceRepository.GetAllAsync();
            return services.Select(s => new ServiceDto
            {
                Id = s.Id,
                Name = s.Name,
                Description = s.Description,
                Price = s.Price,
                DurationMinutes = s.DurationMinutes
            });
        }

        public async Task<ServiceDto?> GetServiceByIdAsync(int id)
        {
            var service = await _serviceRepository.GetByIdAsync(id);
            if (service == null) return null;

            return new ServiceDto
            {
                Id = service.Id,
                Name = service.Name,
                Description = service.Description,
                Price = service.Price,
                DurationMinutes = service.DurationMinutes
            };
        }

        public async Task<ServiceDto> CreateServiceAsync(ServiceCreateDto dto)
        {
            var service = new Domain.Entities.Service
            {
                Name = dto.Name,
                Description = dto.Description,
                Price = dto.Price,
                DurationMinutes = dto.DurationMinutes
            };

            await _serviceRepository.AddAsync(service);
            await _serviceRepository.SaveChangesAsync();

            return new ServiceDto
            {
                Id = service.Id,
                Name = service.Name,
                Description = service.Description,
                Price = service.Price,
                DurationMinutes = service.DurationMinutes
            };
        }

        public async Task<bool> UpdateServiceAsync(int id, ServiceUpdateDto dto)
        {
            var service = await _serviceRepository.GetByIdAsync(id);
            if (service == null) return false;

            service.Name = dto.Name;
            service.Description = dto.Description;
            service.Price = dto.Price;
            service.DurationMinutes = dto.DurationMinutes;

            _serviceRepository.Update(service);
            await _serviceRepository.SaveChangesAsync();
            return true;
        }

        public async Task<bool> DeleteServiceAsync(int id)
        {
            var service = await _serviceRepository.GetByIdAsync(id);
            if (service == null) return false;

            _serviceRepository.Delete(service);
            await _serviceRepository.SaveChangesAsync();
            return true;
        }
    }
}
