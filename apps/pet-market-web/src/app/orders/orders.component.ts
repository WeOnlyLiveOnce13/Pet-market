import { Component, inject, OnInit, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { OrderStore } from '../stores/order.store';
import { RouterLink } from '@angular/router';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { switchMap } from 'rxjs';

@Component({
  selector: 'app-orders',
  imports: [CommonModule, RouterLink],
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.scss',
})
export class OrdersComponent implements OnInit {
  orderStore = inject(OrderStore);
  platformId = inject(PLATFORM_ID);
  
  getOrders = rxMethod<void>(
    switchMap(() => this.orderStore.getUserOrders())
  );

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.getOrders();
    }
  }
}
