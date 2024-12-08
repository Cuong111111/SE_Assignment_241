import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UserService, User } from '../../services/user.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { lastValueFrom } from 'rxjs';

@Component({
  selector: 'app-buy-pages',
  templateUrl: './buy-pages.component.html',
  styleUrls: ['./buy-pages.component.css'],
  standalone: true,
  imports: [FormsModule, CommonModule],
})
export class BuyPagesComponent implements OnInit {
  activeTab: 'purchase' | 'history' = 'purchase';
  user: User | null = null;
  pages: number = 0;
  paymentHistory: any[] = [];
  isPaymentModalOpen: boolean = false;
  currentPurchase: { pages: number; amount: number } | null = null;

  constructor(private http: HttpClient, private userService: UserService) {}

  async ngOnInit() {
    this.user = this.userService.getUser();
    await this.fetchPaymentHistory();
  }

  setActiveTab(tab: 'purchase' | 'history') {
    this.activeTab = tab;
  }

  onSubmit() {
    if (this.pages > 0) {
      this.initiatePurchase(this.pages);
      this.pages = 0;
    }
  }

  async fetchPaymentHistory() {
    if (this.user) {
      const url = `http://localhost:5057/api/history/payment/${this.user.id}`;
      try {
        const response = await lastValueFrom(this.http.get<any>(url));
        if (typeof response === 'string' && response.includes('No payment history')) {
          this.paymentHistory = [];
        } else {
          this.paymentHistory = response.sort((a: any, b: any) => new Date(b.paymentDate).getTime() - new Date(a.paymentDate).getTime());
        }
      } catch (err) {
        console.error('Lỗi khi lấy lsgd:', err);
      }
    }
  }

  initiatePurchase(pages: number) {
    this.currentPurchase = { pages, amount: pages };
    this.isPaymentModalOpen = true;
  }

  async completePurchase() {
    if (this.currentPurchase && this.user) {
      const url = 'http://localhost:5057/api/history/payment';
      const purchaseData = {
        paymentId: 0,
        userId: this.user.id,
        paymentDate: new Date().toISOString(),
        amount: this.currentPurchase.amount
      };

      try {
        console.log('Sending purchase data:', purchaseData);
        const response = await lastValueFrom(this.http.post<any>(url, purchaseData));
        console.log('API response:', response);
        
        if (response && response.paymentId) {
          await this.updatePageBalance(this.user.id, this.currentPurchase.pages);
          await this.fetchPaymentHistory();
          this.isPaymentModalOpen = false;
          this.currentPurchase = null;
          console.log('Purchase completed successfully');
          console.log(this.paymentHistory);
        } else {
          console.error('API response did not indicate success');
        }
      } catch (err) {
        console.error('Lỗi khi hoàn tất giao dịch:', err);
      }
    }
  }

  async updatePageBalance(userId: number, pages: number) {
    const url = `http://localhost:5057/api/User_info/${userId}/pagebalance`;
    console.log(url);
    this.http.get<{ pageBalance: number }>(url).subscribe({
      next: (response) => {
        console.log('Fetch successful:', response);
        const currentBalance = response.pageBalance;
        const newBalance = currentBalance + pages;
        this.http.put(url, newBalance).subscribe({
          next: () => console.log('Page balance updated successfully'),
          error: (err) => console.error('Lỗi khi cập nhật số trang:', err),
        });
      },
      error: (err) => console.error('Lỗi khi lấy số dư:', err),
    });
  }

  cancelPurchase() {
    console.log('Giao dịch bị hủy');
    this.isPaymentModalOpen = false;
    this.currentPurchase = null;
  }
}