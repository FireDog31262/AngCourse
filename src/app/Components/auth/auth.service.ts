import { inject, Injectable, signal } from "@angular/core";
import { Auth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, authState } from "@angular/fire/auth";
import { AuthData } from "./auth-data.model";
import { User } from "./user.model";
import { Subject } from "rxjs";
import { Router } from "@angular/router";
import { doc, Firestore, setDoc, getDoc } from '@angular/fire/firestore';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private user = signal<User | null>(null);
  loggedIn = new Subject<boolean>();

  router = inject(Router);
  private auth = inject(Auth);
  private firestore = inject(Firestore);

  login(authData: AuthData) {
    try {
      signInWithEmailAndPassword(this.auth, authData.email, authData.password)
        .then(async result => {

          // Fetch user profile from Firestore
          const userDocRef = doc(this.firestore, "users", result.user.uid);
          const userDocSnap = await getDoc(userDocRef);

          if (userDocSnap.exists()) {
            const userData = userDocSnap.data();

            // Convert Firestore Timestamp to Date
            let birthdayDate = new Date();
            if (userData['birthdate']) {
              // Check if it's a Firestore Timestamp object
              if (userData['birthdate'].toDate) {
                birthdayDate = userData['birthdate'].toDate();
              } else {
                // Fallback for other date formats
                birthdayDate = new Date(userData['birthdate']);
              }
            }

            this.user.set({
              id: result.user.uid,
              email: result.user.email || '',
              name: userData['name'] || '',
              birthday: birthdayDate
            });
          } else {
            // Fallback if no Firestore document exists
            this.user.set({
              id: result.user.uid,
              email: result.user.email || '',
              name: result.user.displayName || '',
              birthday: new Date()
            });
          }

          this.loggedIn.next(true);
          this.router.navigate(['/training']);
        })
        .catch(error => {
            alert(`Login failed: ${error.message}`);
          });
    } catch (error: any) {
      console.error('❌ Login exception:', error);
      alert('Login failed. Please check your connection and try again.');
    }
  }

  logout() {
    signOut(this.auth)
      .then(() => {
        console.log('✅ Firebase logout successful');
        this.user.set(null);
        this.loggedIn.next(false);
        this.router.navigate(['/']);
      })
      .catch(error => {
        console.error('❌ Logout error:', error);
        // If Firebase logout fails (not configured), just clear local state
        this.user.set(null);
        this.loggedIn.next(false);
        this.router.navigate(['/']);
      });
  }

  getUser() {
    return { ...this.user() };
  }

  async registerUser(userData: User & { password: string }) {
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

      console.log("Successfully registered user and created profile for UID:", uid);
      // You can now navigate the user to your main app screen
      this.router.navigate(['/login']);
    } catch (error: any) {
      console.error("Error during user registration or profile creation:", error.message);
      // Handle specific errors (e.g., auth/email-already-in-use, auth/weak-password)
      // You might want to display a user-friendly error message
    }
  }

  isAuthenticated() {
    const authenticated = this.user() !== null;
    return authenticated;
  }
}
