import { inject } from '@angular/core';
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { Product } from '@prisma/client';
import { Apollo, gql } from 'apollo-angular';
import { catchError, EMPTY, map, pipe, switchMap, tap } from 'rxjs';

const GET_PRODUCTS = gql`
  query GetProducts {
    products {
      id
      name
      description
      price
      image
      stripePriceId
    }
  }
`;


const SEARCH_PRODUCTS = gql`
  query SearchProducts($searchTerm: String!) {
    searchProducts(term: $searchTerm) {
      id
      name
      description
      price
      image
      stripePriceId
    }
  }
`;

const GET_FEATURED_PRODUCTS = gql`
  query GetFeaturedProducts($featured: Boolean) {
    products(featured: $featured) {
      id
      name
      description
      price
      image
      stripePriceId
  }   
}
`

// Product State (data shape)
export interface ProductState {
  products: Product[];
  featuredProducts: Product[];
  loading: boolean;
  error: string | null;
}

// Product Initial State
const initialState: ProductState = {
  products: [],
  featuredProducts: [],
  loading: false,
  error: null,
};


// Product Signal Store
export const ProductStore = signalStore(
  {
    providedIn: 'root',
  },
  withState(initialState),

  // Product Methods (actions) : loadProducts, searchProducts
  withMethods((store, apollo = inject(Apollo)) => ({

    // 1. LOAD PRODUCTS
    loadProducts() {

      // Update loading state & error state    
      patchState(store, { loading: true, error: null });

      // Fetch products using Apollo & GET_PRODUCTS query
      apollo
        .watchQuery<{ products: Product[] }>({
          query: GET_PRODUCTS,
        })
        .valueChanges.pipe(

          // Update response data & error message if any  
          tap({
            next: ({ data }) =>
              patchState(
                store, 

                // Assign products to the products array& reset loading state
                { 
                    products: data.products, loading: false 
                }
              ),
            error: (error) =>
              patchState(
                store, 
                { 
                    error: error.message,
                    loading: false
                }
              ),
          })
        )
        .subscribe();
    },

    // 2. LOAD FEATURED PRODUCTS
    getFeaturedProducts: rxMethod<boolean>(
      pipe(
        switchMap((featured) => apollo.query<{ products: Product[] }>({
          query: GET_FEATURED_PRODUCTS,
          variables: { featured },
        })),
        tap({
          next: ({ data }) =>
            patchState(store, {
              products: data.products,
              loading: false,
              error: null,
            }),
          error: (error) =>
            patchState(store, {
              error: error.message,
              loading: false,
            }),
        }),
      )
    ),
    // 3. SEARCH PRODUCTS
    searchProducts(term: string) {

      // Update loading state    
      patchState(store, { loading: true , error: null });

      // Fetch products using Apollo & GET_PRODUCTS query
      apollo
        .query<{ searchProducts: Product[] }>({
          query: SEARCH_PRODUCTS,
          variables: { 
            searchTerm: term 
          }
        })
        .pipe(

          // Update response data 
          map(({ data }) =>
            patchState(
              store, 

              // Assign products to the products array& reset loading state
              { 
                  products: data.searchProducts, loading: false 
              }
            ),
          ),
          
          // Handle error
          catchError((error) => {
            patchState(store, { error: error.message, loading: false });
            return EMPTY;
          })
        )
        .subscribe();
    },

  

  }))
);


// Search Products
