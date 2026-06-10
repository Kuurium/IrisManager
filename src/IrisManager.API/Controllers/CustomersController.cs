using IrisManager.API.Data;
using IrisManager.API.DTOs;
using IrisManager.API.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace IrisManager.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CustomersController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public CustomersController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<CustomerDto>>> GetCustomers([FromQuery] string? name)
        {
            var query = _context.Customers.AsQueryable();

            if (!string.IsNullOrWhiteSpace(name))
            {
                query = query.Where(c => EF.Functions.Like(c.Name, $"%{name}%"));
            }

            var customers = await query
                .Select(c => new CustomerDto
                {
                    Id = c.Id,
                    Name = c.Name,
                    Phone = c.Phone,
                    Email = c.Email
                })
                .ToListAsync();

            return Ok(customers);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<CustomerDto>> GetCustomer(int id)
        {
            var customer = await _context.Customers.FindAsync(id);

            if (customer == null)
            {
                return NotFound();
            }

            var customerDto = new CustomerDto
            {
                Id = customer.Id,
                Name = customer.Name,
                Phone = customer.Phone,
                Email = customer.Email
            };

            return Ok(customerDto);
        }

        [HttpPost]
        public async Task<ActionResult<CustomerDto>> CreateCustomer(CustomerCreateDto customerDto)
        {
            var phoneExists = await _context.Customers.AnyAsync(c => c.Phone == customerDto.Phone);
            if (phoneExists)
            {
                return Conflict(new { message = "A customer with this phone number already exists." });
            }

            if (!string.IsNullOrWhiteSpace(customerDto.Email))
            {
                var emailExists = await _context.Customers.AnyAsync(c => c.Email == customerDto.Email);
                if (emailExists)
                {
                    return Conflict(new { message = "A customer with this email already exists." });
                }
            }

            var customer = new Customer
            {
                Name = customerDto.Name,
                Phone = customerDto.Phone,
                Email = customerDto.Email
            };

            _context.Customers.Add(customer);
            await _context.SaveChangesAsync();

            var createdDto = new CustomerDto
            {
                Id = customer.Id,
                Name = customer.Name,
                Phone = customer.Phone,
                Email = customer.Email
            };

            return CreatedAtAction(nameof(GetCustomer), new { id = customer.Id }, createdDto);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateCustomer(int id, CustomerUpdateDto customerDto)
        {
            if (id != customerDto.Id)
            {
                return BadRequest();
            }

            var customer = await _context.Customers.FindAsync(id);
            if (customer == null)
            {
                return NotFound();
            }

            customer.Name = customerDto.Name;
            customer.Phone = customerDto.Phone;
            customer.Email = customerDto.Email;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!CustomerExists(id))
                {
                    return NotFound();
                }
                throw;
            }

            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCustomer(int id)
        {
            var customer = await _context.Customers.FindAsync(id);
            if (customer == null)
            {
                return NotFound();
            }

            _context.Customers.Remove(customer);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool CustomerExists(int id)
        {
            return _context.Customers.Any(e => e.Id == id)  ;
        }
    }
}