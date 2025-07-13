import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminMensagensComponent } from './admin-mensagens.component';

describe('AdminMensagensComponent', () => {
  let component: AdminMensagensComponent;
  let fixture: ComponentFixture<AdminMensagensComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminMensagensComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AdminMensagensComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
