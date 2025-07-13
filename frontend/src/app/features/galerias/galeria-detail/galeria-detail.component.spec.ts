import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GaleriaDetailComponent } from './galeria-detail.component';

describe('GaleriaDetailComponent', () => {
  let component: GaleriaDetailComponent;
  let fixture: ComponentFixture<GaleriaDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GaleriaDetailComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GaleriaDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
