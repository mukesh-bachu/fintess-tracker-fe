import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CustomValidators } from './CustomValidators';
import { AuthService } from '../../services/auth.service';


@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {

  signupForm: FormGroup;
  responseMessage: string = '';

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
    this.signupForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      phone: ['', [ Validators.pattern('^[0-9]+$')]],
      fitbitUrl: ['', [Validators.pattern('(http|https):\/\/.*')]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    },{ validator: CustomValidators.passwordMatchValidator });

    this.responseMessage = '';

  }
  
  onSubmit() {
    this.authService.signup(this.signupForm.value).subscribe({next: (success) => {
      if (success) {
        console.log('Signup successful');
        this.signupForm.reset();
        this.responseMessage = 'Signup successful. Please ';
        //this.router.navigate(['mft/login']);
      } else {
        this.responseMessage = 'Enter valid details, please try again';
      }
    },
    error: (error) => {
      console.error('Signup failed', error);
      this.responseMessage = 'Signup failed.  Please try again.'; 
    }
  });
  }

  ngOnInit(): void {
  }

}
