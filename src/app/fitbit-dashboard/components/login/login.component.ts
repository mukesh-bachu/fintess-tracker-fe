import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import {MessageService} from "primeng/api";
import { EncryptedServiceService } from '../../services/encrypted-service.service';
import { environment } from '../../environments/environment';
import {  Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  private loading: boolean = false;

  loginform: NgForm;
  loginRes:boolean;

  constructor(public authService: AuthService, private messageService: MessageService, public encrpservice: EncryptedServiceService, private router: Router  ) { }

    isSignInFormVisible = false;
    isSignUpFormVisible = false;
    isRegistrationSuccessful = false;

    showSignInForm() {
        this.isSignInFormVisible = !this.isSignInFormVisible;
        this.isSignUpFormVisible = !this.isSignUpFormVisible;
    }

    showSignupForm() {
        this.isSignUpFormVisible = !this.isSignUpFormVisible;
        this.isSignInFormVisible = !this.isSignInFormVisible;
    }

    ngOnInit(): void {
        if (this.authService.isLoggedIn()) {
            this.router.navigate(['mft/user-home']);
        
          } 

    }

    showSuccessToastAndRoute() {
        console.log("This is frm show toast: ", this.authService.incorrectPassword );

    }


    onLogin(form: NgForm){
        console.log(form.value);
        // if(form.invalid){
        //     return;
        // }
        

        let data1 = {
            loginId: this.encrpservice.set(
                environment.encryptKey,
                form.value.signin_email
            ),
            password: this.encrpservice.set(
                environment.encryptKey,
                form.value.signin_password
            ),
        };

        console.log(data1);

        this.authService.getJWTUserToken1(data1);

        


        console.log("in here");

        if(!this.authService.incorrectPassword){
            this.messageService.add({
                severity: 'success',
                summary: 'Logged in successfully.',
                detail: 'You have successfully logged In.',
                life: 3000
            });
        }

        if(this.authService.incorrectPassword){
            this.messageService.add({
                severity: 'error',
                summary: 'Incorrect password.',
                detail: 'Please re-enter your credentials.',
                life: 3000
            });
            //this.authService.incorrectPassword = false;
        }


    }

    onSignup(form: NgForm) {
        if(form.invalid){
            return;
        }
        this.authService.createUser(
            form.value.firstname,
            form.value.lastname,
            form.value.signup_email,
            form.value.mobile,
            form.value.signup_password
        );

        this.isRegistrationSuccessful = !this.isRegistrationSuccessful;
        this.isSignUpFormVisible = !this.isSignUpFormVisible;
    }

}
