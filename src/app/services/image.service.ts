import { Injectable } from '@angular/core'
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { server } from '../server'
import { UsersService } from './users.service'


@Injectable({providedIn: 'root'})

export class ImageService {

  constructor(private http:HttpClient, private usersService:UsersService) { }

  genHeadersJSON() {
    return {headers: new HttpHeaders({'Content-Type':'image/png'})}
  }

  upload(fd:any) {
    console.log('uploading service\n', fd)
    this.usersService.verifyToken().subscribe(data => {
      if (!data['success']){
        console.log("Falló verificación de usuario para cargar imagen en servidor")  
        return
      }
    })
    return this.http.post<any>(`${server}/api/users/upload-image`, fd)
  }
  
}
