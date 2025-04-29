import { isPlatformServer } from '@angular/common';
import { inject, Injectable, OnDestroy, PLATFORM_ID, REQUEST } from '@angular/core';
import { 
  Auth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signOut, 
  user, 
  onIdTokenChanged,
  beforeAuthStateChanged} from '@angular/fire/auth';
import cookies from 'js-cookie';
import { Router } from '@angular/router';
@Injectable({
  providedIn: 'root'
})
export class AuthService implements OnDestroy {
  firebaseAuth = inject(Auth);
  router = inject(Router);
  platformId = inject(PLATFORM_ID);
  currentUser$ = user(this.firebaseAuth);
  idToken = '' ;
  cookieKey = '__pet_market_token';
  unsubscribeFromIdTokenChanged: (() => void) | undefined;
  unsubscribeFromAuthStateChanged: (() => void) | undefined;

  constructor() {
    if (isPlatformServer(this.platformId)) {
      // set up Server Auth;
      this.setupServerAuth();
    } else {
      // set up Browser Auth;
      this.setupBrowserAuth();
    }
  }

  // Server Auth
  setupServerAuth() {
    const request = inject(REQUEST);
    const requestHeaders = request?.headers;
    const cookieHeader = requestHeaders?.get('cookie');
    let authIdToken: string | undefined;

    if (cookieHeader) {
      const cookiePairs = cookieHeader.split(';');
      for (const cookie of cookiePairs) {
        const [key, value] = cookie.trim().split('=');
        if (key === this.cookieKey) {
          authIdToken = value.trim();
          break;
        }
      }

      // cookiePairs.forEach((cookie) => {
      //   const [key, value] = cookie.split('=');
      //   if (key.trim() === this.cookieKey) {
      //     authIdToken = value.trim();
      //   }
      // });
    }

    if (authIdToken) {
      this.idToken = authIdToken     //this.firebaseAuth.setCustomUserClaims(authIdToken);
      
      this.handleCookie(this.idToken);
    } else {
      this.handleCookie();
    }
  }

  // Browser Auth
  setupBrowserAuth() {
    this.unsubscribeFromIdTokenChanged = onIdTokenChanged(
      this.firebaseAuth,
      async (user) => {
        const token = await user?.getIdToken();
        this.handleCookie(token);
      }
    );


    let priorCookieValue: string | undefined;     // 1
    this.unsubscribeFromAuthStateChanged = beforeAuthStateChanged(
      this.firebaseAuth,
      async (user) => {
        // Get value of cookie
        priorCookieValue = cookies.get(this.cookieKey);   // 2
        
        const token = await user?.getIdToken();
        this.handleCookie(token);                      // 3
      },
      // On Abort
      async () => {
        // Restore cookie value if auth state was changed
        this.handleCookie(priorCookieValue);            // 4
      }
    );

    this.idToken = cookies.get(this.cookieKey) || '';
  }

  // Handle cookies
  handleCookie(token?: string) {
    if (token) {
      cookies.set(this.cookieKey, token);
    } else {
      cookies.remove(this.cookieKey);
    }
  }


  //Login with email and password
  async login(email: string, password: string) {

    try {
      const result = await signInWithEmailAndPassword(
        this.firebaseAuth, 
        email, 
        password);

        return result.user;

    } catch (error) {
      console.error('Login failed', error);
      throw error;
    }
  }

  // Sign up with email and password
  async signup(email: string, password: string) {
    try {
      const result = await createUserWithEmailAndPassword(
        this.firebaseAuth, 
        email, 
        password);

      return result.user;
    } catch (error) {
      console.error('Signup failed', error);
      throw error;
    }
  }
  
  // Get token
  async getToken() {
    let token: string | null = null;
    const currentUser = this.firebaseAuth.currentUser;

    if (currentUser) {
      const token = await currentUser.getIdToken();
      return token;
    } else if (this.idToken) {
      token = this.idToken;
    }

    console.log('Token from getToken() method:', token);

    return token;
  }




  // Google sign in
  async googleSignIn() {

    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(
        this.firebaseAuth, 
        provider);
      return result.user;
      
    } catch (error) {
      console.error('Google sign in failed', error);
      throw error;
    }  
  } 


  // Logout 
  async logout() {
    try {
      await signOut(this.firebaseAuth);
      this.router.navigate(['/auth/login']);
    } catch (error) {
      console.error('Logout failed', error);
      throw error;
    }
  }


  ngOnDestroy() {
    this.unsubscribeFromIdTokenChanged?.();
    this.unsubscribeFromAuthStateChanged?.();
  }
  
}


