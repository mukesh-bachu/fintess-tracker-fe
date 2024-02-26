import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MetricServicesService } from '../../services/metric-services.service';
import Chart, { ChartType } from 'chart.js/auto';
import { SelectItem } from 'primeng/api';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-calories',
  templateUrl: './calories.component.html',
  styleUrls: ['./calories.component.scss']
})
export class CaloriesComponent implements OnInit {
  chartOptions!: SelectItem[];
  displayDateRange!: string;
  isCurrentWeek: boolean = false;
  isDataAvaiable: boolean;
  basicData: any;

  basicOptions: any;
  basicType:any;
  
  @ViewChild('chartCanvas') chartCanvas!: ElementRef<HTMLCanvasElement>;
  public chart!: Chart;
  selectedChartType: ChartType = 'bar';
  currentDate: Date = new Date();
  authCode: string = this.authService.getFitbitAccessToken();

  constructor(private metricServicesService: MetricServicesService, private authService: AuthService) { }

  ngOnInit(): void {
    this.fetchData();
    this.isDataAvaiable = this.authService.isFitbitLoggedIn() || this.authService.isGoogleFitLoggedIn();
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
          this.metricServicesService.getCaloriesData(startDate, endDate, this.authCode).subscribe(data => {
            this.isDataAvaiable = true;
            this.renderChart(data);
          });
          break;
        case 'google':
          this.authCode = this.authService.getGoogleFitAccessToken();
          this.metricServicesService.getGCaloriesData(startDate, endDate, this.authCode).subscribe(data => {
            this.isDataAvaiable = true;
            this.renderChart(data);
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
    const caloriesData = apiData['activities-tracker-calories'];
    const labels = caloriesData.map((item: any) => this.formatDate(new Date(item.dateTime), 'EEE, MMM d'));
    const data = caloriesData.map((item: any) => parseInt(item.value, 10));
    return { labels, data };
  }

  private getStartOfWeek(d: Date): Date {
    const date = new Date(d);
    const day = date.getDay(); // Day of the week (0 for Sunday)
    const diff = date.getDate() - day; // Calculate difference to previous Sunday
    return new Date(date.setDate(diff));
  }
  

  private getEndOfWeek(d: Date): Date {
    const date = new Date(d);
    const day = date.getDay(); // Day of the week (0 for Sunday)
    const diff = date.getDate() - day + 6; // Calculate difference to next Saturday
    return new Date(date.setDate(diff));
  }
  

  private addWeeks(date: Date, numberOfWeeks: number): Date {
    return new Date(date.setDate(date.getDate() + 7 * numberOfWeeks));
  }

  private formatDate(date: Date, formatString: string): string {
    if (formatString === 'yyyy-MM-dd') {
      const year = date.getFullYear();
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const day = date.getDate().toString().padStart(2, '0');
      return `${year}-${month}-${day}`;
    }

    const options: Intl.DateTimeFormatOptions = {};
    switch (formatString) {
      case 'EEE, MMM d':
        options.weekday = 'short';
        options.month = 'short';
        options.day = 'numeric';
        break;
    }
    return new Intl.DateTimeFormat('en-US', options).format(date);
  }

  private updateDisplayDateRange(): void {
    const startDate = this.formatDate(this.getStartOfWeek(this.currentDate), 'MMM d');
    const endDate = this.formatDate(this.getEndOfWeek(this.currentDate), 'MMM d');
    this.displayDateRange = `${startDate} - ${endDate}`;
    this.isCurrentWeek = this.currentDate >= this.getStartOfWeek(new Date()) && this.currentDate <= this.getEndOfWeek(new Date());
  }

  private renderChart(apiData: any): void {
    if (this.chart) {
      this.chart.destroy();
    }

    const { labels, data } = this.processDataForChart(apiData);

    // const canvas = this.chartCanvas.nativeElement;
    // const context = canvas.getContext('2d');

    let datasets = [];

    if (this.selectedChartType === 'bar') {
      datasets.push({
        label: 'Steps',
        data: data,
        backgroundColor: 'rgb(255, 99, 132)',
        borderColor: 'rgb(255, 99, 132)',
        borderWidth: 1,
        barPercentage: 0.5 // Adjust bar width
      });
    } else if (this.selectedChartType === 'line') {
      datasets.push({
        label: 'Steps',
        data: data,
        backgroundColor: 'rgb(75, 192, 192)',
        borderColor: 'rgb(75, 192, 192)',
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
      maintainAspectRatio: true,
      plugins: {
        legend: {
          labels: {
            color: '#A0A7B5'
          },
          display:false
        }
      },
      scales: {
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
      }
    };


    // if (context) {
    //   let datasets = [];

    //   if (this.selectedChartType === 'bar') {
    //     datasets.push({
    //       label: 'Steps',
    //       data: data,
    //       backgroundColor: 'rgb(255, 99, 132)',
    //       borderColor: 'rgb(255, 99, 132)',
    //       borderWidth: 1,
    //       barPercentage: 0.5 // Adjust bar width
    //     });
    //   } else if (this.selectedChartType === 'line') {
    //     datasets.push({
    //       label: 'Steps',
    //       data: data,
    //       backgroundColor: 'rgb(75, 192, 192)',
    //       borderColor: 'rgb(75, 192, 192)',
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
    //       maintainAspectRatio: true,
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
