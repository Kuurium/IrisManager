namespace IrisManager.Application.Dtos
{
    public class StylistDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Specialty { get; set; } = string.Empty;
        public bool IsActive { get; set; }
    }
}
