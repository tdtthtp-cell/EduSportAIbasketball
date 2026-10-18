/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { ControlBar } from './components/ControlBar';
import { TabTheTrang } from './components/TabTheTrang';
import { TabKHBD } from './components/TabKHBD';
import { TabDanhGia } from './components/TabDanhGia';
import { TabBMI } from './components/TabBMI';
import { TabDinhDuong } from './components/TabDinhDuong';
import { TabPhuHuynh } from './components/TabPhuHuynh';
import { StopwatchModal } from './components/StopwatchModal';
import { SyncBackupModal } from './components/SyncBackupModal';
import { INITIAL_STUDENTS } from './data/students';
import { Role, SportKey, GradeLevel, StudentProfile } from './types';
import { testConnection, subscribeStudentsFromCloud, syncAllStudentsToCloud } from './firebase';

export default function App() {
  // Navigation tab state (default: tab-thetrang as in the prototype image)
  const [activeTab, setActiveTab] = useState<string>('tab-thetrang');

  // Teacher / Student role & identity
  const [userRole, setUserRole] = useState<Role>(() => {
    return (localStorage.getItem('edusport_role') as Role) || 'gv';
  });

  const [selectedTeacher, setSelectedTeacher] = useState<string>(() => {
    return localStorage.getItem('edusport_teacher_select') || 'Nguyễn Trung Hiếu';
  });

  const [customUserName, setCustomUserName] = useState<string>(() => {
    return localStorage.getItem('edusport_user_name') || 'Nguyễn Trung Hiếu';
  });

  // Sport & Grade
  const [currentSport, setCurrentSport] = useState<SportKey>(() => {
    const initialized = localStorage.getItem('edusport_sport_v2_bongro');
    if (!initialized) {
      localStorage.setItem('edusport_sport_v2_bongro', 'true');
      localStorage.setItem('edusport_sport', 'bong-ro');
      return 'bong-ro';
    }
    return (localStorage.getItem('edusport_sport') as SportKey) || 'bong-ro';
  });

  const [currentGrade, setCurrentGrade] = useState<GradeLevel>(() => {
    return (localStorage.getItem('edusport_grade') as GradeLevel) || '12';
  });

  // Students list state (Loads new official roster of 10A1, 10A3, 12C1, 12C2, 12C3)
  const [students, setStudents] = useState<StudentProfile[]>(() => {
    try {
      const rosterVer = localStorage.getItem('edusport_students_roster_v4');
      if (rosterVer !== '2026_10A1_10A3_12C1_12C2_12C3') {
        localStorage.setItem('edusport_students_roster_v4', '2026_10A1_10A3_12C1_12C2_12C3');
        localStorage.setItem('edusport_students', JSON.stringify(INITIAL_STUDENTS));
        return INITIAL_STUDENTS;
      }
      const saved = localStorage.getItem('edusport_students');
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return INITIAL_STUDENTS;
  });

  // Selected student passed to Parent Portal message
  const [messageTargetStudent, setMessageTargetStudent] = useState<StudentProfile | null>(null);

  // Stopwatch modal
  const [isTimerOpen, setIsTimerOpen] = useState<boolean>(false);

  // Backup & Multi-Device Sync modal
  const [isSyncModalOpen, setIsSyncModalOpen] = useState<boolean>(false);

  // Toast notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  // Sync state to LocalStorage
  useEffect(() => {
    localStorage.setItem('edusport_role', userRole);
    localStorage.setItem('edusport_teacher_select', selectedTeacher);
    localStorage.setItem('edusport_user_name', customUserName);
    localStorage.setItem('edusport_sport', currentSport);
    localStorage.setItem('edusport_grade', currentGrade);
    localStorage.setItem('edusport_students', JSON.stringify(students));
  }, [userRole, selectedTeacher, customUserName, currentSport, currentGrade, students]);

  // Lắng nghe và đồng bộ dữ liệu thời gian thực từ Firestore (Real-time Cloud Sync)
  useEffect(() => {
    testConnection();
    const unsubscribe = subscribeStudentsFromCloud(
      (cloudStudents) => {
        if (cloudStudents && cloudStudents.length > 0) {
          setStudents(cloudStudents);
          localStorage.setItem('edusport_students', JSON.stringify(cloudStudents));
        } else {
          // Lần đầu khởi tạo: tự động đẩy danh sách 70 học sinh chuẩn lên Cloud Firestore
          syncAllStudentsToCloud(INITIAL_STUDENTS).catch(() => {});
        }
      },
      (err) => {
        console.warn('Lưu ý kết nối Firestore:', err);
      }
    );

    return () => {
      if (typeof unsubscribe === 'function') {
        unsubscribe();
      }
    };
  }, []);

  const handleUpdateStudents = (updated: StudentProfile[]) => {
    setStudents(updated);
    localStorage.setItem('edusport_students', JSON.stringify(updated));
    // Tự động đẩy lên Đám Mây Firestore để mọi thiết bị (kể cả điện thoại tdc3htp.com) tự cập nhật
    syncAllStudentsToCloud(updated).catch((err) => {
      console.warn('Đồng bộ nền lên Firestore:', err);
    });
  };

  const handleRoleChange = (role: Role) => {
    setUserRole(role);
    if (role === 'gv') {
      if (selectedTeacher !== 'custom') {
        setCustomUserName(selectedTeacher);
      }
    } else {
      setCustomUserName('Lê Khánh An');
    }
  };

  const handleSelectTeacher = (teacher: string) => {
    setSelectedTeacher(teacher);
    if (teacher !== 'custom') {
      setCustomUserName(teacher);
    } else {
      setCustomUserName('');
    }
  };

  const handleSaveSession = () => {
    localStorage.setItem('edusport_students', JSON.stringify(students));
    localStorage.setItem('edusport_user_name', customUserName);
    setIsSyncModalOpen(true);
  };

  const handleSelectForMessage = (student: StudentProfile) => {
    setMessageTargetStudent(student);
    setActiveTab('tab-phuhuynh');
  };

  return (
    <div className="bg-slate-100 font-sans text-slate-800 antialiased min-h-screen flex flex-col">
      
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-4 right-4 z-50 bg-emerald-900 text-white px-4 py-2.5 rounded-xl shadow-xl flex items-center gap-2 border border-emerald-700 animate-bounce text-xs md:text-sm font-semibold">
          <i className="fa-solid fa-circle-check text-emerald-400"></i>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* TOP HEADER */}
      <Header
        currentSport={currentSport}
        userRole={userRole}
        userName={customUserName || (userRole === 'gv' ? 'Thầy/Cô GDTC' : 'Học sinh')}
        onSwitchTab={(tabId) => setActiveTab(tabId)}
        onSaveSession={handleSaveSession}
        onOpenTimerModal={() => setIsTimerOpen(true)}
        unreadCount={2}
      />

      {/* THANH ĐIỀU HƯỚNG TÁC NGHIỆP (NAV TABS) */}
      <nav className="bg-white border-b border-slate-200 shadow-xs sticky top-0 z-30 no-print">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between overflow-x-auto no-scrollbar py-2">
          <div className="flex space-x-1 sm:space-x-2 text-xs md:text-sm font-semibold whitespace-nowrap">
            
            <button
              onClick={() => setActiveTab('tab-khbd')}
              className={`nav-tab px-3.5 py-2 rounded-lg flex items-center gap-2 transition cursor-pointer ${
                activeTab === 'tab-khbd'
                  ? 'bg-emerald-800 text-white shadow-xs font-bold'
                  : 'text-slate-600 hover:text-emerald-700 hover:bg-emerald-50'
              }`}
            >
              <i className={`fa-solid fa-book-open ${activeTab === 'tab-khbd' ? 'text-amber-300' : 'text-emerald-600'}`}></i>
              <span>Soạn Kế Hoạch Bài Dạy (AI)</span>
            </button>

            <button
              onClick={() => setActiveTab('tab-danhgia')}
              className={`nav-tab px-3.5 py-2 rounded-lg flex items-center gap-2 transition cursor-pointer ${
                activeTab === 'tab-danhgia'
                  ? 'bg-emerald-800 text-white shadow-xs font-bold'
                  : 'text-slate-600 hover:text-emerald-700 hover:bg-emerald-50'
              }`}
            >
              <i className={`fa-solid fa-clipboard-check ${activeTab === 'tab-danhgia' ? 'text-amber-300' : 'text-blue-600'}`}></i>
              <span>Đánh Giá Thường Xuyên</span>
            </button>

            <button
              onClick={() => setActiveTab('tab-thetrang')}
              className={`nav-tab px-3.5 py-2 rounded-lg flex items-center gap-2 transition cursor-pointer ${
                activeTab === 'tab-thetrang'
                  ? 'bg-emerald-800 text-white shadow-xs font-bold'
                  : 'text-slate-600 hover:text-emerald-700 hover:bg-emerald-50'
              }`}
            >
              <i className={`fa-solid fa-person-running ${activeTab === 'tab-thetrang' ? 'text-amber-300' : 'text-emerald-600'}`}></i>
              <span>Gợi Ý Bài Tập Thể Trạng</span>
            </button>

            <button
              onClick={() => setActiveTab('tab-bmi')}
              className={`nav-tab px-3.5 py-2 rounded-lg flex items-center gap-2 transition cursor-pointer ${
                activeTab === 'tab-bmi'
                  ? 'bg-emerald-800 text-white shadow-xs font-bold'
                  : 'text-slate-600 hover:text-emerald-700 hover:bg-emerald-50'
              }`}
            >
              <i className={`fa-solid fa-scale-balanced ${activeTab === 'tab-bmi' ? 'text-amber-300' : 'text-teal-600'}`}></i>
              <span>Đánh Giá Chỉ Số BMI</span>
            </button>

            <button
              onClick={() => setActiveTab('tab-dinhduong')}
              className={`nav-tab px-3.5 py-2 rounded-lg flex items-center gap-2 transition cursor-pointer ${
                activeTab === 'tab-dinhduong'
                  ? 'bg-emerald-800 text-white shadow-xs font-bold'
                  : 'text-slate-600 hover:text-emerald-700 hover:bg-emerald-50'
              }`}
            >
              <i className={`fa-solid fa-utensils ${activeTab === 'tab-dinhduong' ? 'text-amber-300' : 'text-orange-600'}`}></i>
              <span>Dinh Dưỡng Nông Thôn</span>
            </button>

            <button
              onClick={() => setActiveTab('tab-phuhuynh')}
              className={`nav-tab px-3.5 py-2 rounded-lg flex items-center gap-2 transition cursor-pointer relative ${
                activeTab === 'tab-phuhuynh'
                  ? 'bg-emerald-800 text-white shadow-xs font-bold'
                  : 'text-slate-600 hover:text-emerald-700 hover:bg-emerald-50'
              }`}
            >
              <i className={`fa-solid fa-bell ${activeTab === 'tab-phuhuynh' ? 'text-amber-300' : 'text-rose-600'}`}></i>
              <span>Thông Báo Zalo / SMS</span>
              <span className="bg-rose-500 text-white rounded-full px-1.5 py-0.2 text-[10px] font-bold">2</span>
            </button>

          </div>
        </div>
      </nav>

      {/* THANH CẤU HÌNH NHANH */}
      <ControlBar
        userRole={userRole}
        onChangeRole={handleRoleChange}
        selectedTeacher={selectedTeacher}
        onSelectTeacher={handleSelectTeacher}
        customUserName={customUserName}
        onChangeUserName={(name) => setCustomUserName(name)}
        currentSport={currentSport}
        onChangeSport={(sport) => setCurrentSport(sport)}
        currentGrade={currentGrade}
        onChangeGrade={(grade) => setCurrentGrade(grade)}
      />

      {/* NỘI DUNG CHÍNH (MAIN CONTAINER) */}
      <main className="max-w-7xl mx-auto px-4 py-5 flex-1 w-full">
        {activeTab === 'tab-thetrang' && (
          <TabTheTrang
            students={students}
            currentSport={currentSport}
            currentTeacherName={customUserName || 'Giáo viên'}
            onSelectStudentForMessage={handleSelectForMessage}
          />
        )}

        {activeTab === 'tab-khbd' && (
          <TabKHBD
            currentSport={currentSport}
            currentGrade={currentGrade}
            currentTeacherName={customUserName || 'Nguyễn Trung Hiếu'}
            userRole={userRole}
            students={students}
          />
        )}

        {activeTab === 'tab-danhgia' && (
          <TabDanhGia
            students={students}
            onUpdateStudents={handleUpdateStudents}
            onSelectForMessage={handleSelectForMessage}
          />
        )}

        {activeTab === 'tab-bmi' && (
          <TabBMI
            students={students}
            onUpdateStudents={handleUpdateStudents}
            onSwitchToTheTrang={() => setActiveTab('tab-thetrang')}
            onSelectForMessage={handleSelectForMessage}
            onShowToast={showToast}
          />
        )}

        {activeTab === 'tab-dinhduong' && (
          <TabDinhDuong students={students} />
        )}

        {activeTab === 'tab-phuhuynh' && (
          <TabPhuHuynh
            students={students}
            currentSport={currentSport}
            currentTeacherName={customUserName || 'Nguyễn Trung Hiếu'}
            initialSelectedStudent={messageTargetStudent}
          />
        )}
      </main>

      {/* FOOTER SƯ PHẠM TRANG TRỌNG */}
      <footer className="bg-slate-900 text-slate-400 text-xs py-4 border-t border-slate-800 mt-auto no-print">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-2 text-center md:text-left">
          <div>
            <p className="font-semibold text-slate-200">
              TRƯỜNG TRUNG HỌC PHỔ THÔNG HUỲNH TẤN PHÁT
            </p>
            <p>
              Bộ môn: Giáo dục Thể chất • Thiết kế hỗ trợ chuyên môn GDPT 2018 & Chuyển đổi số Sư phạm
            </p>
          </div>
          <div className="text-slate-400 text-[11px] md:text-xs">
            <span>
              Danh sách GV: Nguyễn Tấn Phước, Bồ Công Lâm, Nguyễn Trung Hiếu, Bùi Thanh Liêm, Cao Minh Thắng, Phạm Thị Ngọc Du, Võ Thị Yến Lan
            </span>
          </div>
        </div>
      </footer>

      {/* MODAL BẤM GIỜ & METRONOME SƯ PHẠM */}
      <StopwatchModal
        isOpen={isTimerOpen}
        onClose={() => setIsTimerOpen(false)}
      />

      {/* MODAL SAO LƯU & ĐỒNG BỘ THIẾT BỊ (PC ⇄ ĐIỆN THOẠI) */}
      <SyncBackupModal
        isOpen={isSyncModalOpen}
        onClose={() => setIsSyncModalOpen(false)}
        students={students}
        onUpdateStudents={handleUpdateStudents}
        currentSport={currentSport}
        currentGrade={currentGrade}
        userRole={userRole}
        customUserName={customUserName}
        onShowToast={showToast}
      />

    </div>
  );
}

