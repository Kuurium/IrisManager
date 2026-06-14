using System.ComponentModel.DataAnnotations;

namespace IrisManager.API.DTOs
{
    public class AppointmentUpdateStatusDto
    {
        [Required]
        public string Status { get; set; } = string.Empty;
    }
}
