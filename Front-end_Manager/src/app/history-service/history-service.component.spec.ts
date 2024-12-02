import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms'; // For [(ngModel)]
import { HistoryServiceComponent } from './history-service.component';

describe('HistoryServiceComponent', () => {
  let component: HistoryServiceComponent;
  let fixture: ComponentFixture<HistoryServiceComponent>;
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HistoryServiceComponent],
      imports: [HttpClientTestingModule, FormsModule],
    }).compileComponents();

    fixture = TestBed.createComponent(HistoryServiceComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
    fixture.detectChanges();
  });

  afterEach(() => {
    httpMock.verify(); // Ensure no outstanding HTTP requests
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch print history for a student', () => {
    // Arrange
    component.studentId = '12345';
    const mockPrintHistory = [
      {
        printId: 1,
        userId: 12345,
        printDate: '2023-11-01T10:00:00',
        pagesPrinted: 10,
        printerId: 'Printer 1',
        title: 'Test Document',
      },
    ];

    // Act
    component.fetchPrintHistory();
    const req = httpMock.expectOne(`/api/history/print/12345`);

    // Assert
    expect(req.request.method).toBe('GET');
    req.flush(mockPrintHistory);
    expect(component.printHistory.length).toBe(1);
    expect(component.printHistory[0].title).toBe('Test Document');
  });

  it('should handle error when fetching print history', () => {
    // Arrange
    component.studentId = '12345';

    // Act
    component.fetchPrintHistory();
    const req = httpMock.expectOne(`/api/history/print/12345`);

    // Assert
    expect(req.request.method).toBe('GET');
    req.flush('Error fetching history', { status: 500, statusText: 'Server Error' });
    expect(component.printHistory.length).toBe(0);
    // Optional: Test if error handling shows an alert or console log
  });

  it('should export the monthly report as a PDF', () => {
    // Arrange
    const year = new Date().getFullYear();
    const month = '11'; // November
    component.selectedMonth = month;
    const mockPdfData = new Blob(['Mock PDF data'], { type: 'application/pdf' });

    // Act
    component.exportMonthlyReport();
    const req = httpMock.expectOne(`/api/history/monthly-report?year=${year}&month=${month}`);

    // Assert
    expect(req.request.method).toBe('GET');
    req.flush(mockPdfData);

    // Additional: Test for file download (requires a bit more setup)
    expect(component.selectedMonth).toBe(month);
  });

  it('should not fetch print history if studentId is empty', () => {
    // Arrange
    component.studentId = '';

    // Act
    spyOn(window, 'alert');
    component.fetchPrintHistory();

    // Assert
    expect(window.alert).toHaveBeenCalledWith('Vui lòng nhập mã số sinh viên!');
    httpMock.expectNone(`/api/history/print/`);
  });

  it('should not export report if month is not selected', () => {
    // Arrange
    component.selectedMonth = '';

    // Act
    spyOn(window, 'alert');
    component.exportMonthlyReport();

    // Assert
    expect(window.alert).toHaveBeenCalledWith('Vui lòng chọn tháng để xuất báo cáo!');
    httpMock.expectNone(`/api/history/monthly-report`);
  });
});
