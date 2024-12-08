import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { PrinterServiceComponent } from './printer-service.component';

describe('PrinterServiceComponent', () => {
  let component: PrinterServiceComponent;
  let fixture: ComponentFixture<PrinterServiceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PrinterServiceComponent],
      imports: [FormsModule], // Import FormsModule để hỗ trợ [(ngModel)]
    }).compileComponents();

    fixture = TestBed.createComponent(PrinterServiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should add a printer', () => {
    // Giả lập dữ liệu mẫu
    component.newPrinter = {
      id: 0,
      name: 'Printer 2',
      isActive: true,
      brand: 'Brand B',
      model: 'Model Y',
      description: 'Color inkjet printer',
      location: 'Campus B, Building C, Room 202',
    };

    // Gọi hàm thêm máy in
    component.addPrinter();

    // Kiểm tra máy in mới đã được thêm vào danh sách
    expect(component.printers.length).toBe(1);
    expect(component.printers[0].name).toBe('Printer 2');
    expect(component.printers[0].brand).toBe('Brand B');
  });

  it('should save changes', () => {
    // Giả lập dữ liệu máy in
    component.printers = [
      {
        id: 1,
        name: 'Printer 1',
        isActive: true,
        brand: 'Brand A',
        model: 'Model X',
        description: 'High-speed laser printer',
        location: 'Campus A, Building B, Room 101',
      },
    ];

    // Spy để kiểm tra console.log
    spyOn(console, 'log');

    // Gọi hàm saveChanges
    component.updatePrinterStatuses();

    // Kiểm tra console.log có được gọi với dữ liệu chính xác
    expect(console.log).toHaveBeenCalledWith('Trạng thái của các máy in đã được cập nhật!');
  });
});