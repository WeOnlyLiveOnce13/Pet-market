import { inject } from "@angular/core";
import { patchState, signalStore, withMethods, withState } from "@ngrx/signals";
import { Order, OrderItem, Product } from "@prisma/client";
import { Apollo, gql } from "apollo-angular";
import {  tap } from "rxjs";


// Query from GraphQL
// id MUST be provided
const GET_ORDER = gql `
    query GetOrder($id: String!) {
        order(id: $id) {
            id
            totalAmount
            status
            items {
                id
                quantity
                price
                product {
                    id
                    name
                    image
                }
            }
            createdAt
        }
    }
`


export type OrderItemWithProduct = OrderItem & {
    product: Product;
}

export type OrderWithItems = Order & {
    items: OrderItemWithProduct[];
}

type OrderStoreState = {
    orders: OrderWithItems[];
    orderDetail: OrderWithItems | null;
    error: string | null;
}

const initialState: OrderStoreState = {
    orders: [],
    orderDetail: null,
    error: null,

}

export const OrderStore = signalStore({
        providedIn: 'root',

    },
    withState(() => initialState),
    withMethods((store, apollo = inject(Apollo)) => ({
        // Method 1: get order
        getOrder(id: string) {
            

            patchState( store, { error: null });

            return apollo
                .query<{ order: OrderWithItems }>({
                    query: GET_ORDER,
                    variables: { 
                        id              // from getOrders input
                    },
                })
                .pipe(
                    // map(({ data }) => data.order),
                    // tap((order) => patchState(store, { orderDetail: order })),
                    // catchError((error) => patchState(store, { error: error.message }))
                    tap({ 
                        next: ({ data }) => 
                            patchState(store, { orderDetail: data.order }),
                        error: (error) => 
                                patchState(store, { error: error.message })
                     }) 
                )
        },

        // Method 2: set error
        setError(error: string) {
            patchState(store, { 
                error 
            });
        }
     
        
    }))
)

