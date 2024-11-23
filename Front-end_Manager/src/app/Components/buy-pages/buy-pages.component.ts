import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PurchaseService, Purchase } from '../../services/purchase.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-buy-pages',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './buy-pages.component.html',
  styleUrls: ['./buy-pages.component.css'],
  providers: [PurchaseService]
})
export class BuyPagesComponent implements OnInit {
  activeTab: 'purchase' | 'history' = 'purchase';
  pages: number = 0;
  purchases$!: Observable<Purchase[]>;
  isPaymentModalOpen$!: Observable<boolean>;
  currentPurchase$!: Observable<{ pages: number; amount: number } | null>;

  constructor(private purchaseService: PurchaseService) {}

  ngOnInit() {
    this.purchases$ = this.purchaseService.purchases$;
    this.isPaymentModalOpen$ = this.purchaseService.isPaymentModalOpen$;
    this.currentPurchase$ = this.purchaseService.currentPurchase$;
  }

  setActiveTab(tab: 'purchase' | 'history') {
    this.activeTab = tab;
  }

  onSubmit() {
    if (this.pages > 0) {
      this.purchaseService.initiatePurchase(this.pages);
      this.pages = 0;
    }
  }

  completePurchase() {
    this.purchaseService.completePurchase();
  }

  cancelPurchase() {
    this.purchaseService.cancelPurchase();
  }
}