import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { JWT_OPTIONS, JwtHelperService } from '@auth0/angular-jwt';
import { NavbarComponent } from './shared/navbar/navbar.component';
@NgModule({
  declarations: [AppComponent],
  imports: [HttpClientModule ,BrowserModule,NavbarComponent, AppRoutingModule],
   providers: [ JwtHelperService,
    { provide: JWT_OPTIONS, useValue: JWT_OPTIONS }],
  bootstrap: [AppComponent]
})
export class AppModule { }
