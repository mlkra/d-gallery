import { Component, OnInit, AfterViewInit } from '@angular/core';
import { StorageService } from '../storage/storage.service';
import { fromEvent } from 'rxjs';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css']
})
export class UploadComponent implements OnInit, AfterViewInit {
  currentFile: String;
  showSpinner: boolean;
  uploadResult: string;
  imgSrc: String;

  private fileInput: HTMLInputElement;

  constructor(private storageService: StorageService) { }

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.fileInput = document.querySelector('#app-file-input');
  }

  onFileChange($event) {
    this.uploadResult = null;
    const file = $event.target.files[0];
    if (file) {
      this.currentFile = file.name;
    }
  }

  uploadFile() {
    const file = this.fileInput.files[0];
    // TODO handle errors
    this.showSpinner = true;
    this.uploadResult = null;
    this.storageService.uploadImage(file).subscribe((obj) => {
      console.log(obj);
      const fileReader = new FileReader();
      const obs = fromEvent(fileReader, 'load');
      obs.subscribe((ev) => {
        this.imgSrc = ev.target['result'];
      });
      fileReader.readAsDataURL(obj.blob);
      this.showSpinner = false;
      this.uploadResult = 'Success!';
    }, (err) => {
      this.showSpinner = false;
      console.log(err);
      this.uploadResult = 'Error!';
    });
  }
}
