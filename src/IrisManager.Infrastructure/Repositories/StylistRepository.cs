using IrisManager.Domain.Entities;
using IrisManager.Domain.Interfaces;
using IrisManager.Infrastructure.Context;

namespace IrisManager.Infrastructure.Repositories
{
    public class StylistRepository : BaseRepository<Stylist>, IStylistRepository
    {
        public StylistRepository(ApplicationDbContext context) : base(context)
        {
        }
    }
}