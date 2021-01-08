import { Component, OnInit, ViewEncapsulation } from '@angular/core'
import { mobile } from '../app.component'
import { NgbModal } from '@ng-bootstrap/ng-bootstrap'
import { UsersService } from '../services/users.service'
import { Router } from '@angular/router'


@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  mobile = mobile
  showBottomNavbar = true
  sc = 0
  scOld = 0

  username:string = ""
  password:string = ""

  // create new user fields
  newUserUsername = ""
  newUserPassword = ""
  newUserEmail = ""

  
  constructor(
    private modalService:NgbModal,
    private userService:UsersService,
    private router:Router
  ) { }

  ngOnInit(): void {
    // localStorage.clear()
  }

  doSomethingOnWindowScroll(event) {
    this.sc = event.target.scrollingElement.scrollTop
    //console.log(`old ${this.scOld} vs new ${this.sc}`)
    
    if (this.sc>this.scOld) {
      this.showBottomNavbar = false
      this.scOld = this.sc
      // console.log("ocultado")
    } else if (this.sc==0) {
      this.showBottomNavbar = true
      this.scOld = this.sc
      // console.log("mostrando", this.showBottomNavbar, this.mobile)
    } else {
      this.showBottomNavbar = true
      this.scOld = this.sc
      // console.log("mostrando")
    }
  }


  // MODAL
  openWindowCustomClass(content) {
    this.modalService.open(content, { windowClass: 'dark-modal' })
  }


  login() {
    if (!this.username) {alert("Username field cannot be empty"); return}
    if (!this.password) {alert("Passworld field cannot be empty"); return}
    
    this.userService.validateUser(this.username, this.password).subscribe(
      data => {
        if (data['success'] === true) {
          localStorage.setItem("username", this.username)
          this.modalService.dismissAll()
          this.router.navigateByUrl('/dashboard')
        } else {alert('Invalid username or password')}
      },
      err => console.error(err),
      () => console.log('completed validation')
    )
  }

  createUser() {
    if(!this.newUserUsername) {alert('Username field cannot be blank'); return}
    if(!this.newUserPassword) {alert('Password field cannot be blank'); return}

    this.userService.createUser(this.newUserUsername, this.newUserPassword, this.newUserEmail).subscribe(
      data => {
        alert("Usuario creado")
        this.userService.validateUser(this.newUserUsername, this.newUserPassword).subscribe(data => {
          if (data['success'] === true) {
            localStorage.setItem("username", this.newUserUsername)
            this.router.navigateByUrl('/dashboard')
          } else {alert('Se creó el usuario pero falló el ingreso')}
        })
      },
      err => console.error(err)
    )
  }

}
