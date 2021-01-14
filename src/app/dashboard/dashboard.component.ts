import { Component, OnInit } from '@angular/core'
import { UsersService } from '../services/users.service'
import { Router } from '@angular/router'
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
  groups = []
  channels = []
  title:string = 'Dashboard'
  userData
  allGroups
  allUsers
  listOfUsers = []
  usernameMakeAdmin:string = ''
  selectedFile = null
  user$:Observable<typeUser>
  mobile=mobile

  constructor(
    private usersService:UsersService,
    private router:Router,
    // private ref: ChangeDetectorRef,
    private imgService:ImageService,
    private store:Store<{user:typeUser}>
  ) { }

  ngOnInit() {
    window.scrollTo(0, 0)
    this.user$ = this.store.pipe(select('user'))
    // console.log("Desde dashboard:",
    if (localStorage.getItem('username')) {
      this.groups = JSON.parse(localStorage.getItem('groups')).groups
      this.groupAdmin = localStorage.getItem('groupAdmin') === 'true' ? true : false
      this.superAdmin = localStorage.getItem('superAdmin') === 'true' ? true : false
      this.email = localStorage.getItem('email')
      this.profileImage = localStorage.getItem('profileImage')
    }
  }
  
  
  updateUser() {
    this.usersService.updateUser(this.username, this.token, this.profileImage).subscribe(
      data => {
        if (data['success']) {
          console.log("Datos actualizados")
          const userData:typeUser = {
            username: this.username,
            email: this.email,
            superAdmin: this.superAdmin,
            groupAdmin: this.groupAdmin,
            profileImage: this.profileImage,
            groups: this.groups,
            token: this.token
          }
          this.store.dispatch(setUser({userData}))
        }
        else alert("Falló actualización de datos de usuario")
      },
      err => console.error(err)
    )
  }
  
  uploadSelected(event:any) {
    console.log('Selected image!', event.target.files[0])
    this.selectedFile = event.target.files[0]
  }

  uploadImageToServer() {
    console.log('Uploading image!', this.selectedFile)
    if (!this.selectedFile) {alert('No image selected'); return}
    const fd = new FormData()
    fd.append('image', this.selectedFile, this.selectedFile.name)
    this.imgService.upload(fd, this.username, this.token).subscribe(
      data => {
        console.log('Image upload received data', data)
        this.profileImage = data.data['filename']
        this.updateUser()
      },
      err => console.error(err),
      () => console.log('Completed image upload')
    )
  }


  getUser() {
    this.usersService.getUser(this.username, localStorage.getItem('token')).subscribe(
      data => {
        this.userData = data
        // update data (email, groups, channels, admin privileges)
        this.email = this.userData.email
        this.groups = this.userData.groups
        this.groupAdmin = this.userData.groupAdmin
        this.superAdmin = this.userData.superAdmin
        this.getGroups() // get the groups if this user is admin
        this.getDataAllUsers()
        console.log('\tUser retrieved', this.userData)
      },
      err => console.error(err)
    )
  }


  updateEmail() {
    this.usersService.updateEmail(this.username, this.emailField, localStorage.getItem('token'))
    .subscribe(
      (data) => {
        data = JSON.stringify(data)
        console.log('POST call successful. Sent ' + data)
        this.email = this.emailField
        this.emailField = ''
      },
      (err) => {
        console.log('Error in POST call. Error: ' + err)
      },
      () => {
        console.log('POST call completed.')
      }
    )
  }


  viewGroup(group) {
    this.userData = {
      username: this.username,
      email: this.email,
      superAdmin: this.superAdmin,
      groupAdmin: this.groupAdmin,
      profileImage: this.profileImage,
      groups: this.groups,
      token: this.token,
      showGroup: true
    }
    console.log("Actualizando userData para que muestre,", this.userData)
    this.store.dispatch(setUser({userData:this.userData}))

    console.log("Grupo pasado:", "\n", group)
    if (this.groupAdmin || this.superAdmin) {
      console.log(`ADMIN Viewing group ${group}`)
      localStorage.setItem('currentGroup', group)
    }
    else {
      console.log(`No admin, Viewing group ${group.name}`)
      localStorage.setItem('currentGroup', group.name)
    }
  }


  // the bind for the new group name
  createGroupName:string = ''

  // create a new group
  createGroup() {
    if(this.allGroups.includes(this.createGroupName)) {
      alert(`Group ${this.createGroupName} already exists`)
      return
    }
    console.log(`Creating group ${this.createGroupName}`)

    this.usersService.createGroup(this.username, this.createGroupName)
    .subscribe(
      (data) => {
        console.log(JSON.stringify(data)) //TODO: It is printing array of Objects and not the actual data.
        console.log('POST call successful. Sent ' + data)
        this.allGroups = data
        console.log(this.allGroups)
      },
      (err) => {
        console.log('Error in POST call. Error: ' + err)
      },
      () => {
        console.log('POST call completed.')
      }
    )
  }

  // get all groups and their data
  getGroups() {
    if(this.superAdmin || this.groupAdmin) {
      console.log('Admin fetching all groups')
      this.usersService.getGroups().subscribe(
        data => {
          this.allGroups = data
          console.log(data)
        },
        err => {
          console.error
        },
        () => {
          console.log('Finished retrieving groups for admin user')
        }
      )
    }
  }

  removeGroup(group) {
    if(group === 'newbies' || group === 'general') {
      alert('Cannot remove these default groups from the system')
    }
    else {
      console.log(`Removing group ${group} from the system.`)
      this.usersService.removeGroup(group).subscribe(
        data => {
          console.log("Received data: " + data)
          this.allGroups = data
        },
        err => {
          console.error
        },
        () => {
          console.log("Finished removing group " + group)
        }
      )
    }
  }

  // update the user's list 
  updateAllUsersList() {
    this.listOfUsers = []
    // for(let user in this.allUsers) {
    //   this.listOfUsers.push(user)
    // }
    for(let i = 0; i < this.allUsers.length; i++) {
      this.listOfUsers.push(this.allUsers[i].username)
    }
  }

  // get all the data of the users
  getDataAllUsers() {
    if(this.superAdmin) {
      this.usersService.getDataAllUsers().subscribe(
        data => {
          console.log('Received all user data from server')
          console.log(data)
          this.allUsers = data
          this.updateAllUsersList()
        },
        err => {
          console.error
        },
        () => {
          console.log('Completed getting all user data from server')
        }
      )
    }
  }

  // remove a user from system
  removeUserFromSystem(username:string) {
    if(username === 'Super') {
      alert('Cannot remove user Super')
      return
    }
    console.log(`Removing user from system ${username}`)
    this.usersService.removeUserFromSystem(username).subscribe(
      data => {
        console.log('Received data from removing user from system')
        this.allUsers = data
        this.updateAllUsersList()
      },
      err => {
        console.error
      },
      () => {
        console.log('Completed removing user from system')
      }
    )
  }

  // make a user a group admin
  userMakeAdminGroup() {
    if (!this.usernameMakeAdmin) {
      alert('Username cannot be blank')
      return
    }
    if(!this.listOfUsers.includes(this.usernameMakeAdmin)) {
      alert(`User ${this.usernameMakeAdmin} does not exist`)
      return
    }
    for (let user of this.allUsers) {
      if (user.username===this.usernameMakeAdmin) {
        if (user.groupAdmin) {
          alert('This user is already a group admin')
          return
        }
      }
    }
    console.log(`Making user ${this.usernameMakeAdmin} group admin`)
    this.usersService.makeUserGroupAdmin(this.usernameMakeAdmin).subscribe(
      data => {
        console.log('Received new data for making user an admin')
      },
      err => {
        console.error
      },
      () => {
        console.log('Completed making user request')
      }
    )
  }

  // make a user a super admin
  userMakeAdminSuper() {
    if (!this.usernameMakeAdmin) {
      alert('Username cannot be blank')
      return
    }
    if (!this.listOfUsers.includes(this.usernameMakeAdmin)) {
      alert(`User ${this.usernameMakeAdmin} does not exist`)
      return
    }
    for (let user of this.allUsers) {
      if (user.username === this.usernameMakeAdmin) {
        if(user.superAdmin) {
          alert('This user is already a super admin')
          return
        }
      }
    }
    console.log(`Making user ${this.usernameMakeAdmin} super admin`)
    this.usersService.makeUserSuperAdmin(this.usernameMakeAdmin).subscribe(
      data => {console.log('Received new data for making user an admin')},
      err => {console.error},
      () => {console.log('Completed making user request')}
    )
  }

}
