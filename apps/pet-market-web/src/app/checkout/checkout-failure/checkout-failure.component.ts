import { Component, inject, OnInit, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformServer } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { OrderStore } from '../../stores/order.store';


@Component({
  selector: 'app-checkout-failure',
  imports: [CommonModule, RouterLink],
  templateUrl: './checkout-failure.component.html',
  styleUrl: './checkout-failure.component.scss',
})
export class CheckoutFailureComponent implements OnInit {
  orderStore = inject(OrderStore);
  route = inject(ActivatedRoute);

  // Enable ONLY FrontEnd deletion
  platformId = inject(PLATFORM_ID);


  ngOnInit() {

    // If server, do nothing
    // Only delete on the Client-Side
    if (isPlatformServer(this.platformId)) {
      return;
    }

    // this.route.snapshot.queryParams['orderId'];
    // Get `orderId` from query params
    const orderId = this.route.snapshot.queryParamMap.get('orderId');

    // If no order ID, set error and return
    if (!orderId) {
      this.orderStore.setError('Order ID is required');
      return;
    }

    // Remove unpaid order
    this.orderStore.removeUnpaidOrder(orderId);
  }
}
