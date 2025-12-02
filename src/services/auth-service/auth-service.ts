import {inject, Injectable} from '@angular/core';
import {
  Auth,
  browserSessionPersistence,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  user,
  User,
} from '@angular/fire/auth';
import { setPersistence } from 'firebase/auth';
import {BehaviorSubject, from, map, Observable, of, shareReplay, switchMap, tap} from 'rxjs';
import {doc, Firestore, getDoc, serverTimestamp, setDoc} from '@angular/fire/firestore';
import {UserProfile} from '../../models/User';
import {Router} from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private userSubject = new BehaviorSubject<UserProfile | null>(this.loadUserFromStorage());

  user$: Observable<User | null>;
  router = inject(Router);

  constructor(private firebaseAuth: Auth, private firestore: Firestore) {
    this.user$ = user(this.firebaseAuth);

    this.setSessionStoragePersistence();

    this.user$
      .pipe(
        tap(user => console.log('Auth state changed:', user?.uid)),
        switchMap(user => user ? this.getUserProfile(user.uid) : of(null)),
        tap(profile => {
          console.log('Profile loaded:', profile?.name);

          // Update cache + BehaviorSubject
          if (profile) {
            localStorage.setItem('user', JSON.stringify(profile));
          } else {
            localStorage.removeItem('user');
          }

          this.userSubject.next(profile);
        })
      )
      .subscribe(); // 👈 MUST subscribe so the stream runs
  }

  private setSessionStoragePersistence(): void {
    setPersistence(this.firebaseAuth, browserSessionPersistence);
  }

  getUser(): UserProfile | null {
    return this.userSubject.value;
  }

  getUserProfile(uid: string): Observable<UserProfile | null> {
    const userDocRef = doc(this.firestore, `users/${uid}`);
    return from(getDoc(userDocRef)).pipe(
      map(docSnap => docSnap.exists() ? docSnap.data() as UserProfile : null)
    );
  }

  private loadUserFromStorage(): UserProfile | null {
    const userJson = localStorage.getItem('user');

    if (!userJson) return null;         // null or missing key
    if (userJson === 'undefined') return null; // invalid string

    try {
      return JSON.parse(userJson);
    } catch (e) {
      console.warn('Failed to parse user from storage:', userJson);
      return null;
    }
  }


  isLoggedIn(): Observable<boolean> {
    return this.user$.pipe(map(user => !!user));
  }

  register(email: string, password: string, name: string, birthday: Date): Observable<void> {
    const promise = createUserWithEmailAndPassword(
      this.firebaseAuth,
      email,
      password
    ).then(async userCredential => {
      const uid = userCredential.user.uid;

      const profile: Partial<UserProfile> = {
        uid,
        email,
        name,
        birthday,
        createdAt: serverTimestamp()
      };

      await setDoc(doc(this.firestore, `users/${uid}`), profile);
      console.log('User created in Auth and Firestore');
    });

    return from(promise);
  }

  login(email: string, password: string): Observable<void> {
    return from(
      signInWithEmailAndPassword(this.firebaseAuth, email, password).then(() =>
        console.log('Login successful')
      )
    );
  }

  logout(): Observable<void> {
    return from(
      signOut(this.firebaseAuth).then(() => {
        localStorage.removeItem('user');
        this.userSubject.next(null);
        this.router.navigate(['/auth/login']);
      })
    );
  }
}
