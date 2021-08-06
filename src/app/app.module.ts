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
import { AgmCoreModule } from '@agm/core';




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
  ],
  imports: [
    BrowserModule,
    NgxSpinnerModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    NgxPaginationModule,
    ToastrModule.forRoot({
      timeOut: 3000,
      closeButton: true,
      progressBar:true,
      preventDuplicates: true,
    }),
    BrowserAnimationsModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyA2AB0fKeqVHUUmRB1pvcaFRiDFTj8dSfM',
      language: 'en',
      libraries: ['places']
    }),
  ],
  entryComponents:[],
  providers: [DatePipe,AuthService, AuthGuard],
  bootstrap: [AppComponent]
})
export class AppModule { }
