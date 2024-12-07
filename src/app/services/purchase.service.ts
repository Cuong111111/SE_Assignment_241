import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface Purchase {
  id: string;
  date: Date;
  pages: number;
  amount: number;
}

@Injectable({
  providedIn: 'root'
})
export class PurchaseService {
  private purchasesSubject = new BehaviorSubject<Purchase[]>([]);
  purchases$ = this.purchasesSubject.asObservable();

  private isPaymentModalOpenSubject = new BehaviorSubject<boolean>(false);
  isPaymentModalOpen$ = this.isPaymentModalOpenSubject.asObservable();

  private currentPurchaseSubject = new BehaviorSubject<{ pages: number; amount: number } | null>(null);
  currentPurchase$ = this.currentPurchaseSubject.asObservable();

  initiatePurchase(pages: number) {
    const amount = pages * 0.1; // Assume $0.10 per page
    this.currentPurchaseSubject.next({ pages, amount });
    this.isPaymentModalOpenSubject.next(true);
  }

  completePurchase() {
    const currentPurchase = this.currentPurchaseSubject.value;
    if (currentPurchase) {
      const newPurchase: Purchase = {
        id: Math.random().toString(36).substr(2, 9),
        date: new Date(),
        ...currentPurchase,
      };
      const currentPurchases = this.purchasesSubject.value;
      this.purchasesSubject.next([newPurchase, ...currentPurchases]);
      this.currentPurchaseSubject.next(null);
      this.isPaymentModalOpenSubject.next(false);
    }
  }

  cancelPurchase() {
    this.currentPurchaseSubject.next(null);
    this.isPaymentModalOpenSubject.next(false);
  }
}

