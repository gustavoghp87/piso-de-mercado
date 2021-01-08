import { BrowserModule } from '@angular/platform-browser'
import { NgModule } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { HttpClientModule } from '@angular/common/http'

import { AppRoutingModule } from './app-routing.module'
import { AppComponent } from './app.component'
import { LoginComponent } from './login/login.component'
import { DashboardComponent } from './dashboard/dashboard.component'
import { GroupComponent } from './group/group.component'
import { ChannelComponent } from './channel/channel.component'
import { SocketService } from './services/socket.service'
import { FooterComponent } from './footer/footer.component';
import { NavbarComponent } from './navbar/navbar.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap'


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    DashboardComponent,
    GroupComponent,
    ChannelComponent,
    FooterComponent,
    NavbarComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    NgbModule
  ],
  providers: [SocketService],
  bootstrap: [AppComponent]
})

export class AppModule { }
