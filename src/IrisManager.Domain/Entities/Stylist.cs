using System.ComponentModel.DataAnnotations;

namespace IrisManager.Domain.Entities
{
    public class Stylist
    {
        public int Id { get; set; }

        [Required]
        public string Name { get; set; } = string.Empty;

        [Required]
        public string Specialty { get; set; } = string.Empty;

        public bool IsActive { get; set; } = true;
        public string Email { get; set; } = string.Empty;
        public string Phone { get; set; } = string.Empty;
        public ICollection<Service> Services { get; set; } = new List<Service>();
    }
}