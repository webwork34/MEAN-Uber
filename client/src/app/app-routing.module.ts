import { EditLoadPageComponent } from './siteBlock/edit-load-page/edit-load-page.component';
import { DriverGuard } from './classes/driver.guard';
import { ShipperGuard } from './classes/shipper.guard';
import { LoadPageComponent } from './siteBlock/load-page/load-page.component';
import { UpdateTruckPageComponent } from './siteBlock/update-truck-page/update-truck-page.component';
import { ShowUserTrucksPageComponent } from './siteBlock/show-user-trucks-page/show-user-trucks-page.component';
import { CreateNewTruckPageComponent } from './siteBlock/create-new-truck-page/create-new-truck-page.component';
import { CreateNewLoadPageComponent } from './siteBlock/create-new-load-page/create-new-load-page.component';
import { PostedLoadsPageComponent } from './siteBlock/posted-loads-page/posted-loads-page.component';
import { NewLoadsPageComponent } from './siteBlock/new-loads-page/new-loads-page.component';
import { AssignedLoadsPageComponent } from './siteBlock/assigned-loads-page/assigned-loads-page.component';
import { PasswordPageComponent } from './authBlock/password-page/password-page.component';
import { ResetPageComponent } from './authBlock/reset-page/reset-page.component';
import { HistoryPageComponent } from './siteBlock/history-page/history-page.component';
import { ProfilePageComponent } from './siteBlock/profile-page/profile-page.component';
import { RegisterPageComponent } from './authBlock/register-page/register-page.component';
import { SiteLayoutComponent } from './siteBlock/site-layout/site-layout.component';
import { AuthLayoutComponent } from './authBlock/auth-layout/auth-layout.component';
import { LoginPageComponent } from './authBlock/login-page/login-page.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './classes/auth.guard';
import { PasswordGuard } from './classes/password.guard';
import { LoadShippingInfoPageComponent } from './siteBlock/load-shipping-info-page/load-shipping-info-page.component';

const routes: Routes = [
  {
    path: '',
    component: AuthLayoutComponent,
    children: [
      {
        path: '',
        redirectTo: '/login',
        pathMatch: 'full',
      },
      {
        path: 'login',
        component: LoginPageComponent,
      },
      {
        path: 'register',
        component: RegisterPageComponent,
      },
      {
        path: 'reset',
        component: ResetPageComponent,
      },
      {
        path: 'password/:token',
        component: PasswordPageComponent,
        canActivate: [PasswordGuard],
      },
    ],
  },
  {
    path: '',
    component: SiteLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'create-new-truck',
        component: CreateNewTruckPageComponent,
        canActivate: [DriverGuard],
      },
      {
        path: 'show-user-trucks',
        component: ShowUserTrucksPageComponent,
        canActivate: [DriverGuard],
      },
      {
        path: 'update-truck/:id',
        component: UpdateTruckPageComponent,
        canActivate: [DriverGuard],
      },
      {
        path: 'create-new-load',
        component: CreateNewLoadPageComponent,
        canActivate: [ShipperGuard],
      },
      {
        path: 'loads/:id',
        component: LoadPageComponent,
        canActivate: [ShipperGuard],
      },
      {
        path: 'loads/:id/edit',
        component: EditLoadPageComponent,
        canActivate: [ShipperGuard],
      },
      {
        path: 'loads/:id/shipping-info',
        component: LoadShippingInfoPageComponent,
      },
      {
        path: 'new-loads',
        component: NewLoadsPageComponent,
        canActivate: [ShipperGuard],
      },
      {
        path: 'posted-loads',
        component: PostedLoadsPageComponent,
        canActivate: [ShipperGuard],
      },
      {
        path: 'assigned-loads',
        component: AssignedLoadsPageComponent,
      },
      {
        path: 'history',
        component: HistoryPageComponent,
      },
      {
        path: 'profile',
        component: ProfilePageComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
