using System.ComponentModel.DataAnnotations;

namespace IrisManager.Application.Dtos
{
    public class StylistCreateDto
    {
        [Required]
        public string Name { get; set; } = string.Empty;

        [Required]
        public string Specialty { get; set; } = string.Empty;

        public bool IsActive { get; set; } = true;
    }
}
