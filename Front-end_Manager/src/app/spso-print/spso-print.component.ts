import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-spsoprint',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './spso-print.component.html',
  styleUrls: ['./spso-print.component.css'],
})
export class SPSOPrintComponent implements OnInit {
  printHistory: any[] = []; // Toàn bộ dữ liệu lịch sử in
  filterHistory: any[] = []; // Dữ liệu lịch sử in sau khi áp dụng bộ lọc
  totalPages: number = 1; // Tổng số trang
  currentPage: number = 1; // Trang hiện tại
  pageSize: number = 10; // Số item trên mỗi trang

  // Bộ lọc
  searchUserId: string = ''; // Dữ liệu tìm kiếm theo Student ID
  searchYear: string = ''; // Dữ liệu tìm kiếm theo năm
  searchMonth: string = ''; // Dữ liệu tìm kiếm theo tháng
  searchDay: string = ''; // Dữ liệu tìm kiếm theo ngày

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadPrintHistory(); // Load dữ liệu khi khởi tạo
  }

  // Load toàn bộ dữ liệu lịch sử in
  loadPrintHistory(): void {
    const apiUrl = 'http://localhost:5057/api/history/allprint';

    this.http.get<any[]>(apiUrl).subscribe(
      (data) => {
        this.printHistory = data.sort(
          (a, b) => new Date(b.printDate).getTime() - new Date(a.printDate).getTime()
        ); // Sắp xếp theo thời gian gần nhất
        this.resetFilter(); // Gán dữ liệu ban đầu vào filterHistory
      },
      (error) => {
        console.error('Failed to fetch print history:', error);
      }
    );
  }

  // Áp dụng bộ lọc
  applyFilter(): void {
    this.filterHistory = this.printHistory.filter((history) => {
      const matchesUserId = this.searchUserId
        ? history.userId.toString().includes(this.searchUserId)
        : true;
      const matchesYear = this.searchYear
        ? new Date(history.printDate).getFullYear().toString() === this.searchYear
        : true;
      const matchesMonth = this.searchMonth
        ? (new Date(history.printDate).getMonth() + 1).toString() === this.searchMonth
        : true;
      const matchesDay = this.searchDay
        ? new Date(history.printDate).getDate().toString() === this.searchDay
        : true;

      return matchesUserId && matchesYear && matchesMonth && matchesDay;
    });

    this.currentPage = 1; // Reset về trang đầu tiên
  }

  // Reset bộ lọc
  resetFilter(): void {
    this.filterHistory = [...this.printHistory];
    this.currentPage = 1; // Reset về trang đầu tiên
  }

  // Lấy danh sách item hiển thị trên trang hiện tại
  getCurrentPageItems(): any[] {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    return this.filterHistory.slice(startIndex, endIndex);
  }

  // Chuyển trang
  changePage(direction: 'next' | 'prev'): void {
    if (direction === 'next' && this.currentPage < this.getTotalPages()) {
      this.currentPage++;
    } else if (direction === 'prev' && this.currentPage > 1) {
      this.currentPage--;
    }
  }

  // Tính tổng số trang
  getTotalPages(): number {
    return Math.ceil(this.filterHistory.length / this.pageSize);
  }
}
