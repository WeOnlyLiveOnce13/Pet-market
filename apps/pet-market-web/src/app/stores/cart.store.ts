import { computed } from "@angular/core";
import { patchState, signalStore, withComputed, withMethods, withState } from "@ngrx/signals";
import { Product } from "@prisma/client";

type CartItem = Product & {
    quantity: number;
}


type CartState = {
    items: CartItem[];
}

const initialState: CartState = {
    items: [],
}

const CART_LOCAL_STORAGE_KEY = 'pet_market_cart';


export const CartStore = signalStore({
    providedIn: 'root',
},

    // Initialize cart items from localStorage
    withState(() => {

        // If localStorage is available, get items from localStorage
        if ('localStorage' in globalThis) {
            return {
                ...initialState,
                items: JSON.parse(
                    localStorage.getItem(CART_LOCAL_STORAGE_KEY) ?? '[]'
                ) as CartItem[]
            }
        };

        // If localStorage is not available, return initial state
        return initialState;
        
    }),
    // Calculate:  total items and total amount
    withComputed((store) => ({
        totalItems: computed(() => 
            store.items().reduce((acc, item) => {
                return acc + item.quantity
            }, 0)
        ),
        totalAmount: computed(() => 
            store.items().reduce((acc, item) => {
                return acc + item.quantity * item.price
            }, 0)
        ),
    })),

    // Methods: to add, update, remove, and clear cart items
    withMethods((store) => ({
        addToCart(product: Product, quantity: number = 1) {

            // Get current cart items
            const currentItems = store.items();

            // Check if product already exists in cart
            const existingItem = currentItems.find((cartItem) => cartItem.id === product.id);

            // If product already exists in cart, update quantity
            if (existingItem) {
                const updatedItems = currentItems.map((cartItem) =>
                    
                    // If product id matches one of a cart item, update quantity 
                    // else return cart item unchanged
                    cartItem.id === existingItem.id ? { ...cartItem, quantity: cartItem.quantity + quantity } : cartItem
                );

                patchState(
                    store, {
                    items: updatedItems
                    }
                );

            // If product does not exist in cart, add new product to cart
            } else {
                patchState(store, {
                    items: [
                        ...currentItems, {
                         ...product, 
                            quantity 
                        }
                    ]
                });
            }

            // Save cart items to localStorage
            localStorage.setItem(
                CART_LOCAL_STORAGE_KEY, 
                JSON.stringify(store.items())
            );

        },
        updateQuantity(productId: string, quantity: number) {
            const updatedItems = store.items()
                .map((item) => 
                    // If product id matches one of a cart item, update quantity 
                    // else return cart item unchanged
                    (item.id === productId ? { ...item, quantity } : item)
                )

            patchState(
                store, { items: updatedItems }
            );

            // Update cart items from localStorage
            localStorage.setItem(
                CART_LOCAL_STORAGE_KEY, 
                JSON.stringify(store.items())
            );
            
        },
        removeFromCart(productId: string) {
            const keptItems = store.items().filter((item) => item.id !== productId);

            patchState(store, { items: keptItems });

            // Remove cart items from localStorage
            localStorage.setItem(
                CART_LOCAL_STORAGE_KEY, 
                JSON.stringify(store.items())
            );
        },
        clearCart(){
            patchState(store, { items: [] });

            // Delete cart items from localStorage
            localStorage.removeItem(
                CART_LOCAL_STORAGE_KEY
            );
        }
    }))
    

);

