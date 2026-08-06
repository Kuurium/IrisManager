using System.Collections.Generic;
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

        [Required(ErrorMessage = "The email is required.")]
        [EmailAddress(ErrorMessage = "The email format is invalid.")]
        public string Email { get; set; } = string.Empty;

        [Required(ErrorMessage = "The phone number is required.")]
        [Phone(ErrorMessage = "The phone format is invalid.")]
        public string Phone { get; set; } = string.Empty;

        public bool IsActive { get; set; }

        [Required(ErrorMessage = "At least one service must be selected.")]
        [MinLength(1, ErrorMessage = "At least one service must be selected.")]
        public List<int> ServiceIds { get; set; } = new List<int>();
    }
}