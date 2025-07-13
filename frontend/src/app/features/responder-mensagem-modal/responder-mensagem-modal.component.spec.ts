import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResponderMensagemModalComponent } from './responder-mensagem-modal.component';

describe('ResponderMensagemModalComponent', () => {
  let component: ResponderMensagemModalComponent;
  let fixture: ComponentFixture<ResponderMensagemModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResponderMensagemModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ResponderMensagemModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
