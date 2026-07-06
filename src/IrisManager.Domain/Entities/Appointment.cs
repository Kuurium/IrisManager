using System.ComponentModel.DataAnnotations;

namespace IrisManager.Domain.Entities
{
    public class Appointment
    {

        public int Id { get; set; }

        [Required]
        public int CustomerId { get; set; }
        public Customer? Customer { get; set; }

        [Required]
        public int StylistId { get; set; }
        public Stylist? Stylist { get; set; }

        [Required]
        public int ServiceId { get; set; }
        public Service? Service { get; set; }

        [Required]
        public DateTime StartTime { get; set; }

        [Required]
        public DateTime EndTime { get; set; }

        [Required]
        public string Status { get; set; } = "Scheduled";
    }
}
