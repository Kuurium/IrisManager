using System.ComponentModel.DataAnnotations;

namespace IrisManager.Application.Dtos
{
    public class CustomerCreateDto
    {
        [Required]
        public string Name { get; set; } = string.Empty;

        [Required]
        public string Phone { get; set; } = string.Empty;

        public string? Email { get; set; }
    }
}