import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminSobreComponent } from './admin-sobre.component';

describe('AdminSobreComponent', () => {
  let component: AdminSobreComponent;
  let fixture: ComponentFixture<AdminSobreComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminSobreComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AdminSobreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
