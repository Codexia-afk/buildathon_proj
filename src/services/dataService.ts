import { 
  collection, 
  onSnapshot, 
  addDoc, 
  doc, 
  updateDoc, 
  query, 
  orderBy, 
  getDocs,
  setDoc,
  getDoc
} from 'firebase/firestore';
import { db, isFirebaseConfigured } from './firebase';
import { AssessmentResult, AthleteProfile } from '../types';
import { SEED_ASSESSMENTS, SEED_ATHLETES } from '../data/seedAthletes';

const LOCAL_STORAGE_KEY_ASSESSMENTS = 'talentlens_assessments_v1';
const LOCAL_STORAGE_KEY_ATHLETES = 'talentlens_athletes_v1';
const BROADCAST_CHANNEL_NAME = 'talentlens_realtime_sync';

// Local multi-tab real-time event bus
let broadcastChannel: BroadcastChannel | null = null;
if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
  try {
    broadcastChannel = new BroadcastChannel(BROADCAST_CHANNEL_NAME);
  } catch {
    console.warn('BroadcastChannel not supported in this environment');
  }
}

// In-memory fallback state
function getLocalAssessments(): AssessmentResult[] {
  if (typeof window === 'undefined') return [...SEED_ASSESSMENTS];
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY_ASSESSMENTS);
    if (!raw) {
      localStorage.setItem(LOCAL_STORAGE_KEY_ASSESSMENTS, JSON.stringify(SEED_ASSESSMENTS));
      return [...SEED_ASSESSMENTS];
    }
    return JSON.parse(raw);
  } catch {
    return [...SEED_ASSESSMENTS];
  }
}

function saveLocalAssessments(data: AssessmentResult[]) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY_ASSESSMENTS, JSON.stringify(data));
    broadcastChannel?.postMessage({ type: 'ASSESSMENTS_UPDATED', timestamp: Date.now() });
  } catch (err) {
    console.error('Error saving local assessments:', err);
  }
}

function getLocalAthletes(): AthleteProfile[] {
  if (typeof window === 'undefined') return [...SEED_ATHLETES];
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY_ATHLETES);
    if (!raw) {
      localStorage.setItem(LOCAL_STORAGE_KEY_ATHLETES, JSON.stringify(SEED_ATHLETES));
      return [...SEED_ATHLETES];
    }
    return JSON.parse(raw);
  } catch {
    return [...SEED_ATHLETES];
  }
}

function saveLocalAthletes(data: AthleteProfile[]) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY_ATHLETES, JSON.stringify(data));
    broadcastChannel?.postMessage({ type: 'ATHLETES_UPDATED', timestamp: Date.now() });
  } catch (err) {
    console.error('Error saving local athletes:', err);
  }
}

/**
 * Subscribe to real-time stream of all athlete assessments
 */
export function subscribeToAssessments(
  onUpdate: (assessments: AssessmentResult[]) => void
): () => void {
  // If real Firebase Firestore is configured, use live onSnapshot
  if (isFirebaseConfigured && db) {
    try {
      const q = query(collection(db, 'assessments'), orderBy('verifiedAt', 'desc'));
      const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          if (snapshot.empty) {
            // First time setup: seed if empty
            const initial = getLocalAssessments();
            onUpdate(initial);
          } else {
            const list = snapshot.docs.map((docSnap) => ({
              id: docSnap.id,
              ...docSnap.data(),
            })) as AssessmentResult[];
            onUpdate(list);
          }
        },
        (error) => {
          console.warn('Firestore subscription fallback to local realtime:', error);
          const initial = getLocalAssessments();
          onUpdate(initial);
        }
      );
      return unsubscribe;
    } catch (e) {
      console.warn('Firestore listener initialization error, using local reactive stream:', e);
    }
  }

  // Reactive Local / Multi-Tab Synchronization
  const notify = () => {
    const list = getLocalAssessments();
    // Sort descending by date
    list.sort((a, b) => new Date(b.verifiedAt).getTime() - new Date(a.verifiedAt).getTime());
    onUpdate(list);
  };

  notify();

  const handleBroadcast = (event: MessageEvent) => {
    if (event.data?.type === 'ASSESSMENTS_UPDATED') {
      notify();
    }
  };

  const handleStorageEvent = (e: StorageEvent) => {
    if (e.key === LOCAL_STORAGE_KEY_ASSESSMENTS) {
      notify();
    }
  };

  broadcastChannel?.addEventListener('message', handleBroadcast);
  window.addEventListener('storage', handleStorageEvent);

  return () => {
    broadcastChannel?.removeEventListener('message', handleBroadcast);
    window.removeEventListener('storage', handleStorageEvent);
  };
}

/**
 * Save new verified assessment to Firestore & local real-time stream
 */
export async function saveAssessment(
  assessment: Omit<AssessmentResult, 'id'> & { id?: string }
): Promise<AssessmentResult> {
  const finalId = assessment.id || `ass_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
  const record: AssessmentResult = {
    ...assessment,
    id: finalId,
  };

  // 1. Update local store & broadcast across browser tabs immediately
  const localList = getLocalAssessments();
  const existingIdx = localList.findIndex((item) => item.id === record.id);
  if (existingIdx >= 0) {
    localList[existingIdx] = record;
  } else {
    localList.unshift(record);
  }
  saveLocalAssessments(localList);

  // 2. Sync to Firebase Firestore if active
  if (isFirebaseConfigured && db) {
    try {
      await setDoc(doc(db, 'assessments', finalId), record);
    } catch (err) {
      console.warn('Firestore write error (cached locally):', err);
    }
  }

  return record;
}

/**
 * Save or update an athlete's profile
 */
export async function saveAthleteProfile(
  profile: Omit<AthleteProfile, 'id'> & { id?: string }
): Promise<AthleteProfile> {
  const finalId = profile.id || `ath_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
  const athlete: AthleteProfile = {
    ...profile,
    id: finalId,
  };

  const list = getLocalAthletes();
  const idx = list.findIndex((a) => a.id === athlete.id);
  if (idx >= 0) {
    list[idx] = athlete;
  } else {
    list.push(athlete);
  }
  saveLocalAthletes(list);

  if (isFirebaseConfigured && db) {
    try {
      await setDoc(doc(db, 'athletes', finalId), athlete);
    } catch (err) {
      console.warn('Firestore athlete write error:', err);
    }
  }

  return athlete;
}

/**
 * Retrieve athlete by ID with all their historical assessments
 */
export async function getAthleteDetails(athleteId: string): Promise<{
  profile: AthleteProfile | null;
  history: AssessmentResult[];
}> {
  const athletes = getLocalAthletes();
  const assessments = getLocalAssessments();

  let profile = athletes.find((a) => a.id === athleteId) || null;
  
  if (!profile && isFirebaseConfigured && db) {
    try {
      const snap = await getDoc(doc(db, 'athletes', athleteId));
      if (snap.exists()) {
        profile = { id: snap.id, ...snap.data() } as AthleteProfile;
      }
    } catch {
      // Ignore
    }
  }

  const history = assessments
    .filter((a) => a.athleteId === athleteId)
    .sort((a, b) => new Date(a.verifiedAt).getTime() - new Date(b.verifiedAt).getTime());

  return { profile, history };
}

/**
 * Toggle scout shortlist for an assessment
 */
export async function toggleScoutShortlist(
  assessmentId: string,
  scoutId: string = 'scout_default'
): Promise<boolean> {
  const list = getLocalAssessments();
  const assessment = list.find((a) => a.id === assessmentId);
  if (!assessment) return false;

  const currentList = assessment.shortlistedBy || [];
  const isShortlisted = currentList.includes(scoutId);
  
  const updatedList = isShortlisted
    ? currentList.filter((id) => id !== scoutId)
    : [...currentList, scoutId];

  assessment.shortlistedBy = updatedList;
  saveLocalAssessments(list);

  if (isFirebaseConfigured && db) {
    try {
      await updateDoc(doc(db, 'assessments', assessmentId), {
        shortlistedBy: updatedList,
      });
    } catch (err) {
      console.warn('Firestore shortlist update error:', err);
    }
  }

  return !isShortlisted;
}

/**
 * Add scout review note to an assessment
 */
export async function addScoutNote(
  assessmentId: string,
  noteText: string
): Promise<void> {
  const list = getLocalAssessments();
  const assessment = list.find((a) => a.id === assessmentId);
  if (!assessment) return;

  const currentNotes = assessment.scoutNotes || [];
  assessment.scoutNotes = [...currentNotes, noteText];
  saveLocalAssessments(list);

  if (isFirebaseConfigured && db) {
    try {
      await updateDoc(doc(db, 'assessments', assessmentId), {
        scoutNotes: assessment.scoutNotes,
      });
    } catch (err) {
      console.warn('Firestore note update error:', err);
    }
  }
}

/**
 * Reset / Re-seed demo data
 */
export function resetDemoData() {
  if (typeof window === 'undefined') return;
  localStorage.setItem(LOCAL_STORAGE_KEY_ASSESSMENTS, JSON.stringify(SEED_ASSESSMENTS));
  localStorage.setItem(LOCAL_STORAGE_KEY_ATHLETES, JSON.stringify(SEED_ATHLETES));
  broadcastChannel?.postMessage({ type: 'ASSESSMENTS_UPDATED', timestamp: Date.now() });
}
