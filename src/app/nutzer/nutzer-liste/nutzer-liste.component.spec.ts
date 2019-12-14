import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NutzerListeComponent } from './nutzer-liste.component';

describe('NutzerListeComponent', () => {
  let component: NutzerListeComponent;
  let fixture: ComponentFixture<NutzerListeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NutzerListeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NutzerListeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
