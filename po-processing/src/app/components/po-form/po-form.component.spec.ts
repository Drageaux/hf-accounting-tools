import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PoFormComponent } from './po-form.component';

describe('PoFormComponent', () => {
  let component: PoFormComponent;
  let fixture: ComponentFixture<PoFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PoFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PoFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
