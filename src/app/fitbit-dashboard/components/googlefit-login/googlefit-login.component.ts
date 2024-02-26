import { Component, OnInit } from '@angular/core';
import {  Router ,ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-googlefit-login',
  templateUrl: './googlefit-login.component.html',
  styleUrls: ['./googlefit-login.component.scss']
})
export class GooglefitLoginComponent implements OnInit {

  constructor(private router: Router, private route: ActivatedRoute, private http: HttpClient, private authService: AuthService) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      const code = params['code'];
      const state = params['state'];
      if (code) {
        this.sendCodeToBackend(code , state);
      }
    });
  }

  sendCodeToBackend(code: string, state: string) {
    const url = `http://localhost:8080/google-fit?code=${code}&state=${state}`;
    const jwtToken = localStorage.getItem('jwtToken');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${jwtToken}`
    });
  
    this.http.get<any>(url, { headers }).subscribe(
      response => {
        this.authService.setGoogleFitTokenData(response);
        console.log('Google fit token data saved.');
        this.router.navigate(['/mft/user-home']);
      },
      error => {
        console.error('Error:', error);
        // Handle error here
      }
    );
  }
}
