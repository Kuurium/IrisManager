using IrisManager.Application.Dtos;

namespace IrisManager.Application.Contract
{
    public interface IStylistService
    {
        Task<IEnumerable<StylistDto>> GetAllStylistsAsync(bool activeOnly = false);
        Task<IEnumerable<StylistDto>> GetStylistsByServiceAsync(int serviceId);
        Task<StylistDto?> GetStylistByIdAsync(int id);
        Task<StylistDto> CreateStylistAsync(StylistCreateDto dto);
        Task<bool> UpdateStylistAsync(int id, StylistUpdateDto dto);
        Task<bool> DeleteStylistAsync(int id);
    }
}