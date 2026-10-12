import React from 'react';
import { Role, SportKey, GradeLevel } from '../types';
import { TEACHERS_LIST, SPORTS_LIST } from '../data/curriculum';

interface ControlBarProps {
  userRole: Role;
  onChangeRole: (role: Role) => void;
  selectedTeacher: string;
  onSelectTeacher: (teacher: string) => void;
  customUserName: string;
  onChangeUserName: (name: string) => void;
  currentSport: SportKey;
  onChangeSport: (sport: SportKey) => void;
  currentGrade: GradeLevel;
  onChangeGrade: (grade: GradeLevel) => void;
}

export const ControlBar: React.FC<ControlBarProps> = ({
  userRole,
  onChangeRole,
  selectedTeacher,
  onSelectTeacher,
  customUserName,
  onChangeUserName,
  currentSport,
  onChangeSport,
  currentGrade,
  onChangeGrade
}) => {
  const officialSports = SPORTS_LIST.filter(s => s.isOfficialAtSchool);
  const referenceSports = SPORTS_LIST.filter(s => !s.isOfficialAtSchool);

  return (
    <section className="bg-slate-200/80 border-b border-slate-300/80 py-2.5 px-4 no-print">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 text-xs md:text-sm">
        
        {/* Nhóm chọn & nhập người dùng (Giáo viên hoặc Học sinh) */}
        <div className="flex items-center gap-2 flex-wrap">
          <label className="font-bold text-slate-700 flex items-center gap-1.5">
            <i className="fa-solid fa-user-pen text-emerald-700"></i> Người thực hiện:
          </label>
          
          <select
            value={userRole}
            onChange={(e) => onChangeRole(e.target.value as Role)}
            className="bg-white border border-slate-300 rounded-md px-2 py-1 font-medium text-slate-700 focus:ring-1 focus:ring-emerald-500 cursor-pointer shadow-2xs"
          >
            <option value="gv">Giáo viên</option>
            <option value="hs">Học sinh</option>
          </select>

          {/* Dropdown chọn nhanh danh sách giáo viên THPT Huỳnh Tấn Phát */}
          {userRole === 'gv' && (
            <select
              value={selectedTeacher}
              onChange={(e) => onSelectTeacher(e.target.value)}
              className="bg-white border border-slate-300 rounded-md px-2 py-1 font-semibold text-emerald-800 focus:ring-1 focus:ring-emerald-500 cursor-pointer shadow-2xs"
            >
              {TEACHERS_LIST.map(t => (
                <option key={t} value={t}>{t}</option>
              ))}
              <option value="custom">-- Tự nhập tên khác --</option>
            </select>
          )}

          {/* Ô tự do nhập tên Giáo viên hoặc Học sinh */}
          <input
            type="text"
            value={customUserName}
            onChange={(e) => onChangeUserName(e.target.value)}
            placeholder={userRole === 'gv' ? 'Nhập tên giáo viên...' : 'Nhập tên học sinh (ví dụ: Lê Hoàng Long)...'}
            className="bg-white border border-slate-300 rounded-md px-2.5 py-1 text-slate-800 font-semibold focus:ring-1 focus:ring-emerald-500 w-44 md:w-56 shadow-2xs"
          />

          <span className="text-slate-500 italic hidden lg:inline">
            | Trường THPT Huỳnh Tấn Phát • Bộ môn Giáo dục Thể chất
          </span>
        </div>

        {/* Nhóm chọn phân môn & khối học */}
        <div className="flex items-center gap-3 flex-wrap">
          {/* Phân môn GDPT 2018 (3 phân môn chính thức + 2 phân môn chuẩn) */}
          <div className="flex items-center gap-1.5">
            <span className="font-bold text-slate-700">Phân môn:</span>
            <select
              value={currentSport}
              onChange={(e) => onChangeSport(e.target.value as SportKey)}
              className="bg-white border border-slate-300 rounded-md px-2.5 py-1 font-bold text-slate-800 focus:ring-1 focus:ring-emerald-500 cursor-pointer shadow-2xs"
            >
              <optgroup label="3 Phân môn chính thức tại THPT Huỳnh Tấn Phát">
                {officialSports.map(s => (
                  <option key={s.key} value={s.key}>
                    {s.name} ({s.grades})
                  </option>
                ))}
              </optgroup>
              <optgroup label="Danh mục GDPT 2018 tham khảo">
                {referenceSports.map(s => (
                  <option key={s.key} value={s.key}>
                    {s.name}
                  </option>
                ))}
              </optgroup>
            </select>
          </div>

          {/* Khối lớp THPT */}
          <div className="flex items-center gap-1.5">
            <span className="font-bold text-slate-700">Khối:</span>
            <select
              value={currentGrade}
              onChange={(e) => onChangeGrade(e.target.value as GradeLevel)}
              className="bg-white border border-slate-300 rounded-md px-2.5 py-1 font-bold text-slate-800 focus:ring-1 focus:ring-emerald-500 cursor-pointer shadow-2xs"
            >
              <option value="12">Khối 12</option>
              <option value="11">Khối 11</option>
              <option value="10">Khối 10</option>
            </select>
          </div>

        </div>

      </div>
    </section>
  );
};
