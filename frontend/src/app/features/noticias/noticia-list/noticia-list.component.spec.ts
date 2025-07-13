import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NoticiaListComponent } from './noticia-list.component';

describe('NoticiaListComponent', () => {
  let component: NoticiaListComponent;
  let fixture: ComponentFixture<NoticiaListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NoticiaListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NoticiaListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
