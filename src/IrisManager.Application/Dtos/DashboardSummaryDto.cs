namespace IrisManager.API.DTOs
{
    public class DashboardSummaryDto
    {
        public int AppointmentsToday { get; set; }
        public int AppointmentsThisWeek { get; set; }
        public string TodayDayName { get; set; } = string.Empty;

        public int ScheduledCount { get; set; }
        public int RescheduledCount { get; set; }
        public int CompletedCount { get; set; }
        public int CancelledCount { get; set; }

        public decimal TotalRevenueMonth { get; set; }
        public string MostPopularService { get; set; } = "N/A";
        public string PreferredPaymentMethod { get; set; } = "N/A";

        public List<StylistDailySummaryDto> ActiveStylistsToday { get; set; } = new();
    }

    public class StylistDailySummaryDto
    {
        public int StylistId { get; set; }
        public string StylistName { get; set; } = string.Empty;
        public int AppointmentsCount { get; set; }
    }
}