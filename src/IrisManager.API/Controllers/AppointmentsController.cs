using IrisManager.API.Data;
using IrisManager.API.DTOs;
using IrisManager.API.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Reflection.Metadata.Ecma335;

namespace IrisManager.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AppointmentsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public AppointmentsController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<AppointmentDto>>> GetAppointments([FromQuery] DateTime? date)
        {
            var query = _context.Appointments.AsQueryable();

            if (date.HasValue)
            {
                query = query.Where(a => a.StartTime.Date == date.Value.Date);
            }

            var appointments = await query
                .Select(a => new AppointmentDto
                {
                    Id = a.Id,
                    StylistId = a.StylistId,
                    ServiceId = a.ServiceId,
                    StartTime = a.StartTime,
                    EndTime = a.EndTime,
                    Status = a.Status
                })
            .ToListAsync();

            return Ok(appointments);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<AppointmentDto>> GetAppointment(int id)
        {
            var appointment = await _context.Appointments.FindAsync(id);

            if (appointment == null) 
            {
                return NotFound();
            }

            return Ok(new AppointmentDto
            {
                Id = appointment.Id,
                CustomerId = appointment.CustomerId,
                StylistId = appointment.StylistId,
                ServiceId = appointment.ServiceId,
                StartTime = appointment.StartTime,
                EndTime = appointment.EndTime,
                Status = appointment.Status
            });
        }

        [HttpPost]
        public async Task<ActionResult<AppointmentDto>> CreateAppointment(Appointment dto)
        {
            var customerExists = await _context.Customers.AnyAsync(c => c.Id == dto.CustomerId);
            if (!customerExists) return BadRequest(new { message = "Customer not found." });

            var stylist = await _context.Stylists.FindAsync(dto.StylistId);
            if (stylist == null || !stylist.IsActive) return BadRequest(new { message = "Stylist not found or inactive." });

            var service = await _context.Services.FindAsync(dto.ServiceId);
            if (service == null) return BadRequest(new { message = "Service not found." });

            var calculatedEndTime = dto.StartTime.AddMinutes(service.DurationMinutes);

            var isStylistBooked = await _context.Appointments
                .AnyAsync(a => a.StylistId == dto.StylistId
                && a.Status != "Cancelled"
                && dto.StartTime < a.EndTime
                && calculatedEndTime > a.StartTime);

            if (isStylistBooked)
            {
                return Conflict(new { message = "The stylist is already booked for this time slot. " });
            }

            var appointment = new Appointment
            {
                CustomerId = dto.CustomerId,
                StylistId = dto.StylistId,
                ServiceId = dto.ServiceId,
                StartTime = dto.StartTime,
                EndTime = dto.EndTime,
                Status = "Scheduled"
            };

            _context.Appointments.Add(appointment);
            await _context.SaveChangesAsync();

            var createdDto = new AppointmentDto
            {
                Id = appointment.Id,
                CustomerId = appointment.CustomerId,
                StylistId = appointment.StylistId,
                ServiceId = appointment.ServiceId,
                StartTime = appointment.StartTime,
                EndTime = appointment.EndTime,
                Status = appointment.Status
            };

            return CreatedAtAction(nameof(GetAppointment), new { id = appointment.Id }, createdDto);
        }

        [HttpPatch("{id}/status")]
        public async Task<IActionResult> UpdateAppointmentStatus(int id, AppointmentUpdateStatusDto dto)
        {
            var validStatuses = new[] { "Scheduled", "Completed", "Cancelled" };
            if (!validStatuses.Contains(dto.Status))
            {
                return BadRequest(new { message = "Invalid status. Must be scheduled, Completed, or Cancelled" });
            }

            var appointment = await _context.Appointments.FindAsync(id);
            if (appointment == null)
            {
                return NotFound();
            }

            appointment.Status = dto.Status;
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
