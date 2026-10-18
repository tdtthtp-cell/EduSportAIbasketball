import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import {
  getFirestore,
  doc,
  getDocFromServer,
  collection,
  onSnapshot,
  setDoc,
  writeBatch
} from 'firebase/firestore';
import { StudentProfile } from './types';
import firebaseConfig from '../firebase-applet-config.json';

// Khởi tạo Firebase App
const app = initializeApp(firebaseConfig);

// CRITICAL: Phải truyền đúng databaseId từ cấu hình
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const auth = getAuth(app);

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth?.currentUser?.uid,
      email: auth?.currentUser?.email,
      emailVerified: auth?.currentUser?.emailVerified,
      isAnonymous: auth?.currentUser?.isAnonymous,
      tenantId: auth?.currentUser?.tenantId,
      providerInfo: auth?.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Kiểm tra kết nối khi khởi động
export async function testConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn('Firebase client is currently offline.');
    }
  }
}

// Lắng nghe dữ liệu học sinh thời gian thực từ Firestore (Real-time Cloud Sync)
export function subscribeStudentsFromCloud(
  onSuccess: (students: StudentProfile[]) => void,
  onError?: (err: unknown) => void
) {
  const path = 'students';
  return onSnapshot(
    collection(db, path),
    (snapshot) => {
      if (snapshot.empty) {
        return;
      }
      const remoteList: StudentProfile[] = [];
      snapshot.forEach((d) => {
        const data = d.data();
        remoteList.push({
          id: d.id,
          code: data.code || `HS-${d.id}`,
          name: data.name || '',
          class: data.class || '12C1',
          gender: data.gender || 'Nam',
          heightCm: Number(data.heightCm) || 165,
          weightKg: Number(data.weightKg) || 55,
          bmi: Number(data.bmi) || 20,
          status: data.status || 'standard',
          medicalNote: data.medicalNote || '',
          evalTech: data.evalTech || '',
          evalAttitude: data.evalAttitude || '',
          evalDigital: data.evalDigital || '',
          rating: data.rating || 'Đạt',
          parentPhone: data.parentPhone || ''
        });
      });
      if (remoteList.length > 0) {
        onSuccess(remoteList);
      }
    },
    (err) => {
      if (onError) onError(err);
      handleFirestoreError(err, OperationType.GET, path);
    }
  );
}

// Lưu 1 học sinh lên đám mây Firestore
export async function saveStudentToCloud(student: StudentProfile): Promise<void> {
  const path = `students/${student.id}`;
  try {
    const studentRef = doc(db, 'students', student.id);
    const payload = {
      id: student.id,
      code: student.code || '',
      name: student.name,
      class: student.class,
      gender: student.gender,
      heightCm: Number(student.heightCm),
      weightKg: Number(student.weightKg),
      bmi: Number(student.bmi),
      status: student.status,
      medicalNote: student.medicalNote || '',
      evalTech: student.evalTech || '',
      evalAttitude: student.evalAttitude || '',
      evalDigital: student.evalDigital || '',
      rating: student.rating || 'Đạt',
      parentPhone: student.parentPhone || '',
      updatedAt: new Date().toISOString()
    };
    await setDoc(studentRef, payload);
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, path);
  }
}

// Đẩy toàn bộ danh sách lên đám mây (Initial Cloud Seed / Sync All)
export async function syncAllStudentsToCloud(students: StudentProfile[]): Promise<void> {
  const path = 'students';
  try {
    const batch = writeBatch(db);
    students.forEach((student) => {
      const studentRef = doc(db, 'students', student.id);
      batch.set(studentRef, {
        id: student.id,
        code: student.code || '',
        name: student.name,
        class: student.class,
        gender: student.gender,
        heightCm: Number(student.heightCm),
        weightKg: Number(student.weightKg),
        bmi: Number(student.bmi),
        status: student.status,
        medicalNote: student.medicalNote || '',
        evalTech: student.evalTech || '',
        evalAttitude: student.evalAttitude || '',
        evalDigital: student.evalDigital || '',
        rating: student.rating || 'Đạt',
        parentPhone: student.parentPhone || '',
        updatedAt: new Date().toISOString()
      });
    });
    await batch.commit();
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, path);
  }
}
