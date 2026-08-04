using IrisManager.Application.Dtos;
using IrisManager.Application.Contract;
using IrisManager.Application.Dtos;
using Microsoft.AspNetCore.Mvc;

namespace IrisManager.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class StylistsController : ControllerBase
    {
        private readonly IStylistService _stylistService;

        public StylistsController(IStylistService stylistService)
        {
            _stylistService = stylistService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<StylistDto>>> GetStylists([FromQuery] bool activeOnly = false)
        {
            var stylists = await _stylistService.GetAllStylistsAsync(activeOnly);
            return Ok(stylists);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<StylistDto>> GetStylist(int id)
        {
            var stylist = await _stylistService.GetStylistByIdAsync(id);
            if (stylist == null) return NotFound(new { message = "Stylist not found." });
            return Ok(stylist);
        }

        [HttpPost]
        public async Task<ActionResult<StylistDto>> CreateStylist(StylistCreateDto dto)
        {
            var newStylist = await _stylistService.CreateStylistAsync(dto);
            return CreatedAtAction(nameof(GetStylist), new { id = newStylist.Id }, newStylist);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateStylist(int id, StylistUpdateDto dto)
        {
            var updated = await _stylistService.UpdateStylistAsync(id, dto);
            if (!updated) return NotFound(new { message = "Stylist not found." });
            return NoContent();
        }


        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteStylist(int id)
        {
            var deleted = await _stylistService.DeleteStylistAsync(id);
            if (!deleted) return NotFound(new { message = "Stylist not found." });
            return NoContent();

        }
    }
}