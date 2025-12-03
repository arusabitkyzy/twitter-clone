import {ApplicationConfig, inject, provideBrowserGlobalErrorListeners, provideZoneChangeDetection} from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app/app.routes';
import {provideHttpClient} from '@angular/common/http';
import {getAuth, provideAuth} from '@angular/fire/auth';
import {provideFirebaseApp} from '@angular/fire/app';
import firebaseConfig from './firebase'
import {initializeApp} from '@angular/fire/app';
import {getFirestore, provideFirestore} from '@angular/fire/firestore';
import {FirebaseService} from './services/firebase-service/firebase-service';

const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(),
    provideFirebaseApp(() => inject(FirebaseService).app),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
  ]
};

export default appConfig;
