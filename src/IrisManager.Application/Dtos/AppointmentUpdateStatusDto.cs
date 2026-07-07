using System.ComponentModel.DataAnnotations;

namespace IrisManager.Application.Dtos
{
    public class AppointmentUpdateStatusDto
    {
        [Required]
        public string Status { get; set; } = string.Empty;
    }
}
