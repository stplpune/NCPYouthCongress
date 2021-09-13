import { NgModule } from '@angular/core';
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
import { HttpClientModule } from '@angular/common/http';
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
    ServerErrorComponent
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
    ToastrModule.forRoot({
      timeOut: 3000,
      closeButton: true,
      progressBar:true,
      preventDuplicates: true,
    }),
    BrowserAnimationsModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyAkNBALkBX7trFQFCrcHO2I85Re2MmzTo8',
      language: 'en',
      libraries: ['geometry','places']
    }),
  ],
  entryComponents:[ActivityDetailsComponent],
  providers: [DatePipe,AuthService, AuthGuard],
  bootstrap: [AppComponent]
})
export class AppModule { }
