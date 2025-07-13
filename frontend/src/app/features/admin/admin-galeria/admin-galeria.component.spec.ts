import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminGaleriasComponent } from './admin-galeria.component';

describe('AdminGaleriaComponent', () => {
  let component: AdminGaleriasComponent;
  let fixture: ComponentFixture<AdminGaleriasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminGaleriasComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AdminGaleriasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
