import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Network, DataSet, Node, Edge, IdType } from 'vis';

import { FileService } from "../_services/file.service";
import { AlertService } from "../_services/alert.service";

import { File } from "../_models/file";
import { DownloadableComponent } from '../visualization-download/visualization-download.component';
import {JsonfileService} from '../_services';

@Component({
  selector: 'app-visualization-vis_cluster',
  templateUrl: './visualization-vis_cluster.component.html',
  styleUrls: ['./visualization-vis_cluster.component.css']
})
export class VisualizationVisClusterComponent extends DownloadableComponent implements OnInit {
  fileId: number;
  fileName: string;
  fileData;
  info: string;
  kind: string;

  loading: boolean = true;

  public nodesC: Node[];
  public edgesC: Edge[];

  public nodesW: Node[];
  public edgesW: Edge[];

  public clusteredNetwork: Network;
  public zoomedNetwork: Network;

  zoomOnSelectedCluster;
  zoomOnSelectedEdge;

  private _networkOptions;

  private timeCycleCounts: number = 60;
  private errorMessage: string = 'An overload occured during processing your file. Please try again with other method or file.';
  private lastProgressMessage: string;

  constructor(
    private route: ActivatedRoute,
    private fileService: FileService,
    private alertService: AlertService,
    private jsonfileService: JsonfileService
  ) { super() }

  ngOnInit() {
    console.log("on Init")
    this.route.params.subscribe(
      params => {
        this.fileId = params['f'];
        this.fileName = params['name'];
        this.kind = params['kind'];
        this.loadVis();
      });
  }

  loadVis() {
    this.jsonfileService.getJsonFile(this.fileId, this.kind).subscribe(
      data => {
        this.info = null;

        this.fileData = data;
        this.nodesC = this.fileData.content.clusteredNetwork.nodes;
        this.edgesC = this.fileData.content.clusteredNetwork.edges;
        this.nodesW = this.fileData.content.wholeNetwork.nodes;
        this.edgesW = this.fileData.content.wholeNetwork.edges;

        this.nodesC.forEach(node => {
          if (node.font && node.font.size < 1) {
            node.font.size = 1;
          }
        });

        this.nodesW.forEach(node => {
          if (node.font && node.font.size < 1) {
            node.font.size = 1;
          }
        });

        let containerMain = document.getElementById('visualization');

        let _dataC = {
          nodes: new DataSet(this.nodesC),
          edges: new DataSet(this.edgesC)
        };

        this._networkOptions = {
          "edges": {
            "smooth": false
          },
          "interaction":
            {
              "selectConnectedEdges": false
            },
          "physics": {
            "enabled": false
          }
        };

        this.zoomOnSelectedCluster = (selectNodeEvent) => {
          if (this.zoomedNetwork != null) {
            this.zoomedNetwork.destroy();
          }

          let clusterId = selectNodeEvent.nodes[0];
          let containerZoom = document.getElementById('zoom');

          let nodes = this.nodesW.filter(node => node.cluster == clusterId);
          let edges = this.edgesW.filter(edge => {
            let node1cluster = this.nodesW.find(node => node.id == edge.from).cluster;
            let node2cluster = this.nodesW.find(node => node.id == edge.to).cluster;

            if (node1cluster == node2cluster && node1cluster == clusterId)
              return true;
            else
              return false;
          })

          let data = {
            nodes: new DataSet(nodes),
            edges: new DataSet(edges)
          };

          this.zoomedNetwork = new Network(containerZoom, data, this._networkOptions);
        };

        this.zoomOnSelectedEdge = (selectEdgeEvent) => {

          if (this.zoomedNetwork != null) {
            this.zoomedNetwork.destroy();
          }

          let selectedEdge = this.edgesC.find(edge => edge.id === selectEdgeEvent.edges[0]);

          let cluster1Id = selectedEdge.from;
          let cluster2Id = selectedEdge.to;
          let containerZoom = document.getElementById('zoom');

          let edgesBetweenClusters = this.edgesW.filter(edge => {
            let node1cluster = this.nodesW.find(node => node.id == edge.from).cluster;
            let node2cluster = this.nodesW.find(node => node.id == edge.to).cluster;

            if ((node1cluster == cluster1Id && node2cluster == cluster2Id)
              || (node1cluster == cluster2Id && node2cluster == cluster1Id)) {
              return true;
            }
            else {
              return false;
            }
          });

          let nodes = this.nodesW.filter(node => {
            return edgesBetweenClusters.some(edge => {
              return edge.from == node.id || edge.to == node.id;
            });
          });

          let edges = this.edgesW.filter(edge => {
            return this.nodesW.some(node => node.id == edge.from || node.id == edge.to);
          })

          let data = {
            nodes: new DataSet(nodes),
            edges: new DataSet(edges)
          };

          this.zoomedNetwork = new Network(containerZoom, data, this._networkOptions);
        }

        this.clusteredNetwork = new Network(containerMain, _dataC, this._networkOptions);
        this.clusteredNetwork.on("selectNode", this.zoomOnSelectedCluster);
        this.clusteredNetwork.on("selectEdge", this.zoomOnSelectedEdge);
        this.network = this.clusteredNetwork;

        this.loading = false;
      }
    )


    // console.log("loadVis")
    // //var getFile = this.fileService.getClusteredFile(this.fileId)
    // var getFile
    // if (this.kind == 'sat') {
    //   getFile = this.fileService.getSatFile(this.fileId, 'sat_vis_cluster')
    // }
    // else {
    //   getFile = this.fileService.getMaxSatFile(this.fileId, 'maxsat_vis_cluster')
    // }
    // getFile.subscribe(
    //   data => {
    //     console.log(data)
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
    //       setTimeout(() => { this.loadVis(); }, 1000);
    //     } else {
    //       this.info = null;
    //
    //       this.fileData = data;
    //
    //       this.nodesC = this.fileData['content']['data']['clusteredNetwork']['nodes'];
    //       this.edgesC = this.fileData['content']['data']['clusteredNetwork']['edges'];
    //       this.nodesW = this.fileData['content']['data']['wholeNetwork']['nodes'];
    //       this.edgesW = this.fileData['content']['data']['wholeNetwork']['edges'];
    //
    //       this.nodesC.forEach(node => {
    //         if (node.font && node.font.size < 1) {
    //           node.font.size = 1;
    //         }
    //       });
    //
    //       this.nodesW.forEach(node => {
    //         if (node.font && node.font.size < 1) {
    //           node.font.size = 1;
    //         }
    //       });
    //
    //       let containerMain = document.getElementById('visualization');
    //
    //       let _dataC = {
    //         nodes: new DataSet(this.nodesC),
    //         edges: new DataSet(this.edgesC)
    //       };
    //
    //       this._networkOptions = {
    //         "edges": {
    //           "smooth": false
    //         },
    //         "interaction":
    //         {
    //           "selectConnectedEdges": false
    //         },
    //         "physics": {
    //           "enabled": false
    //         }
    //       };
    //
    //       this.zoomOnSelectedCluster = (selectNodeEvent) => {
    //         if (this.zoomedNetwork != null) {
    //           this.zoomedNetwork.destroy();
    //         }
    //
    //         let clusterId = selectNodeEvent.nodes[0];
    //         let containerZoom = document.getElementById('zoom');
    //
    //         let nodes = this.nodesW.filter(node => node.cluster == clusterId);
    //         let edges = this.edgesW.filter(edge => {
    //           let node1cluster = this.nodesW.find(node => node.id == edge.from).cluster;
    //           let node2cluster = this.nodesW.find(node => node.id == edge.to).cluster;
    //
    //           if (node1cluster == node2cluster && node1cluster == clusterId)
    //             return true;
    //           else
    //             return false;
    //         })
    //
    //         let data = {
    //           nodes: new DataSet(nodes),
    //           edges: new DataSet(edges)
    //         };
    //
    //         this.zoomedNetwork = new Network(containerZoom, data, this._networkOptions);
    //       };
    //
    //       this.zoomOnSelectedEdge = (selectEdgeEvent) => {
    //
    //         if (this.zoomedNetwork != null) {
    //           this.zoomedNetwork.destroy();
    //         }
    //
    //         let selectedEdge = this.edgesC.find(edge => edge.id === selectEdgeEvent.edges[0]);
    //
    //         let cluster1Id = selectedEdge.from;
    //         let cluster2Id = selectedEdge.to;
    //         let containerZoom = document.getElementById('zoom');
    //
    //         let edgesBetweenClusters = this.edgesW.filter(edge => {
    //           let node1cluster = this.nodesW.find(node => node.id == edge.from).cluster;
    //           let node2cluster = this.nodesW.find(node => node.id == edge.to).cluster;
    //
    //           if ((node1cluster == cluster1Id && node2cluster == cluster2Id)
    //             || (node1cluster == cluster2Id && node2cluster == cluster1Id)) {
    //             return true;
    //           }
    //           else {
    //             return false;
    //           }
    //         });
    //
    //         let nodes = this.nodesW.filter(node => {
    //           return edgesBetweenClusters.some(edge => {
    //             return edge.from == node.id || edge.to == node.id;
    //           });
    //         });
    //
    //         let edges = this.edgesW.filter(edge => {
    //           return this.nodesW.some(node => node.id == edge.from || node.id == edge.to);
    //         })
    //
    //         let data = {
    //           nodes: new DataSet(nodes),
    //           edges: new DataSet(edges)
    //         };
    //
    //         this.zoomedNetwork = new Network(containerZoom, data, this._networkOptions);
    //       }
    //
    //       this.clusteredNetwork = new Network(containerMain, _dataC, this._networkOptions);
    //       this.clusteredNetwork.on("selectNode", this.zoomOnSelectedCluster);
    //       this.clusteredNetwork.on("selectEdge", this.zoomOnSelectedEdge);
    //       this.network = this.clusteredNetwork;
    //
    //       this.loading = false;
    //     }
    //   }
    // )
  }
}
