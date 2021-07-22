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
    WebFooterComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
