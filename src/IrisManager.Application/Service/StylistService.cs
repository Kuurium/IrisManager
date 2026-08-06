using IrisManager.Application.Contract;
using IrisManager.Application.Dtos;
using IrisManager.Domain.Entities;
using IrisManager.Domain.Interfaces;

namespace IrisManager.Application.Service
{
    public class StylistService : IStylistService
    {
        private readonly IStylistRepository _stylistRepository;
        private readonly IServiceRepository _serviceRepository;

        public StylistService(IStylistRepository stylistRepository, IServiceRepository serviceRepository)
        {
            _stylistRepository = stylistRepository;
            _serviceRepository = serviceRepository;
        }

        public async Task<IEnumerable<StylistDto>> GetAllStylistsAsync(bool activeonly = false)
        {
            var stylists = await _stylistRepository.GetStylistsWithServicesAsync();

            if (activeonly)
            {
                stylists = stylists.Where(s => s.IsActive);
            }

            return stylists.Select(MapToStylistDto);
        }

        public async Task<IEnumerable<StylistDto>> GetStylistsByServiceAsync(int serviceId)
        {
            var stylists = await _stylistRepository.GetStylistsWithServicesAsync();

            var filtered = stylists.Where(s =>
                s.IsActive &&
                s.Services != null &&
                s.Services.Any(srv => srv.Id == serviceId)
            );

            return filtered.Select(MapToStylistDto);
        }

        public async Task<StylistDto?> GetStylistByIdAsync(int id)
        {
            var stylist = await _stylistRepository.GetByIdWithServicesAsync(id);
            if (stylist == null) return null;

            return MapToStylistDto(stylist);
        }

        public async Task<StylistDto> CreateStylistAsync(StylistCreateDto dto)
        {
            var stylist = new Stylist
            {
                Name = dto.Name,
                Email = dto.Email,
                Phone = dto.Phone,
                IsActive = dto.IsActive,
                Services = new List<Domain.Entities.Service>()
            };

            if (dto.ServiceIds != null && dto.ServiceIds.Any())
            {
                var services = await _serviceRepository.GetByIdsAsync(dto.ServiceIds);
                foreach (var service in services)
                {
                    stylist.Services.Add(service);
                }
            }

            await _stylistRepository.AddAsync(stylist);
            await _stylistRepository.SaveChangesAsync();

            return MapToStylistDto(stylist);
        }

        public async Task<bool> UpdateStylistAsync(int id, StylistUpdateDto dto)
        {
            var stylist = await _stylistRepository.GetByIdWithServicesAsync(id);
            if (stylist == null) return false;

            stylist.Name = dto.Name;
            stylist.Email = dto.Email;
            stylist.Phone = dto.Phone;
            stylist.IsActive = dto.IsActive;

            if (dto.ServiceIds != null)
            {
                var selectedServices = await _serviceRepository.GetByIdsAsync(dto.ServiceIds);

                stylist.Services.Clear();
                foreach (var service in selectedServices)
                {
                    stylist.Services.Add(service);
                }
            }

            _stylistRepository.Update(stylist);
            await _stylistRepository.SaveChangesAsync();
            return true;
        }

        public async Task<bool> DeleteStylistAsync(int id)
        {
            var stylist = await _stylistRepository.GetByIdAsync(id);
            if (stylist == null) return false;

            stylist.IsActive = false;
            _stylistRepository.Update(stylist);

            await _stylistRepository.SaveChangesAsync();
            return true;
        }

        private static StylistDto MapToStylistDto(Stylist s)
        {
            var serviceList = s.Services?.ToList() ?? new List<Domain.Entities.Service>();
            var serviceNames = serviceList.Select(srv => srv.Name).ToList();
            var serviceIds = serviceList.Select(srv => srv.Id).ToList();

            string fullSpecialtyString = string.Join(" - ", serviceNames);
            string displaySpecialty = string.Empty;

            if (serviceNames.Count > 2)
            {
                var firstTwo = string.Join(", ", serviceNames.Take(2));
                int remaining = serviceNames.Count - 2;
                displaySpecialty = $"{firstTwo}... y {remaining} más";
            }
            else
            {
                displaySpecialty = string.Join(", ", serviceNames);
            }

            return new StylistDto
            {
                Id = s.Id,
                Name = s.Name,
                Email = s.Email,
                Phone = s.Phone,
                IsActive = s.IsActive,
                Specialty = displaySpecialty,
                FullSpecialties = fullSpecialtyString,
                ServiceIds = serviceIds,
                ServiceNames = serviceNames
            };
        }
    }
}