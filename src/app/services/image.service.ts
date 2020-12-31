import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { server } from '../server'

@Injectable({
  providedIn: 'root'
})

// This service handles the upload of images
export class ImageService {

  constructor(private http:HttpClient) { }

  upload(fd) {
    console.log('uploading service', fd)
    return this.http.post<any>(`${server}/api/image/upload`, fd)
  }
}
