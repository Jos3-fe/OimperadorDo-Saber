import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DirecaoDetailComponent } from './direcao-detail.component';

describe('DirecaoDetailComponent', () => {
  let component: DirecaoDetailComponent;
  let fixture: ComponentFixture<DirecaoDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DirecaoDetailComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DirecaoDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
