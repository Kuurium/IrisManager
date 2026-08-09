export interface StylistDailySummary {
  stylistId: number;
  stylistName: string;
  appointmentsCount: number;
}

export interface DashboardSummary {
  appointmentsToday: number;
  appointmentsThisWeek: number;
  todayDayName: string;
  scheduledCount: number;
  rescheduledCount: number;
  completedCount: number;
  cancelledCount: number;
  totalRevenueMonth: number;
  mostPopularService: string;
  preferredPaymentMethod: string;
  activeStylistsToday: StylistDailySummary[];
}