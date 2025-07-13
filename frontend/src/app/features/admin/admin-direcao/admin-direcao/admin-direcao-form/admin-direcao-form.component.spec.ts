import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminDirecaoFormComponent } from './admin-direcao-form.component';

describe('AdminDirecaoFormComponent', () => {
  let component: AdminDirecaoFormComponent;
  let fixture: ComponentFixture<AdminDirecaoFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminDirecaoFormComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AdminDirecaoFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
