import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyBaseComponent } from './company-base.component';

describe('CompanyBaseComponent', () => {
  let component: CompanyBaseComponent;
  let fixture: ComponentFixture<CompanyBaseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompanyBaseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompanyBaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
