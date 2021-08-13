import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './auth/auth.guard';
import { AuthorizationGuard } from './auth/authorization.guard';
import { LoggedInAuthGuard } from './auth/logged-in-auth.guard';
import { PageNotFoundComponent } from './errors/page-not-found/page-not-found.component';
import { ServerErrorComponent } from './errors/server-error/server-error.component';
import { PartialComponent } from './partial/partial.component';
import { WebComponent } from './web/web.component';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  {
    path: '', component: WebComponent, children: [
      { path: 'home', loadChildren: () => import('./web/home/home.module').then(m => m.HomeModule), data: { title: 'Home' } },
      { path: 'about', loadChildren: () => import('./web/about/about.module').then(m => m.AboutModule), data: { title: 'About' } },
      { path: 'register', loadChildren: () => import('./web/register/register.module').then(m => m.RegisterModule), data: { title: 'Register' } },
      { path: 'login', loadChildren: () => import('./web/login/login.module').then(m => m.LoginModule), data: { title: 'Login' }, canActivate: [LoggedInAuthGuard] },
      { path: 'privacy-policy', loadChildren: () => import('./web/privacy-policy/privacy-policy.module').then(m => m.PrivacyPolicyModule) },
    ]
  },
  {
    path: '',
    canActivate: [AuthGuard],
    canActivateChild: [AuthorizationGuard],
    component: PartialComponent, children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', loadChildren: () => import('./partial/dashboard/dashboard.module').then(m => m.DashboardModule), data: { title: 'Dashboard' } },
      //{ path: 'masters/designation-master', loadChildren: () => import('./partial/masters/designation-master/designation-master.module').then(m => m.DesignationMasterModule), data: { title: 'Designation Master' } },
      { path: 'master/organization', loadChildren: () => import('./partial/masters/organization-master/organization-master.module').then(m => m.OrganizationMasterModule), data: { title: 'Organization Master' } },
      { path: 'master/party-program', loadChildren: () => import('./partial/masters/party-program-master/party-program-master.module').then(m => m.PartyProgramMasterModule) },
      { path: 'master/party-program/details', loadChildren: () => import('./partial/masters/party-program-master/party-program-details/party-program-details.module').then(m => m.PartyProgramDetailsModule) },
      { path: 'member/executive', loadChildren: () => import('./partial/members/executive-members/executive-members.module').then(m => m.ExecutiveMembersModule), data: { title: 'Executive Members' } },
      // { path: 'registrations', loadChildren: () => import('./partial/registrations/registrations.module').then(m => m.RegistrationsModule), data: { title: 'Registrations' } },
      { path: 'political-works', loadChildren: () => import('./partial/political-work/political-work.module').then(m => m.PoliticalWorkModule), data: { title: 'Political Work' } },
      { path: 'social-media', loadChildren: () => import('./partial/social-media-messages/social-media-messages.module').then(m => m.SocialMediaMessagesModule), data: { title: 'Social Media Messages' } },
      { path: 'feedbacks', loadChildren: () => import('./partial/feedbacks/feedbacks.module').then(m => m.FeedbacksModule), data: { title: 'Feedbacks' } },
      { path: 'member/all', loadChildren: () => import('./partial/members/view-members/view-members.module').then(m => m.ViewMembersModule), data: { title: 'View Members' } },
      { path: 'member/profile', loadChildren: () => import('./partial/members/member-profile/member-profile.module').then(m => m.MemberProfileModule), data: { title: 'Member Profile' } },
      { path: 'notifications', loadChildren: () => import('./partial/notifications/notifications.module').then(m => m.NotificationsModule), data: { title: 'Notifications' } },
      { path: 'help-support', loadChildren: () => import('./partial/help-support/help-support.module').then(m => m.HelpSupportModule), data: { title: 'Help Support' } },
      { path: 'forward-activities', loadChildren: () => import('./partial/forward-activities/forward-activities.module').then(m => m.ForwardActivitiesModule), data: { title: 'Forward Activities' } },
      { path: 'social-media/person-profile', loadChildren: () => import('./partial/social-media-person/social-media-person.module').then(m => m.SocialMediaPersonModule) },
      { path: 'forward-activity-tracker', loadChildren: () => import('./partial/forward-activity-tracker/forward-activity-tracker.module').then(m => m.ForwardActivityTrackerModule) },
      //{ path: 'user/my-profile', loadChildren: () => import('./partial/user-profile/my-profile/my-profile.module').then(m => m.MyProfileModule) },
      //{ path: 'user/change-password', loadChildren: () => import('./partial/user-profile/change-password/change-password.module').then(m => m.ChangePasswordModule) },
      { path: 'activity-analysis', loadChildren: () => import('./partial/activity-analysis/activity-analysis.module').then(m => m.ActivityAnalysisModule) },
    ]
  },
  { path: '500', component: ServerErrorComponent },

  { path: '**', component: PageNotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
