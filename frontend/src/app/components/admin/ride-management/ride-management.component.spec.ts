import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RideManagementComponent } from './ride-management.component';

describe('RideManagementComponent', () => {
  let component: RideManagementComponent;
  let fixture: ComponentFixture<RideManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RideManagementComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RideManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
