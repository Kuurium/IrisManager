namespace IrisManager.Application.Dtos
{
    public class AppointmentUpdateDto
    {
        public int Id { get; set; }
        public int CustomerId { get; set; }
        public int StylistId { get; set; }
        public int ServiceId { get; set; }

        public string? Date { get; set; }
        public string? Time { get; set; }
        public string? Status { get; set; }
        public string? PaymentMethod { get; set; }
        public string? Notes { get; set; }
        public DateTime StartTime { get; set; }
    }
}