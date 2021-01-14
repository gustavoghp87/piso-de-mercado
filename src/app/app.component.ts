import { Component } from '@angular/core'
//import { FormsModule } from '@angular/forms'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Piso de Mercado'
}

export const mobile = screen.width < 990 ? true : false
