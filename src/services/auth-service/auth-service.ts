import {inject, Injectable, signal, Injector} from '@angular/core';
import {
  Auth,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from '@angular/fire/auth';
import {from, Observable} from 'rxjs';
import {doc, Firestore, getDoc, serverTimestamp, setDoc} from '@angular/fire/firestore';
import {UserProfile} from '../../models/User';
import {runAsyncInInjectionContext} from '../../helper/injection-context';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private auth = inject(Auth);
  private firestore = inject(Firestore);
  private injector = inject(Injector);

  user = signal<UserProfile | null>(null);

  constructor() {
    this.initializeAuth();
  }

  private initializeAuth() {
    // ✅ Use runAsyncInInjectionContext for async Firebase operations
    onAuthStateChanged(this.auth, (authUser) => {
      runAsyncInInjectionContext(this.injector, async () => {
        try {
          if (!authUser) {
            this.user.set(null);
            return;
          }

          const userProfile = await this.getUserInfo(authUser.uid);
          this.user.set(userProfile);
        } catch (error) {
          console.error('Error in auth state change:', error);
          this.user.set(null);
        }
      });
    });
  }

  async getUserInfo(uid: string): Promise<UserProfile | null> {
    return runAsyncInInjectionContext(this.injector, async () => {
      try {
        const userDocRef = doc(this.firestore, `users/${uid}`);
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
          return userDocSnap.data() as UserProfile;
        }
        return null;
      } catch (error) {
        console.error('Error fetching user info:', error);
        return null;
      }
    });
  }

  async login(email: string, password: string) {
    return runAsyncInInjectionContext(this.injector, async () => {
      return signInWithEmailAndPassword(this.auth, email, password);
    });
  }

  async logout() {
    return runAsyncInInjectionContext(this.injector, async () => {
      return signOut(this.auth);
    });
  }

  register(email: string, password: string, name: string, birthday: Date): Observable<void> {
    const promise = runAsyncInInjectionContext(this.injector, async () => {
      const userCredential = await createUserWithEmailAndPassword(
        this.auth,
        email,
        password
      );

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
}
