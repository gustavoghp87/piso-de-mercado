import { Injectable } from '@angular/core'
// import { io } from 'socket.io-client/build/index'
// import { Observable } from 'rxjs'
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { server } from '../server'


@Injectable({providedIn: 'root'})
export class SocketPanelService {

  private server = server

  constructor(private http:HttpClient) {}

  genHeadersJSON() {return {headers: new HttpHeaders({'Content-Type':'application/json'})}}
  
  retrieveData() {
    const username = localStorage.getItem('username') || 'invitado'
    return this.http.post(`${this.server}/api/panel`, JSON.stringify({username}), this.genHeadersJSON())
    // return this.http.get(this.server + '/tv', {params: {ticket: 'MELI'}})
  }

}
