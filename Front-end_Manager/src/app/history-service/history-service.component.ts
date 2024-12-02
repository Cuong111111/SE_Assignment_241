import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

interface PrintHistory {
  printId: number;
  userId: number;
  printDate: string;
  pagesPrinted: number;
  printerId: string;
  title: string;
}

@Component({
  selector: 'app-history-service',
  templateUrl: './history-service.component.html',
  styleUrls: ['./history-service.component.css'],
  standalone: true, imports: [CommonModule, FormsModule]
})
export class HistoryServiceComponent {
  studentId: string = '';
  filterDate: string = '';
  printHistory: PrintHistory[] = [];
  selectedMonth: string = '';
  months = [
    { value: '01', label: 'Tháng 1' },
    { value: '02', label: 'Tháng 2' },
    { value: '03', label: 'Tháng 3' },
    { value: '04', label: 'Tháng 4' },
    { value: '05', label: 'Tháng 5' },
    { value: '06', label: 'Tháng 6' },
    { value: '07', label: 'Tháng 7' },
    { value: '08', label: 'Tháng 8' },
    { value: '09', label: 'Tháng 9' },
    { value: '10', label: 'Tháng 10' },
    { value: '11', label: 'Tháng 11' },
    { value: '12', label: 'Tháng 12' },
  ];

  constructor(private http: HttpClient) {}

  fetchPrintHistory(): void {
    if (!this.studentId) {
      alert('Vui lòng nhập mã số sinh viên!');
      return;
    }

    const url = `/api/history/print/${this.studentId}`;
    this.http.get<PrintHistory[]>(url).subscribe(
      (data) => {
        this.printHistory = data;
        console.log('Print history fetched:', data);
      },
      (error) => {
        console.error('Error fetching print history:', error);
        alert('Không thể lấy lịch sử in ấn.');
      }
    );
  }

  exportMonthlyReport(): void {
    const year = new Date().getFullYear();
    const month = this.selectedMonth;

    if (!month) {
      alert('Vui lòng chọn tháng để xuất báo cáo!');
      return;
    }

    const url = `/api/history/monthly-report?year=${year}&month=${month}`;
    this.http.get(url, { responseType: 'blob' }).subscribe(
      (data) => {
        const blob = new Blob([data], { type: 'application/pdf' });
        const downloadUrl = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = downloadUrl;
        link.download = `BaoCaoThang_${month}_${year}.pdf`;
        link.click();
        alert('Báo cáo đã được tải xuống!');
      },
      (error) => {
        console.error('Error exporting report:', error);
        alert('Không thể xuất báo cáo.');
      }
    );
  }
}
