import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderDetailComponent } from '../components/order-detail/order-detail.component';
import { RouterLink } from '@angular/router';
import { OrderStore } from '../stores/order.store';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { switchMap } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-order',
  imports: [CommonModule, OrderDetailComponent,RouterLink],
  templateUrl: './order.component.html',
  styleUrl: './order.component.scss',
})
export class OrderComponent implements OnInit{
  orderStore = inject(OrderStore);
  currentRoute = inject(ActivatedRoute);
  getOrder = rxMethod<string>(
    switchMap((orderId: string) => this.orderStore.getOrder(orderId))
  )


  ngOnInit(): void {
    const orderId = this.currentRoute.snapshot.paramMap.get('id');
    // OR snapshot.params['id'];

    if (!orderId) {
      this.orderStore.setError('Order ID is required');
      return;
    }

    this.getOrder(orderId);
  }

  // TODO: Add auth/guard to check if user access to this order is valid

 
 
}
