import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { JWT_OPTIONS, JwtHelperService } from '@auth0/angular-jwt';
import { NavbarComponent } from './shared/navbar/navbar.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SnackbarComponent } from './shared/snackbar/snackbar.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AuthInterceptor } from './auth/interceptor/auth.interceptor';

@NgModule({
  declarations: [AppComponent],
  imports: [HttpClientModule ,BrowserModule,NavbarComponent, AppRoutingModule, BrowserAnimationsModule,MatSnackBarModule, NgbModule],
   providers: [ JwtHelperService,
    { provide: JWT_OPTIONS, useValue: JWT_OPTIONS },
  {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }],
  bootstrap: [AppComponent]
})
export class AppModule { }
