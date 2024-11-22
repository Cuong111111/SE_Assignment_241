import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { UserService, User } from '../../services/user.service';
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
  pageBalance: number = 0; // Số dư trang in
  printHistory: any[] = []; // Lịch sử in ấn
  private sessionInterval: any; // Kiểm tra phiên định kỳ
  private logoutTimeout: any; // Đếm ngược để tự động đăng xuất

  recentFiles = [
    { name: 'Giải_tích1.pdf', type: 'pdf' },
    { name: 'Bài_tập_lớn.doc', type: 'doc' },
    { name: 'Bài_tập_lớn.doc', type: 'doc' },
    { name: 'Bài_tập_lớn.doc', type: 'doc' },
    { name: 'Bài_tập_lớn.doc', type: 'doc' },
    { name: 'Bài_tập_lớn.doc', type: 'doc' },
  ];

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
      const url = `http://localhost:5057/api/User_info/${this.user.id}/pagebalance`;
      console.log(url);
      this.http.get<{ pageBalance: number }>(url).subscribe({
        next: (response) => (
          console.log('Fetch successful:', response),
          this.pageBalance = response.pageBalance
          ),
        error: (err) => console.error('Lỗi khi lấy số dư:', err),
      });
    }
  }

  fetchPrintHistory(): void {
    if (this.user) {
      const url = `http://localhost:5057/api/history/print/${this.user.id}`;
      this.http.get<any[]>(url).subscribe({
        next: (response) => (
          console.log('Fetch successful:', response),
          this.printHistory = response,
          console.log(this.printHistory)),
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

  onBuyMore(): void {
    console.log('Mua thêm');
  }

  onUploadDocument(): void {
    this.router.navigate(['/print']);
  }

  showMore(): void {
    console.log('Hiển thị thêm');
  }

  logout(): void {
    this.userService.clearUser();
    alert('Phiên đã hết hạn. Đăng xuất tự động.');
    this.router.navigate(['/login']);
  }
}
