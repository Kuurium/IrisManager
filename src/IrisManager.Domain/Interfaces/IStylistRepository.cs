using IrisManager.Domain.Entities;

namespace IrisManager.Domain.Interfaces
{
    public interface IStylistRepository : IBaseRepository<Stylist>
    {
        Task<IEnumerable<Stylist>> GetStylistsWithServicesAsync();
        Task<Stylist?> GetByIdWithServicesAsync(int id);
    }
}