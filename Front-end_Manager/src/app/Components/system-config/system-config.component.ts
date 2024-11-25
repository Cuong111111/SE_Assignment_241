import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

interface SystemConfig {
  allowedFileFormats: string[];
  defaultPrintPageLimit: number;
  issueDate: string;
}

@Component({
  selector: 'app-system-config',
  templateUrl: './system-config.component.html',
  styleUrls: ['./system-config.component.css'],
})
export class SystemConfigComponent implements OnInit {
  fileFormats = ['PDF', 'DOCX', 'DOC', 'PPTX', 'PPT', 'XLS', 'XLSX'];
  allowedFileFormats: string[] = [];
  defaultPrintPageLimit: number = 100;
  issueDate: string = '';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.fetchConfig();
  }

  /**
   * Fetches the system configuration from the backend.
   */
  fetchConfig(): void {
    this.http.get<SystemConfig>('/api/system-config').subscribe(
      (config) => {
        this.allowedFileFormats = config.allowedFileFormats;
        this.defaultPrintPageLimit = config.defaultPrintPageLimit;
        this.issueDate = config.issueDate.split('T')[0]; // Format date to YYYY-MM-DD
        console.log('Fetched system config:', config);
      },
      (error) => {
        console.error('Error fetching system config:', error);
      }
    );
  }

  /**
   * Toggles a file format in the allowed formats list.
   * @param format The file format to toggle.
   * @param event The change event from the checkbox.
   */
  toggleFileFormat(format: string, event: Event): void {
    const isChecked = (event.target as HTMLInputElement).checked;
    if (isChecked && !this.allowedFileFormats.includes(format)) {
      this.allowedFileFormats.push(format);
    } else if (!isChecked) {
      this.allowedFileFormats = this.allowedFileFormats.filter((f) => f !== format);
    }
    console.log('Updated allowed formats:', this.allowedFileFormats);
  }

  /**
   * Saves the updated system configuration to the backend.
   */
  saveConfig(): void {
    const updatedConfig: SystemConfig = {
      allowedFileFormats: this.allowedFileFormats,
      defaultPrintPageLimit: this.defaultPrintPageLimit,
      issueDate: this.issueDate,
    };

    this.http.put('/api/system-config', updatedConfig).subscribe(
      () => {
        alert('Cấu hình đã được lưu thành công!');
      },
      (error) => {
        console.error('Error saving system config:', error);
        alert('Không thể lưu cấu hình!');
      }
    );
  }

  /**
   * Navigates back to the button page.
   */
  proceed(): void {
    window.location.href = '/button-page'; // Route address
  }
}
