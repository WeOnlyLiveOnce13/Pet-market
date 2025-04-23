import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Product } from '@prisma/client';

@Component({
  selector: 'app-product-card',
  imports: [CommonModule],
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.scss',
})
export class ProductCardComponent {
  // @Input() product: Product;

  // Take a product as input from the parent component (ProductsComponent)
  product = input.required<Product>();

  // Output the product to the parent component (ProductsComponent)
  // in order to add the product to the cart from the parent component
  addToCart = output<Product>();

  // Send product clicked to parent component (ProductsComponent)
  // to add the product to the cart from the parent component
  onAddToCart(product: Product) {
    this.addToCart.emit(product);
  }
}
