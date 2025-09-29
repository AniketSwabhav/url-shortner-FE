import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RedirectUrlComponent } from './redirect-url.component';

describe('RedirectUrlComponent', () => {
  let component: RedirectUrlComponent;
  let fixture: ComponentFixture<RedirectUrlComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RedirectUrlComponent]
    });
    fixture = TestBed.createComponent(RedirectUrlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
