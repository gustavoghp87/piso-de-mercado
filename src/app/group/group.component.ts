import { Component, OnInit } from '@angular/core'
// import { Router } from "@angular/router"
import { UsersService } from '../services/users.service'
import { Observable } from 'rxjs'
import { select, Store } from '@ngrx/store'
import { typeUser, typeGroup } from '../models/types'
import { setUser } from '../reducers/actions'
import { mobile } from '../app.component'


@Component({
  selector: 'app-group',
  templateUrl: './group.component.html',
  styleUrls: ['./group.component.css']
})

export class GroupComponent implements OnInit {
  groupName:string = ''
  username:string = ''
  email:string
  token:string
  groups:typeGroup[]
  profileImage:string
  showGroup:string
  userChannels:string[]
  allChannels:string[]         // para admins
  groupAdmin = false
  superAdmin = false
  createChannelName:string = ''
  allUsers:string[]
  allUserData:typeUser[]       // para admins
  newUsername:string = ''
  mobile=mobile
  user$:Observable<typeUser>

  constructor(
    //private router:Router,
    private usersService:UsersService,
    private store:Store<{user:typeUser}>
  ) {}
  
  ngOnInit() {
    this.user$ = this.store.pipe(select('user'))
    this.user$.subscribe((user:typeUser) => {
      if (user) {
        this.groupName = user.showGroup
        this.groupAdmin = user.groupAdmin
        this.superAdmin = user.superAdmin
        this.username = user.username
        this.email = user.email
        this.token = user.token
        this.groups = user.groups
        this.profileImage = user.profileImage
        this.showGroup = user.showGroup
        if (user && user.groups) user.groups.forEach((group:typeGroup) => {
          if (group.name===this.groupName) this.userChannels = group.channels
        })
        //console.log("LISTO inicio group.component", this.groupName, this.groupAdmin, this.superAdmin, this.userChannels, this.email)
        this.getGroupUsers()
        this.getChannelsForAdmins()
        this.getDataAllUsers()
      }
    })
  }

  
  getGroupUsers() {
    console.log(`Function: Getting users for group... ${this.groupName}`)
    this.usersService.getGroupUsers(this.groupName).subscribe(
      data => this.allUsers = data['allUsers'],
      err => console.error(err)
    )
  }
  
  getChannelsForAdmins() {
    if (this.groupAdmin || this.superAdmin) {
      console.log('Admin fetching all channels', this.groupName)
      this.usersService.getChannelsForAdmins(this.groupName).subscribe(
        data => {
          console.log('Received data for all channels', data)
          this.allChannels = data['channels']
        },
        err => console.error(err)
      )
    }
  }
    
  getDataAllUsers() {
    if (!this.groupAdmin) return
    console.log('Getting all user data from server')
    this.usersService.getDataAllUsers().subscribe(
      data => {
        this.allUserData = data['users']
        console.log('Received all user data from server', this.allUserData)
      },
      err => console.error(err)
    )
  }

  viewChannel(channel:string) {
    if (localStorage.getItem("currentChannel")) {
      //this.socketService.leaveChannel()
    }
    console.log("Abriendo canal", channel)
    this.store.dispatch(setUser({userData: {
      username: this.username,
      email: this.email,
      superAdmin: this.superAdmin,
      groupAdmin: this.groupAdmin,
      profileImage: this.profileImage,
      groups: this.groups,
      token: this.token,
      showGroup: this.showGroup,
      currentChannel: channel
    }}))
    window.scrollTo(0,0)
    // this.router.navigateByUrl('/channel')
  }

  createChannel() {
    if (!this.createChannelName) {alert('New channel name cannot be empty'); return}
    for (let channel of this.allChannels) {
      if (this.createChannelName===channel) {alert('This channel already exists'); return}
    }
    this.usersService.createChannel(this.groupName, this.createChannelName).subscribe(
      data => {
        if (data['success']) {
          this.allUserData = data['users']
          this.updateUserChannels()
          this.getChannelsForAdmins()
        } else alert("Algo falló")
      },
      err => console.error(err)
    )
  }

  removeChannel(channel:string) {
    if (channel==='general') {alert(`Cannot remove default channel ${channel}`); return}
    this.usersService.removeChannel(this.groupName, channel).subscribe(
      data => {
        if (data['success']) {
          this.allUserData = data['users']
          this.updateUserChannels()
          this.getChannelsForAdmins()
        } else alert("Algo falló")
      },
      err => console.error(err)
    )
  }

  removeUser(userToRemove:string) {
    if (this.groupName==='newbies' || this.groupName==='general') {alert('Cannot remove users in this default channel'); return}
    if (userToRemove===this.username) {alert('Cannot remove yourself'); return}
    this.usersService.removeUserInGroup(userToRemove, this.groupName).subscribe(
      data => {
        if (data['success']) {
          this.allUsers = data['allUsers']
          console.log('Received new list of users', this.allUsers)
        } else if (data['isAdmin']) alert("No se puede eliminar a los Admins")
      },
      err => console.error(err)
    )
  }

  updateAllUsersList() {
    if (!this.allUserData) return
    this.allUsers = []
    this.allUserData.forEach((user:typeUser) => {
      user.groups.forEach((group:typeGroup) => {
        if (group.name===this.groupName && !this.allUsers.includes(group.name)) this.allUsers.push(user.username)
      })
    })
  }

  updateUserChannels() {
    this.usersService.getUser().subscribe(data => {
      if (data['success']) {
        this.store.dispatch(setUser({userData: {
          username: this.username,
          email: this.email,
          superAdmin: this.superAdmin,
          groupAdmin: this.groupAdmin,
          profileImage: this.profileImage,
          groups: data['userData'].groups,
          token: this.token,
          showGroup: this.showGroup
        }}))
      } else console.log("Falló actualización de datos x-22")
    })
  }

  addUserToGroup() {
    if (this.newUsername) {alert('New user\'s username cannot be empty'); return}
    if (this.groupName==='newbies' || this.groupName==='general') {alert('Cannot add users in the default channels: newbies and general'); return}
    if(this.allUsers.includes(this.newUsername)) {alert(`User ${this.newUsername} is already in the group`); return}
    console.log(`Adding new user ${this.newUsername} to group`)
    this.usersService.addUserToGroup(this.newUsername, this.groupName).subscribe(
      data => {
        console.log('Received data from adding user to group', data)
        this.allUserData = data['users']
        this.updateAllUsersList()
      },
      err => console.error,
      () => console.log(`Completed adding user ${this.newUsername} to group`)
    )
  }

  closeGroup() {
    this.store.dispatch(setUser({userData: {
      username: this.username,
      email: this.email,
      superAdmin: this.superAdmin,
      groupAdmin: this.groupAdmin,
      profileImage: this.profileImage,
      groups: this.groups,
      token: this.token,
      showGroup: '',
      currentChannel: ''
    }}))
  }

}
