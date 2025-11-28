import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-verify-otp',
  templateUrl: './verify-otp.html',
  standalone: true,
  imports: [FormsModule],
})
export class VerifyOtpComponent {
  otp = '';
  email = '';

  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
    private router: Router
  ) {
    this.email = this.route.snapshot.queryParamMap.get('email') || '';
  }

  verify() {
    this.authService.verifyOtp({ email: this.email, otp: this.otp }).subscribe({
      next: () => {
        alert('Verification successful!');
        this.router.navigate(['/dashboard']);
      },
      error: (err) => alert(err.error.message),
    });
  }
}
