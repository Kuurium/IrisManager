using IrisManager.Domain.Entities;
using IrisManager.Domain.Interfaces;
using IrisManager.Infrastructure.Context;

namespace IrisManager.Infrastructure.Repositories
{
    public class AppointmentRepository : BaseRepository<Appointment>, IAppointmentRepository
    {
        public AppointmentRepository(ApplicationDbContext context) : base(context)
        {
        }
    }
}