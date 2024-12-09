import { Component, OnInit } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';  // Import HttpClientModule
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { renderAsync as DocxPreview } from 'docx-preview';
import { PDFDocument } from 'pdf-lib';
import { UserService } from '../../services/user.service';
@Component({
  selector: 'app-print-page',
  standalone: true,
  templateUrl: './print-page.component.html',
  styleUrls: ['./print-page.component.css'],
  imports: [CommonModule,HttpClientModule]  // Thêm HttpClientModule vào imports

})
export class PrintPageComponent implements OnInit {
  printers: string[] = []; // Danh sách tên máy in đang hoạt động
  user: any;
  constructor(
    private http: HttpClient,  // Inject HttpClient
    private sanitizer: DomSanitizer,  // Inject DomSanitizer
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.loadActivePrinters(); // Gọi API khi component được khởi tạo
      this.user = this.userService.getUser();
      if (!this.user) {
        alert('Không tìm thấy thông tin người dùng. Vui lòng đăng nhập lại.');
        return;
      }
  }

  // Hàm gọi API lấy trạng thái máy in hoạt động
  loadActivePrinters(): void {
    this.http.get<any>('http://localhost:5057/api/printers/status').subscribe({
      next: (response) => {
        console.log('Dữ liệu trả về từ API:', response);
        // Chỉ lấy id các máy in đang hoạt động
        this.printers = response.activePrinters.map((printer: any) => printer.id);
        console.log('Danh sách máy in hoạt động:', this.printers);
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

  



  selectedPrinterId: string | null = null; 
  selectedFileName: string | null = null; 
  fileContent: string | ArrayBuffer | SafeResourceUrl | null = '';
  fileType: 'text' | 'image' | 'pdf' | 'docx' | 'unsupported' | null = null;
  sanitizedFileUrl: SafeResourceUrl | null = null;
  pageCount: number | null = null;

  downloadFile(url: string): void {
    this.http.get(url, { responseType: 'blob' }).subscribe(
      (response) => {
        console.log('File downloaded:', response);
      },
      (error) => {
        console.error('Có lỗi khi tải tệp:', error);
      }
    );
  }
  // Xử lý tệp được chọn
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (file) {
      this.selectedFileName = file.name;
      const fileType = file.type;
      const reader = new FileReader();

      reader.onload = (e: ProgressEvent<FileReader>) => {
        const result = e.target?.result;

        if (fileType.startsWith('text/')) {
          this.fileContent = result as string;
          this.fileType = 'text';
          this.pageCount = 1; // Văn bản đơn giản được coi là 1 trang
        } else if (fileType.startsWith('image/')) {
          this.fileContent = this.sanitizer.bypassSecurityTrustUrl(result as string);
          this.fileType = 'image';
          this.pageCount = 1; // Ảnh luôn là 1 trang
        } else if (fileType === 'application/pdf') {
          const blobUrl = URL.createObjectURL(file); // Sử dụng Blob URL để hiển thị
          this.fileContent = this.sanitizer.bypassSecurityTrustResourceUrl(blobUrl);
          this.fileType = 'pdf';
          this.processPdf(file); // Tính số trang PDF
        } else if (file.name.endsWith('.docx')) {
          this.processDocx(file);
        } else {
          this.fileContent = 'Định dạng file không được hỗ trợ.';
          this.fileType = 'unsupported';
          this.pageCount = null;
        }
      };

      if (fileType.startsWith('text/') || fileType.startsWith('image/') || fileType === 'application/pdf') {
        reader.readAsDataURL(file);
      } else if (file.name.endsWith('.docx')) {
        reader.readAsArrayBuffer(file);
      } else {
        this.fileContent = 'Không hỗ trợ định dạng file này.';
        this.fileType = 'unsupported';
        this.pageCount = null;
      }
    } else {
      this.fileContent = 'Vui lòng chọn một tệp.';
      this.fileType = null;
      this.pageCount = null;
    }
  }
  // Xử lý file .docx
  private processDocx(file: File): void {
    const reader = new FileReader();
  
    reader.onload = async (e: ProgressEvent<FileReader>) => {
      const arrayBuffer = e.target?.result as ArrayBuffer;
      const container = document.createElement('div'); // Tạo container hiển thị nội dung
  
      try {
        await DocxPreview(arrayBuffer, container); // Hiển thị nội dung file docx
        this.fileContent = this.sanitizer.bypassSecurityTrustHtml(container.innerHTML);
        this.fileType = 'docx';
  
        const textContent = container.innerText;  // Lấy nội dung văn bản thuần túy từ container
        const estimatedPageCount = Math.ceil(textContent.length / 200);  // Ước tính mỗi trang có khoảng 2000 ký tự
        this.pageCount = estimatedPageCount
        console.log(`DOCX có ${this.pageCount} trang.`);
      } catch (error) {
        console.error('Không thể hiển thị file .docx:', error);
        this.fileContent = 'Không thể hiển thị nội dung file .docx.';
        this.fileType = 'unsupported';
        this.pageCount = null;
      }
    };
  
    reader.readAsArrayBuffer(file);
  }
  // Xử lý số trang của file PDF
  private async processPdf(file: File): Promise<void> {
    const reader = new FileReader();
  
    reader.onload = async (e: ProgressEvent<FileReader>) => {
      const arrayBuffer = e.target?.result as ArrayBuffer;
  
      try {
        const pdfDoc = await PDFDocument.load(arrayBuffer); // Load PDF từ ArrayBuffer
        this.pageCount = pdfDoc.getPageCount(); // Lấy số trang
        console.log(`PDF có ${this.pageCount} trang.`);
      } catch (error) {
        console.error('Không thể đọc file PDF:', error);
        this.pageCount = null;
      }
    };
  
    reader.readAsArrayBuffer(file); // Đọc file dưới dạng ArrayBuffer
  }

  onSubmit(): void {
    // Kiểm tra điều kiện trước khi gửi
    if (!this.selectedPrinterId) {
      alert('Vui lòng chọn máy in!');
      return;
    }
  
    if (!this.selectedFileName) {
      alert('Vui lòng tải lên tệp!');
      return;
    }
    alert("Complete print!")
    // Dữ liệu cần gửi
    const printData = {
      "printId": 1,               
      "userId": this.user.id,               
      "printDate": new Date().toISOString(),
      "pagesPrinted": this.pageCount,
      "printerId": this.selectedPrinterId,
      "fileFormats": this.selectedFileName?.split('.').pop(),
      "title": this.selectedFileName
    };
    console.log(printData);
  
    // Gửi yêu cầu POST
    const url = 'http://localhost:5057/api/history/print';
    this.http.post(url, printData).subscribe({
      next: (response) => {
        console.log('In thành công:', response);
        alert('Dữ liệu đã được lưu thành công!');
      },
      error: (error) => {
        console.error('Lỗi khi lưu dữ liệu:', error);
        alert('Có lỗi xảy ra khi lưu dữ liệu!');
      }
    });
  }
  

  onPrinterChange(event: Event): void {
    const target = event.target as HTMLSelectElement; // Chuyển kiểu
    const selectedValue = target.value; // Bây giờ bạn có thể truy cập 'value'
    this.selectedPrinterId = selectedValue
  }
}
