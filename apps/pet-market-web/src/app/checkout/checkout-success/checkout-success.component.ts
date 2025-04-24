import { afterNextRender, Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderStore } from '../../stores/order.store';
import { ActivatedRoute } from '@angular/router';
import { OrderDetailComponent } from '../../orders/components/order-detail/order-detail.component';
import { CartStore } from '../../stores/cart.store';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { map, pipe, switchMap } from 'rxjs';
import { OrderStatus } from '@prisma/client';

@Component({
  selector: 'app-checkout-success',
  imports: [CommonModule, OrderDetailComponent],
  templateUrl: './checkout-success.component.html',
  styleUrl: './checkout-success.component.scss',
})
export class CheckoutSuccessComponent implements OnInit {

  route = inject(ActivatedRoute);
  orderStore = inject(OrderStore);
  cartStore = inject(CartStore);
  getAndUpdateOrder = rxMethod<string>(
    pipe(
      switchMap((orderId) => {
        return this.orderStore.getOrder(orderId)
      }),   
      map((order) => {
        // Update OrderStatus to Pending IF it is Payment Required
        if (order.status === OrderStatus.PAYMENT_REQUIRED) {
          return this.orderStore.updateOrder({
            id: order.id,
            status: OrderStatus.PENDING
          })
        }
        return null;
      })
    ),
  )


  constructor() {
    // client-side rendering, not server-side
    afterNextRender(() => {
      this.cartStore.clearCart();
    });
  }

  ngOnInit() {
    const orderId = this.route.snapshot.queryParamMap.get('orderId');

    // If no order ID, show error
    if (!orderId) {
      this.orderStore.setError('No order ID found');
      return;
    }

    this.getAndUpdateOrder(orderId);
  }
}
