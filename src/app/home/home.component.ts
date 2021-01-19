import { Component, OnInit } from '@angular/core'
import { SocketPanelService } from '../services/socket-panel.service'
import { mobile } from '../app.component'
import { typeProduct } from '../models/types'


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})

// This component handles all the functionality of the home page
export class HomeComponent implements OnInit {
  
  mobile:boolean = mobile

  // tickets: string[] = [
  // 'BCBA:AGRO', 'BCBA:AUSO', 'BCBA:BHIP', 'BCBA:BOLT', 'BCBA:BPAT', 'CBA:BRIO',
  // 'BCBA:BRIO6', 'BCBA:CADO', 'BCBA:CAPX', 'BCBA:CARC', 'BCBA:CECO2',
  // 'BCBA:CELU', 'BCBA:CEPU', 'BCBA:CGPA2', 'BCBA:CTIO', 'BCBA:DGCU2', 'BCBA:DOME',
  // 'BCBA:DYCA', 'BCBA:EDLH', 'BCBA:EMDE', 'BCBA:FERR', 'BCBA:FIPL',
  // 'BCBA:GAMI', 'BCBA:GARO', 'BCBA:GBAN', 'BCBA:GCLA', 'BCBA:GRIM', 'BCBA:HAVA',
  // 'BCBA:INAG', 'BCBA:INTR', 'BCBA:INVJ', 'BCBA:IRCP', 'BCBA:IRSA', 'BCBA:LEDE',
  // 'BCBA:LONG', 'BCBA:MERA', 'BCBA:METR', 'BCBA:MOLA', 'BCBA:MOLI', 'BCBA:MORI',
  // 'BCBA:MTR', 'BCBA:OEST', 'BCBA:PATA', 'BCBA:PGR', 'BCBA:POLL', 'BCBA:RICH',
  // 'BCBA:RIGO', 'BCBA:ROSE']

  ticketsObj: typeProduct[]

  closeResult: string;

  constructor(
    private socketPanelService:SocketPanelService
  ) { }

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
        // console.log(data)
        this.ticketsObj = data['ticketsObj']
        this.ticketsObj.forEach((ticket:typeProduct) => {
          ticket.last_update = ticket.last_update.replace('T', ' ').split('.')[0] + ' GT'
        })
      }
    })
  }

  viewDetails(ticketName:string) {
    this.ticketsObj.forEach((ticket:typeProduct, index:number) => {
      if (ticket.pro_name===ticketName) this.ticketsObj[index].details = !this.ticketsObj[index].details
    })
  }

}
