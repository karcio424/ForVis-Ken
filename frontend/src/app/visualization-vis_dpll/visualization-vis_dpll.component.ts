import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Network, DataSet, Node, Edge, IdType} from 'vis';

import {FileService} from "../_services/file.service";
import {AlertService} from "../_services/alert.service";

import {File} from "../_models/file";
import {DownloadableComponent} from '../visualization-download/visualization-download.component';
import {JsonfileService} from '../_services';

@Component({
  selector: 'app-visualization-vis_dpll',
  templateUrl: './visualization-vis_dpll.component.html',
  styleUrls: ['./visualization-vis_dpll.component.css']
})
export class VisualizationVisDpllComponent extends DownloadableComponent implements OnInit {
  fileId: number;
  fileName: string;
  file: File = new File();
  info: string;
  kind: string;

  loading: boolean;
  stabilizationInProgress: boolean;

  public nodes: Node;
  public edges: Edge;

  heuristicType = 3

  private timeCycleCounts: number = 60;
  private errorMessage: string = 'An overload occured during processing your file. Please try again with other method or file.';
  private lastProgressMessage: string;

  constructor(
    private route: ActivatedRoute,
    private fileService: FileService,
    private alertService: AlertService,
    private jsonfileService: JsonfileService
  ) {
    super()
  }

  ngOnInit() {
    this.route.params.subscribe(
      params => {
        this.fileId = params['f'];
        this.fileName = params['name'];
        this.kind = params['kind'];
        this.loadVis();
      });
  }

  startStab() {
    this.network.startSimulation();
  }

  stopStab() {
    this.network.stopSimulation();
    this.network.fit();
  }

  loadVis(heuType = 3) {
    this.jsonfileService.getJsonFile(this.fileId, this.kind).subscribe(
      data => {
        this.info = null;
        this.file = data;

        if (heuType === 1) {
          this.nodes = new DataSet(data.content.dlis_nodes);
          this.edges = new DataSet(data.content.dlis_edges);
        } else if (heuType === 2) {
          this.nodes = new DataSet(data.content.jw_nodes);
          this.edges = new DataSet(data.content.jw_edges);
        } else {
          this.nodes = new DataSet(data.content.moms_nodes);
          this.edges = new DataSet(data.content.moms_edges);
        }

        this.nodes.forEach(node => {
          if (node.font && node.font.size < 1) {
            node.font.size = 1;
          }
        });

        let container = document.getElementById('visualization');
        let _data = {
          nodes: this.nodes,
          edges: this.edges
        };
        let options = data.content.options;

        this.loading = true;
        this.network = new Network(container, _data, options);
        this.stopStab();

        this.network.on("startStabilizing", function (params) {
          this.stabilizationInProgress = true;
        }.bind(this));

        this.network.on("stabilized", function (params) {
          this.stabilizationInProgress = false;
        }.bind(this));

        this.network.once("stabilizationIterationsDone", function () {
          this.loading = false;
          this.stabilizationInProgress = false;
        }.bind(this));
      }
    )
  }

  loadHeuristic() {
    this.loading = true;
    if (this.heuristicType === 1) {
      this.loadVis(1)
    } else if (this.heuristicType === 2) {
      this.loadVis(2)
    } else if (this.heuristicType === 3) {
      this.loadVis(3)
    } else {
      this.loadVis()
    }

  }

}
