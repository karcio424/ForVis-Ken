import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {AlertService, FileService, JsonfileService} from '../_services';
import {DownloadableComponent} from '../visualization-download/visualization-download.component';
import { Chart } from 'chart.js';

@Component({
  selector: 'app-visualization-vis-distribution',
  templateUrl: './visualization-vis-distribution.component.html',
  styleUrls: ['./visualization-vis-distribution.component.css']
})
export class VisualizationVisDistributionComponent extends DownloadableComponent implements OnInit {
  @ViewChild('visualization') private visElement: ElementRef;

  fileId: number;
  fileName: string;
  fileData;
  info;
  kind: string;
  loading: boolean = true;

  numberOfClauses: number;

  topPercentage = [{description: "All (100%)",
                    value: 0},
                   {description: "5%",
                    value: 5},
                   {description: "10%",
                    value: 10},
                   {description: "25%",
                    value: 25},
                   {description: "50%",
                    value: 50},
                   {description: "75%",
                    value: 75}];
  selectedTopPercentage: number;

  chartForm = [{description: "Both",
                value: "both"},
               {description: "Positive",
                 value: "positive"},
               {description: "Negative",
                value: "negative"},
               {description: "Only positive/negative variables",
                value: "singles"}];
  selectedChartForm: string;

  visualization: any;

  constructor(
    private route: ActivatedRoute,
    private fileService: FileService,
    private alertService: AlertService,
    private jsonfileService: JsonfileService
  ) { super() }

  ngOnInit() {
    this.route.params.subscribe(
      params => {
        this.fileId = params['f'];
        this.fileName = params['name'];
        this.kind = params['kind'];
        this.loadVis();
      });
  }

  loadVis(){
    this.jsonfileService.getJsonFile(this.fileId, this.kind).subscribe(
      data => {
        this.info = data.content.info;
        this.numberOfClauses = parseInt(data.content.info[3].replace("\n", ""));
        this.network = new Chart('visualization', {
          type: 'bar',
          data: {
            labels: data.content.labels,
            datasets: [
              {
                label: "Negative",
                backgroundColor: "#e63030",
                data: data.content.negative
              },
              {
                label: "Positive",
                backgroundColor: "#93eced",
                data: data.content.positive
              }
            ]
          },
          options: {
            title: {
              display: true,
              text: 'Distribution of logical variables in formula'
            },
            scales: {
              xAxes: [{
                stacked: true,
                display: true
              }],
              yAxes: [{
                stacked: true,
                display: true
              }],
            }
          }
        });

        this.loading = false;
      }
      )
  }

  onFilter() {
    if(!(this.selectedTopPercentage == null || this.selectedChartForm == null)){
      this.jsonfileService.getJsonFile(this.fileId, this.kind).subscribe(
        data => {
          console.log("Chosen options: " + this.selectedChartForm + " and " + this.selectedTopPercentage);

          let labels = data.content.labels;
          let negative = data.content.negative;
          let positive = data.content.positive;

          if(this.selectedChartForm == "positive"){
            negative = [];
          }
          if(this.selectedChartForm == "negative"){
            positive = [];
          }
          if(this.selectedChartForm == "singles"){
            let newLabels = [];
            let newNegative = [];
            let newPositive = [];

            for (let index = 0; index < labels.length; index++){
              if((positive[index] == 0 && negative[index] > 0) || (negative[index] == 0 && positive[index] > 0)){
                newLabels.push(labels[index]);
                newNegative.push(negative[index]);
                newPositive.push(positive[index])
              }
            }

            labels = newLabels;
            negative = newNegative;
            positive = newPositive;
          }

          if(this.selectedTopPercentage != 0){
            let newLabels = [];
            let newNegative = [];
            let newPositive = [];
            let newLabelsLength = Math.floor(parseInt(this.info[2])*(this.selectedTopPercentage/100) + 0.99);

            if(this.selectedChartForm == "positive"){
              let positiveTemp = Object.assign([], positive);
              console.log(positive);
              positiveTemp = positiveTemp.sort((a,b) => b-a).slice(0,newLabelsLength);
              console.log(positive);
              let minimumValue = Math.min(...positiveTemp);

              for (let index = 0; index < labels.length; index++){
                // if(newLabels.length > newLabelsLength){
                //   break;
                // }
                if(positive[index] >= minimumValue){
                  newLabels.push(labels[index]);
                  newPositive.push(positive[index]);
                  console.log("Pushing " + labels[index] + " value " + positive[index]);
                }
              }
            }
            if(this.selectedChartForm == "negative"){
              let negativeTemp = Object.assign([], negative);;
              negativeTemp = negativeTemp.sort((a,b) => b-a).slice(0,newLabelsLength);
              let minimumValue = Math.min(...negativeTemp);

              for (let index = 0; index < labels.length; index++){
                // if(newLabels.length >= newLabelsLength){
                //   break;
                // }
                if(negative[index] >= minimumValue){
                  newLabels.push(labels[index]);
                  newNegative.push(negative[index])
                }
              }
            }
            else {
              let sumNegativePositive = [];

              for (let index = 0; index < labels.length; index++){
                sumNegativePositive.push(positive[index]+negative[index]);
              }
              let temp = Object.assign([], sumNegativePositive);

              temp = temp.sort((a,b) => b-a).slice(0,newLabelsLength);
              let minimumValue = Math.min(...temp);

              for (let index = 0; index < labels.length; index++){
                // if(newLabels.length >= newLabelsLength){
                //   break;
                // }
                if(negative[index]+positive[index] >= minimumValue){
                  newLabels.push(labels[index]);
                  newPositive.push(positive[index])
                  newNegative.push(negative[index])
                }
              }
            }

            labels = newLabels;
            negative = newNegative;
            positive = newPositive;
          }

          console.log("Data of visualizations:");
          console.log(positive);
          console.log(negative);
          console.log(labels);

          this.network.data.datasets.length = 0;
          this.network.data.labels.length = 0;
          this.network.update();

          this.network = new Chart('visualization', {
            type: 'bar',
            data: {
              labels: labels,
              datasets: [
                {
                  label: "Negative",
                  backgroundColor: "#e63030",
                  data: negative
                },
                {
                  label: "Positive",
                  backgroundColor: "#93eced",
                  data: positive
                }
              ]
            },
            options: {
              title: {
                display: true,
                text: 'Distribution of logical variables in formula'
              },
              scales: {
                xAxes: [{
                  stacked: true,
                  display: true
                }],
                yAxes: [{
                  stacked: true,
                  display: true
                }],
              }
            }
          });

          this.loading = false;
        }
      )
    }
  }
}


























