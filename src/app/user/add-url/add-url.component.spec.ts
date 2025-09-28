import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddUrlComponent } from './add-url.component';

describe('AddUrlComponent', () => {
  let component: AddUrlComponent;
  let fixture: ComponentFixture<AddUrlComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AddUrlComponent]
    });
    fixture = TestBed.createComponent(AddUrlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
