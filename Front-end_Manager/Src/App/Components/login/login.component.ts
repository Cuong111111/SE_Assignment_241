import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  constructor(private router: Router) {}

  onLogin(): void {
    const emailInput = (document.getElementById('email') as HTMLInputElement).value;
    const passwordInput = (document.getElementById('password') as HTMLInputElement).value;

    if (emailInput && passwordInput) {
      alert('Đăng nhập thành công!');
      this.router.navigate(['/dashboard']);
    } else {
      alert('Vui lòng nhập email và mật khẩu!');
    }
  }
}
