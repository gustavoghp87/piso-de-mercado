import { Injectable } from '@angular/core'
import { io } from 'socket.io-client/build/index'
import { Observable } from 'rxjs'
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { server } from '../server'


@Injectable({providedIn: 'root'})
export class SocketPanelService {

  private server = server
  MELI:string

  constructor(private http:HttpClient) {
    //this.MELI = response.lp
  }

  genHeadersJSON() {return {headers: new HttpHeaders({'Content-Type':'application/json'})}}

  getUsername() {return localStorage.getItem('username')}

  getToken() {return localStorage.getItem('token')}
  
  retrieveData() {
    const username = this.getUsername()
    const token = this.getToken()
    if (!username || !token) {console.log(`Falta ${username} ${token}`); return}
    return this.http.post(`${this.server}/api/panel`, JSON.stringify({username, token}), this.genHeadersJSON())
    // return this.http.get(this.server + '/tv', {params: {ticket: 'MELI'}})
  }

}
