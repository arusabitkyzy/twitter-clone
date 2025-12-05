import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app/app.routes';
import {provideHttpClient} from '@angular/common/http';
import {getAuth, provideAuth} from '@angular/fire/auth';
import {provideFirebaseApp} from '@angular/fire/app';
import firebaseConfig from './firebase'
import {initializeApp} from '@angular/fire/app';
import {getFirestore, provideFirestore} from '@angular/fire/firestore';

const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(),
    provideFirebaseApp(() => initializeApp(firebaseConfig)),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
  ]
};

export default appConfig;
