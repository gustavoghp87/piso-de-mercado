import { Component, OnInit, Input } from '@angular/core'
import { typeProduct } from '../../models/types'
import { mobile } from '../../app.component'
import { select, Store } from '@ngrx/store'
import { Observable } from 'rxjs'
import { typeUser, typeGroup } from '../../models/types'
import { setUser } from '../../reducers/actions'


@Component({
    selector: 'app-ticket-card',
    templateUrl: './ticket-card.component.html',
    styleUrls: ['./ticket-card.component.css']
})

export class TicketCardComponent implements OnInit {

    @Input() pro_name: string;
    @Input() bid: string;
    @Input() ask: string;
    @Input() prev_close_price: string;
    @Input() open_price: string;
    @Input() low_price: string;
    @Input() high_price: string;
    @Input() last_update: string;

    mobile:boolean = mobile
    ticketsObj: typeProduct[]
    ticketsLeadersObj:typeProduct[]
    showDetails:boolean = false
    user$:Observable<typeUser>
    groupName:string = ''
    username:string = ''
    email:string
    token:string
    groups:typeGroup[]
    profileImage:string
    showGroup:string
    groupAdmin = false
    superAdmin = false
    isLogged = false

    constructor(private store:Store<{user:typeUser}>) {}

    ngOnInit() {
        this.user$ = this.store.pipe(select('user'))
        this.user$.subscribe((user:typeUser) => {
            if (user) {
                this.isLogged = true
                this.groupName = user.showGroup
                this.groupAdmin = user.groupAdmin
                this.superAdmin = user.superAdmin
                this.username = user.username
                this.email = user.email
                this.token = user.token
                this.groups = user.groups
                this.profileImage = user.profileImage
                this.showGroup = user.showGroup
            }
        })
    }

    viewDetails() {
        this.showDetails = !this.showDetails
    }

    openChannel(ticketName:string) {
        if (this.isLogged)
        {
            // alert(`Abriendo el canal de este papel ${ticketName} (próximamente)`)
            const userData = {
                username: this.username,
                email: this.email,
                superAdmin: this.superAdmin,
                groupAdmin: this.groupAdmin,
                profileImage: this.profileImage,
                groups: this.groups,
                token: this.token,
                showGroup: ticketName,
                currentChannel: ticketName
            }
            const userData2 = {...this.user$, showGroup:ticketName}
            this.store.dispatch(setUser({userData:userData}))
        
            window.scrollTo(0, 0)
        }
        else alert(`Hay que loguearse primero`)
    }

}
