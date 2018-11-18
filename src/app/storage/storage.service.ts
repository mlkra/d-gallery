import { Injectable } from '@angular/core';
import { DatabaseService } from './database.service';
import { AngularFireStorage } from '@angular/fire/storage';
import { Observable, fromEvent, of } from 'rxjs';
import { Texture } from '../rendering/model/texture';
import { map, concatMap, tap, mergeMap, switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor(
    private dbService: DatabaseService,
    private storage: AngularFireStorage
  ) { }

  getTextures(count: number) {
    return this.dbService.getTexPaths(count).pipe(
      mergeMap((paths) => {
        const pathsArray = Object.keys(paths).map((i) => {
          return paths[i];
        });
        return new Observable<any>((observer) => {
          pathsArray.forEach((path) => {
            path = 'thumb/' + path;
            observer.next(path);
          });
          observer.complete();
        });
      }),
      mergeMap((path) => {
        return this.storage.ref(path).getDownloadURL().pipe(
          map((url) => {
            return {
              url: url,
              path: path
            };
          })
        );
      }),
      mergeMap((value) => {
        const img = new Image();
        img.crossOrigin = '';
        const tex = new Texture(value.path, img);
        console.log(tex);
        return new Observable<Texture>((observer) => {
          img.addEventListener('load', () => {
            observer.next(tex);
            observer.complete();
          })
          img.src = value.url;
        });
      })
    );
  }

  getImageURL(texture: Texture) {
    const path = 'img/' + texture.path.substr(6);
    return this.storage.ref(path).getDownloadURL();
  }

  getTexture(texture: Texture) {
    const path = 'img/' + texture.path.substr(6);
    return this.storage.ref(path).getDownloadURL().pipe(
      map((url) => {
        return {
          url: url,
          path: path
        };
      }),
      switchMap((value) => {
        const img = new Image();
        img.crossOrigin = '';
        const tex = new Texture(value.path, img);
        console.log(tex);
        return new Observable<Texture>((observer) => {
          img.addEventListener('load', () => {
            observer.next(tex);
            observer.complete();
          })
          img.src = value.url;
        });
      })
    );
  }

  // TODO add cropping, resizing
  uploadImage(file: File) {
    return this.dbService.getNextNumber().pipe(
      map((value: number) => {
        const imgName = 'img' + (value + 1).toString().padStart(4, '0') + '.jpg';
        return imgName;
      }),
      concatMap((value) => {
        return this.storage.upload('uploadTest/' + value, file);
      }),
      concatMap((value) => {
        const number = parseInt(value.metadata.name.substr(3, 4));
        return this.dbService.addPath(number - 1);
      })
    );
  }
}
