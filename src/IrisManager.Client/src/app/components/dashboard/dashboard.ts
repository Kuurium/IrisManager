import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardService } from '../../core/services/dashboard';
import { DashboardSummary } from '../../core/models/dashboard-summary';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {
  summaryData: DashboardSummary | null = null;
  currentTime: string = '';
  currentDate: string = '';
  isLoading: boolean = true;
  private timerId: any;

  constructor(
    private dashboardService: DashboardService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.startClock();
    this.loadDashboardData();
  }

  ngOnDestroy(): void {
    if (this.timerId) {
      clearInterval(this.timerId);
    }
  }

  loadDashboardData(): void {
    this.isLoading = true;
    this.dashboardService.getDashboardSummary().subscribe({
      next: (data: DashboardSummary) => {
        this.summaryData = data;
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        console.error('Error al obtener datos del panel general:', err);
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  startClock(): void {
    this.updateTime();
    this.timerId = setInterval(() => {
      this.updateTime();
      this.cdr.detectChanges();
    }, 1000);
  }

updateTime(): void {
  const now = new Date();
  
  this.currentTime = now.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true
  });

  this.currentDate = now.toLocaleDateString('es-ES', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
}
}