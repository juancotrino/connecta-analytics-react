'use client';

import type { User } from '@/types/user';
import axios from 'axios';

import { initializeApp, FirebaseApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, Auth } from 'firebase/auth';
import { getFirestore, doc, getDoc, setDoc, Firestore } from 'firebase/firestore';
import { cleanCache } from './businessService';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

const firebaseApp: FirebaseApp = initializeApp(firebaseConfig);
const API_URL = process.env.NEXT_PUBLIC_API_URL;
export const auth: Auth = getAuth(firebaseApp);
export const db: Firestore = getFirestore(firebaseApp);

export default firebaseApp;

export interface SignUpParams {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  roles: string[];
}

export interface SignInWithOAuthParams {
  provider: 'google' | 'discord';
}

export interface SignInWithPasswordParams {
  email: string;
  password: string;
}

export interface ResetPasswordParams {
  email: string;
}

class AuthClient {
  async signUp(params: SignUpParams): Promise<{ error?: string }> {
    const { firstName, lastName, email, password, roles } = params;
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Set user data in Firestore
      await setDoc(doc(db, 'users', user.uid), { email }); //TODO:firstName, lastName, roles -> add?

      return {};
    } catch (error) {
      return { error: (error as Error).message };
    }
  }

  async signInWithOAuth(_: SignInWithOAuthParams): Promise<{ error?: string }> {
    return { error: 'Social authentication not implemented' };
  }

  async signInWithPassword(params: SignInWithPasswordParams): Promise<{ error?: string }> {
    const { email, password } = params;
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      // Get the ID token for the authenticated user
      const firebaseToken = await user.getIdToken();
      // Get the custom authentication token from the API
      const tokenResponse = await this.getAuthToken(firebaseToken);
      if (tokenResponse.error) {
        return { error: tokenResponse.error };
      }
      // On success return an empty object
      return {};
    } catch (error) {
      // Handle Firebase Auth errors
      let errorMessage = 'An unknown error occurred';
      if (error instanceof Error) {
        switch ((error as any).code) {
          case 'auth/user-not-found':
            errorMessage = 'No user found with this email';
            break;
          case 'auth/wrong-password':
            errorMessage = 'Incorrect password';
            break;
          case 'auth/invalid-email':
            errorMessage = 'Invalid email format';
            break;
          case 'auth/user-disabled':
            errorMessage = 'User account is disabled';
            break;
          default:
            errorMessage = error.message;
        }
      }
      return { error: errorMessage };
    }
  }

  async getAuthToken(firebaseToken: string): Promise<{ error?: string }> {
    try {
      const response = await axios.get(
        `${API_URL}auth/get_custom_token`,
        {
          headers: {
            Authorization: `Bearer ${firebaseToken}`,
            contentType: 'application/json',
          }
        },
      );

      if (!response.data) {
        return { error: 'Failed to retrieve authentication token' };
      }
      // Store the token in local storage
      const token = response.data;
      localStorage.setItem('authToken', token);
      // On success return an empty object
      return {};
    } catch (error) {
      let errorMessage = 'Failed to retrieve authentication token';
      if (axios.isAxiosError(error)) {
        errorMessage = error.response?.data?.message ||
          'Error communicating with authentication server';
      }
      // Return the error message
      return { error: errorMessage };
    }
  }

  async resetPassword(_: ResetPasswordParams): Promise<{ error?: string }> {
    return { error: 'Password reset not implemented' };
  }

  async updatePassword(_: ResetPasswordParams): Promise<{ error?: string }> {
    return { error: 'Update reset not implemented' };
  }

  async getUser(): Promise<{ data?: User | null; error?: string }> {
    // Make API request
    // Use the currentUser property from Firebase Auth to get the authenticated user
    const currentUser = auth.currentUser;

    if (!currentUser) {
      return { data: null };
    }

    // Optionally, you can fetch additional user data from Firestore if needed
    try {
      // Fetch the user document from Firestore using the user's uid
      const userDocRef = doc(db, 'users', currentUser.uid);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        // Extract user data from Firestore, including roles
        const userData = userDoc.data();

        // Return the user data along with roles
        return {
          data: {
            uid: currentUser.uid,
            avatar: userData.avatar || '/assets/avatar.png',
            name: currentUser.displayName || '',
            email: currentUser.email || '',
            roles: Array.isArray(userData.roles) ? userData.roles : [],
          } satisfies User,
        };
      } else {
        // User document not found in Firestore
        return { data: null, error: 'User document not found' };
      }
    } catch (error) {
      return {
        error: `An error occurred while fetching user: ${(error as Error).message}`
      };
    }
  }

  async signOut(): Promise<{ error?: string }> {
    try {
      // First clean the cache and remove the token
      cleanCache();
      localStorage.removeItem('authToken');

      // Then sign out from Firebase
      await auth.signOut();
      return {};
    } catch (error) {
      return { error: (error as Error).message };
    }
  }
}

export const authClient = new AuthClient();
