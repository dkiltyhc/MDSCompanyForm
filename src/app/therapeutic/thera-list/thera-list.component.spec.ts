import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TheraListComponent } from './thera-list.component';

describe('TheraListComponent', () => {
  let component: TheraListComponent;
  let fixture: ComponentFixture<TheraListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TheraListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TheraListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
