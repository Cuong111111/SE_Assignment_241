import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintingComponent } from './printing.component';

describe('PrintingComponent', () => {
  let component: PrintingComponent;
  let fixture: ComponentFixture<PrintingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PrintingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PrintingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
