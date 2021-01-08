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
  
  retrieveData(tickets:string[]) {
    //const response = this.http.get(this.server + '/tv', {params: {tiket: 'MELI'}})
    console.log(tickets)
    return this.http.post(`${this.server}/tv`, tickets)
    // return this.http.get(this.server + '/tv', {params: {ticket: 'MELI'}})
  }

}
