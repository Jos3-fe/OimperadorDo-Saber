import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CicloDetalhesComponent } from './ciclo-detalhes.component';

describe('CicloDetalhesComponent', () => {
  let component: CicloDetalhesComponent;
  let fixture: ComponentFixture<CicloDetalhesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CicloDetalhesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CicloDetalhesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
