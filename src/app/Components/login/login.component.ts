import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

interface User {
  id: number;
  name: string;
  isSPSO: boolean;
}

interface LoginResponse {
  user: User;
  message: string;
}

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
          // Lưu thông tin người dùng vào localStorage
          localStorage.setItem('user', JSON.stringify(response.user));
          alert('Đăng nhập thành công!');
          this.router.navigate(['/dashboard']);
        },
        error: (error) => {
          console.error('Login error details:', error);
          
          if (error.status === 0) {
            alert('Không thể kết nối đến server. Vui lòng kiểm tra:' + 
                  '\n1. Server đã được khởi động' +
                  '\n2. Đúng port 5057' +
                  '\n3. CORS đã được cấu hình');
          } else {
            alert('Đăng nhập thất bại: ' + (error.error?.message || 'Lỗi không xác định'));
          }
        },
      });
    } else {
      alert('Vui lòng nhập email và mật khẩu!');
    }
  }
}
