import { Component, OnInit, ViewEncapsulation } from '@angular/core'
import { mobile } from '../app.component'
import { NgbModal } from '@ng-bootstrap/ng-bootstrap'
import { UsersService } from '../services/users.service'
// import { Router } from '@angular/router'
import { Observable } from 'rxjs'
import { select, Store } from '@ngrx/store'
import { setUser } from '../reducers/actions'
import { typeUser } from '../models/types'


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
  token:string = ""
  user$:Observable<typeUser>
  newUserUsername = ""
  newUserPassword = ""
  newUserEmail = ""
  
  constructor(
    private modalService:NgbModal,
    private userService:UsersService,
    //private router:Router,
    private store:Store<{user:typeUser}>
  ) { }

  ngOnInit(): void {
    this.user$ = this.store.pipe(select('user'))
    if (localStorage.getItem('username') && localStorage.getItem('token')) {
      // console.log("Procediendo a loguear en autom")
      this.username = localStorage.getItem('username')
      this.token = localStorage.getItem('token')
      this.userService.getUser().subscribe(
        data => {
          console.log("Data de getUser", data)
          if (data['success']) {
            // console.log("Éxito en getUser automático")
            this.setUserLocal(data['userData'])
          } else {
            //console.log("No hubo éxito en getUser automático"); localStorage.clear()
          }
        }
      )
    }
  }


  doSomethingOnWindowScroll(event) {
    this.sc = event.target.scrollingElement.scrollTop
    if (this.sc>this.scOld) {
      this.showBottomNavbar = false
      this.scOld = this.sc
    } else if (this.sc==0) {
      this.showBottomNavbar = true
      this.scOld = this.sc
      // console.log("mostrando", this.showBottomNavbar, this.mobile)
    } else {
      this.showBottomNavbar = true
      this.scOld = this.sc
    }
  }

  openWindowCustomClass(content) {
    this.modalService.open(content, { windowClass: 'dark-modal' })
  }

  login() {
    if (!this.username) {alert("Falta el username"); return}
    if (!this.password) {alert("Falta el password"); return}
    this.userService.login(this.username, this.password).subscribe(data => {
      if (data['success']) {
        this.modalService.dismissAll()
        this.token = data['newToken']
        this.setUserLocal(data['user'])
        window.scrollTo(0, 0)
      } else alert('Datos inválidos')
    })
  }

  setUserLocal(userData:typeUser|null) {
    if (userData) userData.showGroup = ''
    // console.log("Estableciendo user,", userData, "y", this.token)
    this.store.dispatch(setUser({userData}))
  }

  logOut() {
    this.userService.logout().subscribe(
      data => {
        if (data['success']) console.log("Cerrado en base de datos")
        else alert("Algo falló")
      }
    )
    window.scrollTo(0, 0)
    localStorage.clear()
    this.setUserLocal(null)
  }
  
  createUser() {
    if(!this.newUserUsername) {alert('Falta el username'); return}
    if(!this.newUserPassword) {alert('Falta el password'); return}
    if(this.newUserPassword.length<10) {alert('Mínimo 10 caracteres para que no molesten los navegadores con que el sitio no es seguro'); return}
    this.newUserUsername = this.newUserUsername.toLowerCase()
    if (this.newUserUsername.includes(' ')) this.newUserUsername = this.newUserUsername.replace(' ', '')
    this.userService.createUser(
      this.newUserUsername,
      this.newUserPassword,
      this.newUserEmail
    ).subscribe(
      data => {
        if (data['success']) {
          // console.log("Usuario creado,", data)
          alert("Usuario creado")
          this.username = this.newUserUsername
          this.password = this.newUserPassword
          this.login()
        } else if (data['exists']) alert("Ya existe usuario con ese username")
        else alert("Algo falló")
      }
    )
  }

  subir() {
    window.scrollTo(0, 0)
  }

}
