using IrisManager.Domain.Entities;
using IrisManager.Domain.Interfaces;
using IrisManager.Infrastructure.Context;
using Microsoft.EntityFrameworkCore;

namespace IrisManager.Infrastructure.Repositories
{
    public class StylistRepository : BaseRepository<Stylist>, IStylistRepository
    {
        public StylistRepository(ApplicationDbContext context) : base(context)
        {
        }

        public async Task<IEnumerable<Stylist>> GetStylistsWithServicesAsync()
        {
            return await _context.Set<Stylist>()
                .Include(s => s.Services)
                .ToListAsync();
        }

        public async Task<Stylist?> GetByIdWithServicesAsync(int id)
        {
            return await _context.Set<Stylist>()
                .Include(s => s.Services)
                .FirstOrDefaultAsync(s => s.Id == id);
        }
    }
}