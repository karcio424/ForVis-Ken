import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {DataSet, Edge, IdType, Network, Node} from 'vis';

import {AlertService, FileService, JsonfileService} from '../_services';

import {File} from '../_models';
import { DownloadableComponent } from '../visualization-download/visualization-download.component';

@Component({
  selector: 'app-visualization-vis_resolution',
  templateUrl: './visualization-vis_resolution.component.html',
  styleUrls: ['./visualization-vis_resolution.component.css']
})
export class VisualizationVisResolutionComponent extends DownloadableComponent implements OnInit {
  fileId: number;
  fileName: string;
  file: File = new File();
  info: string;
  kind: string;

  loading: boolean;
  stabilizationInProgress: boolean;
  isLoaded = false;

  public nodes: Node;
  public edges: Edge;

  public variables = [];
  public selectedVariables = [];
  public selectConfig = {
    placeholder: 'Choose variables',
    search: true,
    customComparator: (n1, n2) => n1 - n2,
  };
  isSelectAll = true;
  private timeCycleCounts: number = 60;
  private errorMessage: string = 'An overload occured during processing your file. Please try again with other method or file.';
  private lastProgressMessage: string;

  constructor(
    private route: ActivatedRoute,
    private fileService: FileService,
    private alertService: AlertService,
    private jsonfileService: JsonfileService
  ) { super()}

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

  loadFileVariables() {
    let getFile;
    if (this.kind === 'sat') {
      getFile = this.fileService.getSatFile(this.fileId, 'variables');
    } else {
      getFile = this.fileService.getMaxSatFile(this.fileId, 'variables');
    }
    getFile.subscribe(
      data => {
        if (data['content']['data']['message']) {
          setTimeout(() => {
              this.loadFileVariables();
            },
            1000
          );

        } else {
          this.variables = data['content']['data']['variables'];
        }
      });
  }

  loadVis(selectedVars = []) {
    this.jsonfileService.getJsonFile(this.fileId, this.kind).subscribe(
      data => {
        this.info = null;

        this.file = data;
        this.variables = data.content.variables;
        this.nodes = new DataSet(data.content.nodes);
        this.edges = new DataSet(data.content.edges);

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
        let options = {
          'edges': {
            'smooth': false
          },
          'physics': {
            'enabled': true,
            'barnesHut': {
              'avoidOverlap': 1,
              'centralGravity': 10
            },
            'maxVelocity': 1,
            'minVelocity': 1,
            'timestep': 0.1,
          }
        };
        this.loading = true;
        this.network = new Network(container, _data, options);
        this.stopStab();

        this.network.on('startStabilizing', function (params) {
          this.stabilizationInProgress = true;
        }.bind(this));

        this.network.on('stabilized', function (params) {
          this.stabilizationInProgress = false;
        }.bind(this));

        this.network.once('stabilizationIterationsDone', function () {
          this.loading = false;
          this.isLoaded = true;
          this.stabilizationInProgress = false;
        }.bind(this));
      }
    )


    // let getFile;
    // if (this.kind === 'sat') {
    //   getFile = this.fileService.getSatFile(this.fileId, 'sat_vis_resolution', selectedVars);
    // } else {
    //   getFile = this.fileService.getMaxSatFile(this.fileId, 'maxsat_vis_resolution', selectedVars);
    // }
    // getFile.subscribe(
    //   data => {
    //     if (data['content']['data']['message']) {
    //       if (this.lastProgressMessage == data['content']['data']['message']) {
    //         if (this.timeCycleCounts <= 0) {
    //           this.info = this.errorMessage;
    //         } else {
    //           this.timeCycleCounts -= 1;
    //         }
    //       } else {
    //         this.info = data['content']['data']['message'];
    //         this.lastProgressMessage = this.info;
    //         this.timeCycleCounts = 60;
    //       }
    //
    //       setTimeout(() => {
    //           this.loadVis(selectedVars);
    //         },
    //         1000
    //       );
    //
    //     } else {
    //       this.info = null;
    //
    //       this.file = data;
    //
    //       this.nodes = new DataSet(data['content']['data']['nodes']);
    //       this.edges = new DataSet(data['content']['data']['edges']);
    //       this.nodes.forEach(node => {
    //         if (node.font && node.font.size < 1) {
    //           node.font.size = 1;
    //         }
    //       });
    //
    //       let container = document.getElementById('visualization');
    //       let _data = {
    //         nodes: this.nodes,
    //         edges: this.edges
    //       };
    //       let options = {
    //         'edges': {
    //           'smooth': false
    //         },
    //         'physics': {
    //           'enabled': true,
    //           'barnesHut': {
    //             'avoidOverlap': 1,
    //             'centralGravity': 10
    //           },
    //           'maxVelocity': 1,
    //           'minVelocity': 1,
    //           'timestep': 0.1,
    //         }
    //       };
    //       this.loading = true;
    //       this.network = new Network(container, _data, options);
    //       this.stopStab();
    //
    //       this.network.on('startStabilizing', function (params) {
    //         this.stabilizationInProgress = true;
    //       }.bind(this));
    //
    //       this.network.on('stabilized', function (params) {
    //         this.stabilizationInProgress = false;
    //       }.bind(this));
    //
    //       this.network.once('stabilizationIterationsDone', function () {
    //         this.loading = false;
    //         this.isLoaded = true;
    //         this.stabilizationInProgress = false;
    //       }.bind(this));
    //     }
    //   },
    //   error => this.alertService.error(error)
    // );
  }

  onDraw() {
    this.loading = true;
    if (this.isSelectAll === false && this.selectedVariables.length > 0) {
      this.loadVis(this.selectedVariables);
    } else {
      this.loadVis();
    }
  }
}
