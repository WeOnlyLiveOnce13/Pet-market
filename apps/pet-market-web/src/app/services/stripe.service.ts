import { inject, Injectable } from '@angular/core';
import { CartStore } from '../stores/cart.store';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';
import { AuthService } from '../auth/auth.service';
import { from, switchMap } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class StripeService {
  cartStore = inject(CartStore);
  http = inject(HttpClient);
  authService = inject(AuthService);
  

  // Create a checkout session
  createCheckoutSession() {
    const items = this.cartStore.items();
    const totalAmount = this.cartStore.totalAmount();

    // token = this.authService.getToken()


    // "from()" is used to convert the token to an observable 
    // required by "createCheckoutSession()" as input
    return from(this.authService.getToken())
        .pipe(
          switchMap((token) => this.http.post<{url: string}>(
            `${environment.apiUrl}/api/checkout`,
            {
              items: items.map((item) => ({
                productId: item.id,
                name: item.name,
                price: item.price,
                quantity: item.quantity,
                stripePriceId: item.stripePriceId, 
              })),
      
              totalAmount: totalAmount,
            },

            {
              headers: {
                Authorization: token ? `Bearer ${token}` : ''
              } 
            }
          ))
        )
  }
}
