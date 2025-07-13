import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NoticiaDetailComponent } from './noticia-detail.component';

describe('NoticiaDetailComponent', () => {
  let component: NoticiaDetailComponent;
  let fixture: ComponentFixture<NoticiaDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NoticiaDetailComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NoticiaDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
