import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
interface Printer {
  id: number;
  name: string;
  isActive: boolean;
  brand: string;
  model: string;
  description: string;
  location: string;
}

@Component({
  selector: 'app-printer-service',
  templateUrl: './printer-service.component.html',
  styleUrls: ['./printer-service.component.css'],
  standalone: true,
  imports: [ HttpClientModule,FormsModule,CommonModule]
})
export class PrinterServiceComponent implements OnInit {
  printers: Printer[] = [];
  activePrinters: Printer[] = [];
  inactivePrinters: Printer[] = [];
  newPrinter: Printer = {
    id: 0,
    name: '',
    isActive: true, // Mặc định là true
    brand: '',
    model: '',
    description: '',
    location: '',
  };

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadActivePrinters();
    //this.fetchPrinters();
  }

  /**
   * Fetches active and inactive printers from the backend.
   */
  isLoading: boolean = false;

fetchPrinters(): void {
  this.isLoading = true;
  this.http.get<{ ActivePrinters: Printer[]; InactivePrinters: Printer[] }>('http://localhost:5057/api/printers/status').subscribe(
    (data) => {
      this.activePrinters = data.ActivePrinters;
      this.inactivePrinters = data.InactivePrinters;
      this.printers = [...this.activePrinters, ...this.inactivePrinters];
    },
    (error) => {
      console.error('Error fetching printers:', error);
    },
    () => {
      this.isLoading = false; // Kết thúc trạng thái loading
    }
  );
}


  /**
   * Adds a new printer by sending data to the backend.
   */
  
  addPrinter(): void {
    if (
      !this.newPrinter.name ||
      !this.newPrinter.brand ||
      !this.newPrinter.model ||
      !this.newPrinter.description ||
      !this.newPrinter.location
    ) {
      alert('Vui lòng nhập đầy đủ thông tin máy in!');
      return;
    }
    const printData = {
      "name": this.newPrinter.name,
      "isActive": true,
      "brand": this.newPrinter.brand,
      "model": this.newPrinter.model,
      "description": this.newPrinter.description,
      "location": this.newPrinter.location
    };
    // Gửi dữ liệu máy in đến API backend
    this.http.post('http://localhost:5057/api/printers/add', printData, { responseType: 'text' }).subscribe(
      () => {
        alert('Máy in mới đã được thêm thành công!');
        this.newPrinter = { // Reset sau khi thêm
          id: 0,
          name: '',
          isActive: true,
          brand: '',
          model: '',
          description: '',
          location: '',
        };
        this.fetchPrinters(); // Cập nhật lại danh sách máy in
      },
      (error) => {
        console.error('Error adding printer:', error);
        let errorMessage = 'Không thể thêm máy in!';
        if (error.error && error.error.message) {
          errorMessage = `${errorMessage}\nChi tiết lỗi: ${error.error.message}`;
        } else if (error.message) {
          errorMessage = `${errorMessage}\nThông báo lỗi: ${error.message}`;
        }

        alert(`${errorMessage}\n${printData}`);

        alert('Thông tin máy in: ' + JSON.stringify(printData, null, 2));
      }
    );
    this.loadActivePrinters();
  }

  loadActivePrinters(): void {
    this.http.get<any>('http://localhost:5057/api/printers/status').subscribe({
      next: (response) => {
        
        // Chỉ lấy id các máy in đang hoạt động
        this.printers = response;
        this.activePrinters = response.activePrinters;
        this.inactivePrinters = response.inactivePrinters;
        console.log('Dữ liệu trả về từ API:', this.printers);
        this.printers = [
          ...response.activePrinters,
          ...response.inactivePrinters
        ];
      },
      error: (error) => {
        console.error('Lỗi khi tải danh sách máy in hoạt động:', error);
        
        // Xử lý thông báo lỗi cụ thể
        if (error.status === 0) {
          alert('Không thể kết nối đến server. Vui lòng kiểm tra:\n1. Server đã được khởi động\n2. Đúng port 5057\n3. CORS đã được cấu hình.');
        } else {
          alert('Lỗi khi tải danh sách máy in: ' + (error.error?.message || 'Không xác định'));
        }
      }
    });
  }

  /**
   * Deletes a printer by ID.
   * @param id - The ID of the printer to delete.
   */
  deletePrinter(id: number): void {
    if (!confirm('Bạn có chắc chắn muốn xóa máy in này?')) return;

    this.http
  .delete(`http://localhost:5057/api/printers/delete/${id}`, { responseType: 'text' })
  .subscribe(
    (response) => {
      console.log('Response:', response); // Xác minh nội dung
      alert('Máy in đã được xóa thành công!');
      this.fetchPrinters();
      window.location.reload();
    },
    (error) => {
      console.error('Error deleting printer:', error);
      alert('Không thể xóa máy in!');
    }
  );
  }

  /**
   * Updates the statuses of printers.
   */
  updatePrinterStatuses(): void {
    const statusUpdates = this.printers.map((printer) => ({
      printerId: printer.id,
      isActive: printer.isActive,
    }));

    this.http.put('/api/printers/status', statusUpdates).subscribe(
      () => {
        alert('Trạng thái của các máy in đã được cập nhật!');
      },
      (error) => {
        console.error('Error updating printer statuses:', error);
        alert('Không thể cập nhật trạng thái!');
      }
    );
  }

  /**
   * Navigates back to the button page.
   */
  proceed(): void {
    window.location.href = '/button-page'; // Route for button page
  }

  togglePrinterStatus(printer: any) {
    const payload = [
      {
        printerId: printer.id,
        isActive: printer.isActive
      }
    ];
    const apiUrl = `http://localhost:5057/api/printers/status`;
  
    this.http.put(apiUrl, payload).subscribe({
      next: (response) => {
        console.log(`Printer ${printer.id} status updated successfully!`);
      },
      error: (error) => {
        console.error('Error updating printer status:', error);
        // Khôi phục trạng thái cũ nếu API lỗi
        printer.isActive = !printer.isActive;
      },
    });
  }

}
