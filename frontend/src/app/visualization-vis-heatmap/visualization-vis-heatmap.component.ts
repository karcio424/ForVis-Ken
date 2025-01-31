import {Chart} from 'chart.js';
import {ActivatedRoute} from "@angular/router";
import {DownloadableComponent} from "../visualization-download/visualization-download.component";
import {Component, ElementRef, OnInit, ViewChild} from "@angular/core";
import {JsonfileService} from "../_services";

@Component({
  selector: 'app-visualization-vis-heatmap',
  templateUrl: './visualization-vis-heatmap.component.html',
  styleUrls: ['./visualization-vis-heatmap.component.css']
})

export class VisualizationVisHeatmapComponent extends DownloadableComponent implements OnInit {

  @ViewChild('visualization') private visElement: ElementRef;

  fileId: number;
  fileName: string;
  info;
  kind: string;
  loading: boolean = true;

  visualization: any;

  constructor(
    private jsonfileService: JsonfileService,
    private route: ActivatedRoute
  ) {
    super();
  }

  ngOnInit() {
    this.route.params.subscribe(
      params => {
        this.fileId = params['f'];
        this.fileName = params['name'];
        this.kind = params['kind'];
      });
    this.jsonfileService.getJsonFile(this.fileId, this.kind).subscribe( data =>
        this.loadVis(data.content)
    )
  }

  loadVis(data) {
    this.network = new Chart('visualization', {
      type: 'scatter',
      data: {
        datasets: data
      },
      options: {
        scales: {
          xAxes: [{
            type: 'linear',
            position: 'bottom'
          }]
        }
      }
    });

  }
}
