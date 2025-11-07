import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZonelessChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { routes } from './app.routes';

export const firebaseConfig = {
  apiKey: "AIzaSyD97S1Gm8DjdBrc_mrmknk0KXvdrqSO42M",
  authDomain: "myangulartraining-dc6c0.firebaseapp.com",
  projectId: "myangulartraining-dc6c0",
  storageBucket: "myangulartraining-dc6c0.firebasestorage.app",
  messagingSenderId: "477692915798",
  appId: "1:477692915798:web:d849c442648b9600ac4bf7"
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(routes),
    provideAnimations(),
    provideFirebaseApp(() => initializeApp(firebaseConfig)),
    provideFirestore(() => getFirestore()),
    provideAuth(() => getAuth())
  ]
};
