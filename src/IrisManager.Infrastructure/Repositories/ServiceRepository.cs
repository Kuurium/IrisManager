using IrisManager.Domain.Entities;
using IrisManager.Domain.Interfaces;
using IrisManager.Infrastructure.Context;
using Microsoft.EntityFrameworkCore;

namespace IrisManager.Infrastructure.Repositories
{
    public class ServiceRepository : BaseRepository<Service>, IServiceRepository
    {
        public ServiceRepository(ApplicationDbContext context) : base(context)
        {
        }

        public async Task<IEnumerable<Service>> GetByIdsAsync(IEnumerable<int> ids)
        {
            return await _context.Set<Service>()
                .Where(s => ids.Contains(s.Id))
                .ToListAsync();
        }
    }
}