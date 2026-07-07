using IrisManager.Application.Contract;
using IrisManager.Application.Dtos;
using Microsoft.AspNetCore.Mvc;

namespace IrisManager.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ServicesController : ControllerBase
    {
        private readonly IServiceService _serviceService;

        public ServicesController(IServiceService serviceService)
        {
            _serviceService = serviceService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<ServiceDto>>> GetServices()
        {
            var services = await _serviceService.GetAllServicesAsync();
            return Ok(services);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ServiceDto>> GetService(int id)
        {
            var service = await _serviceService.GetServiceByIdAsync(id);
            if (service == null) return NotFound(new { message = "Service not found." });
            return Ok(service);
        }

        [HttpPost]
        public async Task<ActionResult<ServiceDto>> CreateService(ServiceCreateDto dto)
        {
            var newService = await _serviceService.CreateServiceAsync(dto);
            return CreatedAtAction(nameof(GetService), new { id = newService.Id }, newService);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateService(int id, ServiceUpdateDto dto)
        {
            var updated = await _serviceService.UpdateServiceAsync(id, dto);
            if (!updated) return NotFound(new { message = "Service not found." });
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteService(int id)
        {
            var deleted = await _serviceService.DeleteServiceAsync(id);
            if (!deleted) return NotFound(new { message = "Service not found." });
            return NoContent();
        }
    }
}