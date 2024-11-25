import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ButtonPageComponent } from './button-page.component';

describe('ButtonPageComponent', () => {
  let component: ButtonPageComponent;
  let fixture: ComponentFixture<ButtonPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ButtonPageComponent],
      imports: [RouterTestingModule],
    }).compileComponents();

    fixture = TestBed.createComponent(ButtonPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate to correct routes', () => {
    spyOn(component, 'navigateTo');
    const buttons = fixture.debugElement.nativeElement.querySelectorAll('button');
    buttons[0].click(); // First button
    expect(component.navigateTo).toHaveBeenCalledWith('printer-management');
  });
});
