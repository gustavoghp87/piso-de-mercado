import { Injectable } from '@angular/core'
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { server } from '../server'

@Injectable({
  providedIn: 'root'
})

// This service handles the upload of images
export class ImageService {

  constructor(private http:HttpClient) { }

  genHeadersJSON() {
    return {headers: new HttpHeaders({'Content-Type': 'image/png'})}
  }

  upload(fd:any, username:string, token:string) {
    console.log('uploading service\n', fd)
    return this.http.post<any>(`${server}/api/user/upload-image`, fd)
  }
  
}
