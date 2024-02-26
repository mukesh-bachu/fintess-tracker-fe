import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MetricServicesService } from '../../services/metric-services.service';
import Chart, { ChartType } from 'chart.js/auto';
import { SelectItem } from 'primeng/api';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-steps',
  templateUrl: './steps.component.html',
  styleUrls: ['./steps.component.scss']
})
export class StepsComponent implements OnInit {

  chartOptions!: SelectItem[];
  displayDateRange!: string;
  isCurrentWeek: boolean = false;
  chartData: any;
  private ctx!: CanvasRenderingContext2D;
  isDataAvaiable: Boolean;

  basicData: any;

  basicOptions: any;
  basicType:any;
 

  @ViewChild('chartCanvas') chartCanvas!: ElementRef<HTMLCanvasElement>;
  public chart!: Chart;
  selectedChartType: ChartType = 'bar';
  currentDate: Date = new Date();
  authCode: string = '';


  constructor(private metricServicesService: MetricServicesService, private authService: AuthService) { }

  ngOnInit(): void {

    this.fetchData();
    // this.ctx = this.chartCanvas.nativeElement.getContext('2d')!;
    // this.displayNoDataMessage();
    this.isDataAvaiable = this.authService.isFitbitLoggedIn() || this.authService.isGoogleFitLoggedIn();

  }


// Function to display message on canvas
 displayNoDataMessage():void {
  this.ctx.clearRect(0, 0, this.chartCanvas.nativeElement.width, this.chartCanvas.nativeElement.height);

  // Set text properties
  this.ctx.fillStyle = 'black'; // Text color
  this.ctx.font = '16px Arial'; // Text size and font
  this.ctx.textAlign = 'center'; // Align text in the middle of the canvas
  this.ctx.textBaseline = 'middle'; // Align text in the middle of the canvas height

  // Display the text
  this.ctx.fillText('No real-time data loaded', this.chartCanvas.nativeElement.width / 2, this.chartCanvas.nativeElement.height / 2);
}



  fetchData(): void {
    this.updateDisplayDateRange();
    const startDate = this.formatDate(this.getStartOfWeek(this.currentDate), 'yyyy-MM-dd');
    const endDate = this.formatDate(this.getEndOfWeek(this.currentDate), 'yyyy-MM-dd');
    const selectedSource = this.authService.getDropDownValue();
    if (selectedSource) {
      switch (selectedSource) {
        case 'fitbit':
          this.authCode = this.authService.getFitbitAccessToken();
          this.metricServicesService.getStepData(startDate, endDate, this.authCode).subscribe(data => {
            this.chartData = data; // Store the fetched data
            this.renderChart(data);
            this.isDataAvaiable = true;
          });
          break;
        case 'google':
          this.authCode = this.authService.getGoogleFitAccessToken();
          this.metricServicesService.getGStepData(startDate, endDate, this.authCode).subscribe(data => {
            this.chartData = data; // Store the fetched data
            this.renderChart(data);
            this.isDataAvaiable = true;
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
  
  changeWeek(amount: number): void {
    this.currentDate = this.addWeeks(this.currentDate, amount);
    this.fetchData();
  }

  onChartTypeChange(chartType: ChartType): void {
    this.selectedChartType = chartType;
    if (this.chart) {
      this.chart.destroy();
    }
    this.fetchData();
  }


  private processDataForChart(apiData: any): { labels: string[], data: number[] } {
    const stepsData = apiData['activities-tracker-steps'];
  
    // Sort stepsData by date if necessary
    stepsData.sort((a: any, b: any) => new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime());
  
    const labels = stepsData.map((item: any) => this.formatDate(new Date(item.dateTime), 'EEE, MMM d'));
    const data = stepsData.map((item: any) => parseInt(item.value, 10));
    return { labels, data };
  }

  private getStartOfWeek(d: Date): Date {
    const date = new Date(d);
    const day = date.getDay(); // Day of the week (0 for Sunday, 1 for Monday, etc.)
    const diff = date.getDate() - day; // Calculate difference to Sunday
    return new Date(date.setDate(diff));
  }

  private getEndOfWeek(d: Date): Date {
    const date = new Date(d);
    const day = date.getDay();
    const diff = date.getDate() - day + (day === 0 ? -1 : 6); // Adjust to get Saturday
    return new Date(date.setDate(diff));
  }

  private addWeeks(date: Date, numberOfWeeks: number): Date {
    return new Date(date.setDate(date.getDate() + 7 * numberOfWeeks));
  }

  private formatDate(date: Date, formatString: string): string {
    if (formatString === 'yyyy-MM-dd') {
      return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    }
  
    const options: Intl.DateTimeFormatOptions = {};
    switch (formatString) {
      case 'EEE, MMM d':
        options.weekday = 'short';
        options.month = 'short';
        options.day = 'numeric';
        break;
      // Add more cases as needed for different formats
    }
    return new Intl.DateTimeFormat('en-US', options).format(date);
  }

  private updateDisplayDateRange(): void {
    const startDate = this.formatDate(this.getStartOfWeek(this.currentDate), 'MMM d');
    const endDate = this.formatDate(this.getEndOfWeek(this.currentDate), 'MMM d');
    this.displayDateRange = `${startDate} - ${endDate}`;
  
    const currentWeekStart = this.getStartOfWeek(new Date());
    const currentWeekEnd = this.getEndOfWeek(new Date());
    this.isCurrentWeek = this.currentDate >= currentWeekStart && this.currentDate <= currentWeekEnd;
  }

  private renderChart(apiData: any): void {

    console.log(apiData);
    if (this.chart) {
      this.chart.destroy();
    }

    const { labels, data } = this.processDataForChart(apiData);
    let datasets = [];

    if (this.selectedChartType === 'bar') {
      datasets.push({
        label: 'Steps',
        data: data,
        backgroundColor: 'rgb(54, 162, 235)', // Blue color for bar chart
        borderColor: 'rgb(54, 162, 235)',
        borderWidth: 1,
        barPercentage: 0.5 // Adjust bar width
      });
    } else if (this.selectedChartType === 'line') {
      datasets.push({
        label: 'Steps',
        data: data,
        backgroundColor: 'rgba(255, 99, 132, 0.2)', // Red color for line chart
        borderColor: 'rgba(255, 99, 132)',
        borderWidth: 3, // Increased line thickness
        tension: 0.4,
        fill: false
      });
    } else if (this.selectedChartType === 'pie') {
      // Configuration for pie chart
      datasets.push({
        data: data,
        backgroundColor: [
          'rgb(54, 162, 235)',
          'rgb(255, 99, 132)',
          'rgb(255, 205, 86)',
          'rgb(75, 192, 192)',
          'rgb(255, 159, 64)',
          'rgb(153, 102, 255)',
          'rgb(255, 99, 71)'
        ]
      });
    }

    this.basicType = this.selectedChartType;
    this.basicData = {
      labels: labels,
      datasets: datasets
    };
    this.basicOptions ={
          responsive:false,
          maintainAspectRatio: true, // Adjust this as needed
          plugins: {
            legend: {
              labels: {
                color: '#A0A7B5'
              },
              display:false
            }
          },
          scales: this.selectedChartType !== 'pie' ? {
            x: {
              ticks: {
                
                color: '#A0A7B5'
              },
              grid: {
                color: 'rgba(160, 167, 181, .3)'
              }
            },
            y: {
              ticks: {
                
                color: '#A0A7B5'
              },
              grid: {
                color: 'rgba(160, 167, 181, .3)'
              }
            }
          } : {}
        };

    // const canvas = this.chartCanvas.nativeElement;
    // const context = canvas.getContext('2d');
    // if (context) {
    //   let datasets = [];

    //   if (this.selectedChartType === 'bar') {
    //     datasets.push({
    //       label: 'Steps',
    //       data: data,
    //       backgroundColor: 'rgb(54, 162, 235)', // Blue color for bar chart
    //       borderColor: 'rgb(54, 162, 235)',
    //       borderWidth: 1,
    //       barPercentage: 0.5 // Adjust bar width
    //     });
    //   } else if (this.selectedChartType === 'line') {
    //     datasets.push({
    //       label: 'Steps',
    //       data: data,
    //       backgroundColor: 'rgba(255, 99, 132, 0.2)', // Red color for line chart
    //       borderColor: 'rgba(255, 99, 132)',
    //       borderWidth: 3, // Increased line thickness
    //       tension: 0.4,
    //       fill: false
    //     });
    //   } else if (this.selectedChartType === 'pie') {
    //     // Configuration for pie chart
    //     datasets.push({
    //       data: data,
    //       backgroundColor: [
    //         'rgb(54, 162, 235)',
    //         'rgb(255, 99, 132)',
    //         'rgb(255, 205, 86)',
    //         'rgb(75, 192, 192)',
    //         'rgb(255, 159, 64)',
    //         'rgb(153, 102, 255)',
    //         'rgb(255, 99, 71)'
    //       ]
    //     });
    //   }

    //   this.chart = new Chart(context, {
    //     type: this.selectedChartType,
    //     data: {
    //       labels: labels,
    //       datasets: datasets
    //     },
    //     options: {
    //       responsive:false,
    //       maintainAspectRatio: true, // Adjust this as needed
    //       plugins: {
    //         legend: {
    //           labels: {
    //             color: '#A0A7B5'
    //           },
    //           display:false
    //         }
    //       },
    //       scales: this.selectedChartType !== 'pie' ? {
    //         x: {
    //           ticks: {
                
    //             color: '#A0A7B5'
    //           },
    //           grid: {
    //             color: 'rgba(160, 167, 181, .3)'
    //           }
    //         },
    //         y: {
    //           ticks: {
                
    //             color: '#A0A7B5'
    //           },
    //           grid: {
    //             color: 'rgba(160, 167, 181, .3)'
    //           }
    //         }
    //       } : {}
    //     }
    //   });
    // } else {
    //   console.error('Unable to get canvas context');
    // }
  }
}
