import { afterNextRender, Component, inject } from '@angular/core';
import { ProductStore } from '../stores/product.store';
import { CartStore } from '../stores/cart.store';
import { ProductCardComponent } from '../components/product-card/product-card.component';
import { FormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';
import untilDestroyed from '../utils/untilDestroyed';
import { Product } from '@prisma/client';

@Component({
  selector: 'app-products',
  imports: [ProductCardComponent, FormsModule],
  standalone: true,
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss',
})

export class ProductsComponent {
  productStore = inject(ProductStore);
  searchTerm = '';
  cartStore = inject(CartStore);
  // Only take final value of searchTerm
  searchSubject = new Subject<string>();
  destroyed = untilDestroyed();


  constructor() {
    this.productStore.loadProducts();

    // called after the next render (client side rendering)
    afterNextRender(() => {
      this.searchSubject.pipe(
        debounceTime(500),          // Wait 500ms after the last event before emitting the next value
        distinctUntilChanged(),     // Only emit if the value has changed from the previous typed value
        this.destroyed()            // Unsubscribe when the component is destroyed  
      )
      .subscribe((term) => {
        this.productStore.searchProducts(term);
      });
    });
  }

  // Emit the search term to the searchSubject to trigger the search
  // and update the searchTerm variable
  onSearch(term: string) {
    this.searchSubject.next(term);
    // console.log({ term });
  }


  // Add product to cart
  onAddToCart(product: Product) {
    this.cartStore.addToCart(product);
  }

}
