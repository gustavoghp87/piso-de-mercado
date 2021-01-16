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

  tickets: string[] = [
  'BCBA:AGRO', 'BCBA:AUSO', 'BCBA:BHIP', 'BCBA:BOLT', 'BCBA:BPAT', 'CBA:BRIO',
  'BCBA:BRIO6', 'BCBA:CADO', 'BCBA:CAPX', 'BCBA:CARC', 'BCBA:CECO2',
  'BCBA:CELU', 'BCBA:CEPU', 'BCBA:CGPA2', 'BCBA:CTIO', 'BCBA:DGCU2', 'BCBA:DOME',
  'BCBA:DYCA', 'BCBA:EDLH', 'BCBA:EMDE', 'BCBA:FERR', 'BCBA:FIPL',
  'BCBA:GAMI', 'BCBA:GARO', 'BCBA:GBAN', 'BCBA:GCLA', 'BCBA:GRIM', 'BCBA:HAVA',
  'BCBA:INAG', 'BCBA:INTR', 'BCBA:INVJ', 'BCBA:IRCP', 'BCBA:IRSA', 'BCBA:LEDE',
  'BCBA:LONG', 'BCBA:MERA', 'BCBA:METR', 'BCBA:MOLA', 'BCBA:MOLI', 'BCBA:MORI',
  'BCBA:MTR', 'BCBA:OEST', 'BCBA:PATA', 'BCBA:PGR', 'BCBA:POLL', 'BCBA:RICH',
  'BCBA:RIGO', 'BCBA:ROSE']

  ticketsObj: typeProduct[]

  closeResult: string;

  constructor(
    private socketPanelService:SocketPanelService
  ) { }

  ngOnInit() {
    this.getPanel()
  }
  
  getPanel() {
    console.log("TIME")
    this.socketPanelService.retrieveData(this.tickets).subscribe((data:any) => {
      console.log(data)
      this.ticketsObj = data
      this.ticketsObj.forEach((ticket:typeProduct) => {
        ticket.last_update = ticket.last_update.replace('T', ' ').split('.')[0] + ' GT'
      })
      // this.MELI.last_update = this.MELI.last_update.replace('T', ' ').split('.')[0] + ' GT'

      // setTimeout(() => {
        this.getPanel()
      // }, 120000)
    
    })
  }

  viewDetails(ticketName:string) {
    this.ticketsObj.forEach((ticket:typeProduct, index:number) => {
      if (ticket.pro_name===ticketName) this.ticketsObj[index].details = !this.ticketsObj[index].details
    })
  }

}
