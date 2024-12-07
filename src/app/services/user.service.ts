import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly USER_KEY = 'user'; // Khóa để lưu thông tin người dùng trong localStorage
  private readonly SESSION_START_TIME_KEY = 'sessionStartTime'; // Khóa lưu thời gian bắt đầu phiên
  private sessionDuration = 100000; // Thời gian phiên: 30 phút (ms)

  setUser(user: User): void {
    localStorage.setItem(this.USER_KEY, JSON.stringify(user)); // Lưu người dùng vào localStorage
    localStorage.setItem(this.SESSION_START_TIME_KEY, Date.now().toString()); // Lưu thời gian bắt đầu phiên
  }

  getUser(): User | null {
    const userJson = localStorage.getItem(this.USER_KEY);
    return userJson ? JSON.parse(userJson) : null; // Trả về thông tin người dùng (hoặc null nếu không có)
  }

  clearUser(): void {
    localStorage.removeItem(this.USER_KEY); // Xóa thông tin người dùng khỏi localStorage
    localStorage.removeItem(this.SESSION_START_TIME_KEY); // Xóa thời gian bắt đầu phiên
  }

  isSessionValid(): boolean {
    const sessionStartTime = this.getSessionStartTime();
    if (sessionStartTime) {
      const currentTime = Date.now();
      return currentTime - sessionStartTime < this.sessionDuration; // Kiểm tra thời gian phiên còn hiệu lực
    }
    return false;
  }

  resetSession(): void {
    localStorage.setItem(this.SESSION_START_TIME_KEY, Date.now().toString()); // Đặt lại thời gian bắt đầu phiên
  }

  getTimeLeft(): number {
    const sessionStartTime = this.getSessionStartTime();
    if (sessionStartTime) {
      const currentTime = Date.now();
      return this.sessionDuration - (currentTime - sessionStartTime); // Tính thời gian còn lại
    }
    return 0;
  }

  private getSessionStartTime(): number | null {
    const sessionStartTime = localStorage.getItem(this.SESSION_START_TIME_KEY);
    return sessionStartTime ? parseInt(sessionStartTime, 10) : null; // Lấy thời gian bắt đầu phiên từ localStorage
  }
}

export interface User {
  id: number;
  name: string;
  isSPSO: boolean;
}