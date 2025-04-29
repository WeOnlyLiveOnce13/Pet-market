import { Component, effect, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CartStore } from '../../stores/cart.store';
import { AuthService } from '../../auth/auth.service';
import { User } from '@angular/fire/auth';

@Component({
  selector: 'app-header',
  imports: [CommonModule, RouterLink],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  cartStore = inject(CartStore);
  previousCountValue = 0;
  isCartBouncing = signal(false);
  authService = inject(AuthService);
  currentUser$ = this.authService.currentUser$;
  isDropdownOpen = false;

  constructor() {
    effect(() => {
        const currentCount = this.cartStore.totalItems();
        
        if (currentCount && currentCount > this.previousCountValue) {
          this.isCartBouncing.set(true);

          setTimeout(() => {
            this.isCartBouncing.set(false);
          }, 1000);
          this.previousCountValue = currentCount;
        }

        this.previousCountValue = currentCount;


    });
  }
  

  // Toggle dropdown
  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  // Get user display name
  getUserDisplayName(user: User | null): string {
    return user?.displayName || user?.email?.split('@')[0] || 'User';
  }

  // Get user photo URL
  getUserPhotoUrl(user: User | null): string {
    return (
      user?.photoURL || 
      `https://ui-avatars.com/api/?name=${this.getUserDisplayName(user)}`
    );
  }

  // Logout
  async logout() {
    try {
      await this.authService.logout();
      this.isDropdownOpen = false;
    } catch (error) {
      console.error('Logout failed', error);
      //throw error;
    }
  }
}
