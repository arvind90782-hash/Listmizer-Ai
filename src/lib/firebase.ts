import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged, User } from 'firebase/auth';
import { getFirestore, collection, addDoc, query, where, getDocs, doc, getDoc, setDoc, getDocFromServer } from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const googleProvider = new GoogleAuthProvider();

// Connection test as per guidelines
async function testConnection() {
  try {
    // Attempt to fetch a non-existent doc from server to test connectivity
    await getDocFromServer(doc(db, '_connection_test_', 'ping'));
    console.log("Firebase connection test successful.");
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.error("Firebase Configuration Error: The client is offline. Please check your firebase-applet-config.json and network connection.");
    }
    // We don't throw here to avoid crashing the app on initial load, 
    // but we log the error for diagnostics.
  }
}
testConnection();

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
  const safeError = error instanceof Error ? error.message : String(error);
  console.error(`Firestore ${operationType} error at ${path}: ${safeError}`);
  throw new Error(safeError);
}

export const signInWithGoogle = async () => {
  try {
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
    throw error;
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

export { onAuthStateChanged };
export type { User };
