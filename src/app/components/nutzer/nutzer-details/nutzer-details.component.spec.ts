import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NutzerDetailsComponent } from './nutzer-details.component';

describe('NutzerDetailsComponent', () => {
  let component: NutzerDetailsComponent;
  let fixture: ComponentFixture<NutzerDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NutzerDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NutzerDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
