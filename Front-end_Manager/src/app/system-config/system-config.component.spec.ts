import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { SystemConfigComponent } from './system-config.component';

describe('SystemConfigComponent', () => {
  let component: SystemConfigComponent;
  let fixture: ComponentFixture<SystemConfigComponent>;
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SystemConfigComponent],
      imports: [HttpClientTestingModule, FormsModule],
    }).compileComponents();

    fixture = TestBed.createComponent(SystemConfigComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
    fixture.detectChanges();
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch system configuration on init', () => {
    const mockConfig = {
      allowedFileFormats: ['PDF', 'DOCX'],
      defaultPrintPageLimit: 100,
      issueDate: '2024-10-24',
    };

    component.fetchConfig();
    const req = httpMock.expectOne('/api/system-config');
    req.flush(mockConfig);

    expect(component.allowedFileFormats).toEqual(mockConfig.allowedFileFormats);
    expect(component.defaultPrintPageLimit).toBe(mockConfig.defaultPrintPageLimit);
    expect(component.issueDate).toBe('2024-10-24');
  });

  it('should save system configuration', () => {
    const updatedConfig = {
      allowedFileFormats: ['PDF', 'DOCX', 'PPTX'],
      defaultPrintPageLimit: 150,
      issueDate: '2024-11-01',
    };

    component.allowedFileFormats = updatedConfig.allowedFileFormats;
    component.defaultPrintPageLimit = updatedConfig.defaultPrintPageLimit;
    component.issueDate = updatedConfig.issueDate;

    component.saveConfig();
    const req = httpMock.expectOne('/api/system-config');
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(updatedConfig);
    req.flush(updatedConfig);
  });
});
