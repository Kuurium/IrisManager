using System.ComponentModel.DataAnnotations;

namespace IrisManager.Application.Dtos
{
    public class ServiceUpdateDto
    {
        [Required]
        public int Id { get; set; }

        [Required]
        public string Name { get; set; } = string.Empty;

        public string? Description { get; set; }

        [Required]
        [Range(0.01, double.MaxValue)]
        public decimal Price { get; set; }

        [Required]
        public int DurationMinutes { get; set; }
    }
}