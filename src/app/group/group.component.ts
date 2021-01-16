import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { UsersService } from '../services/users.service';
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
  channels:string[]
  allChannels:string[]         // para admins
  groupAdmin = false
  superAdmin = false
  createChannelName:string = ''
  userData
  allUsers:string[]
  allUserData:typeUser[]       // para admins
  newUsername:string = ''
  user$:Observable<typeUser>

  constructor(
    private router:Router,
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
        if (user && user.groups) user.groups.forEach((group:typeGroup) => {
          if (group.name === localStorage.getItem('showGroup')) this.channels = group.channels
        })
        console.log("LISTO", this.groupName, this.groupAdmin, this.superAdmin, this.channels)
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
        err => console.error(err),
        () => console.log('Admin has finished fetching all channels')
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
    console.log(`Viewing channel ${channel}`)

    if (localStorage.getItem("currentChannel")) {
      //this.socketService.leaveChannel()
    }

    localStorage.setItem('currentChannel', channel)
    // this.router.navigateByUrl('/channel')
  }


  createChannel() {
    if (!this.createChannelName) {alert('New channel name cannot be empty'); return}

    for (let channel of this.allChannels) {
      if (this.createChannelName === channel) {alert('This channel already exists'); return}
    }

    console.log(`Creating new channel ${this.createChannelName}`)
    this.usersService.createChannel(this.groupName, this.createChannelName).subscribe(
      data => {
        console.log('New list of channels received', data)
        this.allChannels = data['allChannels']
      },
      err => console.error(err),
      () => console.log(`Creating new channel ${this.createChannelName} completed`)
    )
  }


  removeChannel(channel:string) {
    if(channel === 'general') {alert(`Cannot remove default channel ${channel}`); return}
    if (this.groupName==='general' || this.groupName==='newbies') {alert('Cannot remove default channels in default groups'); return}
    console.log(`Removing channel ${channel}`)
    this.usersService.removeChannel(this.groupName, channel).subscribe(
      data => {
        console.log(`New list of channels received`, data)
        this.allChannels = data['allChannels']
      },
      err => console.error(err),
      () => console.log(`Removing channel ${channel} completed`)
    )
  }








  removeUser(userToRemove:string) {
    if (this.groupName==='newbies' || this.groupName==='general') {alert('Cannot remove users in this default channel'); return}
    if (userToRemove === this.username) {alert('Cannot remove yourself'); return}
    
    this.allUserData.forEach((user) => {
      if (user.username===userToRemove) {
        if (user.groupAdmin) {alert(`Cannot remove admin user ${userToRemove}`); return}
      }
    })

    console.log(`Removing user ${userToRemove}`)
    this.usersService.removeUserInGroup(userToRemove, this.groupName).subscribe(
      data => {
        console.log('Received new list of users', data['allUsers'])
        this.allUsers = data['allUsers']
      },
      err => console.error(err)
    )

  }


  updateAllUsersList() {
    this.allUserData.forEach((user:typeUser) => {
      user.groups.forEach((group:typeGroup) => {
        if (group.name===this.groupName) this.allUsers.push(user.username)
      })
    })
    console.log(this.allUserData)
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

}
