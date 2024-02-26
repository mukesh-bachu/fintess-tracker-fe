import { ChangeDetectorRef, Component,OnDestroy, OnInit } from '@angular/core';
import {AuthService} from "../../services/auth.service";
import {Subscription} from "rxjs";
import {AppComponent} from "../../../app.component";
import {AppMainComponent} from "../../../app.main.component";

@Component({
  selector: 'app-itopbar',
  templateUrl: './itopbar.component.html',
  styleUrls: ['./itopbar.component.scss']
})
export class ItopbarComponent implements OnInit {

    userIsAuthenticated: boolean = false;
    decodedToken: string = '';
    userFullObject: string = '';
    userFirstName: string = '';
    userLastname: string = '';
    private authListerSubs: Subscription;
    constructor(private authService: AuthService,
                public app: AppComponent,
                public appMain: AppMainComponent) { }

    ngOnInit(): void {
        // this.authListerSubs = this.authService.authStatusListener.subscribe(isAuthenticated => {

        //     this.userIsAuthenticated = isAuthenticated;
            
        //     if (isAuthenticated) {
                
        //         this.decodedToken = this.authService.getDecodedTokenValues();
        //         console.log(this.decodedToken);
        //         this.userFullObject = JSON.stringify(this.decodedToken);

        //         const userData = JSON.parse(this.userFullObject);
        //         this.userFirstName = this.authService.getFirstName();
        //         this.userLastname = this.authService.getLastName();
        //     }
        // });
        this.userIsAuthenticated = this.authService.isLoggedIn();
        if(this.userIsAuthenticated){
                    this.userFirstName = this.authService.getFirstName();
                    this.userLastname = this.authService.getLastName();
        }

    }

    ngOnDestroy(): void {
        this.authListerSubs.unsubscribe();
    }


    logout(){
        this.userIsAuthenticated=false;
        this.authService.logout();
    }

}