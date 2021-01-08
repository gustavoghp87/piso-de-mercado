import { Component, OnInit } from '@angular/core'
import { mobile } from '../app.component'


@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  mobile = mobile
  showBottomNavbar = true
  sc = 0
  scOld = 0
  
  constructor() {

  }

  ngOnInit(): void {
  }

  doSomethingOnWindowScroll(event) {
    this.sc = event.target.scrollingElement.scrollTop
    console.log(`old ${this.scOld} vs new ${this.sc}`)
    
    if (this.sc>this.scOld) {
      this.showBottomNavbar = false
      this.scOld = this.sc
      console.log("ocultado")
    } else if (this.sc==0) {
      this.showBottomNavbar = true
      this.scOld = this.sc
      console.log("mostrando", this.showBottomNavbar, this.mobile)
    } else {
      this.showBottomNavbar = true
      this.scOld = this.sc
      console.log("mostrando")
    }
  }

}
