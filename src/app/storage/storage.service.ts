import { Injectable } from '@angular/core';
import { DatabaseService } from './database.service';
import { AngularFireStorage } from '@angular/fire/storage';
import { Observable, fromEvent } from 'rxjs';
import { Texture } from '../rendering/model/texture';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor(
    private dbService: DatabaseService,
    private storage: AngularFireStorage
  ) { }

  getTextures(count: number) {
    const source = new Observable<Texture>((observer) => {
      this.dbService.getTexPaths(count).subscribe((paths) => {
        const pathsArray = Object.keys(paths).map((i) => {
          return paths[i];
        });
        const imgToTexMap = new Map;
        pathsArray.forEach((path) => {
          path = 'thumb/' + path;
          this.storage.ref(path).getDownloadURL().subscribe((url) => {
            const img = new Image();
            img.crossOrigin = '';
            const observable = fromEvent(img, 'load');
            const tex = new Texture(path, img);
            imgToTexMap.set(img, tex);
            observable.subscribe((event) => {
              const tex2 = imgToTexMap.get(event.currentTarget);
              observer.next(tex2);
            });
            img.src = url;
          });
        });
      }, () => {}, () => {
        // TODO check and fix if necessary
        observer.complete();
      });
    });
    return source;
  }

  getTexture(texture: Texture) {
    const source = new Observable<Texture>((observer) => {
      const path = 'img/' + texture.path.substr(6);
      this.storage.ref(path).getDownloadURL().subscribe((url) => {
        const img = new Image();
        img.crossOrigin = '';
        const observable = fromEvent(img, 'load');
        const tex = new Texture(path, img);
        // TODO delete unused parameter?
        observable.subscribe((event) => {
          observer.next(tex);
          observer.complete();
          console.log('done!');
        });
        img.src = url;
        console.log('pf');
      });
    });
    return source;
  }
}
