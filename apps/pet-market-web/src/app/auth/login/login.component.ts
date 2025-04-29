import { Component, inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Router, RouterLink } from "@angular/router";
import { FormsModule } from "@angular/forms";
import { AuthService } from "../auth.service";

@Component({
  selector: "app-login",
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: "./login.component.html",
  styleUrl: "./login.component.scss",
})
export class LoginComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  email = "";
  password = "";

  // Login (Submission of form)
  async onSubmit() {
    try {
      await this.authService.login(this.email, this.password);
      this.router.navigate(["/"]);
    } catch (error) {
      console.error("Login error:", error);
    }
  }

  // Login with Google link
  async loginWithGoogle() {
    try {
      await this.authService.googleSignIn();
      this.router.navigate(["/"]);
    } catch (error) {
      console.error("Google login error:", error);
    }
  }
}

