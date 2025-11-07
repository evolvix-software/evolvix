/**
 * Firebase Configuration and Initialization
 */

import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { 
  getAuth, 
  Auth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut as firebaseSignOut,
  User as FirebaseUser,
  onAuthStateChanged,
  sendPasswordResetEmail,
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider,
  sendEmailVerification,
  updateProfile,
} from 'firebase/auth';

// Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || '',
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || '',
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || '',
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || '',
};

// Initialize Firebase only on client side
let app: FirebaseApp | null = null;
let authInstance: Auth | null = null;

function initializeFirebaseApp(): FirebaseApp {
  if (typeof window === 'undefined') {
    // Server-side: throw error if accessed
    throw new Error('Firebase can only be initialized on the client side');
  }
  
  if (!app) {
    if (getApps().length === 0) {
      // Validate config before initializing
      if (!firebaseConfig.apiKey || !firebaseConfig.projectId) {
        throw new Error('Firebase configuration is missing. Please check your environment variables.');
      }
      app = initializeApp(firebaseConfig);
    } else {
      app = getApps()[0];
    }
  }
  return app;
}

function initializeAuth(): Auth {
  if (typeof window === 'undefined') {
    throw new Error('Firebase Auth can only be used on the client side');
  }
  
  if (!authInstance) {
    authInstance = getAuth(initializeFirebaseApp());
  }
  return authInstance;
}

// Export auth getter - lazy initialization with SSR safety
export const auth: Auth = new Proxy({} as Auth, {
  get(_target, prop) {
    // During SSR/build, return a no-op or throw
    if (typeof window === 'undefined') {
      // Return a no-op for properties that might be accessed during SSR
      if (prop === 'currentUser') {
        return null;
      }
      // For methods, return a function that throws
      if (typeof prop === 'string') {
        return () => {
          throw new Error('Firebase Auth can only be used on the client side');
        };
      }
      return undefined;
    }
    
    // Client-side: initialize and return the actual auth instance
    const authInstance = initializeAuth();
    const value = authInstance[prop as keyof Auth];
    if (typeof value === 'function') {
      return value.bind(authInstance);
    }
    return value;
  }
});

// Google Auth Provider - lazy initialization
let googleProviderInstance: GoogleAuthProvider | null = null;

export const getGoogleProvider = (): GoogleAuthProvider => {
  if (typeof window === 'undefined') {
    throw new Error('Google Auth Provider can only be used on the client side');
  }
  
  if (!googleProviderInstance) {
    googleProviderInstance = new GoogleAuthProvider();
    googleProviderInstance.setCustomParameters({
      prompt: 'select_account',
    });
  }
  return googleProviderInstance;
};

/**
 * Get current Firebase user
 */
export const getCurrentUser = (): FirebaseUser | null => {
  return auth.currentUser;
};

/**
 * Get Firebase ID token
 */
export const getIdToken = async (forceRefresh = false): Promise<string | null> => {
  const user = auth.currentUser;
  if (!user) return null;
  
  try {
    return await user.getIdToken(forceRefresh);
  } catch (error) {
    console.error('Error getting ID token:', error);
    return null;
  }
};

/**
 * Sign up with email and password
 */
export const signUp = async (email: string, password: string, displayName?: string) => {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  
  if (displayName && userCredential.user) {
    await updateProfile(userCredential.user, { displayName });
  }
  
  // Send email verification
  if (userCredential.user) {
    await sendEmailVerification(userCredential.user);
  }
  
  return userCredential;
};

/**
 * Sign in with email and password
 */
export const signIn = async (email: string, password: string) => {
  return await signInWithEmailAndPassword(auth, email, password);
};

/**
 * Sign in with Google
 */
export const signInWithGoogle = async () => {
  return await signInWithPopup(initializeAuth(), getGoogleProvider());
};

/**
 * Sign out
 */
export const signOut = async () => {
  return await firebaseSignOut(auth);
};

/**
 * Send password reset email
 */
export const resetPassword = async (email: string) => {
  return await sendPasswordResetEmail(auth, email);
};

/**
 * Update password
 */
export const changePassword = async (newPassword: string) => {
  const user = auth.currentUser;
  if (!user) throw new Error('No user is currently signed in');
  
  return await updatePassword(user, newPassword);
};

/**
 * Reauthenticate user (for password change)
 */
export const reauthenticate = async (email: string, password: string) => {
  const user = auth.currentUser;
  if (!user) throw new Error('No user is currently signed in');
  
  const credential = EmailAuthProvider.credential(email, password);
  return await reauthenticateWithCredential(user, credential);
};

/**
 * Auth state observer
 */
export const onAuthStateChange = (callback: (user: FirebaseUser | null) => void) => {
  return onAuthStateChanged(auth, callback);
};

export default function getFirebaseApp(): FirebaseApp | null {
  if (typeof window === 'undefined') {
    return null;
  }
  return initializeFirebaseApp();
}

