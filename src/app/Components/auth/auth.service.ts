import { computed, inject, Injectable } from "@angular/core";
import { Auth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from "@angular/fire/auth";
import { AuthData } from "./auth-data.model";
import { User } from "./user.model";
import { Router } from "@angular/router";
import { doc, Firestore, setDoc, getDoc } from '@angular/fire/firestore';
import { Store } from "@ngrx/store";
import * as fromRoot from '../../app.reducer';
import * as UI from '../../shared/ui.actions';
// import * as fromAuth from './auth.reducers';
import * as AuthActions from './auth.actions';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly router = inject(Router);
  private readonly auth = inject(Auth);
  private readonly firestore = inject(Firestore);
  private readonly store = inject(Store<fromRoot.State>);
  private readonly userSignal = this.store.selectSignal(fromRoot.getUser);
  private readonly authStatusSignal = this.store.selectSignal(fromRoot.getIsAuthenticated);

  readonly isLoggedIn = computed(() => this.authStatusSignal());

  login(authData: AuthData) {
    this.store.dispatch(new UI.StartLoading());
    signInWithEmailAndPassword(this.auth, authData.email, authData.password)
      .then(async result => {

        // Fetch user profile from Firestore
        const userDocRef = doc(this.firestore, "users", result.user.uid);
        const userDocSnap = await getDoc(userDocRef);

        const authedUser = this.buildUserFromAuth(result.user.uid, result.user.email, result.user.displayName, userDocSnap.exists() ? userDocSnap.data() : null);
        this.handleAuthSuccess(authedUser);
      })
      .catch(error => this.handleAuthFailure('Login', error));
  }

  logout() {
    // Navigate first, then clear state to avoid flashing UI
    this.router.navigate(['/']).then(() => {
      signOut(this.auth)
        .then(() => {
          console.log('✅ Firebase logout successful');
          this.store.dispatch(new AuthActions.SetUnauthenticated());
        })
        .catch(error => {
          console.error('❌ Logout error:', error);
          this.store.dispatch(new AuthActions.SetUnauthenticated());
        });
    });
  }

  getUser() {
    const currentUser = this.userSignal();
    return currentUser ? { ...currentUser } : null;
  }

  async registerUser(userData: Omit<User, 'id'> & { password: string }) {
    this.store.dispatch(new UI.StartLoading());
    try {
      // Step 1: Register user with Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(this.auth, userData.email, userData.password);
      const firebaseUser = userCredential.user;

      const uid = firebaseUser.uid; // The unique ID from Firebase Authentication!

      // Step 2: Create user document in Cloud Firestore
      const userProfileData = {
        email: userData.email,
        name: userData.name,
        birthdate: userData.birthday, // Use server timestamp for consistency
        // Add any other initial user profile data here
      };

      // Set the document ID to be the same as the user's UID
      await setDoc(doc(this.firestore, "users", uid), userProfileData);

      const newUser = this.buildUserFromAuth(uid, userData.email, userData.name, userProfileData);
      this.handleAuthSuccess(newUser);
      console.log("Successfully registered user and created profile for UID:", uid);
    } catch (error) {
      this.handleAuthFailure('Registration', error);
    }
  }

  private buildUserFromAuth(uid: string, email: string | null, displayName: string | null, firestoreData: Record<string, unknown> | null): User {
    const nameFromProfile = firestoreData?.['name'] ?? displayName ?? '';
    const birthdate = firestoreData?.['birthdate'];

    let birthdayDate = new Date();
    if (birthdate) {
      // Firestore Timestamp has toDate method, fallback handles strings/dates
      if (typeof birthdate === 'object' && 'toDate' in birthdate && typeof birthdate['toDate'] === 'function') {
        birthdayDate = birthdate['toDate']();
      } else {
        birthdayDate = new Date(birthdate as string | number | Date);
      }
    }

    return {
      id: uid,
      email: email ?? '',
      name: String(nameFromProfile ?? ''),
      birthday: birthdayDate
    };
  }

  private handleAuthSuccess(user: User) {
    this.store.dispatch(new UI.StopLoading());
    this.store.dispatch(new AuthActions.SetAuthenticated({ user }));
    this.router.navigate(['/training']);
  }

  private handleAuthFailure(context: string, error: unknown) {
    this.store.dispatch(new UI.StopLoading());
    this.store.dispatch(new AuthActions.SetUnauthenticated());
    const msg = this.extractMessage(error);
    this.showErrorSnackbar(`${context} failed: ${msg}`);
    console.error(`❌ ${context} exception:`, msg);
  }

  isAuthenticated() {
    return this.isLoggedIn();
  }

  private showErrorSnackbar(message: string) {
    this.store.dispatch(new UI.ShowSnackbar({
      message,
      action: 'Close',
      duration: 5000
    }));
  }

  private extractMessage(error: unknown) {
    return error instanceof Error ? error.message : String(error ?? 'Unknown error');
  }
}
