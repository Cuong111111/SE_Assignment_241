import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuyPagesComponent } from './buy-pages.component';

describe('BuyPagesComponent', () => {
  let component: BuyPagesComponent;
  let fixture: ComponentFixture<BuyPagesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BuyPagesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BuyPagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
