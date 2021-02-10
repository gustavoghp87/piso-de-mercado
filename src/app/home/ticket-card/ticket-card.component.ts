import { Component, OnInit, Input } from '@angular/core'
import { typeProduct } from '../../models/types'
import { mobile } from '../../app.component'

@Component({
  selector: 'app-ticket-card',
  templateUrl: './ticket-card.component.html',
  styleUrls: ['./ticket-card.component.css']
})
export class TicketCardComponent implements OnInit {

  @Input() pro_name: string;
  @Input() bid: string;
  @Input() ask: string;
  @Input() prev_close_price: string;
  @Input() open_price: string;
  @Input() low_price: string;
  @Input() high_price: string;
  @Input() last_update: string;

  mobile:boolean = mobile
  ticketsObj: typeProduct[]
  ticketsLeadersObj:typeProduct[]
  showDetails:boolean = false

  constructor() {}

  ngOnInit() {
  }

  viewDetails() {
    this.showDetails = !this.showDetails
  }

  openChannel(ticketName:string) {
    alert(`Abriendo el canal de este papel ${ticketName} (próximamente)`)
  }

}
