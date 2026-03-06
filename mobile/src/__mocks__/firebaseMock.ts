// Mock Firebase para testes Jest
const mockUserCredential = {
  user: {
    uid: 'mock-uid-123',
    email: 'test@test.com',
    displayName: 'Test User',
    updateProfile: jest.fn(() => Promise.resolve()),
  },
};

export const initializeApp = jest.fn(() => ({}));
export const getApps = jest.fn(() => []);
export const getApp = jest.fn(() => ({}));

export const mockAuth = {
  currentUser: null,
  onAuthStateChanged: jest.fn((_cb: any) => jest.fn()),
};

export const auth = mockAuth;
export const db = {};

export const getAuth = jest.fn(() => mockAuth);
export const getFirestore = jest.fn(() => db);

export const signInWithEmailAndPassword = jest.fn(() => Promise.resolve(mockUserCredential));
export const createUserWithEmailAndPassword = jest.fn(() => Promise.resolve(mockUserCredential));
export const signOut = jest.fn(() => Promise.resolve());
export const onAuthStateChanged = jest.fn((_auth: any, cb: any) => { cb(null); return jest.fn(); });
export const updateProfile = jest.fn(() => Promise.resolve());

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
export const Timestamp = { now: jest.fn(() => ({ toDate: () => new Date() })) };
