using System.Collections.Generic;

namespace IrisManager.Application.Dtos
{
    public class StylistDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Phone { get; set; } = string.Empty;
        public bool IsActive { get; set; }

        public List<int> ServiceIds { get; set; } = new List<int>();
        public List<string> ServiceNames { get; set; } = new List<string>();

        public string Specialty { get; set; } = string.Empty;
        public string FullSpecialties { get; set; } = string.Empty;
    }
}