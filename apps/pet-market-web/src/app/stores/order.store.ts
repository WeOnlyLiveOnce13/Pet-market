import { inject } from "@angular/core";
import { patchState, signalStore, withMethods, withState } from "@ngrx/signals";
import { rxMethod } from "@ngrx/signals/rxjs-interop";
import { Order, OrderItem, OrderStatus, Product } from "@prisma/client";
import { Apollo, gql } from "apollo-angular";
import {  catchError, EMPTY, from, map, pipe, switchMap,  tap } from "rxjs";
import { AuthService } from "../auth/auth.service";


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

const UPDATE_ORDER = gql`

    mutation UpdateOrderStatus($id: String!, $status: OrderStatus!) {
        updateOrder(updateOrderInput: {
            id: $id
            status: $status
            
    }) {
        id
        status
        totalAmount
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
        updatedAt        
        }
    }
`

const DELETE_UNPAID_ORDER = gql`

    mutation RemoveOrder($id: String!) {
        removeUnpaidOrder(id: $id){
            orderId			
            success 
            error
        } 
    }
`

const GET_USER_ORDERS = gql`
    query GetUserOrders($token: String!) {
        userOrders(token: $token) {
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
    loading: boolean;
}

const initialState: OrderStoreState = {
    orders: [],
    orderDetail: null,
    error: null,
    loading: false,
}

export const OrderStore = signalStore({
        providedIn: 'root',

    },
    withState(() => initialState),
    withMethods((
        store, 
        apollo = inject(Apollo), 
        authService = inject(AuthService)
    ) => ({
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
                    }),
                    
                    // Return the order
                    map(({ data }) => data.order)
                )
        },

        // Method 2: get user orders
        getUserOrders() {
            patchState(store, { loading: true , error: null});
            return from(authService.getToken())
                .pipe(
                    // filter((user) => !!user),
                    // take(1),
                    // switchMap((user) => ),
                    switchMap((token) => {
                        if (!token) {
                            throw new Error('User not authenticated');
                        }
                        
                        
                        
                        return apollo.query<{ userOrders: OrderWithItems[] }>({
                            query: GET_USER_ORDERS,
                            variables: {
                                token
                            },
                            // fetchPolicy: 'network-only' -> only fetch from network, not from cache
                            //fetchPolicy: 'network-only'
                        })  
                    }),
                    tap((result) => {
                        patchState(store, { 
                            orders: result.data.userOrders,
                            loading: false,
                            error: null
                        });
                    }),
                    catchError((error) => {
                        patchState(store, {
                            loading: false,
                            error: error.message
                        });
                        return EMPTY
                    })
                        
                    
                )
        },

        // Method 3: update order
        updateOrder: rxMethod<{ id: string, status: OrderStatus }>(
            pipe(
                switchMap(({ id, status }) => apollo.mutate<{
                    updateOrder: OrderWithItems
                }> ({
                    mutation: UPDATE_ORDER,
                    variables: {
                        id,
                        status
                    }
                })
                )
            )
        ),

        // Method 4: delete order
        removeUnpaidOrder: rxMethod<string>(
            pipe(
                switchMap(( id ) => apollo.mutate<{
                    updateOrder: OrderWithItems
                }> ({
                    mutation: DELETE_UNPAID_ORDER,
                    variables: {
                        id
                    }
                    })
                ),
                // OR tapResponse()
                tap({
                    next: ({ data }) => {
                        console.log('Unpaid order deleted', { data });
                        patchState(store, { error: null });
                    },
                    error: (error) => {
                        patchState(store, { error: error.message });
                    }
                })
            )
        ),

        // Method 5: set error
        setError(error: string) {
            patchState(store, { 
                error 
            });
        }
     
        
    }))
)

