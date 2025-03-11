'use client';

import type { User } from '@/types/user';

import { initializeApp, FirebaseApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, Auth } from 'firebase/auth';
import { getFirestore, collection, doc, getDoc, setDoc, Firestore } from 'firebase/firestore';
// import { getStorage, FirebaseStorage } from 'firebase/storage';


const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

const firebaseApp: FirebaseApp = initializeApp(firebaseConfig);
export const auth: Auth = getAuth(firebaseApp);
export const db: Firestore = getFirestore(firebaseApp);
// export const storage: FirebaseStorage = getStorage(firebaseApp);

export default firebaseApp;
/*
function generateToken(): string {
  const arr = new Uint8Array(12);
  window.crypto.getRandomValues(arr);
  return Array.from(arr, (v) => v.toString(16).padStart(2, '0')).join('');
}

const user = {
  id: 'USR-000',
  avatar: '/assets/avatar.png',
  firstName: 'Sofia',
  lastName: 'Rivers',
  email: 'sofia@devias.io',
} satisfies User;
*/
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
    // Make API request
    const { firstName, lastName, email, password , roles} = params;
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Optionally set additional user data in Firestore
      await setDoc(doc(db, 'users', user.uid), { email });

      const token = await user.getIdToken();
      localStorage.setItem('custom-auth-token', token);

      return {};
    } catch (error) {
      return { error: (error as Error).message };
    }

    // // We do not handle the API, so we'll just generate a token and store it in localStorage.
    // const token = generateToken();
    // localStorage.setItem('custom-auth-token', token);

    // return {};
  }

  async signInWithOAuth(_: SignInWithOAuthParams): Promise<{ error?: string }> {
    return { error: 'Social authentication not implemented' };
  }

  async signInWithPassword(params: SignInWithPasswordParams): Promise<{ error?: string }> {
    const { email, password } = params;

    // Make API request
    try {
      // Use Firebase's signInWithEmailAndPassword method
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      // console.log('user', user)

      // Get the user's token and save it in local storage
      const token = await user.getIdToken();
      localStorage.setItem('custom-auth-token', token);

      // Optionally, you can store additional user data in local storage if needed
      localStorage.setItem('user-uid', user.uid);
      localStorage.setItem('user-displayName', user.displayName || '');
      localStorage.setItem('user-email', user.email || '');

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
        const roles = userData?.roles || []; // Default to an empty array if roles are not defined

        // Return the user data along with roles
        return {
          data: {
            uid: currentUser.uid,
            avatar: userData.avatar || '/assets/avatar.png',
            firstName: userData.firstName || '',
            lastName: userData.lastName || '',
            email: currentUser.email || '',
            roles: roles,
          } satisfies User,
        };
      } else {
        // User document not found in Firestore
        return { data: null, error: 'User document not found' };
      }
    } catch (error) {
      return { error: `An error occurred while fetching user: ${(error as Error).message}` };
    }
  }

  async signOut(): Promise<{ error?: string }> {
    await auth.signOut(); // Ensure this line is awaited
    localStorage.removeItem('custom-auth-token');
    localStorage.removeItem('user-uid');
    localStorage.removeItem('user-displayName');
    localStorage.removeItem('user-email');

    return {};
  }
}

export const authClient = new AuthClient();
