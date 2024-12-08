import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface PrintRecord {
  date: string;
  fileName: string;
  printVersion: string;
  sheets: number;
  paperSize: string;
}

@Component({
  selector: 'app-print-history',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="card w-full max-w-4xl mx-auto bg-[#f0f4ff] p-6 rounded-lg shadow">
      <div class="card-header">
        <h2 class="text-lg font-medium mb-4">Lịch sử in ấn</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div class="space-y-2">
            <label class="text-sm font-medium">Thời thời gian:</label>
            <input type="text" class="w-full h-8 px-2 bg-white rounded border" />
          </div>
          <div class="space-y-2">
            <label class="text-sm font-medium">Thời mẫu in:</label>
            <input type="text" class="w-full h-8 px-2 bg-white rounded border" />
          </div>
          <div class="space-y-2">
            <label class="text-sm font-medium">Theo khối thực:</label>
            <input type="text" class="w-full h-8 px-2 bg-white rounded border" />
          </div>
        </div>
      </div>
      <div class="card-content">
        <table class="w-full">
          <thead>
            <tr class="border-b">
              <th class="py-2 px-4 text-left">Ngày</th>
              <th class="py-2 px-4 text-left">Tên file</th>
              <th class="py-2 px-4 text-left">Mẫy in</th>
              <th class="py-2 px-4 text-center">Số tờ</th>
              <th class="py-2 px-4 text-left">Khổ thuốc</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let record of printRecords" class="border-b">
              <td class="py-2 px-4">{{ record.date }}</td>
              <td class="py-2 px-4">{{ record.fileName }}</td>
              <td class="py-2 px-4">{{ record.printVersion }}</td>
              <td class="py-2 px-4 text-center">{{ record.sheets }}</td>
              <td class="py-2 px-4">{{ record.paperSize }}</td>
            </tr>
          </tbody>
        </table>
        <div class="flex justify-center mt-6">
          <button class="px-4 py-2 bg-black text-white rounded hover:bg-gray-800 transition-colors">
            Quay về
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      font-family: Arial, sans-serif;
    }
  `]
})
export class PrintHistoryComponent {
  printRecords: PrintRecord[] = [
    {
      date: '07-12-2023',
      fileName: '004_1704.pdf',
      printVersion: 'Mẫy in 1',
      sheets: 3,
      paperSize: 'A4'
    }
    // Add more records as needed
  ];
}