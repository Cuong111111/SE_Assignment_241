import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

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
})
export class PrinterServiceComponent implements OnInit {
  printers: Printer[] = [];
  activePrinters: Printer[] = [];
  inactivePrinters: Printer[] = [];
  newPrinter: Partial<Printer> = {
    name: '',
    brand: '',
    model: '',
    description: '',
    location: '',
  };

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.fetchPrinters();
  }

  /**
   * Fetches active and inactive printers from the backend.
   */
  fetchPrinters(): void {
    this.http.get<{ ActivePrinters: Printer[]; InactivePrinters: Printer[] }>('/api/printers/status').subscribe(
      (data) => {
        this.activePrinters = data.ActivePrinters;
        this.inactivePrinters = data.InactivePrinters;
        this.printers = [...this.activePrinters, ...this.inactivePrinters];
        console.log('Fetched printers:', this.printers);
      },
      (error) => {
        console.error('Error fetching printers:', error);
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

    this.http.post('/api/printers/add', this.newPrinter).subscribe(
      () => {
        alert('Máy in mới đã được thêm thành công!');
        this.newPrinter = {}; // Reset input fields
        this.fetchPrinters(); // Refresh the printer list
      },
      (error) => {
        console.error('Error adding printer:', error);
        alert('Không thể thêm máy in!');
      }
    );
  }

  /**
   * Deletes a printer by ID.
   * @param id - The ID of the printer to delete.
   */
  deletePrinter(id: number): void {
    if (!confirm('Bạn có chắc chắn muốn xóa máy in này?')) return;

    this.http.delete(`/api/printers/delete/${id}`).subscribe(
      () => {
        alert('Máy in đã được xóa thành công!');
        this.fetchPrinters();
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
}
