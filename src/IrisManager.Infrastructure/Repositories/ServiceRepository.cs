using IrisManager.Domain.Entities;
using IrisManager.Domain.Interfaces;
using IrisManager.Infrastructure.Context;

namespace IrisManager.Infrastructure.Repositories
{
    public class ServiceRepository : BaseRepository<Service>, IServiceRepository
    {
        public ServiceRepository(ApplicationDbContext context) : base(context)
        {
        }
    }
}