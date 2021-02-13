import { Component, OnInit } from '@angular/core'
import { UsersService } from '../services/users.service'
// import { Router } from '@angular/router'
// import { ChangeDetectorRef } from '@angular/core'
import { ImageService } from '../services/image.service'
import { server } from '../server'
import { Observable } from 'rxjs'
import { select, Store } from '@ngrx/store'
import { typeUser } from '../models/types'
import { setUser } from '../reducers/actions'
import { mobile } from '../app.component'


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})

export class DashboardComponent implements OnInit {

  username:string = localStorage.getItem('username')
  token:string = localStorage.getItem('token')
  email:string = ''
  emailField:string = ''
  groupAdmin:boolean = false
  superAdmin:boolean = false
  profileImage:string
  server:string = server
  groups
  channels:string[]
  title:string = 'Dashboard'
  userData:typeUser
  allGroups:string[]
  allUsers:typeUser[]              // for admins
  listOfUsers:string[]            // for admins
  createGroupName:string = ''
  selectedFile = null
  user$:Observable<typeUser>
  mobile=mobile

  constructor(
    private usersService:UsersService,
    //private router:Router,
    // private ref: ChangeDetectorRef,
    private imgService:ImageService,
    private store:Store<{user:typeUser}>
  ) { }

  ngOnInit() {
    window.scrollTo(0, 0)
    this.user$ = this.store.pipe(select('user'))
    this.user$.subscribe((user:typeUser) => {
      if (user) {
        this.username = user.username
        this.token = user.token
        this.groupAdmin = user.groupAdmin
        this.superAdmin = user.superAdmin
        this.groups = user.groups
        this.email = user.email
        this.profileImage = user.profileImage
        this.getGroups()
        this.getDataAllUsers()
      }
    })
  }
  
  
  updateUserImage() {
    this.usersService.updateUserImage(this.profileImage).subscribe(
      data => {
        if (data['success']) {
          console.log("Datos actualizados")
          this.userData = {
            username: this.username,
            email: this.email,
            superAdmin: this.superAdmin,
            groupAdmin: this.groupAdmin,
            profileImage: this.profileImage,
            groups: this.groups,
            token: this.token
          }
          this.store.dispatch(setUser({userData:this.userData}))
        } else alert("Falló actualización de datos de usuario")
      },
      err => console.error(err)
    )
  }
  
  uploadSelected(event:any) {
    //console.log('Selected image!', event.target.files[0])
    this.selectedFile = event.target.files[0]
  }

  uploadImageToServer() {
    //console.log('Uploading image!', this.selectedFile)
    if (!this.selectedFile) {alert('No image selected'); return}
    const fd = new FormData()
    fd.append('image', this.selectedFile, this.selectedFile.name)
    this.imgService.upload(fd).subscribe(
      data => {
        console.log('Image upload received data', data)
        this.profileImage = data.data['filename']
        this.updateUserImage()
      },
      err => console.error(err)
    )
  }

  updateEmail() {
    this.usersService.updateEmail(this.emailField).subscribe(
      data => {
        data = JSON.stringify(data)
        this.email = this.emailField
        this.emailField = ''
        this.userData = {
          username: this.username,
          email: this.email,
          superAdmin: this.superAdmin,
          groupAdmin: this.groupAdmin,
          profileImage: this.profileImage,
          groups: this.groups,
          token: this.token
        }
        this.store.dispatch(setUser({userData:this.userData}))
      },
      err => console.log('Error in POST call. Error: ' + err)
    )
  }

  viewGroup(group:string) {
    this.userData = {
      username: this.username,
      email: this.email,
      superAdmin: this.superAdmin,
      groupAdmin: this.groupAdmin,
      profileImage: this.profileImage,
      groups: this.groups,
      token: this.token,
      showGroup: group,
    }    
    this.store.dispatch(setUser({userData:this.userData}))

    //console.log("Grupo pasado:", "\n", group)
    if (this.groupAdmin || this.superAdmin) {
      console.log(`ADMIN Viewing group ${group}`)
      localStorage.setItem('currentGroup', group)
    }
    else {
      console.log(`No admin, Viewing group ${group}`)
      localStorage.setItem('currentGroup', group)
    }
    window.scrollTo(0, 0)
  }

  getGroups() {
    if (this.superAdmin || this.groupAdmin) {
      this.usersService.getGroups().subscribe(
        data => {
          this.allGroups = data['allGroups']
          console.log("Llegó getGroups(),", this.allGroups)
        },
        err => console.error(err)
      )
    }
  }

  createGroup() {
    if (!this.createGroupName) {return}
    if (this.allGroups.includes(this.createGroupName)) {alert(`Group ${this.createGroupName} already exists`); return}
    console.log(`Creating group ${this.createGroupName}`)

    this.usersService.createGroup(this.createGroupName).subscribe(
      data => {
        if (data['success']) {
          this.allGroups = data['allGroups']
          this.updateUserGroupsRender()
        }
      },
      err => console.log('Error in POST call. Error: ' + err),
      () => this.createGroupName = ''
    )
  }

  removeGroup(groupToRemove:string) {
    if (groupToRemove==='newbies' || groupToRemove==='general') {alert('Cannot remove these default groups from the system'); return}
    console.log(`Removing group ${groupToRemove} from the system.`)
    this.usersService.removeGroup(groupToRemove).subscribe(
      data => {
        if (data['success']) {
          this.allGroups = data['allGroups']
          this.updateUserGroupsRender()
        }
      },
      err => console.error(err)
    )
  }

  updateUserGroupsRender() {
    this.usersService.getUser().subscribe(
      data => {
        this.userData = data['userData']
        this.groups = this.userData.groups
        console.log("Nuevo grupos,", this.groups)
        
        this.store.dispatch(setUser({userData:this.userData}))
      },
      err => console.error(err)
    )
  }

  getDataAllUsers() {
    if (this.superAdmin) {
      this.usersService.getDataAllUsers().subscribe(
        data => {
          // console.log('Received all user data from server', data['users'])
          this.allUsers = data['users']
          this.listOfUsers = []
          this.allUsers.forEach(user => {this.listOfUsers.push(user.username)})
          // console.log("LIST OF USERS:", this.listOfUsers)
        },
        err => console.error(err)
      )
    }
  }

  removeUserFromSystem(usernameToRemove:string) {
    if (usernameToRemove==='Super') {alert('Cannot remove user Super'); return}
    console.log(`Removing user from system ${usernameToRemove}`)
    this.usersService.removeUserFromSystem(usernameToRemove).subscribe(
      data => {
        if (data['isAdmin']) {alert("No se puede eliminar Admin"); return}
        this.allUsers = data['users']
        this.listOfUsers = []
        this.allUsers.forEach(user => {this.listOfUsers.push(user.username)})
      },
      err => console.error(err)
    )
  }

  makeUserGroupAdmin(usernameMakeAdmin:string) {
    if (!usernameMakeAdmin) {alert('Username cannot be blank'); return}
    //if (!this.listOfUsers.includes(usernameMakeAdmin)) {alert(`User ${usernameMakeAdmin} does not exist`); return}
    if (!this.allUsers) return
    for (let user of this.allUsers) {
      if (user.username===usernameMakeAdmin)
        if (user.groupAdmin) {alert('This user is already a group admin'); return}
    }
    this.usersService.makeUserGroupAdmin(usernameMakeAdmin).subscribe(
      data => {if (data['success']) alert(`Usuario ${usernameMakeAdmin} ahora es ADMIN y GroupAdmin`)},
      err => console.error(err)
    )
  }

  makeUserSuperAdmin(usernameMakeAdmin:string) {
    if (!usernameMakeAdmin) {alert('Username cannot be blank'); return}
    //if (!this.listOfUsers.includes(usernameMakeAdmin)) {alert(`User ${usernameMakeAdmin} does not exist`); return}
    for (let user of this.allUsers) {
      if (user.username===usernameMakeAdmin) {
        if (user.superAdmin) {alert('This user is already a super admin'); return}
      }
    }
    console.log(`Making user ${usernameMakeAdmin} super admin`)
    this.usersService.makeUserSuperAdmin(usernameMakeAdmin).subscribe(
      data => {if (data['success']) alert(`Usuario ${usernameMakeAdmin} ahora es ADMIN y GroupAdmin`)},
      err => console.error(err)
    )
  }

}
