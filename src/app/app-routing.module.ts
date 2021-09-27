import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './auth/auth.guard';
import { AuthorizationGuard } from './auth/authorization.guard';
import { LoggedInAuthGuard } from './auth/logged-in-auth.guard';
import { NoAuthGuardService } from './auth/no-auth-guard.service';
import { AccessDeniedComponent } from './errors/access-denied/access-denied.component';
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
      { path: 'login', loadChildren: () => import('./web/login/login.module').then(m => m.LoginModule), data: { title: 'Login' }, canActivate: [NoAuthGuardService] },
      { path: 'privacy-policy', loadChildren: () => import('./web/privacy-policy/privacy-policy.module').then(m => m.PrivacyPolicyModule) },
      { path: 'share/:id', loadChildren: () => import('./web/share/share.module').then(m => m.ShareModule) },
      { path: 'events', loadChildren: () => import('./web/events/events.module').then(m => m.EventsModule) },
    ]
  },
  {
    path: '',
    canActivate: [AuthGuard],
    canActivateChild: [AuthorizationGuard],
    component: PartialComponent, children: [
      // NCP Admin
      { path: 'dashboard', loadChildren: () => import('./partial/dashboard/dashboard.module').then(m => m.DashboardModule), data: { title: 'Dashboard', allowedRoles: ['1', '2', '5'] } },
      { path: 'committee', loadChildren: () => import('./partial/masters/organization-master/organization-master.module').then(m => m.OrganizationMasterModule), data: { title: 'Committee Master', allowedRoles: ['1', '2', '5'] } },
      { path: 'committees-on-map', loadChildren: () => import('./partial/masters/committees-on-map/committees-on-map.module').then(m => m.CommitteesOnMapModule), data: { title: 'Committees On Map', allowedRoles: ['1', '2'] } },
      { path: 'party-program', loadChildren: () => import('./partial/masters/party-program-master/party-program-master.module').then(m => m.PartyProgramMasterModule), data: { title: 'Party Program', allowedRoles: ['1', '2'] } },
      { path: 'event-master', loadChildren: () => import('./partial/masters/event-master/event-master.module').then(m => m.EventMasterModule), data: { title: 'Event Master', allowedRoles: ['1', '2'] } },
      { path: 'party-program/details', loadChildren: () => import('./partial/masters/party-program-master/party-program-details/party-program-details.module').then(m => m.PartyProgramDetailsModule), data: { title: 'Program Details', allowedRoles: ['1', '2'] } },
      { path: 'designation-master', loadChildren: () => import('./partial/masters/designation-master/designation-master.module').then(m => m.DesignationMasterModule), data: { title: 'Designation Master', allowedRoles: ['1'] } },
      { path: 'executive-members', loadChildren: () => import('./partial/members/executive-members/executive-members.module').then(m => m.ExecutiveMembersModule), data: { title: 'Executive Members', allowedRoles: ['1', '2', '5'] } },
      { path: 'all-members', loadChildren: () => import('./partial/members/view-members/view-members.module').then(m => m.ViewMembersModule), data: { title: 'View Members', allowedRoles: ['1', '2', '5'] } },
      { path: 'profile', loadChildren: () => import('./partial/members/member-profile/member-profile.module').then(m => m.MemberProfileModule), data: { title: 'Member Profile', allowedRoles: ['1', '2', '5'] } },
      { path: 'party-work', loadChildren: () => import('./partial/political-work/political-work.module').then(m => m.PoliticalWorkModule), data: { title: 'Political Work', allowedRoles: ['1', '2', '5'] } },
      { path: 'social-media', loadChildren: () => import('./partial/social-media-messages/social-media-messages.module').then(m => m.SocialMediaMessagesModule), data: { title: 'Social Media Messages', allowedRoles: ['1', '2', '5'] } },
      { path: 'activity-analysis', loadChildren: () => import('./partial/activity-analysis/activity-analysis.module').then(m => m.ActivityAnalysisModule), data: { title: 'Activity Analysis', allowedRoles: ['1', '2', '5'] } },
      { path: 'forward-activity-tracker', loadChildren: () => import('./partial/forward-activity-tracker/forward-activity-tracker.module').then(m => m.ForwardActivityTrackerModule), data: { title: 'Forward Activity Tracker', allowedRoles: ['1', '2', '5'] } },
      { path: 'forward-activities', loadChildren: () => import('./partial/forward-activities/forward-activities.module').then(m => m.ForwardActivitiesModule), data: { title: 'Forward Activities', allowedRoles: ['1', '2'] } },
      { path: 'social-media/person-profile', loadChildren: () => import('./partial/social-media-person/social-media-person.module').then(m => m.SocialMediaPersonModule), data: { title: 'Social Media Person Profile', allowedRoles: ['1', '2', '5'] } },
      { path: 'feedbacks', loadChildren: () => import('./partial/feedbacks/feedbacks.module').then(m => m.FeedbacksModule), data: { title: 'Feedbacks', allowedRoles: ['1', '2', '5'] } },
      { path: 'notifications', loadChildren: () => import('./partial/notifications/notifications.module').then(m => m.NotificationsModule), data: { title: 'Notifications', allowedRoles: ['1', '2'] } },
      { path: 'help-support', loadChildren: () => import('./partial/help-support/help-support.module').then(m => m.HelpSupportModule), data: { title: 'Help Support', allowedRoles: ['1', '2', '5'] } },
      { path: 'my-profile', loadChildren: () => import('./partial/user-profile/my-profile/my-profile.module').then(m => m.MyProfileModule), data: { title: 'Help Support', allowedRoles: ['1', '2', '5', '7', '8'] } },
      
      // Election
      { path: 'create-election', loadChildren: () => import('./partial/election/create-election/create-election.module').then(m => m.CreateElectionModule), data: { title: 'Create Election', allowedRoles: ['7', '1'] } }, //, 
      { path: 'create-constituency', loadChildren: () => import('./partial/election/create-constituency/create-constituency.module').then(m => m.CreateConstituencyModule), data: { title: 'Create Constituency', allowedRoles: ['7', '1'] } },
      { path: 'assign-booth', loadChildren: () => import('./partial/election/assign-booth/assign-booth.module').then(m => m.AssignBoothModule), data: { title: 'Assign Booth', allowedRoles: ['7', '1'] } },
      { path: 'election-profile', loadChildren: () => import('./partial/election/election-profile/election-profile.module').then(m => m.ElectionProfileModule), data: { title: 'Profile', allowedRoles: ['7', '1'] } },
      { path: 'e-dashboard', loadChildren: () => import('./partial/election/dashboard-election/dashboard-election.module').then(m => m.DashboardElectionModule), data: { title: 'Dashboard', allowedRoles: ['7', '1'] } },      
      { path: 'add-client', loadChildren: () => import('./partial/election/add-client/add-client.module').then(m => m.AddClientModule), data: { title: 'Dashboard', allowedRoles: ['7', '1'] } },
      
      // Client
      { path: 'c-dashboard', loadChildren: () => import('./partial/client/c-dashboard/c-dashboard.module').then(m => m.CDashboardModule), data: { title: 'Dashboard', allowedRoles: ['8', '1'] } },
      { path: 'assign-agents-to-booths', loadChildren: () => import('./partial/client/assign-agents-to-booths/assign-agents-to-booths.module').then(m => m.AssignAgentsToBoothsModule), data: { title: 'Dashboard', allowedRoles: ['8', '1'] } },
      { path: 'election-details', loadChildren: () => import('./partial/client/election-details/election-details.module').then(m => m.ElectionDetailsModule) },
      { path: 'access-denied', component: AccessDeniedComponent },
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
