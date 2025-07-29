import { NgModule, OnInit } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './partial/template/header/header.component';
import { SidebarComponent } from './partial/template/sidebar/sidebar.component';
import { FooterComponent } from './partial/template/footer/footer.component';
import { PageNotFoundComponent } from './errors/page-not-found/page-not-found.component';
import { WebComponent } from './web/web.component';
import { PartialComponent } from './partial/partial.component';
import { WebHeaderComponent } from './web/template/web-header/web-header.component';
import { WebFooterComponent } from './web/template/web-footer/web-footer.component';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { AuthGuard } from './auth/auth.guard';
import { AuthService } from './auth/auth.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgxSpinnerModule } from 'ngx-spinner';
import {NgxPaginationModule} from 'ngx-pagination'; // <-- import the module
import { AgmCoreModule} from '@agm/core';
import { ServerErrorComponent } from './errors/server-error/server-error.component';
import { NgxSelectModule } from 'ngx-select-ex';
import { MatDialogModule } from '@angular/material/dialog';
import { ActivityDetailsComponent } from './partial/dialogs/activity-details/activity-details.component';
import { LightboxModule } from '@ngx-gallery/lightbox';
import { GalleryModule } from '@ngx-gallery/core';
import { DeleteComponent } from './partial/dialogs/delete/delete.component';
import { NoAuthGuardService } from './auth/no-auth-guard.service';
import { AuthorizationService } from './auth/authorization.service';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { AddMemberComponent } from './partial/dialogs/add-member/add-member.component';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';
import { UserBlockUnblockComponent } from './partial/dialogs/user-block-unblock/user-block-unblock.component';
import { AddDesignationComponent } from './partial/dialogs/add-designation/add-designation.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { RecentPostDetailsComponent } from './partial/dialogs/recent-post-details/recent-post-details.component';
import { TooltipModule } from './partial/directive/tooltip.module';
import { AddCommitteeComponent } from './partial/dialogs/add-committee/add-committee.component';
import { NgIdleModule } from "@ng-idle/core";
import { ActivatedRoute, Router } from '@angular/router';
import { Idle, DEFAULT_INTERRUPTSOURCES } from '@ng-idle/core';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
// export function httpTranslateLoaderFactory(http: HttpClient) {
//   return new TranslateHttpLoader(http);
// }

export function httpTranslateLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    SidebarComponent,
    FooterComponent,
    PageNotFoundComponent,
    WebComponent,
    PartialComponent,
    WebHeaderComponent,
    WebFooterComponent,
    ServerErrorComponent,
    ActivityDetailsComponent,
    DeleteComponent,
    AddMemberComponent,
    UserBlockUnblockComponent,
    AddDesignationComponent,
    RecentPostDetailsComponent,
    AddCommitteeComponent,
  ],
  imports: [
    BrowserModule,
    NgxSpinnerModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    NgxPaginationModule,
    NgxSelectModule,
    MatDialogModule,
    LightboxModule,
    GalleryModule,
    Ng2SearchPipeModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
    DragDropModule,
    TooltipModule,
    TranslateModule,
    HttpClientModule,
    NgIdleModule.forRoot(),
    ToastrModule.forRoot({
      timeOut: 3000,
      closeButton: true,
      progressBar:true,
      preventDuplicates: true,
    }),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: httpTranslateLoaderFactory,
        deps: [HttpClient]
      }
    }),
    BrowserAnimationsModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyAkNBALkBX7trFQFCrcHO2I85Re2MmzTo8',
      language: 'en',
      libraries: ['places', 'geometry'],
    }),
    // AgmDrawingModule,
  ],
  exports : [WebHeaderComponent],
  providers: [DatePipe, AuthorizationService, NoAuthGuardService, AuthGuard],
  bootstrap: [AppComponent]
})
export class AppModule{
  constructor(
    private idle: Idle,
    private router: Router,
    private route: ActivatedRoute,
    private toastrService: ToastrService,
  ){ this.sessionTimeOut(); }
  timedOut = false;

  sessionTimeOut(){
    // 3600(second) = 60 minutes
    this.idle.setIdle(3600); // 60 minutes Before Reset Website 
    // this.idle.setTimeout(5);
    this.idle.setInterrupts(DEFAULT_INTERRUPTSOURCES);
    this.idle.onTimeout.subscribe(() => {
      this.timedOut = true;
    });
    this.idle.onTimeoutWarning.subscribe((countdown) => this.logOut());
    this.reset();
    // this.toastrService.error("Session Time Out...!!!");
  }
  
  logOut() {
    sessionStorage.clear();
    this.router.navigate(['/home'], { relativeTo: this.route })
  }
  
  reset() {
      this.idle.watch();
      this.timedOut = false;
    }
  
 }
