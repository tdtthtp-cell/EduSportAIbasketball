import React from 'react';
import { SportKey, Role } from '../types';
import { SPORTS_LIST } from '../data/curriculum';

interface HeaderProps {
  currentSport: SportKey;
  userRole: Role;
  userName: string;
  onSwitchTab: (tabId: string) => void;
  onSaveSession: () => void;
  onOpenTimerModal: () => void;
  unreadCount?: number;
}

export const Header: React.FC<HeaderProps> = ({
  currentSport,
  userRole,
  userName,
  onSwitchTab,
  onSaveSession,
  onOpenTimerModal,
  unreadCount = 2
}) => {
  const sportName = SPORTS_LIST.find(s => s.key === currentSport)?.name || 'GDTC ĐẶC THÙ THPT';

  return (
    <header className="bg-gradient-to-r from-slate-900 via-emerald-950 to-teal-950 text-white shadow-md border-b border-emerald-800/40">
      <div className="max-w-7xl mx-auto px-4 py-3 flex flex-wrap items-center justify-between gap-3">
        
        {/* Logo & Tên ứng dụng */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-600/30 border border-emerald-400/40 flex items-center justify-center text-emerald-400 text-xl shadow-inner">
            <i className="fa-solid fa-heart-pulse"></i>
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="bg-amber-400 text-slate-950 text-[11px] font-black px-2 py-0.5 rounded tracking-wide uppercase shadow-xs">
                AI GDTC 4.0
              </span>
              <span className="bg-emerald-700/80 text-emerald-200 text-[11px] font-semibold px-2 py-0.5 rounded flex items-center gap-1 border border-emerald-600/30">
                <i className={`fa-solid ${currentSport === 'bong-ro' ? 'fa-basketball' : currentSport === 'bong-chuyen' ? 'fa-volleyball' : currentSport === 'cau-long' ? 'fa-feather' : 'fa-futbol'} text-[10px]`}></i>
                <span id="headerCurSubj">CHUYÊN MÔN {sportName.toUpperCase()}</span>
              </span>
              <span className="text-xs text-emerald-300/80 hidden md:inline">
                ● GDPT 2018 • Chuẩn CV 5512 & 7991 • PPCT 70 Tiết
              </span>
            </div>
            <h1 className="text-lg md:text-xl font-bold tracking-tight text-white flex items-center gap-2 mt-0.5">
              EduSport AI - GDTC & Sức Khỏe Học Đường
            </h1>
            <p className="text-xs text-emerald-200/90 font-medium">
              <span className="text-amber-300 font-semibold">
                {userRole === 'gv' ? 'Giáo viên' : 'Học sinh'}: {userName}
              </span>{' '}
              • <span className="text-emerald-100">Bộ môn: Giáo dục Thể chất</span> •{' '}
              <span className="text-emerald-300">Trường THPT Huỳnh Tấn Phát</span>
            </p>
          </div>
        </div>

        {/* Tiện ích bên phải */}
        <div className="flex items-center space-x-2 text-xs flex-wrap">
          <div className="hidden sm:flex items-center gap-1.5 bg-emerald-900/60 border border-emerald-700/50 px-2.5 py-1.5 rounded-lg text-emerald-200">
            <i className="fa-solid fa-globe text-emerald-400"></i>
            <span>Tiếng Việt</span>
          </div>

          <div className="flex items-center gap-1.5 bg-emerald-900/60 border border-emerald-700/50 px-2.5 py-1.5 rounded-lg text-emerald-300">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>Trực tuyến</span>
          </div>

          <button
            onClick={onOpenTimerModal}
            title="Đồng hồ bấm giờ & Đếm nhịp vận động"
            className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-600 px-3 py-1.5 rounded-lg text-slate-200 font-medium transition cursor-pointer"
          >
            <i className="fa-solid fa-stopwatch text-amber-400"></i>
            <span className="hidden sm:inline">Bấm giờ</span>
          </button>

          <button
            onClick={onSaveSession}
            title="Lưu trữ phiên làm việc vào bộ nhớ thiết bị"
            className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-600 px-3 py-1.5 rounded-lg text-slate-200 font-medium transition cursor-pointer"
          >
            <i className="fa-solid fa-floppy-disk"></i>
            <span>Sao lưu</span>
          </button>

          <button
            onClick={() => onSwitchTab('tab-phuhuynh')}
            className="relative flex items-center gap-1.5 bg-rose-700 hover:bg-rose-600 text-white px-3 py-1.5 rounded-lg font-semibold shadow-sm transition cursor-pointer"
          >
            <i className="fa-solid fa-heart"></i>
            <span>Cổng Phụ Huynh</span>
            {unreadCount > 0 && (
              <span className="w-4 h-4 bg-white text-rose-700 rounded-full text-[10px] font-black flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>
        </div>

      </div>
    </header>
  );
};
