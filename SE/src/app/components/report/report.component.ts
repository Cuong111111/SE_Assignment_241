import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Observable } from 'rxjs';

interface PrinterReport {
  printerId: number;
  pagesPrinted: number;
}

interface MonthlyReport {
  year: number;
  month: number;
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
export class ReportComponent implements OnInit {
  year!: number;
  month!: number;
  report: MonthlyReport | null = null;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {}

  fetchReport(): void {
    this.getMonthlyReport(this.year, this.month).subscribe((data: MonthlyReport) => {
      this.report = data;
    });
  }

  getMonthlyReport(year: number, month: number): Observable<MonthlyReport> {
    return this.http.get<MonthlyReport>(`/api/history/monthly-report?year=${year}&month=${month}`);
  }
}
