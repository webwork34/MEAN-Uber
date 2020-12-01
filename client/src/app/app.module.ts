import { TokenInterceptor } from './classes/token.interceptor';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginPageComponent } from './authBlock/login-page/login-page.component';
import { AuthLayoutComponent } from './authBlock/auth-layout/auth-layout.component';
import { SiteLayoutComponent } from './siteBlock/site-layout/site-layout.component';
import { RegisterPageComponent } from './authBlock/register-page/register-page.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ProfilePageComponent } from './siteBlock/profile-page/profile-page.component';
import { HistoryPageComponent } from './siteBlock/history-page/history-page.component';
import { ChangePasswordComponent } from './siteBlock/profile-page/change-password/change-password.component';
import { ResetPageComponent } from './authBlock/reset-page/reset-page.component';
import { PasswordPageComponent } from './authBlock/password-page/password-page.component';
import { NewLoadsPageComponent } from './siteBlock/new-loads-page/new-loads-page.component';
import { PostedLoadsPageComponent } from './siteBlock/posted-loads-page/posted-loads-page.component';
import { AssignedLoadsPageComponent } from './siteBlock/assigned-loads-page/assigned-loads-page.component';
import { CreateNewLoadPageComponent } from './siteBlock/create-new-load-page/create-new-load-page.component';
import { CreateNewTruckPageComponent } from './siteBlock/create-new-truck-page/create-new-truck-page.component';
import { ShowUserTrucksPageComponent } from './siteBlock/show-user-trucks-page/show-user-trucks-page.component';
import { UpdateTruckPageComponent } from './siteBlock/update-truck-page/update-truck-page.component';
import { LoadPageComponent } from './siteBlock/load-page/load-page.component';
import { LoadShippingInfoPageComponent } from './siteBlock/load-shipping-info-page/load-shipping-info-page.component';
import { EditLoadPageComponent } from './siteBlock/edit-load-page/edit-load-page.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@NgModule({
  declarations: [
    AppComponent,
    LoginPageComponent,
    AuthLayoutComponent,
    SiteLayoutComponent,
    RegisterPageComponent,
    ProfilePageComponent,
    HistoryPageComponent,
    ChangePasswordComponent,
    ResetPageComponent,
    PasswordPageComponent,
    NewLoadsPageComponent,
    PostedLoadsPageComponent,
    AssignedLoadsPageComponent,
    CreateNewLoadPageComponent,
    CreateNewTruckPageComponent,
    ShowUserTrucksPageComponent,
    UpdateTruckPageComponent,
    LoadPageComponent,
    LoadShippingInfoPageComponent,
    EditLoadPageComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    FontAwesomeModule,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      multi: true,
      useClass: TokenInterceptor,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
