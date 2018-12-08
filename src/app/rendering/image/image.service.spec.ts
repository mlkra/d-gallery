import { TestBed } from '@angular/core/testing';

import { ImageService } from './image.service';
import { TextureService } from '../texture/texture.service';
import { of } from 'rxjs';
import { vec3 } from 'gl-matrix';
import { Texture } from '../model/texture';
import { Image as MyImage } from '../model/image';

describe('ImageService', () => {
  let textureServiceMock; 
  let glMock;
  let glBuffer;
  let cubePlacementStrategyMock;
  let texture;
  
  beforeEach(() => {
    textureServiceMock = jasmine.createSpyObj(
      'TextureService',
      ['getTextures', 'getTexture']
    );
    texture = new Texture('path', new Image());
    textureServiceMock.getTextures.and.returnValue(
      of(texture, texture, texture)
    );
    textureServiceMock.getTexture.and.returnValue(
      of(texture)
    );
    glMock = jasmine.createSpyObj(
      'WebGLRenderingContext',
      ['createBuffer', 'bindBuffer', 'bufferData']
    );
    glMock.ARRAY_BUFFER = 1;
    glBuffer = {};
    glMock.createBuffer.and.returnValue(glBuffer);
    cubePlacementStrategyMock = jasmine.createSpyObj(
      'CubePlacementStrategy',
      ['getPosition']
    );
    cubePlacementStrategyMock.getPosition.and.returnValue(
      vec3.fromValues(1, 1, 1)
    );
  });

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: TextureService, useValue: textureServiceMock }
      ]
    });
  });

  it('should be created', () => {
    const service: ImageService = TestBed.get(ImageService);
    expect(service).toBeTruthy();
  });

  it('should perform init', () => {
    const service: ImageService = TestBed.get(ImageService);
    service.init(glMock);
    expect(glMock.createBuffer).toHaveBeenCalled();
    expect(glMock.bindBuffer).toHaveBeenCalledWith(
      glMock.ARRAY_BUFFER, glBuffer
    );
    expect(glMock.bufferData).toHaveBeenCalled();
  });

  it('should return images', () => {
    const service: ImageService = TestBed.get(ImageService);
    const ret = service.getImages(glMock, cubePlacementStrategyMock, 3);
    ret.subscribe((img) => {
      expect(img.position).toEqual(vec3.fromValues(1, 1, 1));
      expect(img.texture).toBe(texture);
    });
  });

  it('should return image', () => {
    const service: ImageService = TestBed.get(ImageService);
    const img = new MyImage(
      glBuffer, 
      texture, 
      vec3.fromValues(1, 1, 1), 
      vec3.fromValues(1, 1, 1)
    );
    const ret = service.getImage(glMock, img);
    ret.subscribe((img2) => {
      expect(img === img2).toBeFalsy();
    });
  });
});
