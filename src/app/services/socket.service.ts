import { Injectable } from '@angular/core'
import { io } from 'socket.io-client/build/index'
import { Observable } from 'rxjs'
import { server } from '../server'
import { typeMessage } from '../models/types'


@Injectable({providedIn:'root'})

export class SocketService {

  private url = server
  private socket

  constructor() { }

  public joinChannel() {
    this.socket = io(this.url)
    const content = {
      username: "SYSTEM",
      groupName: localStorage.getItem("currentGroup"),
      channelName: localStorage.getItem("currentChannel"),
      message: localStorage.getItem("username") + " has joined the chat"
    }
    this.socket.emit('join', content)
  }

  public leaveChannel() {
    this.socket = io(this.url)
    const content = {
      username: "SYSTEM",
      groupName: localStorage.getItem("currentGroup"),
      channelName: localStorage.getItem("currentChannel"),
      message: localStorage.getItem("username") + " has left the chat"
    }
    this.socket.emit('leave', content)
  }

  public sendMessage(
    username:string, groupName:string, channelName:string,
    message:string, profileImage:string, isFile:boolean
  ) {
    this.socket = io(this.url)
    console.log("Sending: " + message)
    const content:typeMessage = {
      username,
      groupName,
      channelName,
      message,
      profileImage,
      isFile,
      timestamp: Date.now()
    }
    this.socket.emit('new-message', content)
  }

  public getMessages = () => {
    return new Observable((observer) => {
      this.socket.on('message', (content:typeMessage) => {
        console.log('Received message:', content)
        observer.next(content)
      })
    })
  }

}
