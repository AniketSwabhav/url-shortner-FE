import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { LoginService } from 'src/app/service/login.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {

  isAuthenticated = false;
  isAdmin = false;
  userId: string | null = null;

  constructor(private loginService: LoginService) { }

  ngOnInit() {
    this.isAuthenticated = this.loginService.isAuthenticated();
    this.isAdmin = this.loginService.isAdmin();
    this.userId = this.loginService.getUserId();

    this.loginService.authStatus$.subscribe(status => {
      this.isAuthenticated = status;
      this.isAdmin = this.loginService.isAdmin();
    });
  }

  logout() {
    this.loginService.logout();
    this.isAuthenticated = false;
    this.isAdmin = false;
  }
}
