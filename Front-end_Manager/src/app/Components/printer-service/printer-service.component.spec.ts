import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { PrinterServiceComponent } from './printer-service.component';

describe('PrinterServiceComponent', () => {
  let component: PrinterServiceComponent;
  let fixture: ComponentFixture<PrinterServiceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PrinterServiceComponent],
      imports: [FormsModule],
    }).compileComponents();

    fixture = TestBed.createComponent(PrinterServiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should add a printer', () => {
    component.printer = { id: '123', manufacturer: 'ABC', location: 'HCM', model: 'XYZ' };
    component.addPrinter();
    expect(component.printer.id).toBe('123'); // Example expectation
  });

  it('should save changes', () => {
    spyOn(console, 'log');
    component.saveChanges();
    expect(console.log).toHaveBeenCalledWith('Saved Changes:', component.printers);
  });
});
