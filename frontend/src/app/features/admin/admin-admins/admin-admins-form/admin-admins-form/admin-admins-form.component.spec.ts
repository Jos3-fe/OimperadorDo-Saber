import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminAdminsFormComponent } from './admin-admins-form.component';

describe('AdminAdminsFormComponent', () => {
  let component: AdminAdminsFormComponent;
  let fixture: ComponentFixture<AdminAdminsFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminAdminsFormComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AdminAdminsFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
