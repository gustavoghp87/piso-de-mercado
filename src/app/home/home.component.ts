import { Component, OnInit } from '@angular/core'
import { SocketPanelService } from '../services/socket-panel.service'
import { mobile } from '../app.component'
import { typeProduct } from '../models/types'


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  mobile:boolean = mobile
  ticketsObj: typeProduct[]
  ticketsLeadersObj:typeProduct[]

  constructor(
    private socketPanelService:SocketPanelService
  ) {}

  ngOnInit() {
    this.getPanel()
    this.checkActive()
  }

  checkActive = () => {
    setTimeout(() => {
      const timestampNow = Date.now()
      //const dateNow = new Date(timestampNow).toLocaleString("es-AR", {timeZone: "America/Buenos_Aires"})
      const timestampToLocale = timestampNow - 1000 * 60 * 60 *3
      const dateNowString = new Date(timestampToLocale).toLocaleString("es-AR", {timeZone: "UTC"})
      const activeDay = (new Date(timestampToLocale)).getDay()>0 && (new Date(timestampToLocale)).getDay()<6 ? true : false
      const localeHour = parseInt(dateNowString.split(' ')[1])
      const activeHour = localeHour>10 && localeHour<17 ? true : false
      const nowActive = activeDay && activeHour ? true : false
      console.log("Hoy es activo:", activeDay, ", hora activa:", activeHour)
      if (nowActive) this.getPanel()
      this.checkActive()
    }, 1000*60)
  }
  
  getPanel() {
    this.socketPanelService.retrieveData().subscribe((data:any) => {
      if (data['success']) {
        this.ticketsObj = data['ticketsObj']
        this.ticketsLeadersObj = data['ticketsLeadersObj']
      }
    })
  }
}
