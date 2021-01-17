import { Injectable } from '@angular/core'
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { server } from '../server'


@Injectable({providedIn:'root'})

export class UsersService {

  constructor(private http:HttpClient) { }

  private server = server

  genHeadersJSON() {return {headers: new HttpHeaders({'Content-Type':'application/json'})}}

  getUsername() {return localStorage.getItem('username')}

  getToken() {return localStorage.getItem('token')}

  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  getUser() {
    const username = this.getUsername()
    const token = this.getToken()
    if (!username || !token) {console.log(`Falta ${username} ${token}`); return}
    return this.http.post(`${this.server}/api/users/get-one`, JSON.stringify({username, token}), this.genHeadersJSON())
  }

  updateUserImage(profileImage:string) {
    const username = this.getUsername()
    const token = this.getToken()
    if (!username || !token) {console.log(`Falta ${username} ${token}`); return}
    return this.http.post(`${this.server}/api/users/update-image`, JSON.stringify({username, token, profileImage}), this.genHeadersJSON())
  }

  login(usernameToLogin:string, password:string) {
    return this.http.post(`${this.server}/api/users/login`, JSON.stringify({usernameToLogin, password}), this.genHeadersJSON()
    )
  }

  verifyToken() {
    const username = this.getUsername()
    const token = this.getToken()
    if (!username || !token) {console.log(`Falta ${username} ${token}`); return}
    return this.http.post(`${this.server}/api/users/verify-token`, JSON.stringify({username, token}), this.genHeadersJSON())
  }

  createUser(usernameToCreate:string, password:string, email:string) {
    return this.http.post(`${this.server}/api/users/create`, JSON.stringify({usernameToCreate, password, email}), this.genHeadersJSON())
  }

  logout() {
    const username = this.getUsername()
    const token = this.getToken()
    if (!username || !token) {console.log(`Falta ${username} ${token}`); return}
    return this.http.post(`${this.server}/api/users/logout`, JSON.stringify({username, token}), this.genHeadersJSON())
  }

  updateEmail(email:string) { 
    const username = this.getUsername()
    const token = this.getToken()
    if (!username || !token) {console.log(`Falta ${username} ${token}`); return}
    return this.http.post(`${this.server}/api/users/update-email`, JSON.stringify({username, email, token}), this.genHeadersJSON())
  }

  getDataAllUsers() {
    const username = this.getUsername()
    const token = this.getToken()
    if (!username || !token) {console.log(`Falta ${username} ${token}`); return}
    return this.http.post(`${this.server}/api/users/get-all`, JSON.stringify({username, token}), this.genHeadersJSON())
  }

  removeUserFromSystem(usernameToRemove:string) {
    const username = this.getUsername()
    const token = this.getToken()
    if (!username || !token) {console.log(`Falta ${username} ${token}`); return}
    return this.http.post(`${this.server}/api/users/remove-user-from-system`, JSON.stringify({username, token, usernameToRemove}), this.genHeadersJSON())
  }

  makeUserSuperAdmin(usernameToAdmin:string) {
    const username = this.getUsername()
    const token = this.getToken()
    if (!username || !token) {console.log(`Falta ${username} ${token}`); return}
    return this.http.post(`${this.server}/api/users/make-user-super-admin`, JSON.stringify({username, token, usernameToAdmin}), this.genHeadersJSON())
  }

  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  getGroups() {
    const username = this.getUsername()
    const token = this.getToken()
    if (!username || !token) {console.log(`Falta ${username} ${token}`); return}
    return this.http.post(`${this.server}/api/groups`, JSON.stringify({username, token}), this.genHeadersJSON())
  }

  createGroup(groupName:string) {
    const username = this.getUsername()
    const token = this.getToken()
    if (!username || !token) {console.log(`Falta ${username} ${token}`); return}
    return this.http.post(`${this.server}/api/groups/create`, JSON.stringify({username, token, groupName}), this.genHeadersJSON())
  }
  
  removeGroup(groupName:string) {
    const username = this.getUsername()
    const token = this.getToken()
    if (!username || !token) {console.log(`Falta ${username} ${token}`); return}
    return this.http.post(`${this.server}/api/groups/remove-group`, JSON.stringify({username, token, groupName}), this.genHeadersJSON())
  }

  getChannelsForAdmins(groupName:string) {
    const username = this.getUsername()
    const token = this.getToken()
    if (!username || !token) {console.log(`Falta ${username} ${token}`); return}
    return this.http.post(`${this.server}/api/groups/channels`, JSON.stringify({username, token, groupName}), this.genHeadersJSON())
  }

  getGroupUsers(groupName:string) {
    const username = this.getUsername()
    const token = this.getToken()
    if (!username || !token) {console.log(`Falta ${username} ${token}`); return}
    return this.http.post(`${this.server}/api/groups/users`, JSON.stringify({username, token, groupName}), this.genHeadersJSON())
  }

  removeUserInGroup(usernameToRemove:string, groupName:string) {
    const username = this.getUsername()
    const token = this.getToken()
    if (!username || !token) {console.log(`Falta ${username} ${token}`); return}
    return this.http.post(`${this.server}/api/groups/remove-user`, JSON.stringify({username, token, usernameToRemove, groupName}), this.genHeadersJSON())
  }

  addUserToGroup(usernameToAdd:string, groupName:string) {
    const username = this.getUsername()
    const token = this.getToken()
    if (!username || !token) {console.log(`Falta ${username} ${token}`); return}
    return this.http.post(`${this.server}/api/groups/add-user`, JSON.stringify({username, token, usernameToAdd, groupName}), this.genHeadersJSON())
  }

  makeUserGroupAdmin(usernameToAdmin:string) {
    const username = this.getUsername()
    const token = this.getToken()
    if (!username || !token) {console.log(`Falta ${username} ${token}`); return}
    return this.http.post(`${this.server}/api/groups/make-user-group-admin`, JSON.stringify({username, token, usernameToAdmin}), this.genHeadersJSON())
  }

  
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  
  getChannelMessages(groupName:string, channelName:string) {
    const username = this.getUsername()
    const token = this.getToken()
    if (!username || !token) {console.log(`Falta ${username} ${token}`); return}
    return this.http.post(`${this.server}/api/channels/messages`, JSON.stringify({username, token, groupName, channelName}), this.genHeadersJSON())
  }
  
  createChannel(groupName:string, channelName:string) {
    const username = this.getUsername()
    const token = this.getToken()
    if (!username || !token) {console.log(`Falta ${username} ${token}`); return}
    return this.http.post(`${this.server}/api/channels/create`, JSON.stringify({username, token, groupName, channelName}), this.genHeadersJSON())
  }
  
  removeChannel(groupName:string, channelName:string) {
    const username = this.getUsername()
    const token = this.getToken()
    if (!username || !token) {console.log(`Falta ${username} ${token}`); return}
    return this.http.post(`${this.server}/api/channels/remove-channel`, JSON.stringify({username, token, groupName, channelName}), this.genHeadersJSON())
  }
  
  addUserToChannel(usernameToAdd:string, groupName:string, channelName:string) {
    const username = this.getUsername()
    const token = this.getToken()
    if (!username || !token) {console.log(`Falta ${username} ${token}`); return}
    return this.http.post(`${this.server}/api/channels/add-user`, JSON.stringify({username, token, usernameToAdd, groupName, channelName}), this.genHeadersJSON())
  }
  
  removeUserFromChannel(usernameToRemove:string, groupName:string, channelName:string) {
    const username = this.getUsername()
    const token = this.getToken()
    if (!username || !token) {console.log(`Falta ${username} ${token}`); return}
    return this.http.post(`${this.server}/api/channels/remove-user`, JSON.stringify({username, token, usernameToRemove, groupName, channelName}), this.genHeadersJSON())
  }

}
