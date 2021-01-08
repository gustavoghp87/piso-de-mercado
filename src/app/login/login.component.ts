import { Component, OnInit } from '@angular/core'
import { Router } from "@angular/router"
import { UsersService } from "../services/users.service"
import { SocketPanelService } from '../services/socket-panel.service'
import { mobile } from '../app.component'
import { typeProduct } from '../models/types'


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

// This component handles all the functionality of the login page
export class LoginComponent implements OnInit {
  
  username:string = ""
  password:string = ""

  // create new user fields
  newUserUsername = ""
  newUserPassword = ""
  newUserEmail = ""

  mobile:boolean = mobile

  MELI:typeProduct

  constructor(
    private router:Router,
    private userService:UsersService,
    private socketPanelService:SocketPanelService
  ) { }

  ngOnInit() {
    // localStorage.clear()
    this.getPanel()
  }
  
  getPanel() {
    console.log("TIME")
    this.socketPanelService.retrieveData().subscribe((data:typeProduct) => {
      console.log(data)
      this.MELI = data
      this.MELI.last_update = this.MELI.last_update.replace('T', ' ').split('.')[0] + ' GT'

      setTimeout(() => {
        this.getPanel()
      }, 50000)
    
    })
  }

  viewDetails() {
    this.MELI.details = !this.MELI.details
  }

  // log the user in
  login() {
    if(this.username === "") {
      alert("Username field cannot be empty")
      return
    }
    if(this.password === "") {
      alert("Passworld field cannot be empty")
      return
    }
    
    // check password via POST request
    this.userService.validateUser(this.username, this.password).subscribe(
      data => {
        console.log('Received data from validation')
        // console.log(data)
        if (data['success'] === true) {
          localStorage.setItem("username", this.username)
          this.router.navigateByUrl('/dashboard')
        } else {
          alert('Invalid username or password')
        }
      },
      err => console.error,
      () => console.log('completed validation')
    )
  }


  // create a new user
  createUser() {
    if(this.newUserUsername === "") {
      alert('Username field cannot be blank')
      return
    }
    if(this.newUserPassword === "") {
      alert('Password field cannot be blank')
      return
    }

    this.userService.createUser(this.newUserUsername, this.newUserPassword, this.newUserEmail).subscribe(
      data => {
        alert("Usuario creado")
        console.log(this.newUserUsername, this.newUserPassword, this.newUserEmail)
        this.userService.validateUser(this.newUserUsername, this.newUserPassword).subscribe(data => {
          if (data['success'] === true) {
            localStorage.setItem("username", this.newUserUsername)
            this.router.navigateByUrl('/dashboard')
          } else {
            alert('Se creó el usuario pero falló el ingreso')
          }
        })
      },
      err => console.error
    )
  }

}
