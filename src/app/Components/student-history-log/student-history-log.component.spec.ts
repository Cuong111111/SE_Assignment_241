import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentHistoryLogComponent } from './student-history-log.component';

describe('StudentHistoryLogComponent', () => {
  let component: StudentHistoryLogComponent;
  let fixture: ComponentFixture<StudentHistoryLogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StudentHistoryLogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StudentHistoryLogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
