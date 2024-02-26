import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MetricServicesService {

  constructor(private http: HttpClient) { }

  getStepData(startDate: string, endDate: string, authCode: string): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${authCode}`
    });

    const url = environment.fitbitStepsUrl + `${startDate}/${endDate}.json`; 
    return this.http.get(url, { headers }).pipe(
      catchError(this.handleError)
    );
  }

  getProfileData(accessToken: string): Observable<any> {
    const url = environment.fibitProfile;
  
    return this.http.get(url, {
      headers: { 'Authorization': `Bearer ${accessToken}` }
    });
  }
  

  getCaloriesData(startDate: string, endDate: string, authCode: string): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${authCode}`
    });
    console.log(startDate);
    const url = environment.fitbitCaloriesUrl+`${startDate}/${endDate}.json`;
    console.log(url);
    return this.http.get(url, { headers }).pipe(
      catchError(this.handleError)
    );
  }

  getGStepData(startDate: string, endDate: string, authCode: string): Observable<any> {
    // Headers
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${authCode}`,
      'Content-Type': 'application/json'
    });

    // Google Fit API URL for aggregate data
    const url = environment.googleFitStepsUrl;
  
    // Convert startDate and endDate to milliseconds
    const startTimeMillis = new Date(startDate).getTime();
    let endTimeMillis = new Date(endDate);
    endTimeMillis = new Date(endTimeMillis.setHours(23, 59, 59, 999));

    console.log('startTimeMillis '+startTimeMillis);
    console.log('endTimeMillis '+endTimeMillis);
  
    // Request body according to Google Fit API requirements
    const body = {
      "aggregateBy": [{
        "dataTypeName": "com.google.step_count.delta",
        "dataSourceId": "derived:com.google.step_count.delta:com.google.android.gms:estimated_steps"
      }],
      "bucketByTime": { "durationMillis": 86400000 },
      "startTimeMillis": startTimeMillis,
      "endTimeMillis": endTimeMillis.getTime()
    };

    return this.http.post(url, body, { headers }).pipe(
      map(response => this.convertGoogleFitToFitbitFormat(response)), // Convert the data format here
      catchError(this.handleError) // Ensure handleError is properly defined to catch and handle errors
    );
  
    }  


    getGCaloriesData(startDate: string, endDate: string, authCode: string): Observable<any> {
      // Headers
      const headers = new HttpHeaders({
        'Authorization': `Bearer ${authCode}`,
        'Content-Type': 'application/json'
      });
  
      // Google Fit API URL for aggregate data
      const url = environment.googleFitStepsUrl;
    
      // Convert startDate and endDate to milliseconds
      const startTimeMillis = new Date(startDate).getTime();
      let endTimeMillis = new Date(endDate);
      endTimeMillis = new Date(endTimeMillis.setHours(23, 59, 59, 999));
  
      console.log('startTimeMillis '+startTimeMillis);
      console.log('endTimeMillis '+endTimeMillis);
    
      // Request body according to Google Fit API requirements
      const body = {
        "aggregateBy": [{
          "dataTypeName":  "com.google.calories.expended"
        }],
        "bucketByTime": { "durationMillis": 86400000 },
        "startTimeMillis": startTimeMillis,
        "endTimeMillis": endTimeMillis.getTime()
      };
  
      return this.http.post(url, body, { headers }).pipe(
        map(response => this.convertGoogleFitCalToFitbitFormat(response)), // Convert the data format here
        catchError(this.handleError) // Ensure handleError is properly defined to catch and handle errors
      );
  
      }  

// Include the convertGoogleFitToFitbitFormat function here
private convertGoogleFitToFitbitFormat(googleFitData: any): any {
  console.log(googleFitData);
  const convertedData = {
    "activities-tracker-steps": googleFitData.bucket.map((bucket: any) => {
      const dateTime = new Date(parseInt(bucket.startTimeMillis)).toISOString().split('T')[0];
      const value = bucket.dataset.length > 0 && bucket.dataset[0].point.length > 0 
        ? bucket.dataset[0].point[0].value[0].intVal.toString() 
        : "0";
      return { dateTime, value };
    })
  };

  console.log(convertedData);
  return convertedData;
}
  

private convertGoogleFitCalToFitbitFormat(googleFitData: any): any {
  console.log(googleFitData);
  const convertedData = {
    "activities-tracker-calories": googleFitData.bucket.map((bucket: any) => {
      const dateTime = new Date(parseInt(bucket.startTimeMillis)).toISOString().split('T')[0];
      const value = bucket.dataset.length > 0 && bucket.dataset[0].point.length > 0 
        ? bucket.dataset[0].point[0].value[0].fpVal.toString() 
        : "0";
      return { dateTime, value };
    })
  };

  console.log(convertedData);
  return convertedData;
}

  private handleError(error: HttpErrorResponse) {
    // Handle the HTTP error here
    // Return an observable with a user-facing error message
    return throwError(
      'Something bad happened; please try again later.'
    );
  }
}
