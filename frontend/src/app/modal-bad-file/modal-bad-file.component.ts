import { Component, OnInit } from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-modal-bad-file',
  templateUrl: './modal-bad-file.component.html',
  styleUrls: ['./modal-bad-file.component.css']
})
export class ModalBadFileComponent implements OnInit {

  constructor(public activeModal: NgbActiveModal) { }

  ngOnInit() {
  }

}
