import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Observable } from 'rxjs';

interface PrintHistoryDetail {
  printId: number;
  userId: number;
  printerId: number;
  pagesPrinted: number;
  printDate: string; // ISO string format
  fileFormats: string;
  title: string;
}

interface PaymentHistoryDetail {
  paymentId: number;
  userId: number;
  amount: number;
  paymentDate: string; // ISO string format
}

interface PrinterReport {
  printerId: number;
  pagesPrinted: number;
}

interface DetailedMonthlyReport {
  year: number;
  month: number;
  printHistory: PrintHistoryDetail[];
  paymentHistory: PaymentHistoryDetail[];
  printerReports: PrinterReport[];
  totalPayments: number;
}

@Component({
  selector: 'app-report',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.css']
})
export class ReportComponent  {
  year!: number;
  month!: number;
  report: DetailedMonthlyReport | null = null;
  isLoading = false;
  error: string | null = null;

  constructor(private http: HttpClient) {}

  fetchReport(): void {
    if (!this.year || !this.month) {
      this.error = 'Please provide both year and month.';
      return;
    }
    this.isLoading = true;
    this.error = null;
    this.getDetailedMonthlyReport(this.year, this.month).subscribe({
      next: (data: DetailedMonthlyReport) => {
        this.report = data;
        this.isLoading = false;
      },
      error: () => {
        this.error = 'Failed to load report. Please try again later.';
        this.isLoading = false;
      },
    });
  }

  getDetailedMonthlyReport(
    year: number,
    month: number
  ): Observable<DetailedMonthlyReport> {
    return this.http.get<DetailedMonthlyReport>(
      `http://localhost:5057/api/history/monthly-report?year=${year}&month=${month}`
    );
  }
}
