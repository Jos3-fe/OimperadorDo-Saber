import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GaleriaListComponent } from './galeria-list.component';

describe('GaleriaListComponent', () => {
  let component: GaleriaListComponent;
  let fixture: ComponentFixture<GaleriaListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GaleriaListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GaleriaListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
