using IrisManager.Domain.Entities;
using IrisManager.Domain.Interfaces;
using IrisManager.Infrastructure.Context;
using Microsoft.EntityFrameworkCore;

namespace IrisManager.Infrastructure.Repositories
{
    public class AppointmentRepository : BaseRepository<Appointment>, IAppointmentRepository
    {
        private new readonly ApplicationDbContext _context;

        public AppointmentRepository(ApplicationDbContext context) : base(context)
        {
            _context = context;
        }

        public new async Task<IEnumerable<Appointment>> GetAllAsync()
        {
            return await _context.Appointments
                .Include(a => a.Customer)
                .Include(a => a.Stylist)
                .Include(a => a.Service)
                .ToListAsync();
        }

        public new async Task<Appointment?> GetByIdAsync(int id)
        {
            return await _context.Appointments
                .Include(a => a.Customer)
                .Include(a => a.Stylist)
                .Include(a => a.Service)
                .FirstOrDefaultAsync(a => a.Id == id);
        }
    }
}