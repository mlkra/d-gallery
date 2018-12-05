import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CanvasComponent } from './canvas.component';
import { ControlsModule } from 'src/app/controls/controls.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { DownloadPopupComponent } from '../download-popup/download-popup.component';
import { ImageService } from '../image/image.service';
import { StorageService } from 'src/app/storage/storage.service';
import { ControlsService } from 'src/app/controls/controls.service';
import { RenderingService } from '../rendering.service';

describe('CanvasComponent', () => {
  let component: CanvasComponent;
  let fixture: ComponentFixture<CanvasComponent>;

  const imageServiceSpy = jasmine.createSpyObj('ImageService', ['init', 'getImages']);
  const storageServiceSpy = jasmine.createSpyObj('StorageService', ['init']);
  const controlsServiceSpy = jasmine.createSpyObj('ControlsService', ['']);
  const renderingServiceSpy = jasmine.createSpyObj('RenderingService', ['init']);

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        SharedModule,
        ControlsModule
      ],
      declarations: [ CanvasComponent, DownloadPopupComponent ],
      providers: [
        { provide: ImageService, useValue: imageServiceSpy },
        { provide: StorageService, useValue: storageServiceSpy },
        { provide: ControlsService, useValue: controlsServiceSpy },
        { provide: RenderingService, useValue: renderingServiceSpy }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    // fixture = TestBed.createComponent(CanvasComponent);
    // component = fixture.componentInstance;
    // fixture.detectChanges();
  });

  it('should create', () => {
    // expect(component).toBeTruthy();
  });
});
