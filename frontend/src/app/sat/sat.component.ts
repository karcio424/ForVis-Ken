import { Component, OnInit } from '@angular/core';
import { FileUploader } from 'ng2-file-upload';

import { AuthService } from "../_services/auth.service";
import { FileService } from "../_services/file.service";
import { AlertService } from "../_services/alert.service";
import { VisMenuService } from "../_services/vis-menu.service";

import { File } from "../_models/file";
import {ModalProgressComponent} from '../modal-progress/modal-progress.component';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {ModalBadFileComponent} from '../modal-bad-file/modal-bad-file.component';

@Component({
  selector: 'app-sat',
  templateUrl: './sat.component.html',
  styleUrls: ['./sat.component.css']
})
export class SatComponent implements OnInit {
  public uploader:FileUploader = new FileUploader({});

  files: Array<File> = [];

  constructor(
    private alertService: AlertService,
    private authService: AuthService,
    private fileService: FileService,
    private visMenuService: VisMenuService,
    private modalService: NgbModal
  ) { }

  ngOnInit() {
    this.updateList();

    this.uploader.authToken = this.authService.getAuthTokenString();
    this.uploader.onBeforeUploadItem = (item) => {
      item.method = 'PUT';
      item.url = '/api/profile/upload/sat/' + item.file.name + '/';
    };

    this.uploader.onSuccessItem = (item:any, response:any, status:any, headers:any) => {
      this.updateList();

      setTimeout(() => {
         this.updateList();
         },
         8000
     );
      this.uploader.clearQueue();
    };
    this.uploader.onErrorItem = (item, response, status, headers) => {
      const modalRef = this.modalService.open(ModalBadFileComponent, {
        centered: true,
      });
      this.uploader.clearQueue();
    };
  }

  updateList(){
    this.fileService.getSatFilesList().subscribe(
      data => this.files = data,
      error => this.alertService.error(error)
    )
  }

  deleteFile(file: File){
    this.fileService.deleteSatFile(file.id).subscribe(
      data => this.updateList(),
      error => this.alertService.error(error)
    )
  }

  openVisMenu(file: File){
    this.visMenuService.open(file, 'sat');
  }

}
