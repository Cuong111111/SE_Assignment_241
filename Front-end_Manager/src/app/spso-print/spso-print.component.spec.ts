import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SPSOPrintComponent } from './spso-print.component';

describe('SPSOPrintComponent', () => {
  let component: SPSOPrintComponent;
  let fixture: ComponentFixture<SPSOPrintComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SPSOPrintComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SPSOPrintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
