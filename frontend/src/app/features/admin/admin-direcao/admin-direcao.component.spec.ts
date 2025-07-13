import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminDirecaoComponent } from './admin-direcao.component';

describe('AdminDirecaoComponent', () => {
  let component: AdminDirecaoComponent;
  let fixture: ComponentFixture<AdminDirecaoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminDirecaoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AdminDirecaoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
