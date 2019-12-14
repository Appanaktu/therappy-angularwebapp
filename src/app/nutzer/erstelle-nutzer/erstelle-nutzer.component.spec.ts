import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ErstelleNutzerComponent } from './erstelle-nutzer.component';

describe('ErstelleNutzerComponent', () => {
  let component: ErstelleNutzerComponent;
  let fixture: ComponentFixture<ErstelleNutzerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ErstelleNutzerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ErstelleNutzerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
