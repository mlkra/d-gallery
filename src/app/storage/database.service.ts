import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { pluck, map, take, tap, mergeMap } from 'rxjs/operators';
import { AngularFireDatabase } from '@angular/fire/database';
import * as _ from 'lodash';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {
  private items: Observable<{}[]>;

  constructor(private db: AngularFireDatabase) {
    this.items = db.list('root/images').valueChanges();
  }

  getTexPaths(count: number) {
    return this.items.pipe(
      map((items) => {
        return _.sampleSize(items, count);
      }),
      take(1)
    );
  }

  addPath(number: number) {
    const path = 'img' + (number + 1).toString().padStart(4, '0') + '.jpg';
    const node = {};
    node[number] = path;
    return this.db.object('root/images/' + number).set(path);
  }

  getNextNumber() {
    return this.items.pipe(
      pluck('length'),
      take(1)
    );
  }
}
