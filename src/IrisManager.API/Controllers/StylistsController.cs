using IrisManager.API.Data;
using IrisManager.API.DTOs;
using IrisManager.API.Models;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

namespace IrisManager.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class StylistsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public StylistsController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<StylistDto>>> GetStylists([FromQuery] bool activeOnly = false)
        {
            var query = _context.Stylists.AsQueryable();

            if (activeOnly)
            {
                query = query.Where(s => s.IsActive);
            }

            var stylists = await query
                .Select(s => new StylistDto
                {
                    Id = s.Id,
                    Name = s.Name,
                    Specialty = s.Specialty,
                    IsActive = s.IsActive
                })
                .ToListAsync();

            return Ok(stylists);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<StylistDto>> GetStylist(int id)
        {
            var stylist = await _context.Stylists.FindAsync(id);

            if (stylist == null)
            {
                return NotFound();
            }

            return Ok(new StylistDto
            {
                Id = stylist.Id,
                Name = stylist.Name,
                Specialty = stylist.Specialty,
                IsActive = stylist.IsActive
            });
        }

        [HttpPost]
        public async Task<ActionResult<StylistDto>> CreateStylist(StylistCreateDto stylistDto)
        {
            var stylist = new Stylist
            {
                Name = stylistDto.Name,
                Specialty = stylistDto.Specialty,
                IsActive = stylistDto.IsActive
            };

            _context.Stylists.Add(stylist);
            await _context.SaveChangesAsync();

            var createdDto = new StylistDto
            {
                Id = stylist.Id,
                Name = stylist.Name,
                Specialty = stylist.Specialty,
                IsActive = stylist.IsActive
            };

            return CreatedAtAction(nameof(GetStylist), new { id = stylist.Id }, createdDto);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateStylist(int id, StylistUpdateDto stylistDto)
        {
            if (id != stylistDto.Id)
            {
                return BadRequest();
            }

            var stylist = await _context.Stylists.FindAsync(id);
            if (stylist == null)
            {
                return NotFound();
            }

            stylist.Name = stylistDto.Name;
            stylist.Specialty = stylistDto.Specialty;
            stylist.IsActive = stylistDto.IsActive;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!StylistExists(id))
                {
                    return NotFound();
                }
                throw;
            }
            return NoContent();
        }


        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteStylist(int id)
        {
            var stylist = await _context.Stylists.FindAsync(id);
            if (stylist == null)
            {
                return NotFound();
            }

            _context.Stylists.Remove(stylist);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool StylistExists(int id)
        {
            return _context.Stylists.Any(equals => equals.Id == id);
        }
    }
}