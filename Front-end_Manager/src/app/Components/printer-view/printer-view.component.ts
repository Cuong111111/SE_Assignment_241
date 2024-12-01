import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { UserService, User } from '../../services/user.service';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Printer, PrinterResponse } from '../../printer.interface';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-printer-view',
  standalone: true,
  imports: [ReactiveFormsModule,CommonModule],
  templateUrl: './printer-view.component.html',
  styleUrl: './printer-view.component.css'
})
export class PrinterViewComponent {
  constructor(
    private router: Router,
    private userService: UserService,
    private http: HttpClient // Thêm HttpClient để gọi API
  ) {}

  activePrinters: Printer[] = [];
  inactivePrinters: Printer[] = [];
  printerList = new FormControl('Menu Label');

  user: User | null = null;
  private sessionInterval: any; // Kiểm tra phiên định kỳ
  private logoutTimeout: any;

  ngOnInit(): void {
    this.fetchPrinters();
    this.user = this.userService.getUser();

    if (!this.user) {
      alert('Không tìm thấy thông tin người dùng. Vui lòng đăng nhập lại.');
      this.router.navigate(['/login']);
      return;
    }

    // Đặt lịch kiểm tra phiên
    this.userService.resetSession();
    this.sessionInterval = setInterval(() => this.checkSession(), 100000); // Kiểm tra mỗi giây
  }

  ngOnDestroy(): void {
    // Hủy bỏ các interval và timeout khi component bị hủy
    if (this.sessionInterval) clearInterval(this.sessionInterval);
    if (this.logoutTimeout) clearTimeout(this.logoutTimeout);
  }

  checkSession(): void {
    const timeLeft = this.userService.getTimeLeft();

    if (timeLeft <= 50000 && timeLeft > 0) { // Nếu còn < 1 phút
      if (!this.logoutTimeout) {
        const confirmLogout = confirm(
          'Phiên đăng nhập sắp hết hạn. Bạn có muốn tiếp tục?'
        );
        if (confirmLogout) {
          this.userService.resetSession(); // Đặt lại phiên nếu người dùng xác nhận
        } else {
          // Nếu không phản hồi, tự động đăng xuất sau 5 giây
          this.logoutTimeout = setTimeout(() => this.logout(), 100000);
        }
      }
    } else if (timeLeft <= 0) {
      this.logout();
    }
  }


  fetchPrinters(): void {
    this.http.get<PrinterResponse>('http://localhost:5057/api/printers/status').subscribe({
      next: (response) => {
        this.activePrinters = response.activePrinters;
        this.inactivePrinters = response.inactivePrinters;
        console.log(this.activePrinters);
      },
      error: (error) => {
        console.error('Lỗi khi tải danh sách máy in:', error);
        alert('Không thể tải danh sách máy in. Vui lòng thử lại sau.');
      }
    });
  }

  confirmSelection(): void {
    const selectedPrinter = this.printerList.value; // Lấy giá trị máy in đã chọn
    this.router.navigate(['/printPage'], { queryParams: { printer: selectedPrinter } }); // Chuyển đến trang tiếp theo với thông tin máy in
  }

  logout(): void {
    this.userService.clearUser();
    alert('Phiên đã hết hạn. Đăng xuất tự động.');
    this.router.navigate(['/login']);
  }
}
