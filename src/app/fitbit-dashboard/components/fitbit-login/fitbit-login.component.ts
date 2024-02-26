import { Component, OnInit } from '@angular/core';
import {  Router ,ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-fitbit-login',
  templateUrl: './fitbit-login.component.html',
  styleUrls: ['./fitbit-login.component.scss']
})
export class FitbitLoginComponent implements OnInit {

  constructor(private router: Router, private route: ActivatedRoute, private http: HttpClient, private authService: AuthService) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      const code = params['code'];
      const state = params['state'];
      // Validate the state parameter here if you used one
      if (code) {
        // Send code to your backend
        this.sendCodeToBackend(code , state);
      }
    });
  }
  

  sendCodeToBackend(code: string, state: string) {
    const url = `http://localhost:8080/fitbit?code=${code}&state=${state}`;
    const jwtToken = localStorage.getItem('jwtToken');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${jwtToken}`
    });
  
    this.http.get<any>(url, { headers }).subscribe(
      response => {
        this.authService.setFitbitTokenData(response);
        console.log('Fitbit token data saved.');
        this.router.navigate(['/mft/user-home']);
      },
      error => {
        console.error('Error:', error);
        // Handle error here
      }
    );
  }
}
