import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClickableContentComponent } from './clickable-content.component';

describe('ClickableContentComponent', () => {
  let component: ClickableContentComponent;
  let fixture: ComponentFixture<ClickableContentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClickableContentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClickableContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
