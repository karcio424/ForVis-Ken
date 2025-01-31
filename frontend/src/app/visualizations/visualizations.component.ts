import {Component, OnInit} from '@angular/core';
import {Jsonfile} from '../_models';
import {AlertService, AuthService, JsonfileService} from '../_services';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {ModalProgressComponent} from '../modal-progress/modal-progress.component';
import {Router} from '@angular/router';

const formats = new Map([
    ["sat_vis_factor", "visualization-vis_factor"],
    ["sat_vis_interaction", "visualization-vis_interaction"],
    ["sat_vis_matrix", "visualization-vis_matrix"],
    ["sat_vis_tree", "visualization-vis_tree"],
    ["sat_vis_cluster", "visualization-vis_cluster"],
    ["sat_vis_resolution", "visualization-vis_resolution"],
    ["sat_vis_distribution", "visualization-vis_distribution"],
    ["sat_vis_directed", "visualization-vis_directed"],
    ["sat_vis_2clause", "visualization-vis_2clause"],
    ["sat_vis_dpll", "visualization-vis_dpll"],
    ["sat_vis_heatmap", "visualization-vis_heatmap"],
    ["sat_vis_hypergraph", "visualization-vis_hypergraph"],
    ["raw", "visualization-raw"],
    ["maxsat_vis_factor", "visualization-vis_factor"],
    ["maxsat_vis_interaction", "visualization-vis_interaction"],
    ["maxsat_vis_matrix", "visualization-vis_matrix"],
    ["maxsat_vis_tree", "visualization-vis_tree"],
    ["maxsat_vis_cluster", "visualization-vis_cluster"],
    ["maxsat_vis_resolution", "visualization-vis_resolution"],
    ["maxsat_vis_distribution", "visualization-vis_distribution"],
    ["community", "visualization-vis-community"]
]);

const formatsNames = new Map([
  ["sat_vis_factor", "SAT Factor Graph"],
  ["sat_vis_interaction", "SAT Interaction Graph"],
  ["sat_vis_matrix", "SAT Matrix Visualization"],
  ["sat_vis_tree", "SAT Tree Visualization"],
  ["sat_vis_cluster", "SAT Cluster Visualization"],
  ["sat_vis_resolution", "SAT Resolution Graph"],
  ["sat_vis_distribution", "SAT Distribution Chart"],
  ["sat_vis_directed", "SAT Direct Graphical Model"],
  ["sat_vis_2clause", "SAT 2-Clauses Interaction Graph"],
  ["sat_vis_dpll", "SAT DPLL Solver Visualization"],
  ["sat_vis_heatmap", "SAT heatmap visualization"],
  ["sat_vis_hypergraph", "SAT hypergraph visualization"],
  ["raw", "Raw File Visualization"],
  ["maxsat_vis_factor", "MAX-SAT Factor Graph"],
  ["maxsat_vis_interaction", "MAX-SAT Interaction Graph"],
  ["maxsat_vis_matrix", "MAX-SAT Matrix Visualization"],
  ["maxsat_vis_tree", "MAX-SAT Tree Visualization"],
  ["maxsat_vis_cluster", "MAX-SAT Cluster Visualization"],
  ["maxsat_vis_resolution", "MAX-SAT Resolution Graph"],
  ["maxsat_vis_distribution", "MAX-SAT Distribution Chart"],
  ["community", "Communities"]
]);


@Component({
  selector: 'app-visualizations',
  templateUrl: './visualizations.component.html',
  styleUrls: ['./visualizations.component.css']
})
export class VisualizationsComponent implements OnInit {

  visualizations: Array<Jsonfile>;
  isLoading: boolean = true;

  constructor(
    private alertService: AlertService,
    private authService: AuthService,
    private jsonFileService: JsonfileService,
    private modalService: NgbModal,
    private router: Router,
  ) { }

  ngOnInit() {
    this.updateList();
  }

  updateList(){
    this.jsonFileService.getJsonFileList().subscribe(
      data => {
        this.visualizations = data;
        this.visualizations.sort((a, b) => {
          if(a.id>b.id){
            return 1;
          }
          return 0;
          }
        )
        this.isLoading = false;
      },
      error => this.alertService.error(error)
    )
  }

  checkProgress(vis: Jsonfile) {
    const progress: string = vis.progress;

    const modalRef = this.modalService.open(ModalProgressComponent, {
      centered: true,
    });

    modalRef.componentInstance.progressMessage = progress;
  }

  deleteVisualization(id) {
    this.jsonFileService.deleteJsonFile(id).subscribe(
      data => this.updateList(),
      error => this.alertService.error(error)
    )
  }

  visualize(vis: Jsonfile) {
    this.router.navigate([formats.get(vis.json_format),
                        {f: vis.id, name: vis.name, kind: 'sat'}]);
  }

  visualizeCommunity(vis: Jsonfile){
    this.jsonFileService.visualizeCommunity(vis);
    let currentUrl = this.router.url;
    this.updateList();
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.router.onSameUrlNavigation = 'reload';
    this.router.navigate([currentUrl]);
  }

  isDone(vis: Jsonfile) {
    return vis.status === "done" || vis.progress === "Progress: 100.0%";
  }

  canCreateCommunity(vis: Jsonfile) {
    let x = [
      'sat_vis_factor', 'sat_vis_interaction', 'sat_vis_tree',
      'maxsat_vis_factor', 'maxsat_vis_interaction', 'maxsat_vis_tree'
    ]
    if (x.includes(vis.json_format)) {
      return true
    }
    return false
  }

  getFormat(json_format: string) {
    if (json_format.startsWith("community")){
       return 'Community Graph';
    }
    return formatsNames.get(json_format);
  }
}
