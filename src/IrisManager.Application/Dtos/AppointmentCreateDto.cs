using System.ComponentModel.DataAnnotations;

namespace IrisManager.Application.Dtos
{
    public class AppointmentCreateDto
    {
        [Required]
        public int CustomerId { get; set; }

        [Required]
        public int StylistId { get; set; }

        [Required]
        public int ServiceId { get; set; }

        [Required]
        public DateTime StartTime { get; set; }
        public string? Status { get; set; }
        public string? PaymentMethod { get; set; }
    }
}
