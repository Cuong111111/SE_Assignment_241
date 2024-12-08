import { Router } from '@angular/router';
import { UserService, User } from '../../services/user.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';


@Component({
  selector: 'app-button-page',
  standalone: true,
  templateUrl: './button-page.component.html',
  styleUrls: ['./button-page.component.css'],
})
export class ButtonPageComponent {
  user: User | null = null;
  private sessionInterval: any; // Kiểm tra phiên định kỳ
  private logoutTimeout: any;

  constructor(private router: Router,
    private userService: UserService,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.user = this.userService.getUser();

    if (!this.user) {
      alert('Không tìm thấy thông tin người dùng. Vui lòng đăng nhập lại.');
      this.router.navigate(['/login']);
      return;
    }
    this.userService.resetSession();
    this.sessionInterval = setInterval(() => this.checkSession(), 1000);
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
  toReport(): void {
    this.router.navigate(['/report']);
  }
  
  toPrinterService(): void {
    this.router.navigate(['printer-service']);
  }

  toSystemConfig(): void {
    this.router.navigate(['/system-config']);
  }

  toSPSOPrint(): void {
    this.router.navigate(['/spso-print']);
  }


  logout(): void {
    this.userService.clearUser();
    alert('Phiên đã hết hạn. Đăng xuất tự động.');
    this.router.navigate(['/login']);
  }
}