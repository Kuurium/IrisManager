using IrisManager.Domain.Entities;

namespace IrisManager.Domain.Interfaces
{
    public interface IServiceRepository : IBaseRepository<Service>
    {
        Task<IEnumerable<Service>> GetByIdsAsync(IEnumerable<int> ids);
    }
}