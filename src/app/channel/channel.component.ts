import { Component, OnInit } from '@angular/core'
// import { Router } from "@angular/router"
import { UsersService } from '../services/users.service'
import { SocketService } from '../services/socket.service'
import { ImageService } from '../services/image.service'
import { Observable } from 'rxjs'
import { typeUser, typeGroup, typeMessage, typeProduct } from '../models/types'
import { select, Store } from '@ngrx/store'
import { setUser } from '../reducers/actions'
import { server } from '../../app/server'
import { mobile } from '../app.component'
import { SocketPanelService } from '../services/socket-panel.service'


@Component({
    selector: 'app-channel',
    templateUrl: './channel.component.html',
    styleUrls: ['./channel.component.css']
})

export class ChannelComponent implements OnInit {
    currentChannel:string = ''
    username:string = ''
    groupName:string = ''
    userData:typeUser
    groupAdmin = false
    superAdmin = false
    email:string
    token:string
    groups:typeGroup[]
    profileImage:string
    currentGroup:string
    allUsersData:typeUser[]
    listOfUsers:string[] = []
    newUsername:string = ''
    messages:typeMessage[]
    message:string = ''
    isFile = false
    selectedFile = null
    mobile=mobile
    user$:Observable<typeUser>
    server:string = server
    ticketData:any

    constructor(
        //private router:Router,
        private usersService:UsersService,
        private socketService:SocketService,
        private imgService:ImageService,
        private store:Store<{user:typeUser}>,
        private socketPanelService:SocketPanelService
    ) {}

    ngOnInit() {
        this.user$ = this.store.pipe(select('user'))
        this.user$.subscribe((user:typeUser) => {
            if (user) {
                this.groupName = user.currentGroup
                this.groupAdmin = user.groupAdmin
                this.superAdmin = user.superAdmin
                this.username = user.username
                this.email = user.email
                this.token = user.token
                this.groups = user.groups
                this.profileImage = user.profileImage
                this.currentGroup = user.currentGroup
                this.currentChannel = user.currentChannel
                this.getDataAllUsers()
                if (this.currentChannel) {
                    this.usersService.getChannelMessages(this.groupName, this.currentChannel).subscribe(
                        data => {
                            this.messages = data['q']
                            this.socketService.joinChannel()
                            this.getMessages()
                        },
                        err => console.error(err)
                    )
                    this.socketPanelService.retrieveData().subscribe(
                        data => {
                            console.log("tickets:", data)
                            data['ticketsObj'].forEach((ticket:typeProduct) => {
                                if (ticket.pro_name==this.currentChannel) this.ticketData = ticket
                            })
                            data['ticketsLeadersObj'].forEach((ticket:typeProduct) => {
                                if (ticket.pro_name==this.currentChannel) this.ticketData = ticket
                            })
                            console.log("Logrado:", this.ticketData)
                        }
                    )
                }
            }
        })
    }

    getMessages() {
        this.socketService.getMessages().subscribe((message:typeMessage) => {
            this.messages.push(message)
            //console.log("MESSSSS", message)
        })
    }

    updateAllUsersList() {
        this.listOfUsers = []
        if (!this.allUsersData) return
        for (let user of this.allUsersData) {
            for (let group of user.groups) {
                if (group.name===this.groupName && group.channels.includes(this.currentChannel)) {
                    this.listOfUsers.push(user.username)
                    //console.log("LISTA DE USUARIOSNAME", this.listOfUsers)
                }
            }
        }
    }

    getDataAllUsers() {
        this.usersService.getDataAllUsers().subscribe(
            data => {
                if (data['success']) {
                this.allUsersData = data['users']
                this.updateAllUsersList()
                }
            },
            err => console.error(err)
        )
    }

    addUserToChannel() {
        if (this.currentChannel==='general') {alert('Cannot add users to default channel: general'); return}
        if (!this.newUsername) {alert('New user\'s username cannot be empty'); return}
        if (this.groupName==='newbies' || this.groupName==='general') {alert('Cannot add users in the default channels: newbies and general'); return}
        if (this.listOfUsers.includes(this.newUsername)) {alert(`User ${this.newUsername} is already in the channel`); return}
        //console.log(`Adding ${this.newUsername} to channel ${this.currentChannel}`)
        this.usersService.addUserToChannel(this.newUsername, this.groupName, this.currentChannel).subscribe(
            data => {
                if (data['success']) {
                    //console.log('Received data from adding user to channel')
                    this.allUsersData = data['users']
                    this.updateAllUsersList()
                }
            },
            err => console.error(err)
        )
    }

    removeUser(usernameToRemove:string) {
        if (this.groupName==='newbies' || this.groupName==='general') {alert('Cannot remove users in this default channel'); return}
        if (usernameToRemove===this.username) {alert('Cannot remove yourself'); return}
        for (let user of this.allUsersData) {
            if (user.username===usernameToRemove && (user.groupAdmin || user.superAdmin)) {alert(`Cannot remove admin: ${usernameToRemove}`); return}
        }
        if (this.currentChannel==='general') {alert('Cannot remove users from the default channel: general'); return}
        //console.log(`Removing user ${usernameToRemove}`)
        this.usersService.removeUserFromChannel(usernameToRemove, this.groupName, this.currentChannel).subscribe(
            data => {
                if (data['success']) {
                this.allUsersData = data['users']
                this.updateAllUsersList()
                }
            },
            err => console.error(err)
        )
    }

    sendMessage() {
        //console.log(`User typed: ${this.message}`)
        this.socketService.sendMessage(this.username, this.groupName, this.currentChannel, this.message, this.profileImage, this.isFile)
        this.message = ''
        this.isFile = false
    }

    uploadSelected(event) {
        //console.log('Selected image!', event)
        this.selectedFile = event.target.files[0]
    }

    uploadImageToServer() {
        if (!this.selectedFile) {alert('Elegir una imagen primero'); return}
        const fd = new FormData()
        fd.append('image', this.selectedFile, this.selectedFile.name)
        this.imgService.uploadChannels(fd).subscribe(
            data => {
                if (data['success']) {
                    //console.log(data)
                    this.message = data['data'].filename
                    this.isFile = true
                    this.sendMessage()
                } else alert("Algo falló. Imágenes .jpg, .png o .jpeg de hasta 5 MB.")
            },
            err => console.error(err)
        )
    }

    closeChat() {
        this.store.dispatch(setUser({userData: {
            username: this.username,
            email: this.email,
            superAdmin: this.superAdmin,
            groupAdmin: this.groupAdmin,
            profileImage: this.profileImage,
            groups: this.groups,
            token: this.token,
            currentGroup: '',
            currentChannel: ''
        }}))
    }

}
