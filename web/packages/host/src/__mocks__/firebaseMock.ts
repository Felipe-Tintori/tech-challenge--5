// Mock para firebase/app, firebase/auth, firebase/firestore e config/firebase

const mockUserCredential = {
  user: {
    uid: 'mock-uid-123',
    email: 'test@test.com',
    displayName: 'Test User',
    updateProfile: jest.fn(() => Promise.resolve()),
  },
};

// --- firebase/app ---
export const initializeApp = jest.fn(() => ({}));

// --- firebase/auth ---
export const mockAuth = {
  currentUser: null,
  onAuthStateChanged: jest.fn((_callback: (user: null) => void) => jest.fn()),
  signInWithEmailAndPassword: jest.fn(),
  signOut: jest.fn(),
  createUserWithEmailAndPassword: jest.fn(),
};

export const getAuth = jest.fn(() => mockAuth);
export const signInWithEmailAndPassword = jest.fn(() => Promise.resolve(mockUserCredential));
export const signOut = jest.fn(() => Promise.resolve());
export const createUserWithEmailAndPassword = jest.fn(() => Promise.resolve(mockUserCredential));
export const onAuthStateChanged = jest.fn((_auth: any, callback: (user: null) => void) => {
  callback(null);
  return jest.fn();
});
export const updateProfile = jest.fn(() => Promise.resolve());

// --- firebase/firestore ---
export const mockDb = {};
export const getFirestore = jest.fn(() => mockDb);
export const doc = jest.fn();
export const getDoc = jest.fn(() => Promise.resolve({ exists: () => false, data: () => ({}) }));
export const setDoc = jest.fn(() => Promise.resolve());
export const collection = jest.fn();
export const getDocs = jest.fn(() => Promise.resolve({ docs: [] }));
export const addDoc = jest.fn(() => Promise.resolve({ id: 'mock-id' }));
export const updateDoc = jest.fn(() => Promise.resolve());
export const deleteDoc = jest.fn(() => Promise.resolve());
export const query = jest.fn();
export const where = jest.fn();
export const orderBy = jest.fn();
export const limit = jest.fn();
export const Timestamp = { now: jest.fn(() => ({ toDate: () => new Date() })) };

// --- config/firebase (funcoes exportadas pelo modulo interno) ---
export const initializeFirebase = jest.fn(() => ({}));
export const getFirebaseAuth = jest.fn(() => mockAuth);
export const getFirestoreDb = jest.fn(() => mockDb);
