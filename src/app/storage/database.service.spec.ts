import { TestBed } from '@angular/core/testing';

import { DatabaseService } from './database.service';
import { AngularFireDatabase } from '@angular/fire/database';
import { of } from 'rxjs';

describe('DatabaseService', () => {
  let spy: any = {
    valueChanges: function () {
      return;
    }
  };
  let dbMock;

  beforeEach(() => {
    spyOn(spy, 'valueChanges');
    spy.valueChanges.and.returnValue(
      of([1, 1, 1, 1, 1, 1, 1, 1])
    );
    dbMock = {
      list: function () {
        return spy;
      }
    };

    TestBed.configureTestingModule({
      providers: [
        { provide: AngularFireDatabase, useValue: dbMock }
      ]
    });
  });

  it('should be created', () => {
    const service: DatabaseService = TestBed.get(DatabaseService);
    expect(service).toBeTruthy();
  });

  it('should return array with two elements', () => {
    const service: DatabaseService = TestBed.get(DatabaseService);
    expect(dbMock.list().valueChanges).toHaveBeenCalled();
    service.getTexPaths(2).subscribe((paths) => {
      expect(paths.length).toEqual(2);
    })
  });
});
