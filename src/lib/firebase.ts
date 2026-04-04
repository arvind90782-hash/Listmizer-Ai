import { initializeApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  deleteUser,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  User,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateEmail,
  updateProfile,
} from 'firebase/auth';
import { getFirestore, doc, getDoc, setDoc, deleteDoc } from 'firebase/firestore';

type FirebaseRuntimeConfig = {
  apiKey: string;
  authDomain: string;
  projectId: string;
  appId: string;
  storageBucket?: string;
  messagingSenderId?: string;
  measurementId?: string;
  firestoreDatabaseId?: string;
};

type FirebaseAuthError = {
  code?: string;
  message?: string;
};

const envFirebaseConfig: FirebaseRuntimeConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || '',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || '',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || '',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || '',
  firestoreDatabaseId:
    import.meta.env.VITE_FIREBASE_FIRESTORE_DATABASE_ID &&
    import.meta.env.VITE_FIREBASE_FIRESTORE_DATABASE_ID !== '(default)'
      ? import.meta.env.VITE_FIREBASE_FIRESTORE_DATABASE_ID
      : '',
};

const hasEnvFirebaseConfig = Boolean(
  envFirebaseConfig.apiKey &&
    envFirebaseConfig.authDomain &&
    envFirebaseConfig.projectId &&
    envFirebaseConfig.appId
);

const fallbackFirebaseConfig: FirebaseRuntimeConfig = {
  apiKey: 'missing-api-key',
  authDomain: 'missing.firebaseapp.com',
  projectId: 'missing-project-id',
  appId: '1:000000000000:web:missing',
  storageBucket: 'missing.firebasestorage.app',
  messagingSenderId: '000000000000',
  measurementId: '',
  firestoreDatabaseId: '',
};

if (!hasEnvFirebaseConfig) {
  console.error(
    'Firebase config is incomplete. Set VITE_FIREBASE_API_KEY, VITE_FIREBASE_AUTH_DOMAIN, VITE_FIREBASE_PROJECT_ID, and VITE_FIREBASE_APP_ID in your .env.local and restart the dev server.'
  );
}

const resolvedFirebaseConfig = hasEnvFirebaseConfig ? envFirebaseConfig : fallbackFirebaseConfig;

if (!resolvedFirebaseConfig.apiKey || resolvedFirebaseConfig.apiKey.length < 20) {
  console.error(
    'Firebase API key is missing/invalid. Set VITE_FIREBASE_API_KEY and related VITE_FIREBASE_* values in your .env.local.'
  );
}

const app = initializeApp(resolvedFirebaseConfig);
export const auth = getAuth(app);
export const db = resolvedFirebaseConfig.firestoreDatabaseId
  ? getFirestore(app, resolvedFirebaseConfig.firestoreDatabaseId)
  : getFirestore(app);
export const googleProvider = new GoogleAuthProvider();

const AUTH_CONFIG_HELP =
  'Check Firebase Console > Project settings > Your apps > Web app and verify the VITE_FIREBASE_* values in .env.local, then restart the dev server.';

function ensureFirebaseAuthConfig() {
  if (!hasEnvFirebaseConfig || !resolvedFirebaseConfig.apiKey) {
    throw new Error(`Firebase auth is not configured. ${AUTH_CONFIG_HELP}`);
  }
}

function getFirebaseAuthErrorMessage(error: unknown) {
  const firebaseError = error as FirebaseAuthError;

  switch (firebaseError?.code) {
    case 'auth/api-key-not-valid.-please-pass-a-valid-api-key.':
    case 'auth/invalid-api-key':
      return `Firebase API key is invalid. ${AUTH_CONFIG_HELP}`;
    case 'auth/configuration-not-found':
      return 'Firebase Authentication is not fully configured for this project. Enable the sign-in provider in Firebase Console > Authentication.';
    case 'auth/operation-not-allowed':
      return 'This sign-in method is disabled. Enable Email/Password or Google in Firebase Console > Authentication > Sign-in method.';
    case 'auth/unauthorized-domain':
      return 'This domain is not authorized for Firebase Authentication. Add your app domain in Firebase Console > Authentication > Settings > Authorized domains.';
    case 'auth/requires-recent-login':
      return 'For security reasons, please log in again before updating email or deleting your account.';
    case 'auth/email-already-in-use':
      return 'This email is already linked to another account.';
    case 'auth/invalid-email':
      return 'Please enter a valid email address.';
    case 'auth/popup-blocked':
      return 'Google sign-in popup was blocked by the browser. Allow popups and try again.';
    case 'auth/popup-closed-by-user':
      return 'Google sign-in was closed before completion. Please try again.';
    default:
      return firebaseError?.message || 'Authentication failed. Please try again.';
  }
}

const ADMIN_EMAILS = ['arvind90782@gmail.com', 'armanxiom@gmail.com'];

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId: string | undefined;
    email: string | null | undefined;
    emailVerified: boolean | undefined;
    isAnonymous: boolean | undefined;
    tenantId: string | null | undefined;
    providerInfo: {
      providerId: string;
      displayName: string | null;
      email: string | null;
      photoUrl: string | null;
    }[];
  }
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData.map(provider => ({
        providerId: provider.providerId,
        displayName: provider.displayName,
        email: provider.email,
        photoUrl: provider.photoURL
      })) || []
    },
    operationType,
    path
  }
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

function syncUserDocument(uid: string, data: Record<string, unknown>) {
  setDoc(doc(db, 'users', uid), data, { merge: true }).catch((error) => {
    console.error('Background Firestore sync failed', error);
  });
}

export const signInWithGoogle = async () => {
  try {
    ensureFirebaseAuthConfig();
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;
    
    // Check if user exists in Firestore, if not create
    const userRef = doc(db, 'users', user.uid);
    let userSnap;
    try {
      userSnap = await getDoc(userRef);
    } catch (error) {
      handleFirestoreError(error, OperationType.GET, `users/${user.uid}`);
      return user; // Should not reach here if handleFirestoreError throws
    }
    
    const role = ADMIN_EMAILS.includes(user.email || '') ? 'admin' : 'user';

    if (!userSnap.exists()) {
      try {
        await setDoc(userRef, {
          uid: user.uid,
          displayName: user.displayName,
          email: user.email,
          photoURL: user.photoURL,
          createdAt: new Date().toISOString(),
          role: role
        });
      } catch (error) {
        handleFirestoreError(error, OperationType.WRITE, `users/${user.uid}`);
      }
    } else {
      // Update role if it's an admin email but role is still 'user'
      if (role === 'admin' && userSnap.data().role !== 'admin') {
        try {
          await setDoc(userRef, { role: 'admin' }, { merge: true });
        } catch (error) {
          handleFirestoreError(error, OperationType.UPDATE, `users/${user.uid}`);
        }
      }
    }
    
    return user;
  } catch (error) {
    console.error("Error signing in with Google", error);
    throw new Error(getFirebaseAuthErrorMessage(error));
  }
};

export const signInWithEmail = async (email: string, password: string) => {
  try {
    ensureFirebaseAuthConfig();
    const result = await signInWithEmailAndPassword(auth, email, password);
    return result.user;
  } catch (error) {
    throw new Error(getFirebaseAuthErrorMessage(error));
  }
};

export const signUpWithEmail = async (email: string, password: string, displayName?: string) => {
  try {
    ensureFirebaseAuthConfig();
    const result = await createUserWithEmailAndPassword(auth, email, password);
    const trimmedName = displayName?.trim();

    if (trimmedName) {
      await updateProfile(result.user, { displayName: trimmedName });
      syncUserDocument(result.user.uid, {
        uid: result.user.uid,
        displayName: trimmedName,
        email: result.user.email,
        photoURL: result.user.photoURL,
        createdAt: new Date().toISOString(),
        role: ADMIN_EMAILS.includes(result.user.email || '') ? 'admin' : 'user',
      });
    }
    return result.user;
  } catch (error) {
    throw new Error(getFirebaseAuthErrorMessage(error));
  }
};

export const getUserData = async (uid: string) => {
  const userRef = doc(db, 'users', uid);
  try {
    const userSnap = await getDoc(userRef);
    return userSnap.exists() ? userSnap.data() : null;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, `users/${uid}`);
  }
};

export const logout = () => signOut(auth);

export const updateAccountName = async (displayName: string) => {
  const user = auth.currentUser;
  if (!user) {
    throw new Error('You need to be logged in to update your profile.');
  }

  const trimmedName = displayName.trim();
  if (!trimmedName) {
    throw new Error('Please enter a valid name.');
  }

  try {
    await updateProfile(user, { displayName: trimmedName });
    syncUserDocument(user.uid, {
      displayName: trimmedName,
      email: user.email,
      photoURL: user.photoURL,
    });
  } catch (error) {
    throw new Error(getFirebaseAuthErrorMessage(error));
  }
};

export const updateAccountEmail = async (nextEmail: string) => {
  const user = auth.currentUser;
  if (!user) {
    throw new Error('You need to be logged in to update your email.');
  }

  const trimmedEmail = nextEmail.trim();
  if (!trimmedEmail) {
    throw new Error('Please enter a valid email address.');
  }

  try {
    await updateEmail(user, trimmedEmail);
    syncUserDocument(user.uid, {
      email: trimmedEmail,
    });
  } catch (error) {
    throw new Error(getFirebaseAuthErrorMessage(error));
  }
};

export const deleteAccount = async () => {
  const user = auth.currentUser;
  if (!user) {
    throw new Error('You need to be logged in to delete your account.');
  }

  const userId = user.uid;

  try {
    await deleteDoc(doc(db, 'users', userId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `users/${userId}`);
  }

  try {
    await deleteUser(user);
  } catch (error) {
    throw new Error(getFirebaseAuthErrorMessage(error));
  }
};

export { onAuthStateChanged };
export type { User };
