import { Injectable } from '@angular/core';
import {initializeApp} from 'firebase/app';
import firebaseConfig from '../../firebase';
import {Firestore, getFirestore} from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root',
})
export class FirebaseService {
  private _app = initializeApp(firebaseConfig);

  get app() {
    return this._app
  }

  private _db = getFirestore(this._app)

  get db() {
    return this._db
  };

}
