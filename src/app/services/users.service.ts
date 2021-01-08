import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
// import {Observable, of} from 'rxjs';
// import { FormGroupName } from '@angular/forms';
import { server } from '../server'


@Injectable({
  providedIn: 'root'
})

// This service handles the requests made by the client for the application to function
export class UsersService {

  constructor(private http:HttpClient) { }

  private server = server

  // generate the headers for content-type as JSON in a POST request
  genHeadersJSON() {
    return { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) }
  }

  getUser(username:string) {
    return this.http.get(this.server + '/api/user', {params: {username}})
  }

  updateEmail(username:string, email:string) {
    const body = {username, email}
    return this.http.post(`api/email`, JSON.stringify(body), this.genHeadersJSON())
  }

  getGroups() {
    return this.http.get(this.server + '/api/groups')
  }

  createGroup(username:string, groupName:string) {
    const body = {username, groupName}
    return this.http.post(this.server + '/api/createGroup', JSON.stringify(body), this.genHeadersJSON());
  }

  removeGroup(groupName:string) {
    return this.http.delete(this.server + '/api/removeGroup/' + groupName);
  }

  createChannel(username:string, groupName:string, channelName:string) {
    let body = {username, groupName, channelName}
    return this.http.post(this.server + '/api/channel/create', JSON.stringify(body), this.genHeadersJSON())
  }

  // remove a channel
  removeChannel(username:string, groupName:string, channelName:string) {
    return this.http.delete(this.server + '/api/channel/remove/' + username + '.' + groupName + '.' + channelName);
  }

  // get all the channels
  getChannels(groupName:string) {
    return this.http.get(this.server + '/api/' + groupName + '/channels');
  }

  // get the users in a group
  getGroupUsers(groupName:string) {
    return this.http.get(this.server + '/api/' + groupName + '/users');
  }

  // get the data on all users
  getDataAllUsers() {
    return this.http.get(this.server + '/api/users/all');
  }

  // remove a user in a group
  removeUserInGroup(username:string, groupName:string) {
    return this.http.delete(this.server + '/api/remove/' + groupName + '.' + username);
  }

  // add a user to a group
  addUserToGroup(username:string, groupName:string) {
    let body = {
      "username": username,
      "groupName": groupName
    }
    return this.http.post(this.server + '/api/groups/add', JSON.stringify(body), this.genHeadersJSON());
  }

  // add a user to a channel
  addUserToChannel(username:string, groupName:string, channelName:string) {
    let body = {
      "username": username,
      "groupName": groupName,
      "channelName": channelName
    };
    return this.http.post(this.server + '/api/group/channel/add', JSON.stringify(body), this.genHeadersJSON());
  } 

  // remove a user from a channel
  removeUserFromChannel(username:string, groupName:string, channelName:string) {
    return this.http.delete(this.server + '/api/removeUserFromChannel/' + groupName + '.' + channelName + '.' + username);
  }

  // remove a user from the system
  removeUserFromSystem(username:string) {
    return this.http.delete(this.server + '/api/removeUserFromSystem/' + username);
  }

  // make user a group admin
  makeUserGroupAdmin(username:string) {
    let body = {
      "username": username
    }
    return this.http.post(this.server + '/api/makeUserGroupAdmin', JSON.stringify(body), this.genHeadersJSON());
  }

  // make user a super admin
  makeUserSuperAdmin(username:string) {
    let body = {
      "username": username
    }
    return this.http.post(this.server + '/api/makeUserSuperAdmin', JSON.stringify(body), this.genHeadersJSON());
  }

  // get the messages of a channel
  getChannelMessages(groupName:string, channelName:string) {
    return this.http.get(this.server + '/api/channel/messages', {
      params: {
      "groupName": groupName,
      "channelName": channelName
      }
    });
  }

  // update a user's data
  updateUser(username, userData) {
    console.log('updating user data', username);
    let body = userData;
    console.log("UserData a actualizar:", userData);
    
    return this.http.post(this.server + '/api/user/update', JSON.stringify(body), this.genHeadersJSON());
  }

  // validate a user's credentials
  validateUser(username:string, password:string) {
    let body = {
      "username": username,
      "password": password
    }
    return this.http.post(this.server + '/api/user/validate', JSON.stringify(body), this.genHeadersJSON());
  }

  // create a new user
  createUser(username:string, password:string, email:string) {
    let body = {
      "username": username,
      "password": password,
      "email": email
    }
    return this.http.post(this.server + '/api/user/create', JSON.stringify(body), this.genHeadersJSON());
  }

}
