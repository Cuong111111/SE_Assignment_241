import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { PrinterServiceComponent } from './printer-service.component';

describe('PrinterServiceComponent', () => {
  let component: PrinterServiceComponent;
  let fixture: ComponentFixture<PrinterServiceComponent>;
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PrinterServiceComponent],
      imports: [HttpClientTestingModule, FormsModule],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PrinterServiceComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
    fixture.detectChanges();
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch printers on init', () => {
    const mockResponse = {
      ActivePrinters: [
        {
          id: 1,
          name: 'Printer 1',
          isActive: true,
          brand: 'Brand A',
          model: 'Model X',
          description: 'Description 1',
          location: 'Location 1',
        },
      ],
      InactivePrinters: [
        {
          id: 2,
          name: 'Printer 2',
          isActive: false,
          brand: 'Brand B',
          model: 'Model Y',
          description: 'Description 2',
          location: 'Location 2',
        },
      ],
    };

    const req = httpMock.expectOne('/api/printers/status');
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);

    fixture.detectChanges();

    expect(component.activePrinters.length).toBe(1);
    expect(component.inactivePrinters.length).toBe(1);
  });

  it('should add a new printer', () => {
    component.newPrinter = {
      name: 'New Printer',
      brand: 'New Brand',
      model: 'New Model',
      description: 'New Description',
      location: 'New Location',
    };

    component.addPrinter();

    const req = httpMock.expectOne('/api/printers/add');
    expect(req.request.method).toBe('POST');
    req.flush({});

    expect(component.newPrinter.name).toBe('');
    expect(component.newPrinter.brand).toBe('');
    expect(component.newPrinter.model).toBe('');
    expect(component.newPrinter.description).toBe('');
    expect(component.newPrinter.location).toBe('');
  });

  it('should delete a printer', () => {
    component.deletePrinter(1);

    const req = httpMock.expectOne('/api/printers/delete/1');
    expect(req.request.method).toBe('DELETE');
    req.flush({});

    // Add additional checks if necessary
  });

  it('should update printer statuses', () => {
    component.printers = [
      { id: 1, name: 'Printer 1', isActive: true, brand: 'Brand A', model: 'Model X', description: 'Description 1', location: 'Location 1' },
      { id: 2, name: 'Printer 2', isActive: false, brand: 'Brand B', model: 'Model Y', description: 'Description 2', location: 'Location 2' },
    ];

    component.updatePrinterStatuses();

    const req = httpMock.expectOne('/api/printers/status');
    expect(req.request.method).toBe('PUT');
    req.flush({});

    // Add additional checks if necessary
  });
});
