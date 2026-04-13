import {
  collection,
  doc,
  setDoc,
  getDoc,
  addDoc,
  getDocs,
  updateDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from './firebaseConfig';

// ════════════════════════════════════════════════════════════════
// USER PROFILES
// ════════════════════════════════════════════════════════════════

export const saveUserData = async (userId, data) => {
  try {
    await setDoc(doc(db, 'users', userId), {
      name: data.name || "",
      email: data.email || "",
      subscription: data.subscription || "free",
      credits: data.credits ?? 10,
      targetRole: data.targetRole || "",
      targetCountry: data.targetCountry || "",
      createdAt: serverTimestamp()
    });
    return { success: true, error: null };
  } catch (error) {
    console.error('Error saving user data:', error);
    return { success: false, error: error.message };
  }
};

export const getUserData = async (userId) => {
  try {
    const docRef = doc(db, 'users', userId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { data: docSnap.data(), error: null };
    }
    return { data: null, error: 'No data found' };
  } catch (error) {
    console.error('Error fetching user data:', error);
    return { data: null, error: error.message };
  }
};

export const updateUserData = async (userId, updates) => {
  try {
    const docRef = doc(db, 'users', userId);
    await updateDoc(docRef, {
      ...updates,
      updatedAt: serverTimestamp(),
    });
    return { success: true, error: null };
  } catch (error) {
    console.error('Error updating user data:', error);
    return { success: false, error: error.message };
  }
};

// ════════════════════════════════════════════════════════════════
// WAITLIST
// ════════════════════════════════════════════════════════════════

export const saveWaitlistEmail = async (email) => {
  try {
    await addDoc(collection(db, 'waitlist'), {
      email,
      createdAt: serverTimestamp(),
    });
    return { success: true, error: null };
  } catch (error) {
    console.error('Error saving waitlist email:', error);
    return { success: false, error: error.message };
  }
};

// ════════════════════════════════════════════════════════════════
// CV OPTIMIZATIONS
// ════════════════════════════════════════════════════════════════

export const saveCVOptimization = async (userId, data) => {
  try {
    const docRef = await addDoc(collection(db, 'cvOptimizations'), {
      ...data,
      userId,
      createdAt: serverTimestamp()
    });
    return { success: true, id: docRef.id, error: null };
  } catch (error) {
    console.error('Error saving CV optimization:', error);
    return { success: false, error: error.message };
  }
};

export const getUserCVOptimizations = async (userId) => {
  try {
    const q = query(
      collection(db, 'cvOptimizations'),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    const results = [];
    querySnapshot.forEach((doc) => {
      results.push({ id: doc.id, ...doc.data() });
    });
    return { data: results, error: null };
  } catch (error) {
    console.error('Error getting CV optimizations:', error);
    return { data: [], error: error.message };
  }
};

// ════════════════════════════════════════════════════════════════
// LINKEDIN OPTIMIZATIONS
// ════════════════════════════════════════════════════════════════

export const saveLinkedinOptimization = async (userId, data) => {
  try {
    const docRef = await addDoc(collection(db, 'linkedinOptimizations'), {
      ...data,
      userId,
      createdAt: serverTimestamp()
    });
    return { success: true, id: docRef.id, error: null };
  } catch (error) {
    console.error('Error saving LinkedIn optimization:', error);
    return { success: false, error: error.message };
  }
};

export const getUserLinkedinOptimizations = async (userId) => {
  try {
    const q = query(
      collection(db, 'linkedinOptimizations'),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    const results = [];
    querySnapshot.forEach((doc) => {
      results.push({ id: doc.id, ...doc.data() });
    });
    return { data: results, error: null };
  } catch (error) {
    console.error('Error getting LinkedIn optimizations:', error);
    return { data: [], error: error.message };
  }
};

// ════════════════════════════════════════════════════════════════
// SKILL ANALYSES
// ════════════════════════════════════════════════════════════════

export const saveSkillAnalysis = async (userId, data) => {
  try {
    const docRef = await addDoc(collection(db, 'skillAnalyses'), {
      ...data,
      userId,
      createdAt: serverTimestamp()
    });
    return { success: true, id: docRef.id, error: null };
  } catch (error) {
    console.error('Error saving skill analysis:', error);
    return { success: false, error: error.message };
  }
};

export const getUserSkillAnalyses = async (userId) => {
  try {
    const q = query(
      collection(db, 'skillAnalyses'),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    const results = [];
    querySnapshot.forEach((doc) => {
      results.push({ id: doc.id, ...doc.data() });
    });
    return { data: results, error: null };
  } catch (error) {
    console.error('Error getting skill analyses:', error);
    return { data: [], error: error.message };
  }
};

// ════════════════════════════════════════════════════════════════
// COURSE FEEDBACK
// ════════════════════════════════════════════════════════════════

export const saveCourseFeedback = async ({ userId, suggestedCourse, feedbackReason }) => {
  try {
    const docRef = await addDoc(collection(db, 'course_feedback'), {
      userId: userId || null,
      suggestedCourse,
      feedbackReason,
      createdAt: serverTimestamp(),
    });
    return { success: true, id: docRef.id, error: null };
  } catch (error) {
    console.error('Error saving course feedback:', error);
    return { success: false, error: error.message };
  }
};
