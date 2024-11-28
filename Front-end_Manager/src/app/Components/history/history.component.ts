import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UserService } from '../../user.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-history',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.css'],
})
export class HistoryComponent implements OnInit {
  printHistory: any[] = []; 
  paginatedHistory: any[] = []; 
  currentPage: number = 1; 
  itemsPerPage: number = 10; 
  totalPages: number = 1; 
  filteredHistory: any[] = [];
  searchCriteria: Partial<{
    title: string;
    fileFormats: string;
    printDate: string;
    printerId: number | null;
    pagesPrinted: number | null;
  }> = {
    title: '',
    fileFormats: '',
    printDate: '',
    printerId: null,
    pagesPrinted: null,
  };

  constructor(private http: HttpClient, private userService: UserService) {}

  ngOnInit(): void {
    const user = this.userService.getUser();
    if (!user) {
      alert('Không tìm thấy thông tin người dùng. Vui lòng đăng nhập lại.');
      return;
    }

    const url = `http://localhost:5057/api/history/print/${user.id}`;
    this.http.get<any[]>(url).subscribe({
      next: (response) => {
        this.printHistory = response.sort(
          (a, b) => new Date(b.printDate).getTime() - new Date(a.printDate).getTime()
        );
        this.totalPages = Math.ceil(this.printHistory.length / this.itemsPerPage);
        this.updatePaginatedHistory();
        console.log(this.paginatedHistory);
      },
      error: (err) => console.error('Lỗi khi lấy lịch sử in:', err),
    });
  }

  updatePaginatedHistory(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    this.paginatedHistory = this.printHistory.slice(
      startIndex,
      startIndex + this.itemsPerPage
    );
  }

  goToPage(page: number): void {
    this.currentPage = page;
    this.updatePaginatedHistory();
  }
  applyFilters(): void {
    // Bắt đầu với danh sách gốc
    this.filteredHistory=[]
    this.filteredHistory = this.printHistory.filter(item => {
      let isValid = true;
  
      // Kiểm tra từng bộ lọc
      if (this.searchCriteria.printerId) {
        isValid = isValid && item.printerId===this.searchCriteria.printerId;
      }
      if (this.searchCriteria.printDate) {
        const selectedDate = new Date(this.searchCriteria.printDate).toISOString().split('T')[0];
        const itemDate = new Date(item.printDate).toISOString().split('T')[0];
        isValid = isValid && itemDate === selectedDate;
      }
      if (this.searchCriteria.fileFormats) {
        isValid = isValid && item.fileFormats.includes(this.searchCriteria.fileFormats);
      }
      if (this.searchCriteria.pagesPrinted) {
        isValid = isValid && item.pagesPrinted === this.searchCriteria.pagesPrinted;
      }
  
      return isValid; // Trả về true nếu item thỏa mãn tất cả bộ lọc
    });
  
    console.log('Kết quả sau lọc:', this.filteredHistory);
  }
  
  resetFilters(): void {
    this.searchCriteria = {}; // Xóa các tiêu chí
    this.filteredHistory = []; 
  }
}
