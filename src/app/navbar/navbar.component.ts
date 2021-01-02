import { Component, OnInit } from '@angular/core'
import { mobile } from '../app.component'


@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})

export class NavbarComponent implements OnInit {

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
