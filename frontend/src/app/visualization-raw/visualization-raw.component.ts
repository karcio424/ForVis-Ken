import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { FileService } from "../_services/file.service";

import { File } from "../_models/file";
import { AlertService } from "../_services/alert.service";
import {JsonfileService} from '../_services';

@Component({
  selector: 'app-visualization-raw',
  templateUrl: './visualization-raw.component.html',
  styleUrls: ['./visualization-raw.component.css']
})
export class VisualizationRawComponent implements OnInit {
  fileId: number;
  fileName: string;
  file: File = new File();
  info: string;
  kind: string;

  file_content: string;

  constructor(
    private route: ActivatedRoute,
    private fileService: FileService,
    private alertService: AlertService,
    private jsonfileService: JsonfileService
  ) { }

  ngOnInit() {
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
          this.file_content = data.content.raw;
          console.log(this.file_content);
      }
    )

    // var getFile
    // if (this.kind == 'sat'){
    //   getFile = this.fileService.getSatFile(this.fileId, 'raw')
    // }
    // else{
    //   getFile = this.fileService.getMaxSatFile(this.fileId, 'raw')
    // }
    // getFile.subscribe(
    //   data => {
    //     if (data['content']['data']['message']) {
    //       this.info = data['content']['data']['message'];
    //
    //       setTimeout(() => {
    //           this.loadVis();
    //         },
    //         1000
    //       );
    //     } else {
    //       this.info = null;
    //       this.file_content = data['content']['data']['raw'];
    //     }
    //   });
  };
}

