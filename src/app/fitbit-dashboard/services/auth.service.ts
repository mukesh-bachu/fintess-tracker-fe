import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';
import {UserData} from "../models/user-data";
import {Router} from '@angular/router';
import {UserLoginData} from "../models/user-login-data";
import {Subject} from "rxjs";
import { JwtHelperService } from '@auth0/angular-jwt';
import { Friend } from '../interfaces/friend';



interface TokenResponse {
  token: string;
  expires: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  
  private apiUrl =  environment.backendUrl ;// Access the backend URL 'http://localhost:8080';

  private config: any;

  backendUrl = environment.backendUrl;
  private tokenTimer: any;
  private isAuthenticated = false;
  private token: string | undefined;

  public authStatusListener = new Subject<boolean>();
  private jwtHelper = new JwtHelperService();
  private firstname: string|null;
  private lastname: string|null;
  public email: string|null;
  incorrectPassword: boolean = false;

  httpOptions = {
      // withCredentials: true,
      headers: new HttpHeaders({
          'Content-Type': 'application/json',
          'Accept': 'application/json'
      }),
  }

  constructor( private http: HttpClient, private router: Router) { }


  getToken(){
    return this.token;
}

getIsAuth(){
    return this.isAuthenticated;
}

setFirstName(firstname:string){
  localStorage.setItem('firstname', firstname);
}

setEmail(email:string){
  localStorage.setItem('email', email);
}


setLastName(lastname: string){
  localStorage.setItem('lastname', lastname);
}

getFirstName(){
  return localStorage.getItem('firstname');
}

getEmail(){
  return localStorage.getItem('email');
}

getLastName(){
  return localStorage.getItem('lastname');
}

createUser(firstname: string, lastname: string, email: string, mobile: string, password: string){

  const newUserData: UserData = {
      firstname: firstname,
      lastname: lastname,
      email: email,
      mobile: mobile,
      password: password,
  }

  this.http.post<{ message: string }>(`${this.backendUrl}/api/v1/auth/register`, newUserData, this.httpOptions)
      .subscribe({
          next: (response) =>{
              return response;
          },
          error: (error) => {
              console.error("Error while creating new user", error)
          },
          complete: () => {

          }
      });
}

getJWTUserToken(userDataToLogin:{loginId: string, password: string}){

  this.http.post<any>(environment.miracleLogIn, userDataToLogin, this.httpOptions)
        .subscribe({
            next: (response) =>{

                console.log("Used logged in successfully", response)
                const token = response.token;
                this.token = token;
                const success = response.success;
                if(success){
                    const expiredInDuration = 60*60*1000;
                   // this.setAuthTimer(expiredInDuration);

                    this.setMJwtToken(token);

                    const res = this.getDecodedTokenValues();

                    this.isAuthenticated = true;
                    this.authStatusListener.next(true);
                    this.email = res.email;
                    this.firstname = res.firstName;
                    this.lastname = res.lastName;
                    this.setFirstName(this.firstname);
                    this.setLastName(this.lastname);


                    console.log('firstname ' +this.firstname);
                    console.log('lastname ' +this.lastname);
                    console.log('email '+ this.email);

                    this.login(this.email, this.firstname, this.lastname );

                    const now = new Date();
                    const expirationDate = new Date(now.getTime() + expiredInDuration);

                    this.saveAuthData(token, expirationDate);

                    // console.log("Just about to navigate");
                    // this.router.navigate(['/mft/user-home']);
                }else{
                    console.log("Something is wrong with the credentials");
                    console.error("Error while logging in: ", response.message);
                    this.incorrectPassword = true;
                }
            },
                error: (error) => {
                    console.error("Error while logging in: ", error.message)
                    if(error.status === 401){
                        this.incorrectPassword = true;
                    }else{
                        console.error("Other error: ", error.message)
                    }
            },
                complete: () => {

                }
        })

}

getJWTUserToken1(userDataToLogin:{loginId: string, password: string}){

  this.http.post<any>(environment.mftlogin, userDataToLogin, this.httpOptions)
        .subscribe({
            next: (response) =>{

                console.log("Used logged in successfully", response)
                const token = response.token;
                this.token = token;
                
                if(this.token){
                    const expiredInDuration = 60*60*1000;
                   // this.setAuthTimer(expiredInDuration);

                    this.setJwtToken(token);

                    const res = this.getDecodedTokenValues();

                    this.isAuthenticated = true;
                    this.authStatusListener.next(true);
                    this.email= res.sub;
                    this.firstname = response.firstname;
                    this.lastname = response.lastname;
                    this.setFirstName(this.firstname);
                    this.setLastName(this.lastname);
                    this.setEmail(this.email);


                    console.log('firstname ' +this.firstname);
                    console.log('lastname ' +this.lastname);
                    console.log('email '+ this.email);

                    //this.login(this.email, this.firstname, this.lastname );

                    const now = new Date();
                    const expirationDate = new Date(now.getTime() + expiredInDuration);

                    this.saveAuthData(token, expirationDate);
             
                    this.saveAuthData(token, expirationDate);

                    console.log("Just about to navigate");
                    this.router.navigate(['/mft/user-home']);
                }else{
                    console.log("Something is wrong with the credentials");
                    console.error("Error while logging in: ", response.message);
                    this.incorrectPassword = true;
                }
            },
                error: (error) => {
                    console.error("Error while logging in: ", error.message)
                    if(error.status === 401){
                        this.incorrectPassword = true;
                    }else{
                        console.error("Other error: ", error.message)
                    }
            },
                complete: () => {

                }
        })

}

login(email: string, firstname:string, lastname: string){

    const userDataToLogin: UserLoginData = {
        email: email,
        firstName: firstname,
        lastName: lastname
    }
    console.log(userDataToLogin);

     this.http.post<{ token: string, expiresIn: number, firstname:string, lastname: string}>(`${this.backendUrl}/api/v1/auth/authenticate`, userDataToLogin, this.httpOptions)
        .subscribe({
            next: (response) =>{

                console.log("Used logged in successfully", response)
                const token = response.token;

                if(token){
                    const expiredInDuration = 60*60*1000;
                   // this.setAuthTimer(expiredInDuration);

                    this.setJwtToken(token);

                    const now = new Date();
                    const expirationDate = new Date(now.getTime() + expiredInDuration);

                    this.saveAuthData(token, expirationDate);

                    console.log("Just about to navigate");
                    this.router.navigate(['/mft/user-home']);
                }else{
                    console.log("Something is wrong with the token")
                }
            },
                error: (error) => {
                    console.error("Error while logging in: ", error.message)
                    if(error.status === 401){
                        this.incorrectPassword = true;
                    }else{
                        console.error("Other error: ", error.message)
                    }
            },
                complete: () => {

                }
        })

}

setAuthTimer(duration: number){
  this.tokenTimer = setTimeout(() => {
      this.logout();
  }, duration * 1000);
}

private saveAuthData(token: string, expirationDate: Date){
  localStorage.setItem('token', token);
  localStorage.setItem('expiration', expirationDate.toISOString());
}


  signup(userData: any): Observable<Object> {
    return this.http.post(`${this.apiUrl}/api/v1/auth/register`, userData);
  }
  setMJwtToken(token: string): void {
    localStorage.setItem('MjwtToken', token);
    
  }

  getMJwtToken(): string | null {
    return localStorage.getItem('MjwtToken');
  }

  setJwtToken(token: string): void {
    localStorage.setItem('jwtToken', token);
    localStorage.setItem('isLoggedIn', 'true');
  }

  getJwtToken(): string | null {
    return localStorage.getItem('jwtToken');
  }
  
  isLoggedIn(): boolean {
    return localStorage.getItem('isLoggedIn') === 'true';
  }
  isFitbitLoggedIn(): boolean {
    return localStorage.getItem('fitbitlogin') === 'true';
  }

  isGoogleFitLoggedIn(): boolean {
    return localStorage.getItem('googlefitlogin') === 'true';
  }

  // In AuthService or a suitable service

setFitbitTokenData(data: any): void {
  localStorage.setItem('fitbitAccessToken', data.access_token);
  localStorage.setItem('fitbitRefreshToken', data.refresh_token);
  localStorage.setItem('fitbitlogin', "true");
  localStorage.setItem('fitbitTokenExpiry', (Date.now() + data.expires_in * 1000).toString());
  // Storing the expiry time in milliseconds
}

setGoogleFitTokenData(data: any): void {
  localStorage.setItem('googleFitAccessToken', data.access_token);
  localStorage.setItem('gogleFitRefreshToken', data.refresh_token);
  localStorage.setItem('googlefitlogin', "true");
  localStorage.setItem('googleFitTokenExpiry', (Date.now() + data.expires_in * 1000).toString());
  // Storing the expiry time in milliseconds
}

getGoogleFitAccessToken(): string | null {
  return localStorage.getItem('googleFitAccessToken');
}

setDropDownValue(option: any): void{
  console.log(option.value);
  localStorage.setItem('selectedLoginMethod', option.value);
}

getDropDownValue(): string | null {
  return localStorage.getItem('selectedLoginMethod');
}


getFitbitAccessToken(): string | null {
  return localStorage.getItem('fitbitAccessToken');
}

getFitbitRefreshToken(): string | null {
  return localStorage.getItem('fitbitRefreshToken');
}


isFitbitTokenExpired(): boolean {
  const expiryTime = parseInt(localStorage.getItem('fitbitTokenExpiry') || '0');
  return Date.now() > expiryTime;
}

clearFitbitTokenData(): void {
  localStorage.removeItem('fitbitAccessToken');
  localStorage.removeItem('fitbitRefreshToken');
  localStorage.removeItem('fitbitTokenExpiry');
  localStorage.removeItem('fitbitlogin');
}

clearGoogleFitTokenData(): void {
  localStorage.removeItem('googleFitAccessToken');
  localStorage.removeItem('gogleFitRefreshToken');
  localStorage.removeItem('googleFitTokenExpiry');
  localStorage.removeItem('googlefitlogin');
}

logout(){
  this.authStatusListener.next(false);
  this.token = '';
  this.isAuthenticated = false;
  clearTimeout(this.tokenTimer);
  localStorage.removeItem('selectedLoginMethod'); 
  this.clearAuthData();
  localStorage.removeItem('jwtToken'); // Removing JWT
  localStorage.removeItem('MjwtToken'); // Removing JWT
  localStorage.setItem('isLoggedIn', 'false');
  this.clearFitbitTokenData();
  this.clearGoogleFitTokenData();
  this.router.navigate(['/']);
}

private clearAuthData(){
  localStorage.removeItem("token");
  localStorage.removeItem("expiration");
}

getDecodedTokenValues() {
  if(this.token){
      return this.jwtHelper.decodeToken(this.token);
  }
  return null;
}


getFriends() {
  return this.http.get<any>('/assets/demo/data/friends.json')
  .toPromise()
  .then(res => res.data as Friend[])
  .then(data => data);
}

getGroups() {
  return this.http.get<any>('/assets/demo/data/groups.json')
  .toPromise()
  .then(res => res.data as Friend[])
  .then(data => data);
}


searchUsers(query: string ): Observable<any[]> {
  const authToken = this.getJwtToken();
  const headers = new HttpHeaders({
    'Authorization': `Bearer ${authToken}`
  });
  const url = environment.mftSearch;
  return this.http.get<any[]>(url+`${query}`, { headers });
}


followUser(followerEmail: string, followedEmail: string): Observable<any> {
  const authToken = this.getJwtToken();
  const headers = new HttpHeaders({
    'Authorization': `Bearer ${authToken}`
  });

  console.log(headers);
  const url = `${environment.backendUrl}/api/v1/users/${followerEmail}/follow/${followedEmail}` ;

  console.log(url);
  
  return this.http.post<any>(url, {}, { headers: headers });
}


unfollowUser(followerEmail: string, followedEmail: string): Observable<any> {
  const authToken = this.getJwtToken()
  const headers = new HttpHeaders({
    'Authorization': `Bearer ${authToken}`
  });

  console.log(headers);
  const url = `${environment.backendUrl}/api/v1/users/${followerEmail}/unfollow/${followedEmail}` ;

  console.log(url);
  
  return this.http.post<any>(url, {}, { headers: headers });
}

getFollowing():Observable<any[]> {
  const authToken = this.getJwtToken();
  const headers = new HttpHeaders({
    'Authorization': `Bearer ${authToken}`
  });
  const email = this.getEmail();
  const url = `${environment.mftFollowing}${email}/following`;
  return this.http.get<any[]>(url, { headers });
}

getFollowers():Observable<any[]> {
  const authToken = this.getJwtToken();
  const headers = new HttpHeaders({
    'Authorization': `Bearer ${authToken}`
  });
  const email = this.getEmail();
  const url = `${environment.mftFollowing}${email}/followers`;
  return this.http.get<any[]>(url, { headers });

}

getTop7():Observable<any[]> {
  const authToken = this.getJwtToken();
  const headers = new HttpHeaders({
    'Authorization': `Bearer ${authToken}`
  });
  const url = `${environment.mftFollowing}top7`;
  return this.http.get<any[]>(url, { headers });

}


}
