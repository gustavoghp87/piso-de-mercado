import { BrowserModule } from '@angular/platform-browser'
import { NgModule } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { HttpClientModule } from '@angular/common/http'
import { AppRoutingModule } from './app-routing.module'
import { AppComponent } from './app.component'
import { HomeComponent } from './home/home.component'
import { DashboardComponent } from './dashboard/dashboard.component'
import { GroupComponent } from './group/group.component'
import { ChannelComponent } from './channel/channel.component'
import { SocketService } from './services/socket.service'
import { FooterComponent } from './footer/footer.component'
import { NavbarComponent } from './navbar/navbar.component'
import { NgbModule } from '@ng-bootstrap/ng-bootstrap'
import { StoreModule } from '@ngrx/store'
import { setUserReducer } from './reducers/user.reducer';
import { TicketCardComponent } from './home/ticket-card/ticket-card.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations'


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    DashboardComponent,
    GroupComponent,
    ChannelComponent,
    FooterComponent,
    NavbarComponent,
    TicketCardComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    NgbModule,
    StoreModule.forRoot({}, {}),
    StoreModule.forRoot({
      user: setUserReducer
    }),
    NoopAnimationsModule
  ],
  providers: [SocketService],
  bootstrap: [AppComponent]
})

export class AppModule { }
