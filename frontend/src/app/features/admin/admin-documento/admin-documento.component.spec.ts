import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminDocumentoComponent } from './admin-documento.component';

describe('AdminDocumentoComponent', () => {
  let component: AdminDocumentoComponent;
  let fixture: ComponentFixture<AdminDocumentoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminDocumentoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AdminDocumentoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
