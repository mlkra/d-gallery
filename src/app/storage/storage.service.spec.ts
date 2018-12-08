import { TestBed } from '@angular/core/testing';

import { StorageService } from './storage.service';
import { DatabaseService } from './database.service';
import { AngularFireStorage } from '@angular/fire/storage';
import { of } from 'rxjs';
import { Texture } from '../rendering/model/texture';

describe('StorageService', () => {
  let dbServiceMock;
  let storageMock;
  let spy;
  
  beforeEach(() => {
    dbServiceMock = jasmine.createSpyObj(
      'DatabaseService',
      [
        'getTexPaths',
        'getNextNumber',
        'addPath'
      ]
    );
    dbServiceMock.getTexPaths.and.returnValue(
      of({
        0: 'path',
        1: 'path'
      })
    );
    storageMock = jasmine.createSpyObj(
      'AngularFireStorage',
      [
        'upload'
      ]
    );
    spy = {
      getDownloadURL: function () {

      }
    };
    storageMock.ref = function () {
      return spy;
    }
    spyOn(spy, 'getDownloadURL');
    spy.getDownloadURL.and.returnValue(
      of('dummyURL')
    );

    TestBed.configureTestingModule({
      providers: [
        { provide: DatabaseService, useValue: dbServiceMock },
        { provide: AngularFireStorage, useValue: storageMock }
      ]
    });
  });

  it('should be created', () => {
    const service: StorageService = TestBed.get(StorageService);
    expect(service).toBeTruthy();
  });

  it('should return textures', () => {
    const service: StorageService = TestBed.get(StorageService);
    service.getTextures(2).subscribe((tex) => {
      expect(tex.path).toEqual('path');
    });
  });

  it('should return URL', () => {
    const service: StorageService = TestBed.get(StorageService);
    service.getImageURL(new Texture('path', new Image())).subscribe((url) => {
      expect(url).toEqual('dummyURL');
    });
  });
});
