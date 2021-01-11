import { Component, OnInit } from '@angular/core'
import { UsersService } from '../services/users.service'
import { Router } from '@angular/router'
// import { ChangeDetectorRef } from '@angular/core'
import { ImageService } from '../services/image.service'
import { server } from '../server'
import { Observable } from 'rxjs'
import { select, Store } from '@ngrx/store'


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})

export class DashboardComponent implements OnInit {

  username:string = localStorage.getItem('username')
  email:string = ''
  emailField:string = ''
  isGroupAdmin:boolean = false
  isSuperAdmin:boolean = false
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
  logged$:Observable<boolean>

  constructor(
    private usersService:UsersService,
    private router:Router,
    // private ref: ChangeDetectorRef,
    private imgService:ImageService,
    private store:Store<{logged:boolean}>
  ) { }

  ngOnInit() {
    this.logged$ = this.store.pipe(select('logged'))
    this.getUser()
  }

  // get the file to be uploaded
  uploadSelected(event) {
    console.log('Selected image!', event.target.files[0])
    this.selectedFile = event.target.files[0]
  }
  
  // update the user with new data
  updateUser() {
    this.usersService.updateUser(this.username, this.userData).subscribe(
      data => { },
      err => console.error,
      () => { }
    )
  }

  // upload the image
  upload() {
    console.log('Uploading image!')
    const fd = new FormData()
    console.log("IMAGEN:", this.selectedFile)
    if (!this.selectedFile) {alert('No image selected'); return}
    fd.append('image', this.selectedFile, this.selectedFile.name)
    this.imgService.upload(fd).subscribe(
      data => {
        console.log('Image upload received data')
        this.userData.profileImage = data.path
        this.updateUser()
      },
      err => console.error,
      () => console.log('Completed image upload')
    )
  }

  // get the user's data
  getUser() {
    this.usersService.getUser(this.username).subscribe(
      data => this.userData = data,
      err => console.error(err),
      () => {
        console.log(this.userData)
        // update data (email, groups, channels, admin privileges)
        this.email = this.userData.email
        this.groups = this.userData.groups
        this.isGroupAdmin = this.userData.groupAdmin
        this.isSuperAdmin = this.userData.superAdmin
        this.getGroups() // get the groups if this user is admin
        this.getDataAllUsers()
        console.log('\tUser retrieved', this.userData)
      }
    )
  }

  // update the user's email
  updateEmail() {
    this.usersService.updateEmail(this.username, this.emailField)
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

  /**
   * Route to the group page
   * @param group The group object
   */
  viewGroup(group) {
    if(this.isGroupAdmin || this.isSuperAdmin) {
      console.log(`Viewing group ${group}`)
      localStorage.setItem('currentGroup', group)
      this.router.navigateByUrl('/group')
    }
    else {
      console.log(`Viewing group ${group.name}`)
      localStorage.setItem('currentGroup', group.name)
      this.router.navigateByUrl('/group')
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
    if(this.isSuperAdmin || this.isGroupAdmin) {
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
    if(this.isSuperAdmin) {
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
    if(this.usernameMakeAdmin === '') {
      alert('Username cannot be blank')
      return
    }
    if(!this.listOfUsers.includes(this.usernameMakeAdmin)) {
      alert(`User ${this.usernameMakeAdmin} does not exist`)
      return
    }
    for(let user of this.allUsers) {
      if(user.username === this.usernameMakeAdmin) {
        if(user.groupAdmin) {
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
    if(this.usernameMakeAdmin === '') {
      alert('Username cannot be blank')
      return
    }
    if(!this.listOfUsers.includes(this.usernameMakeAdmin)) {
      alert(`User ${this.usernameMakeAdmin} does not exist`)
      return
    }
    for(let user of this.allUsers) {
      if(user.username === this.usernameMakeAdmin) {
        if(user.superAdmin) {
          alert('This user is already a super admin')
          return
        }
      }
    }
    console.log(`Making user ${this.usernameMakeAdmin} super admin`)
    this.usersService.makeUserSuperAdmin(this.usernameMakeAdmin).subscribe(
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

}
