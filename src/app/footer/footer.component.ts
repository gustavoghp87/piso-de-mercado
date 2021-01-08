import { Component, OnInit } from '@angular/core'
import { mobile } from '../app.component'


@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})

export class FooterComponent implements OnInit {

  mobile:boolean = mobile
  FAOon:boolean = false
  CONTACTon:boolean = false

  constructor() { }

  ngOnInit(): void {
  }

  FAOclick() {
    this.FAOon = !this.FAOon
  }

  CONTACTclick() {
    this.CONTACTon = !this.CONTACTon
  }

}
