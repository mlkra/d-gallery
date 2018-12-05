import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DownloadPopupComponent } from './download-popup.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { ImageService } from '../image/image.service';
import { Observable } from 'rxjs';

describe('DownloadPopupComponent', () => {
  let component: DownloadPopupComponent;
  let fixture: ComponentFixture<DownloadPopupComponent>;

  const imageServiceSpy = jasmine.createSpyObj('ImageService', ['downloadImage']);
  imageServiceSpy.downloadImage.and.returnValue(new Observable());

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        SharedModule
      ],
      declarations: [ DownloadPopupComponent ],
      providers: [
        { provide: ImageService, useValue: imageServiceSpy }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DownloadPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('downloadImage should be called', () => {
    component.download();
    expect(imageServiceSpy.downloadImage).toHaveBeenCalled();
  });

  it('showSpinner should be false', () => {
    component.imgLoaded();
    expect(component.showSpinner).toBeFalsy();
  })
});
