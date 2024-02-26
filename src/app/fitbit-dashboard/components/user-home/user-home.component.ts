import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';
import {Router} from '@angular/router';
import { environment } from '../../environments/environment';
import { Friend } from '../../interfaces/friend';
import { MetricServicesService } from '../../services/metric-services.service';
import { Product } from 'src/app/demo/domain/product';
import { TreeNode } from 'primeng/api/treenode';
import { Following } from '../../interfaces/following';

@Component({
  selector: 'app-user-home',
  templateUrl:'./user-home.component.html',
  styleUrls: ['./user-home.component.scss']
})
export class UserHomeComponent implements OnInit {

  selectedLoginMethod: any = '';
  followings!: Following[];
  followers!: Following[];
  
  stepsToday: number = 0;
  caloriesToday: number = 0;
  height: string;
  weight: string;
  selectedUser: any; 
  filteredUsers: any[];
  customers!: Product[];
  selectedCustomers!: Product[];
  loading: boolean = false;
  users: any[] = []; 
  selectedUsers: any[] = [];
  data: TreeNode[];

  data1: TreeNode[] = [
    {
        label: 'Soni',
        expanded: true,
        data: { country: 'us', steps: '9000' },
        children: [
            {
                label: 'Jyostna',
                expanded: true,
                data: { country: 'us', steps: '8930' },
                children: [
                    {
                        label: 'Mukesh',
                        data: { country: 'cr', steps: '7890' }
                    },
                    {
                      label: 'Mansi',
                      data: { country: 'us', steps: '7600' }
                  }

                ]
            },
            {
                label: 'Bhanu',
                expanded: true,
                data: { country: 'in', steps: '8530' },
                children: [
                    {
                        label: 'Sai',
                        data: { country: 'ar', steps: '6800' }
                    },
                    {
                      label: 'Syed',
                      data: { country: 'us', steps: '6000' }
                  },
                ]
            }
        ]
    }
];

  ngOnInit(): void {

    const savedValue = this.authService.getDropDownValue();
    console.log('i am on init: '+savedValue);
    this.fetchTop7();
    
  if (savedValue) {
    const selectedOption = this.loginOptions.find(option => option.value === savedValue);
    console.log('i am on init' );
    if (selectedOption) {
      this.selectedLoginMethod = selectedOption; // Set the whole object if your dropdown is bound to such objects
      this.loadStepsData();
      this.loadCaloriesData();
      this.loadProfileData();
    }
    console.log('i am on init');
  }
  }



  constructor(private http: HttpClient, private authService: AuthService, private router: Router, private metricService: MetricServicesService) {}

  loadProfileData(): void {
    const selectedSource = this.authService.getDropDownValue();
    const todayDate = this.getCurrentDate();
    let accessToken;
    if (selectedSource) {
      switch (selectedSource) {
        case 'fitbit':
          accessToken = this.authService.getFitbitAccessToken();
          this.metricService.getProfileData(accessToken).subscribe({
            next: (profileData) => {
              const heightInCm = profileData.user.height;
              const weightInKg = profileData.user.weight;
      
              // Convert the height from cm to feet and inches
              this.height = this.convertCmToFeetInches(heightInCm);
  
              this.weight = `${weightInKg} Kgs`;
            },
            error: (error) => {
              console.error('Error fetching steps data', error);
            },
            complete: () => {

            }
          });
          break;
        case 'google':
          // accessToken = this.authService.getGoogleFitAccessToken();
          // this.metricService.getGStepData(todayDate, todayDate, accessToken).subscribe({
          //   next: (data) => {
          //     this.stepsToday = data['activities-tracker-steps'][0].value;
          //     console.log(this.stepsToday);
          //   },
          //   error: (error) => {
          //     console.error('Error fetching steps data', error);
          //   },
          //   complete: () => {

          //   }
          // });
          // break;
          accessToken = this.authService.getFitbitAccessToken();
          this.metricService.getProfileData(accessToken).subscribe({
            next: (profileData) => {
              const heightInCm = profileData.user.height;
              const weightInKg = profileData.user.weight;
      
              // Convert the height from cm to feet and inches
              this.height = this.convertCmToFeetInches(heightInCm);
  
              this.weight = `${weightInKg} Kgs`;
            },
            error: (error) => {
              console.error('Error fetching steps data', error);
            },
            complete: () => {

            }
          });
          break;
        case 'apple':
          // Call method to fetch Apple Health data
          break;
        // ... other cases
        default:
          console.log('Invalid data source');
      }
    }
  
  }

  convertCmToFeetInches(cm: number): string {
    const inches = cm / 2.54;
    const feet = Math.floor(inches / 12);
    const inchesLeft = Math.round(inches % 12);
    return `${feet}' ${inchesLeft}"`;
  }

  getCurrentDate(): string {
    const currentDate = new Date();
    const year = currentDate.getFullYear().toString();
    const month = (currentDate.getMonth() + 1).toString().padStart(2, '0'); // JavaScript months are 0-indexed
    const day = currentDate.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
  
  loadStepsData(): void {
    const selectedSource = this.authService.getDropDownValue();
    const todayDate = this.getCurrentDate();
    let accessToken;
    if (selectedSource) {
      switch (selectedSource) {
        case 'fitbit':
          accessToken = this.authService.getFitbitAccessToken();
          this.metricService.getStepData(todayDate, todayDate,accessToken).subscribe({
            next: (data) => {
              this.stepsToday = data['activities-tracker-steps'][0].value;
              console.log(this.stepsToday);
            },
            error: (error) => {
              console.error('Error fetching steps data', error);
            },
            complete: () => {

            }
          });
          break;
        case 'google':
          accessToken = this.authService.getGoogleFitAccessToken();
          this.metricService.getGStepData(todayDate, todayDate, accessToken).subscribe({
            next: (data) => {
              this.stepsToday = data['activities-tracker-steps'][0].value;
              console.log(this.stepsToday);
            },
            error: (error) => {
              console.error('Error fetching steps data', error);
            },
            complete: () => {

            }
          });
          break;
        case 'apple':
          // Call method to fetch Apple Health data
          break;
        // ... other cases
        default:
          console.log('Invalid data source');
      }
    }
    
    

  }

  loadCaloriesData(): void {
    const selectedSource = this.authService.getDropDownValue();
    const todayDate = this.getCurrentDate();
    let accessToken;
    if (selectedSource) {
      switch (selectedSource) {
        case 'fitbit':
          accessToken = this.authService.getFitbitAccessToken();
          this.metricService.getCaloriesData(todayDate, todayDate,accessToken).subscribe({
            next: (data) => {
              this.caloriesToday = data['activities-tracker-calories'][0].value;
            },
            error: (error) => {
              console.error('Error fetching steps data', error);
            },
            complete: () => {

            }
          });
          break;
        case 'google':
          accessToken = this.authService.getGoogleFitAccessToken();
          this.metricService.getGCaloriesData(todayDate, todayDate, accessToken).subscribe({
            next: (data) => {
              this.caloriesToday = Math.round( data['activities-tracker-calories'][0].value );
            },
            error: (error) => {
              console.error('Error fetching steps data', error);
            },
            complete: () => {

            }
          });
          break;
        case 'apple':
          // Call method to fetch Apple Health data
          break;
        // ... other cases
        default:
          console.log('Invalid data source');
      }
    }
    
  }

  onFitbitLogin() {
    if(this.authService.isFitbitLoggedIn()){
      // this.router.navigate(['/mft/user-home']);
      this.router.navigateByUrl('/mft/user-home', {skipLocationChange: true}).then(() => {
        location.reload();
      });
    
      return;
    } 
    const jwtToken = this.authService.getJwtToken();
    console.log(jwtToken);
  
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${jwtToken}`
    });
  
    const fitbitApiUrl = 'http://localhost:8080/initiate-fitbit-oauth';
    this.http.get(fitbitApiUrl, { headers, responseType: 'text' as 'json' }).subscribe(
      (response: any) => {
        console.log('Success response:', response);
        const correctedUrl = response.replace(/\s/g, ''); // Removes all spaces
        window.location.assign(correctedUrl);
      },
      error => {
        console.error('Error response:', error);
        // Handle the error here
        // Display an error message to the user
      }
    );
  }
  

  logout() {
    this.authService.logout();
  }

loginOptions = [
  { label: 'Fitbit Login', value: 'fitbit' },
  { label: 'Apple Health Login', value: 'apple' },
  { label: 'Google Fit Login', value: 'google' }
];

onLogin(option: { label: string, value: string }) {

  switch (option.value) {
      case 'fitbit':
          this.authService.setDropDownValue(option);
          this.onFitbitLogin();
          break;
      case 'apple':
          this.onAppleLogin();
          break;
      case 'google':
          this.authService.setDropDownValue(option);
          this.onGoogleLogin();
          break;
      default:
          console.log('Invalid option');
  }
}

onAppleLogin() { /* Apple login logic */ }

onGoogleLogin() { 
  if(this.authService.isGoogleFitLoggedIn()){
    // this.router.navigate(['/mft/user-home']);
    this.router.navigateByUrl('/mft/user-home', {skipLocationChange: true}).then(() => {
      location.reload();
    });
  
    return;
  } 
  const jwtToken = this.authService.getJwtToken();
  console.log(jwtToken);

  const headers = new HttpHeaders({
    'Authorization': `Bearer ${jwtToken}`
  });

  const gogleFitApiUrl = 'http://localhost:8080/initiate-google-fit-oauth';
  this.http.get(gogleFitApiUrl, { headers, responseType: 'text' as 'json' }).subscribe(
    (response: any) => {
      console.log('Success response:', response);
      const correctedUrl = response.replace(/\s/g, ''); 
      window.location.assign(correctedUrl);
    },
    error => {
      console.error('Error response:', error);
    }
  );
 }


 filterUser(event) {
  const query = event.query;
  this.authService.searchUsers(query).subscribe(data => {
    this.filteredUsers = data;
  });

  this.authService.searchUsers(query).subscribe( (response: any) => {

    this.filteredUsers = response.data.map(user => ({
      ...user,
      // Add any additional mapping if necessary, for example, combining first name and last name
      name: user.employeeName // This assumes you want to use 'employeeName' as the label in suggestions
      ,email: user.email1
    }));
  }, error => {
    console.error('Failed to fetch user data:', error);
  });
}


toggleFollow(user: any) {
  if(!user.isFollowing){
    this.authService.followUser(this.authService.getEmail(), user.email).subscribe({
      next: (response) => {
        // Handle successful follow here, e.g., show a message
        user.isFollowing = !user.isFollowing;
        console.log('Followed successfully');
      },
      error: (error) => {
        // Handle error here, e.g., user already followed, etc.
        console.error('Error following user', error);
      }
    });
    
  }else{
    this.authService.unfollowUser(this.authService.getEmail(), user.email).subscribe({
      next: (response) => {
        // Handle successful follow here, e.g., show a message
        user.isFollowing = !user.isFollowing;
        console.log('Followed successfully');
      },
      error: (error) => {
        // Handle error here, e.g., user already followed, etc.
        console.error('Error following user', error);
      }
    });
  }

}



onEnter(value: string): void {
  
  this.authService.searchUsers(value).subscribe( (response: any) => {
      this.users = response.map(user => ({
        ...user,
        // Add any additional mapping if necessary, for example, combining first name and last name
        name: user.employeeName 
        ,email: user.email1,
        isFollowing:user.isFollowing
      }));
      while (this.users.length < 8) {
        this.users.push({} ); // Push an empty user or appropriate default object
      }
      while (this.users.length%8 != 0) {
        this.users.push({} ); // Push an empty user or appropriate default object
      }
      console.log(this.users);
    },
 error => {
      console.error('Error fetching users:', error);
    }
  );
}


onTabChange(event: any) {
  // Check if the "Following" tab is selected based on its index
  // Assuming "Following" tab is the second tab, its index would be 1
  if (event.index === 1) {
    this.fetchFollowing();
  }else if(event.index === 2){
    this.fetchFollowers();
  }
  else if(event.index === 3){
    while (this.users.length < 8) {
      this.users.push({} ); // Push an empty user or appropriate default object
    }
  }
}

fetchFollowing(){
  this.loading = true;
  this.authService.getFollowing().subscribe(
    (data) => {
      this.followings = data;
      while (this.followings.length%10 != 0) {
        this.followings.push({} as Following); // Push an empty user or appropriate default object
      }
      this.loading = false;
    },
    (error) => {
      console.error('Failed to fetch data:', error);
      this.loading = false;
    }
  );
}


fetchFollowers(){
  this.loading = true;
  this.authService.getFollowers().subscribe(
    (data) => {
      this.followers = data;
      while (this.followers.length%10 != 0) {
        this.followers.push({} as Following); // Push an empty user or appropriate default object
      }
      this.loading = false;
    },
    (error) => {
      console.error('Failed to fetch data:', error);
      this.loading = false;
    }
  );
}

fetchTop7(){
  this.authService.getTop7().subscribe(
    (data) => {
      this.data = data;
    },
    (error) => {
      console.error('Failed to fetch data:', error);
      this.loading = false;
    }
  );
}


}