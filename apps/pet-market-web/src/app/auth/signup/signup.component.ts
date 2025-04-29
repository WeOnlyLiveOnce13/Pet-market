import { Component, inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { Router, RouterLink } from "@angular/router";
import { AuthService } from "../auth.service";

@Component({
  selector: "app-signup",
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: "./signup.component.html",
  styleUrl: "./signup.component.scss",
})
export class SignupComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  email = "";
  password = "";

  // Signup (Submission of form)
  async onSubmit() {
    try {
      await this.authService.signup(this.email, this.password);
      this.router.navigate(["/"]);
    } catch (error) {
      console.error("Signup error:", error);
    }
  }

  // Signup with Google link
  async signupWithGoogle() {
    try {
      await this.authService.googleSignIn();
      this.router.navigate(["/"]);
    } catch (error) {
      console.error("Google signup error:", error);
    }
  }
}

