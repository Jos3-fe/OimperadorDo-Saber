import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminGaleriaFormComponent } from './admin-galeria-form.component';

describe('AdminGaleriaFormComponent', () => {
  let component: AdminGaleriaFormComponent;
  let fixture: ComponentFixture<AdminGaleriaFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminGaleriaFormComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AdminGaleriaFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
