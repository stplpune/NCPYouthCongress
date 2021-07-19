import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PageNotFoundComponent } from './errors/page-not-found/page-not-found.component';
import { PartialComponent } from './partial/partial.component';
import { WebComponent } from './web/web.component';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  {
    path: '', component: WebComponent, children: [
      { path: 'home', loadChildren: () => import('./web/home/home.module').then(m => m.HomeModule) },
      { path: 'about', loadChildren: () => import('./web/about/about.module').then(m => m.AboutModule) },
      { path: 'register', loadChildren: () => import('./web/register/register.module').then(m => m.RegisterModule) },
      { path: 'login', loadChildren: () => import('./web/login/login.module').then(m => m.LoginModule) },
    ]
  },
  {
    path: 'partial', component: PartialComponent, children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', loadChildren: () => import('./partial/dashboard/dashboard.module').then(m => m.DashboardModule) },
      { path: 'work-this-week', loadChildren: () => import('./partial/work-this-week/work-this-week.module').then(m => m.WorkThisWeekModule) },
      { path: 'social-media-image', loadChildren: () => import('./partial/social-media-image/social-media-image.module').then(m => m.SocialMediaImageModule) },
      { path: 'executive-members', loadChildren: () => import('./partial/executive-members/executive-members.module').then(m => m.ExecutiveMembersModule) },
      { path: 'registrations', loadChildren: () => import('./partial/registrations/registrations.module').then(m => m.RegistrationsModule) },
      { path: 'political-work', loadChildren: () => import('./partial/political-work/political-work.module').then(m => m.PoliticalWorkModule) },
      { path: 'social-media-messages', loadChildren: () => import('./partial/social-media-messages/social-media-messages.module').then(m => m.SocialMediaMessagesModule) },
      { path: 'feedbacks', loadChildren: () => import('./partial/feedbacks/feedbacks.module').then(m => m.FeedbacksModule) },
    ]
  },
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
