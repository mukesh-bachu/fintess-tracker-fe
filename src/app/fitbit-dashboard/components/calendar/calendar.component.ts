import { Component, OnInit } from '@angular/core';
import { MetricServicesService } from '../../services/metric-services.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})
export class CalendarComponent implements OnInit {
  currentMonth: Date = new Date();
  today: Date = new Date();
  weeks: any[] = []; // Array of weeks, each week is an array of days

  constructor(private metricService: MetricServicesService, private authService: AuthService) { }

  ngOnInit(): void {
    this.calculateMonth();
    this.loadStepsData();
  }

  calculateMonth(): void {
    this.weeks = [];
    const startOfMonth = new Date(this.currentMonth.getFullYear(), this.currentMonth.getMonth(), 1);
    const endOfMonth = new Date(this.currentMonth.getFullYear(), this.currentMonth.getMonth() + 1, 0);
    const daysInMonth = endOfMonth.getDate();
    const dayOfWeek = startOfMonth.getDay();
    
    let day = 1 - dayOfWeek;
    let week = [];
    while (day <= daysInMonth) {
      week = [];
      for (let i = 0; i < 7; i++) {
        if (day >= 1 && day <= daysInMonth) {
          week.push({ date: new Date(this.currentMonth.getFullYear(), this.currentMonth.getMonth(), day), steps: 0 });
        } else {
          week.push({ date: null, steps: 0 }); // Fill empty days
        }
        day++;
      }
      this.weeks.push(week);
    }
  }

  loadStepsData(): void {
    // Assuming MetricServicesService is correctly set up to fetch data
    // This is a simplified example. You'll need to adjust it based on how your service and API work
    const month = this.currentMonth.getMonth() + 1;
    const year = this.currentMonth.getFullYear();
    const startDate = `${year}-${month}-01`;
    const endDate = `${year}-${month}-${new Date(year, month, 0).getDate()}`;
    const authCode = this.authService.getFitbitAccessToken(); // Adjust based on actual authService method
    
    this.metricService.getStepData(startDate, endDate, authCode).subscribe(data => {
      // Assuming data is an array of {date: 'YYYY-MM-DD', steps: number}
      data.forEach(d => {
        // Manually flatten the weeks array
        const flatWeeks = this.weeks.reduce((acc, week) => acc.concat(week), []);
        
        const dayData = flatWeeks.find(day =>
          day.date && this.formatDate(day.date) === d.date
        );
        
        if (dayData) {
          dayData.steps = d.steps;
        }
      });
      
    });
  }

  formatDate(date: Date, format: string = 'yyyy-MM-dd'): string {
    // Implement or use a library to format dates as required
    // This is a placeholder
    return ''; // Format the date as per your requirement
  }

  goToPreviousMonth(): void {
    this.currentMonth.setMonth(this.currentMonth.getMonth() - 1);
    this.calculateMonth();
    this.loadStepsData();
  }

  goToNextMonth(): void {
    if (this.currentMonth < this.today) {
      this.currentMonth.setMonth(this.currentMonth.getMonth() + 1);
      this.calculateMonth();
      this.loadStepsData();
    }
  }
}
