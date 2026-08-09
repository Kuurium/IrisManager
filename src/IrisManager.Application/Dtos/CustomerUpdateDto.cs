using System.ComponentModel.DataAnnotations;

namespace IrisManager.Application.Dtos
{
    public class CustomerUpdateDto
    {
        [Required]
        public int Id { get; set; }

        [Required]
        public string Name { get; set; } = string.Empty;

        [Required]
        public string Phone { get; set; } = string.Empty;

        public string? Email { get; set; }
        public bool IsActive { get; set; }
    }
}