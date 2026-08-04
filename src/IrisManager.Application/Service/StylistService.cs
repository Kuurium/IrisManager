using IrisManager.Application.Contract;
using IrisManager.Application.Dtos;
using IrisManager.Domain.Entities;
using IrisManager.Domain.Interfaces;

namespace IrisManager.Application.Service
{
    public class StylistService : IStylistService
    {
        private readonly IStylistRepository _stylistRepository;

        public StylistService(IStylistRepository stylistRepository)
        {
            _stylistRepository = stylistRepository;
        }

        public async Task<IEnumerable<StylistDto>> GetAllStylistsAsync(bool activeonly = false)
        {
            var stylists = await _stylistRepository.GetAllAsync();

            if (activeonly)
            {
                stylists = stylists.Where(s => s.IsActive);
            }

            return stylists.Select(s => new StylistDto
            {
                Id = s.Id,
                Name = s.Name,
                Email = s.Email,
                Phone = s.Phone,
                Specialty = s.Specialty,
                IsActive = s.IsActive
            });
        }

        public async Task<StylistDto?> GetStylistByIdAsync(int id)
        {
            var stylist = await _stylistRepository.GetByIdAsync(id);
            if (stylist == null) return null;

            return new StylistDto
            {
                Id = stylist.Id,
                Name = stylist.Name,
                Email = stylist.Email,
                Phone = stylist.Phone,
                Specialty = stylist.Specialty,
                IsActive = stylist.IsActive
            };
        }

        public async Task<StylistDto> CreateStylistAsync(StylistCreateDto dto)
        {
            var stylist = new Stylist
            {
                Name = dto.Name,
                Email = dto.Email, 
                Phone = dto.Phone,
                Specialty = dto.Specialty,
                IsActive = dto.IsActive
            };

            await _stylistRepository.AddAsync(stylist);
            await _stylistRepository.SaveChangesAsync();

            return new StylistDto
            {
                Id = stylist.Id,
                Name = stylist.Name,
                Specialty = stylist.Specialty,
                IsActive = stylist.IsActive
            };
        }

        public async Task<bool> UpdateStylistAsync(int id, StylistUpdateDto dto)
        {
            var stylist = await _stylistRepository.GetByIdAsync(id);
            if (stylist == null) return false;

            stylist.Name = dto.Name;
            stylist.Email = dto.Email;
            stylist.Phone = dto.Phone;
            stylist.Specialty = dto.Specialty;
            stylist.IsActive = dto.IsActive;

            _stylistRepository.Update(stylist);
            await _stylistRepository.SaveChangesAsync();
            return true;
        }

        public async Task<bool> DeleteStylistAsync(int id)
        {
            var stylist = await _stylistRepository.GetByIdAsync(id);
            if (stylist == null) return false;
            stylist.IsActive = false;


            // _stylistRepository.Update(stylist);

            await _stylistRepository.SaveChangesAsync();
            return true;
        }
    }
}
