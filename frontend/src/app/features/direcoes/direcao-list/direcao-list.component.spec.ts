import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DirecaoListComponent } from './direcao-list.component';

describe('DirecaoListComponent', () => {
  let component: DirecaoListComponent;
  let fixture: ComponentFixture<DirecaoListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DirecaoListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DirecaoListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
