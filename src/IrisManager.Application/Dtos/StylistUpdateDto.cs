using System.ComponentModel.DataAnnotations;

namespace IrisManager.Application.Dtos
{
    public class StylistUpdateDto
    {
        [Required]
        public int Id { get; set; }

        [Required(ErrorMessage = "The name is required.")]
        [StringLength(100, ErrorMessage = "The name cannot exceed 100 characters.")]
        public string Name { get; set; } = string.Empty;

        [Required(ErrorMessage = "The specialty is required.")]
        public string Specialty { get; set; } = string.Empty;

        [Required(ErrorMessage = "The email is required.")]
        [EmailAddress(ErrorMessage = "The email format is invalid.")]
        public string Email { get; set; } = string.Empty;

        [Required(ErrorMessage = "The phone number is required.")]
        [Phone(ErrorMessage = "The phone format is invalid.")]
        public string Phone { get; set; } = string.Empty;

        public bool IsActive { get; set; }
    }
}