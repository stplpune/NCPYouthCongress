import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PageNotFoundComponent } from './errors/page-not-found/page-not-found.component';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', loadChildren: () => import('./web/home/home.module').then(m => m.HomeModule) },
  { path: 'about', loadChildren: () => import('./web/about/about.module').then(m => m.AboutModule) },
  { path: 'register', loadChildren: () => import('./web/register/register.module').then(m => m.RegisterModule) },
  { path: 'login', loadChildren: () => import('./web/login/login.module').then(m => m.LoginModule) },
  { path: 'dashboard', loadChildren: () => import('./partial/dashboard/dashboard.module').then(m => m.DashboardModule) },
  { path: 'work-this-week', loadChildren: () => import('./partial/work-this-week/work-this-week.module').then(m => m.WorkThisWeekModule) },
  { path: 'social-media-image', loadChildren: () => import('./partial/social-media-image/social-media-image.module').then(m => m.SocialMediaImageModule) },
  { path: 'executive-members', loadChildren: () => import('./partial/executive-members/executive-members.module').then(m => m.ExecutiveMembersModule) },
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
