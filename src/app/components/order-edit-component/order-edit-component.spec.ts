import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderEditComponent } from './order-edit-component';

describe('OrderEditComponent', () => {
  let component: OrderEditComponent;
  let fixture: ComponentFixture<OrderEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrderEditComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(OrderEditComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
