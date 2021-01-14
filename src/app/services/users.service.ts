import { Injectable } from '@angular/core'
import { HttpClient, HttpHeaders } from '@angular/common/http'
// import {Observable, of} from 'rxjs'
// import { FormGroupName } from '@angular/forms'
import { server } from '../server'
import { typeUser } from '../models/types'


@Injectable({providedIn: 'root'})

export class UsersService {

  constructor(private http:HttpClient) { }

  private server = server

  genHeadersJSON() {
    return {headers: new HttpHeaders({'Content-Type':'application/json'})}
  }

  getUser(username:string, token:string) {
    return this.http.post(`${this.server}/api/user`, JSON.stringify({username, token}), this.genHeadersJSON())
  }

  updateEmail(username:string, email:string, token:string) { 
    return this.http.post(`${this.server}/api/email`, JSON.stringify({username, email, token}), this.genHeadersJSON())
  }

  getGroups() {
    return this.http.get(`${this.server}/api/groups`)
  }

  createGroup(username:string, groupName:string) {
    return this.http.post(`${this.server}/api/createGroup`, JSON.stringify({username, groupName}), this.genHeadersJSON())
  }

  removeGroup(groupName:string) {
    return this.http.delete(`${this.server}/api/removeGroup/${groupName}`)
  }

  createChannel(username:string, groupName:string, channelName:string) {
    return this.http.post(`${this.server}/api/channel/create`, JSON.stringify({username, groupName, channelName}), this.genHeadersJSON())
  }

  // remove a channel
  removeChannel(username:string, groupName:string, channelName:string) {
    return this.http.delete(`${this.server}/api/channel/remove/${username}.${groupName}.${channelName}`)
  }

  getChannels(groupName:string) {
    return this.http.get(`${this.server}/api/${groupName}/channels`)
  }

  getGroupUsers(groupName:string) {
    return this.http.get(`${this.server}/api/${groupName}/users`)
  }

  getDataAllUsers() {
    return this.http.get(`${this.server}/api/users/all`)
  }

  removeUserInGroup(username:string, groupName:string) {
    return this.http.delete(`${this.server}/api/remove/${groupName}.${username}`)
  }

  addUserToGroup(username:string, groupName:string) {
    return this.http.post(`${this.server}/api/groups/add`, JSON.stringify({username, groupName}), this.genHeadersJSON())
  }

  addUserToChannel(username:string, groupName:string, channelName:string) {
    return this.http.post(`${this.server}/api/group/channel/add`, JSON.stringify({username, groupName, channelName}), this.genHeadersJSON())
  } 

  removeUserFromChannel(username:string, groupName:string, channelName:string) {
    return this.http.delete(`${this.server}/api/removeUserFromChannel/${groupName}.${channelName}.${username}`)
  }

  removeUserFromSystem(username:string) {
    return this.http.delete(`${this.server}/api/removeUserFromSystem/${username}`)
  }

  makeUserGroupAdmin(username:string) {
    return this.http.post(`${this.server}/api/makeUserGroupAdmin`, JSON.stringify(username), this.genHeadersJSON())
  }

  makeUserSuperAdmin(username:string) {
    return this.http.post(`${this.server}/api/makeUserSuperAdmin`, JSON.stringify(username), this.genHeadersJSON())
  }

  getChannelMessages(groupName:string, channelName:string) {
    return this.http.get(`${this.server}/api/channel/messages`, {params: {groupName, channelName}})
  }

  updateUser(username:string, token:string, profileImage:string) {
    return this.http.post(`${this.server}/api/user/update`, JSON.stringify({username, token, profileImage}), this.genHeadersJSON())
  }

  validateUserByPassword(username:string, password:string) {
    return this.http.post(`${this.server}/api/user/login`,
      JSON.stringify({username, password}),
      this.genHeadersJSON()
    )
  }

  validateUserByToken(username:string, token:string) {
    return this.http.post(`${this.server}/api/user/validateByToken`, JSON.stringify({username, token}), this.genHeadersJSON())
  }

  createUser(username:string, password:string, email:string) {
    return this.http.post(`${this.server}/api/user/create`,
      JSON.stringify({username, password, email}),
      this.genHeadersJSON()
    )
  }

  logout(username:string, token:string) {
    return this.http.post(`${this.server}/api/user/logout`,
      JSON.stringify({username, token}),
      this.genHeadersJSON()
    )
  }

}
