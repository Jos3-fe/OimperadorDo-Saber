import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminDocumentoFormComponent } from './admin-documento-form.component';

describe('AdminDocumentoFormComponent', () => {
  let component: AdminDocumentoFormComponent;
  let fixture: ComponentFixture<AdminDocumentoFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminDocumentoFormComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AdminDocumentoFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
