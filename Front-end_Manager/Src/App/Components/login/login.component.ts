import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  constructor(private router: Router, private http: HttpClient) {}

  onLogin(): void {
    const emailInput = (document.getElementById('email') as HTMLInputElement).value;
    const passwordInput = (document.getElementById('password') as HTMLInputElement).value;

    if (emailInput && passwordInput) {
      this.http.post('http://localhost:5057/api/User_info/login', {username: emailInput, password: passwordInput,})
        .subscribe({
          next: () => {
            alert('Đăng nhập thành công!');
            this.router.navigate(['/dashboard']);
          },
          error: () => {
            alert('Email hoặc mật khẩu không chính xác!');
          },
        });
    } else {
      alert('Vui lòng nhập email và mật khẩu!');
    }
  }
}
