import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TherapeuticClassificationComponent } from './therapeutic-classification.component';

describe('TherapeuticClassificationComponent', () => {
  let component: TherapeuticClassificationComponent;
  let fixture: ComponentFixture<TherapeuticClassificationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TherapeuticClassificationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TherapeuticClassificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
