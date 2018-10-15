import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AngularFireDatabase } from "@angular/fire/database";
import * as _ from 'lodash';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {
  private items: Observable<{}[]>;
  
  constructor(private db: AngularFireDatabase) {
    // TODO insert appropriate path
    this.items = db.list('').valueChanges();
  }

  getTexPaths(count: number) {
    const source = new Observable((observer) => {
      this.items.subscribe((items) => {
        const paths = _.sampleSize(items, count);
        observer.next(paths);
      });
    });
    return source;
  }
}