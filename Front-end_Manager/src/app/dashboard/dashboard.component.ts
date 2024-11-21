import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { UserService, User } from '../user.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit, OnDestroy {
  user: User | null = null;
  pageBalance: number | null = null; // Số dư trang in
  printHistory: any[] = []; // Lịch sử in ấn
  private sessionInterval: any; // Kiểm tra phiên định kỳ
  private logoutTimeout: any; // Đếm ngược để tự động đăng xuất

  constructor(
    private router: Router,
    private userService: UserService,
    private http: HttpClient // Thêm HttpClient để gọi API
  ) {}

  ngOnInit(): void {
    this.user = this.userService.getUser();

    if (!this.user) {
      alert('Không tìm thấy thông tin người dùng. Vui lòng đăng nhập lại.');
      this.router.navigate(['/login']);
      return;
    }

    // Gọi API để lấy thông tin page balance và print history
    this.fetchPageBalance();
    this.fetchPrintHistory();

    // Đặt lịch kiểm tra phiên
    this.userService.resetSession();
    this.sessionInterval = setInterval(() => this.checkSession(), 1000); // Kiểm tra mỗi giây
  }

  ngOnDestroy(): void {
    // Hủy bỏ các interval và timeout khi component bị hủy
    if (this.sessionInterval) clearInterval(this.sessionInterval);
    if (this.logoutTimeout) clearTimeout(this.logoutTimeout);
  }

  fetchPageBalance(): void {
    if (this.user) {
      const url = `/User_info/${this.user.id}/pagebalance`;
      this.http.get<{ balance: number }>(url).subscribe({
        next: (response) => (this.pageBalance = response.balance),
        error: (err) => console.error('Lỗi khi lấy số dư:', err),
      });
    }
  }

  fetchPrintHistory(): void {
    if (this.user) {
      const url = `/api/history/print/${this.user.id}`;
      this.http.get<any[]>(url).subscribe({
        next: (response) => (this.printHistory = response),
        error: (err) => console.error('Lỗi khi lấy lịch sử in ấn:', err),
      });
    }
  }

  checkSession(): void {
    const timeLeft = this.userService.getTimeLeft();

    if (timeLeft <= 5000 && timeLeft > 0) { // Nếu còn < 1 phút
      if (!this.logoutTimeout) {
        const confirmLogout = confirm(
          'Phiên đăng nhập sắp hết hạn. Bạn có muốn tiếp tục?'
        );
        if (confirmLogout) {
          this.userService.resetSession(); // Đặt lại phiên nếu người dùng xác nhận
        } else {
          // Nếu không phản hồi, tự động đăng xuất sau 5 giây
          this.logoutTimeout = setTimeout(() => this.logout(), 5000);
        }
      }
    } else if (timeLeft <= 0) {
      // Nếu hết thời gian
      this.logout();
    }
  }

  logout(): void {
    this.userService.clearUser();
    alert('Phiên đã hết hạn. Đăng xuất tự động.');
    this.router.navigate(['/login']);
  }
}
