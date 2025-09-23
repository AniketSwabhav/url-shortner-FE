import { Component } from '@angular/core';
import { Subscription } from 'rxjs';
import { LoginService } from './service/login.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'url-shortner-FE';
   isAuthenticated: boolean = false;
  private subscription!: Subscription;  

  constructor(private loginService: LoginService) {}

  ngOnInit() {
    this.subscription = this.loginService.authStatus$.subscribe(
      (status) => {
        this.isAuthenticated = status;
      }
    );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
