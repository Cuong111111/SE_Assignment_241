import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

interface DocumentItem {
  name: string;
  type: string;
}

@Component({
  selector: 'app-printing-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {
  constructor(private router: Router) {}

  userName = 'Nguyễn Văn A';
  userId = '2252xxx';
  pageBalance = 25;

  // Sample recent files and history
  recentFiles = [
    { name: 'Giải_tích1.pdf', type: 'pdf' },
    { name: 'Bài_tập_lớn.doc', type: 'doc' }
  ];

  onBuyMore(): void {
    //alert('Mua thêm pages clicked!');
  }

  onUploadDocument(): void {
    //alert('Tải tài liệu clicked!');
    this.router.navigate(['/print-page']);
  }

  showMore(): void {
    //alert('Hiển thị thêm clicked!');
    this.router.navigate(['/history']);
  }

  logout(): void {
    alert('Logged out successfully!');
    this.router.navigate(['/']);
  }
}