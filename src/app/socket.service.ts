import { Injectable } from '@angular/core'
import { io } from 'socket.io-client/build/index'
import { Observable } from 'rxjs'
import { server } from '../app/server'


@Injectable({providedIn:'root'})

export class SocketService {

  private url = server
  private socket

  constructor() { }
  // join a channel
  public joinChannel() {
    this.socket = io(this.url)
    let content = {
      username: "SYSTEM",
      groupName: localStorage.getItem("currentGroup"),
      channelName: localStorage.getItem("currentChannel"),
      message: localStorage.getItem("username") + " has joined the chat"
    }
    this.socket.emit('join', content)
  }

  // leave a channel
  public leaveChannel() {
    let content = {
      username: "SYSTEM",
      groupName: localStorage.getItem("currentGroup"),
      channelName: localStorage.getItem("currentChannel"),
      message: localStorage.getItem("username") + " has left the chat"
    }
    this.socket.emit('leave', content)
  }

  // send a new message (text or image)
  public sendMessage(username:string, groupName:string, channelName:string, message:string, profileImage:string, isFile:boolean) {
    console.log("Sending: " + message)
    let content = {
      username,
      groupName,
      channelName,
      message,
      profileImage,
      isFile
    }
    this.socket.emit('new-message', content)
  }

  public getMessages = () => {
    return Observable.create((observer) => {
      this.socket.on('message', (content) => {
        console.log('Received message:')
        console.log(content)
        observer.next(content)
      })
    })
  }
}
