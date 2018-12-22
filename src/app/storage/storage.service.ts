import { Injectable } from '@angular/core';
import { DatabaseService } from './database.service';
import { AngularFireStorage } from '@angular/fire/storage';
import { Observable } from 'rxjs';
import { Texture } from '../rendering/model/texture';
import { map, concatMap, mergeMap, switchMap } from 'rxjs/operators';

declare var Caman: any;

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
          });
          img.src = value.url;
        });
      })
    );
  }

  uploadImage(file: File) {
    return this.dbService.getNextNumber().pipe(
      map((value: number) => {
        const imgName = 'img' + (value + 1).toString().padStart(4, '0') + '.jpg';
        return imgName;
      }),
      concatMap((value) => {
        return new Observable<{}>((observer) => {
          const img = new Image();
          img.addEventListener('load', () => {
            const div = document.createElement('div');
            const canvas = document.createElement('canvas');
            div.appendChild(canvas);
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0);
            observer.next({
              value: value,
              div: div,
              canvas: canvas
            });
            observer.complete();
          });
          img.src = URL.createObjectURL(file);
        });
      }),
      concatMap((obj) => {
        return new Observable<{}>((observer) => {
          Caman(obj['canvas'], function () {
            if (obj['canvas'].width > obj['canvas'].height) {
              this.resize({
                height: 1024
              });
            } else {
              this.resize({
                width: 1024
              });
            }
            this.crop(1024, 1024);
            this.render();
            obj['canvas'] = obj['div'].querySelector('canvas');
            observer.next(obj),
            observer.complete();
          });
        })
      }),
      concatMap((obj) => {
        return new Observable<{}>((observer) => {
          obj['canvas'].toBlob((blob) => {
            obj['blob'] = blob;
            observer.next(obj);
            observer.complete();
          }, 'image/jpeg');
        });
      }),
      concatMap((obj) => {
        return new Observable<{}>((observer) => {
          Caman(obj['canvas'], function() {
            this.resize({
              width: 256
            });
            this.render();
            obj['canvas'] = obj['div'].querySelector('canvas');
            observer.next(obj),
            observer.complete();
          });
        });
      }),
      concatMap((obj) => {
        return new Observable<{}>((observer) => {
          obj['canvas'].toBlob((blob) => {
            obj['blob2'] = blob
            observer.next(obj);
            observer.complete();
          }, 'image/jpeg');
        })
      }),
      concatMap((obj) => {
        return new Observable<any>((observer) => {
          obj['path'] = 'thumb/' + obj['value'];
          this.storage.upload('thumb/' + obj['value'], obj['blob2']).then(() => {
            this.storage.upload('img/' + obj['value'], obj['blob']).
              then((ret) => {
                obj['task'] = ret;
                observer.next(obj);
                observer.complete();
            });
          });
        });
      }),
      concatMap((obj) => {
        const number = parseInt(obj['task'].metadata.name.substr(3, 4));
        return new Observable<any>((observer) => {
          this.dbService.addPath(number - 1).then(() => {
            observer.next(obj);
            observer.complete();
          });
        });
      })
    );
  }
}
