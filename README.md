# ✨ Pet Market e-Commerce App ✨

<br>

A monorepo online e-Commerce web application allowing users to purchase AI-generated pets. Users can add pets to cart, remove pets from the cart, update the quantity of pets inside the cart, view their past purchases, and pay through the `stripe` API integration. The monorepo application is powered by `Angular 19+` for the frontend, `NestJS` for the backend, and `NgRx` Signal store for state management and `Neon` along `Prisma` ORM as a database.  


## 🌟 Demo 🌟

Demo gif here ----


##  🚀 Features 🚀 

-   🌐 **Nx**: Nx for monorepo of both frontend and backend to improve productivity.
-   🛡️ **User Authentication & Authorization**: User sign up and sign-in authentication and user 
        authorization to enable users to only access their past transactions  via Firebase.
-   📋 **View pets**: View all available pets.
-   ➕ **Add pets to cart**: Add pets to the Cart for purchase.
-   ✏️ **Edit Cart**: Edit pets quantity from within the Cart.
-   🔃 **Retrieve purchase history**: Retrieve purchase history. 
-   🚀 **Payment via Stripe**: Forward the payment to stripe portal.
-   🛠️ **NgRx State management**: Manage states through NgRx.
-   👌 **Clean & commented code**: The code is commented follows a clean project structure.
-   🌐 **Deployment**: Deploy both frontend and backend applications on `Cloudways`.



## 🛠️ Tech Stack 🌟

-   **Nx** to combine both application within a single repository.
### Frontend

-   **Angular 19** standalone application.
-   **NgRx** for state management.
-   **Tailwindcss** for styling.

### Database

-   **Firebase** for authentication and authorization.
-   **GraphQL API & http protocol** for the communication between Angular App and NestJS application.
-   **Neon (Postgres)** as the database.
-   **Prisma** as the ORM.
-   **Stripe API** for online payments.
-   **Cloudways** for the deployment
