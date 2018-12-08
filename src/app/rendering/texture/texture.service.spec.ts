import { TestBed } from '@angular/core/testing';

import { TextureService } from './texture.service';
import { StorageService } from 'src/app/storage/storage.service';
import { Texture } from '../model/texture';
import { of } from 'rxjs';

describe('TextureService', () => {
  let storageServiceMock;
  let glMock;
  const texture = new Texture('test', new Image());

  beforeEach(() => {
    storageServiceMock = jasmine.createSpyObj(
      'StorageService',
      ['getTextures', 'getTexture']
    );
    storageServiceMock.getTextures.and.returnValue(
      of(texture, texture)
    );
    storageServiceMock.getTexture.and.returnValue(
      of(texture)
    );

    glMock = jasmine.createSpyObj(
      'WebGLRenderingContext',
      [
        'createBuffer',
        'bindBuffer',
        'bufferData',
        'createTexture',
        'activeTexture',
        'bindTexture',
        'texImage2D',
        'generateMipmap'
      ]
    );

    TestBed.configureTestingModule({
      providers: [
        { provide: StorageService, useValue: storageServiceMock }
      ]
    });
  });

  it('should be created', () => {
    const service: TextureService = TestBed.get(TextureService);
    expect(service).toBeTruthy();
  });

  it('should return two textures', () => {
    const service: TextureService = TestBed.get(TextureService);
    service.getTextures(glMock, 2).subscribe((tex) => {
      expect(tex).toBe(texture);
    })
  });

  it('should return texture', () => {
    const service: TextureService = TestBed.get(TextureService);
    let tex = new Texture('test2', new Image());
    service.getTexture(glMock, tex).subscribe((tex) => {
      expect(tex).toBe(texture);
      expect(glMock.createTexture).toHaveBeenCalled();
    })
  });
});
