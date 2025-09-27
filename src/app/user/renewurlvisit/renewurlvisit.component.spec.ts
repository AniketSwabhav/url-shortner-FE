import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RenewurlvisitComponent } from './renewurlvisit.component';

describe('RenewurlvisitComponent', () => {
  let component: RenewurlvisitComponent;
  let fixture: ComponentFixture<RenewurlvisitComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RenewurlvisitComponent]
    });
    fixture = TestBed.createComponent(RenewurlvisitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
