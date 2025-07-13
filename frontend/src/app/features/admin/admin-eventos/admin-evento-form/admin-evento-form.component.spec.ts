import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminEventoFormComponent } from './admin-evento-form.component';

describe('AdminEventoFormComponent', () => {
  let component: AdminEventoFormComponent;
  let fixture: ComponentFixture<AdminEventoFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminEventoFormComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AdminEventoFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
