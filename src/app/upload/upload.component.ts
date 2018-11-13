import { Component, OnInit, AfterViewInit } from '@angular/core';
import { StorageService } from '../storage/storage.service';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css']
})
export class UploadComponent implements OnInit, AfterViewInit {
  currentFile: String;
  showSpinner: boolean;
  uploadResult: string;

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
    this.storageService.uploadImage(file).subscribe(() => {
      this.showSpinner = false;
      this.uploadResult = 'Success!';
    }, () => {
      this.showSpinner = false;
      this.uploadResult = 'Error!';
    });
  }
}
