import { Component, OnInit, Input, Output, EventEmitter, AfterViewInit } from '@angular/core';
import { ImageService } from '../image/image.service';

declare var $: any;

export enum ModalState {
  VISIBLE,
  HIDDEN
}

@Component({
  selector: 'app-download-popup',
  templateUrl: './download-popup.component.html',
  styleUrls: ['./download-popup.component.css']
})
export class DownloadPopupComponent implements OnInit, AfterViewInit {
  @Input() set src(src: string) {
    if (this._src !== src) {
      this.showSpinner = true
      this._src = src;
    }
  }

  get src() {
    return this._src;
  }

  @Input() 
  set show(show: boolean) {
    this._show = show;
    this.__show(show);
  }
  
  get show() {
    return this._show;
  }
  
  @Output('toggled')
  toggledEmitter: EventEmitter<ModalState> = new EventEmitter<ModalState>();

  showSpinner: boolean;

  private _src: string;
  private _show: boolean;

  constructor(private imageService: ImageService) { }

  ngOnInit() {
  }

  ngAfterViewInit() {
    $('#app-modal').on('shown.bs.modal', () => {
      this.toggledEmitter.next(ModalState.VISIBLE);
    });
    $('#app-modal').on('hidden.bs.modal', () => {
      this.toggledEmitter.next(ModalState.HIDDEN);
    });
  }
  
  download() {
    this.imageService.downloadImage(this.src, 'texture.jpg').subscribe((ret) => {
      if (ret) {
        $('#app-modal').modal('hide');
      }
    });
  }

  imgLoaded() {
    this.showSpinner = false;
  }

  private __show(show: boolean) {
    if (show) {
      $('#app-modal').modal('show');
    } else {
      $('#app-modal').modal('hide');
    }
  }
}
