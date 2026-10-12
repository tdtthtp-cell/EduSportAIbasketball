export type Role = 'gv' | 'hs';

export type SportKey = 'bong-chuyen' | 'bong-ro' | 'cau-long' | 'bong-da' | 'da-cau';

export type GradeLevel = '10' | '11' | '12';

export type HealthStatus = 'overweight' | 'underweight' | 'mild' | 'standard';

export interface ActivityStep {
  stepNumber: 1 | 2 | 3 | 4;
  stepName: string;
  roleTag: string; // 'GV' | 'HS' | 'HS/Cán sự/GV'
  content: string[];
}

export interface LessonActivity {
  id: string;
  activityNumber: 1 | 2 | 3 | 4;
  title: string;
  timeRange: string; // '5 - 10 phút', '10 - 15 phút', '15 - 20 phút', '5 phút'
  targetHeartRate?: string;
  objective: string;
  steps: ActivityStep[];
}

export interface DetailedKHBDPlan {
  schoolName: string;
  schoolLocation: string; // Địa điểm trường (nhập từ bàn phím)
  subjectName: string;
  grade: GradeLevel;
  gradeBlock: string; // Khối lớp (Khối 10, Khối 11, Khối 12)
  className: string; // Lớp cụ thể (nhập từ bàn phím)
  lessonTitle: string;
  durationOption: '1 tiết' | '2 tiết';
  durationText: string; // '1 tiết (Thời lượng: 45 phút)' hoặc '2 tiết (Thời lượng: 90 phút)'
  teacherName: string;
  ttcmName: string; // TTCM - Tổ trưởng chuyên môn (nhập từ bàn phím)
  sgkReference: string;
  sportKey: SportKey;
  
  // 1. MỤC TIÊU BÀI DẠY
  objectives: {
    specificCompetencies: {
      healthCare: string;
      basicMotor: string;
      sportsActivities: string;
    };
    generalCompetencies: {
      selfControl: string;
      communication: string;
    };
    digitalAndAiCompetency: string;
    qualities: {
      diligence: string;
      honesty: string;
      solidarity: string;
    };
  };

  // 2. THIẾT BỊ DẠY HỌC & HỌC LIỆU
  equipment: {
    teacherTools: string[];
    studentTools: string[];
    digitalAndAiTools: string[];
  };

  // 3. TIẾN TRÌNH DẠY HỌC (4 hoạt động x 4 bước)
  activities: LessonActivity[];

  // 4. HÌNH ẢNH KÈM THEO
  images: LessonDiagramImage[];
}

export interface LessonDiagramImage {
  id: string;
  title: string;
  caption: string;
  type: 'technique' | 'court' | 'formation' | 'biomechanics';
  svgType: string;
}

export interface LessonItem {
  id: string;
  title: string;
  classRef: string;
  sgkRef: string;
  grade: GradeLevel;
  sportKey: SportKey;
  periodNumber: number;
  durationMinutes: number;
  week: number;
  objective: string;
  newKnowledge: string;
  practice: string;
  aiDigital: string;
  safetyNote?: string;
  assessmentCriteria?: string;
  images: LessonDiagramImage[];
}

export interface PPCTRow {
  period: number;
  week: number;
  semester: 'HK1' | 'HK2';
  theme: string;
  lessonTitle: string;
  sgkPages: string;
  notes: string;
  sportKey: SportKey;
  grade: GradeLevel;
}

export interface StudentProfile {
  id: string;
  code: string;
  name: string;
  class: string;
  gender: 'Nam' | 'Nữ';
  heightCm: number;
  weightKg: number;
  bmi: number;
  status: HealthStatus;
  medicalNote: string;
  evalTech: string;
  evalAttitude: string;
  evalDigital: string;
  rating: 'Đạt' | 'Chưa đạt';
  parentPhone?: string;
}

export interface ZaloMessageItem {
  id: string;
  studentId: string;
  studentName: string;
  className: string;
  senderName: string;
  timestamp: string;
  type: 'overweight' | 'underweight' | 'mild' | 'praise' | 'custom';
  content: string;
  status: 'sent' | 'draft';
}
