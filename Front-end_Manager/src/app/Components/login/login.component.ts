import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { UserService } from '../../services/user.service';

interface User {
  id: number;
  email: string;
  name: string;
  isSPSO: boolean;
  page_balance: number;
  recentPayments: any[];
  recentPrints: any[];
}

interface LoginResponse {
  user: User;
}

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  constructor(
    private router: Router, 
    private http: HttpClient,
    private userService: UserService  // Thêm UserService
  ) {}
  onLogin(): void {
    const emailInput = (document.getElementById('email') as HTMLInputElement).value;
    const passwordInput = (document.getElementById('password') as HTMLInputElement).value;

    if (emailInput && passwordInput) {
      const loginData = {
        email: emailInput.trim(),
        password: passwordInput.trim()
      };

      console.log('Sending login request:', loginData);

      this.http.post<LoginResponse>(
        'http://localhost:5057/api/User_info/login', 
        loginData,
        {
          headers: {
            'Content-Type': 'application/json'
          },
          withCredentials: true
        }
      ).subscribe({
        next: (response) => {
          console.log('Login successful:', response);
          this.userService.setUser({
            id: response.user.id,
            name: response.user.name,
            isSPSO: response.user.isSPSO
          });
          alert('Đăng nhập thành công!');
          if (response.user.isSPSO) {
            this.router.navigate(['/button-page']);
          } else {
            this.router.navigate(['/dashboard']);
          }
        },
        error: (error) => {
          console.error('Login error details:', error);
          }
        },
      );
    } else {
      alert('Vui lòng nhập email và mật khẩu!');
    }
  }
}
