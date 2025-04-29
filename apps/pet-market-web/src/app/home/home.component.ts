import { Component, inject } from '@angular/core';
import { Product } from '@prisma/client';
import { CartStore } from '../stores/cart.store';
import { ProductStore } from '../stores/product.store';
import { RouterLink } from '@angular/router';
import { ProductCardComponent } from '../components/product-card/product-card.component';

@Component({
  selector: 'app-home',
  imports: [RouterLink, ProductCardComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  productStore = inject(ProductStore);
  cartStore = inject(CartStore);

  constructor() {
    this.productStore.getFeaturedProducts(true);
  }

  onAddToCart(product: Product) {
    this.cartStore.addToCart(product);
  }
}
