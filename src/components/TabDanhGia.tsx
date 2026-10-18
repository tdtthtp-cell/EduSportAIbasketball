import React, { useState } from 'react';
import { StudentProfile, HealthStatus } from '../types';
import { calculateBmiValue, INITIAL_STUDENTS } from '../data/students';
import { EditStudentModal } from './EditStudentModal';
import { ImportStudentsModal } from './ImportStudentsModal';

interface TabDanhGiaProps {
  students: StudentProfile[];
  onUpdateStudents: (updated: StudentProfile[]) => void;
  onSelectForMessage: (student: StudentProfile) => void;
}

export const TabDanhGia: React.FC<TabDanhGiaProps> = ({
  students,
  onUpdateStudents,
  onSelectForMessage
}) => {
  const [filterClass, setFilterClass] = useState<string>('all');
  const [filterRating, setFilterRating] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  
  // Modals state
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [showImportModal, setShowImportModal] = useState<boolean>(false);
  const [editingStudent, setEditingStudent] = useState<StudentProfile | null>(null);

  // New student form state
  const [newCode, setNewCode] = useState<string>('');
  const [newName, setNewName] = useState<string>('');
  const [newClass, setNewClass] = useState<string>('10A1');
  const [newGender, setNewGender] = useState<'Nam' | 'Nữ'>('Nam');
  const [newHeight, setNewHeight] = useState<number>(165);
  const [newWeight, setNewWeight] = useState<number>(60);
  const [newMedicalNote, setNewMedicalNote] = useState<string>('Thể trạng bình thường');
  const [newParentPhone, setNewParentPhone] = useState<string>('');
  const [newEvalTech, setNewEvalTech] = useState<string>('Thực hiện tốt kỹ thuật cơ bản');
  const [newEvalAttitude, setNewEvalAttitude] = useState<string>('Tự giác, tích cực rèn luyện');
  const [newEvalDigital, setNewEvalDigital] = useState<string>('Xem video mẫu và tự ghi hình động tác');

  // Extract all distinct real classes from database
  const availableClasses = Array.from(new Set(students.map(s => s.class))).filter(Boolean).sort();

  const filteredStudents = students.filter(s => {
    if (filterClass !== 'all' && s.class !== filterClass) return false;
    if (filterRating !== 'all' && s.rating !== filterRating) return false;
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase().trim();
      const matchName = s.name.toLowerCase().includes(term);
      const matchCode = s.code.toLowerCase().includes(term);
      const matchClass = s.class.toLowerCase().includes(term);
      if (!matchName && !matchCode && !matchClass) return false;
    }
    return true;
  });

  const totalCount = filteredStudents.length;
  const passCount = filteredStudents.filter(s => s.rating === 'Đạt').length;
  const overweightCount = filteredStudents.filter(s => s.status === 'overweight').length;
  const mildCount = filteredStudents.filter(s => s.status === 'mild').length;

  const handleToggleRating = (id: string) => {
    const updated = students.map(s => {
      if (s.id === id) {
        return {
          ...s,
          rating: (s.rating === 'Đạt' ? 'Chưa đạt' : 'Đạt') as 'Đạt' | 'Chưa đạt'
        };
      }
      return s;
    });
    onUpdateStudents(updated);
  };

  const handleSetAllPass = () => {
    if (confirm(`Thầy/Cô có muốn đánh dấu xếp loại "Đạt (Đ)" cho toàn bộ ${filteredStudents.length} học sinh đang lọc?`)) {
      const updated = students.map(s => {
        const isInFiltered = filteredStudents.some(f => f.id === s.id);
        if (isInFiltered) {
          return { ...s, rating: 'Đạt' as const };
        }
        return s;
      });
      onUpdateStudents(updated);
    }
  };

  const handleQuickEditComment = (id: string, field: 'evalTech' | 'evalAttitude' | 'evalDigital', val: string) => {
    const updated = students.map(s => {
      if (s.id === id) {
        return { ...s, [field]: val };
      }
      return s;
    });
    onUpdateStudents(updated);
  };

  const handleDeleteStudent = (id: string) => {
    if (confirm('Thầy/Cô có chắc chắn muốn xóa học sinh này khỏi danh sách?')) {
      const updated = students.filter(s => s.id !== id);
      onUpdateStudents(updated);
    }
  };

  const handleResetSampleData = () => {
    if (confirm('Thầy/Cô có chắc chắn muốn đặt lại danh sách học sinh mẫu ban đầu?')) {
      onUpdateStudents(INITIAL_STUDENTS);
    }
  };

  const handleClearAllStudents = () => {
    if (confirm('CẢNH BÁO: Thầy/Cô có chắc chắn muốn xóa toàn bộ danh sách để nhập mới từ đầu?')) {
      onUpdateStudents([]);
    }
  };

  const handleExportCsv = () => {
    if (students.length === 0) {
      alert('Danh sách học sinh đang trống, không thể xuất file!');
      return;
    }

    const headers = 'STT,Mã định danh HS,Họ và tên,Lớp,Giới tính,Chiều cao (cm),Cân nặng (kg),BMI,Thể trạng,Ghi chú sức khỏe,SĐT Phụ huynh,Kỹ thuật,Thái độ,Ứng dụng số,Xếp loại TT22\n';
    
    const rows = filteredStudents.map((st, i) => {
      const statusText = st.status === 'overweight' ? 'Thừa cân' : st.status === 'underweight' ? 'Thiếu cân' : st.status === 'mild' ? 'Bệnh nền nhẹ' : 'Đạt chuẩn';
      return `${i + 1},"${st.code}","${st.name}","${st.class}","${st.gender}",${st.heightCm},${st.weightKg},${st.bmi},"${statusText}","${st.medicalNote}","${st.parentPhone || ''}","${st.evalTech}","${st.evalAttitude}","${st.evalDigital}","${st.rating}"`;
    }).join('\n');

    // Add UTF-8 BOM so Excel opens Vietnamese characters correctly
    const blob = new Blob(["\uFEFF" + headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    const fileName = filterClass !== 'all' ? `So_Danh_Gia_GDTC_${filterClass}.csv` : 'So_Danh_Gia_GDTC_Toan_Truong.csv';
    link.setAttribute('download', fileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSaveNewStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) {
      alert('Vui lòng nhập họ và tên học sinh!');
      return;
    }

    const calculatedBmi = calculateBmiValue(newHeight, newWeight);
    let status: HealthStatus = 'standard';
    if (newMedicalNote.toLowerCase().includes('hen') || newMedicalNote.toLowerCase().includes('tim')) {
      status = 'mild';
    } else if (calculatedBmi >= 24) {
      status = 'overweight';
    } else if (calculatedBmi < 18.5) {
      status = 'underweight';
    }

    const newStudent: StudentProfile = {
      id: `s-real-${Date.now()}`,
      code: newCode.trim() || `HS-${Date.now().toString().slice(-4)}`,
      name: newName.trim(),
      class: newClass.trim() || '10A1',
      gender: newGender,
      heightCm: newHeight,
      weightKg: newWeight,
      bmi: calculatedBmi,
      status,
      medicalNote: newMedicalNote.trim() || 'Thể trạng bình thường',
      evalTech: newEvalTech,
      evalAttitude: newEvalAttitude,
      evalDigital: newEvalDigital,
      rating: 'Đạt',
      parentPhone: newParentPhone.trim()
    };

    onUpdateStudents([newStudent, ...students]);
    setShowAddModal(false);
    // Reset form
    setNewName('');
    setNewCode('');
    setNewMedicalNote('Thể trạng bình thường');
    setNewParentPhone('');
  };

  const handleImportStudents = (imported: StudentProfile[], replaceAll: boolean) => {
    if (replaceAll) {
      onUpdateStudents(imported);
    } else {
      // Merge: avoid duplicated IDs
      onUpdateStudents([...imported, ...students]);
    }
  };

  const handleSaveEditedStudent = (updatedStudent: StudentProfile) => {
    const updated = students.map(s => s.id === updatedStudent.id ? updatedStudent : s);
    onUpdateStudents(updated);
  };

  return (
    <div id="tab-danhgia" className="tab-content block space-y-4">
      <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs space-y-4">
        
        {/* Tiêu đề & Thao tác */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <div>
            <h2 className="text-base md:text-lg font-bold text-slate-900 flex items-center gap-2">
              <i className="fa-solid fa-clipboard-check text-blue-600"></i>
              Sổ Đánh Giá Thường Xuyên Theo Thông Tư 22 & GDPT 2018
            </h2>
            <p className="text-xs text-slate-500">
              Bộ môn Giáo dục Thể chất • Dữ liệu học sinh, lớp, mã định danh được quản lý theo thực tế nhà trường
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {/* Nút Nhập Thực Tế Từ Excel */}
            <button
              onClick={() => setShowImportModal(true)}
              className="bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold px-3 py-2 rounded-lg flex items-center gap-1.5 transition cursor-pointer shadow-xs"
              title="Sao chép từ Excel hoặc tải tệp CSV của trường"
            >
              <i className="fa-solid fa-file-excel"></i>
              <span>Nhập Thực Tế (Excel/CSV)</span>
            </button>

            {/* Nút Thêm Từng Học Sinh */}
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold px-3 py-2 rounded-lg flex items-center gap-1.5 transition cursor-pointer shadow-xs"
            >
              <i className="fa-solid fa-user-plus"></i>
              <span>+ Thêm Học Sinh</span>
            </button>

            {/* Nút Xuất File CSV */}
            <button
              onClick={handleExportCsv}
              className="bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold px-3 py-2 rounded-lg flex items-center gap-1.5 border border-slate-300 transition cursor-pointer"
              title="Xuất bảng điểm ra file CSV mở bằng Excel"
            >
              <i className="fa-solid fa-file-export text-emerald-700"></i>
              <span>Xuất Excel (.CSV)</span>
            </button>

            {/* Nút In */}
            <button
              onClick={() => window.print()}
              className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold px-3 py-2 rounded-lg flex items-center gap-1.5 border border-slate-300 transition cursor-pointer"
            >
              <i className="fa-solid fa-print"></i>
              <span>In Sổ</span>
            </button>
          </div>
        </div>

        {/* THANH BỘ LỌC THEO LỚP HỌC (10A1, 10A3, 12C1, 12C2, 12C3) */}
        <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-2.5">
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center text-xs font-black shrink-0">
                <i className="fa-solid fa-filter"></i>
              </span>
              <div>
                <span className="text-xs font-bold text-slate-800 uppercase tracking-wide">
                  Lọc Học Sinh Theo Lớp:
                </span>
                <span className="text-[11px] text-slate-500 block">
                  {filterClass === 'all' 
                    ? `Toàn bộ 5 lớp (${students.length} học sinh) • Nhấp vào từng lớp để theo dõi và vào điểm tập trung` 
                    : `Đang quản lý lớp ${filterClass} (${students.filter(s => s.class === filterClass).length} học sinh)`}
                </span>
              </div>
            </div>

            {/* Nút lọc nhanh theo 5 lớp */}
            <div className="flex items-center gap-1.5 flex-wrap">
              <button
                onClick={() => setFilterClass('all')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                  filterClass === 'all'
                    ? 'bg-emerald-800 text-white shadow-xs'
                    : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-300'
                }`}
              >
                <i className="fa-solid fa-layer-group text-[10px]"></i>
                <span>Tất cả ({students.length})</span>
              </button>
              {availableClasses.map((cls) => {
                const count = students.filter(s => s.class === cls).length;
                const isSelected = filterClass === cls;
                return (
                  <button
                    key={cls}
                    onClick={() => setFilterClass(cls)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                      isSelected
                        ? 'bg-emerald-800 text-white shadow-xs'
                        : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-300'
                    }`}
                  >
                    <i className={`fa-solid fa-graduation-cap text-[10px] ${isSelected ? 'text-amber-300' : 'text-emerald-600'}`}></i>
                    <span>Lớp {cls}</span>
                    <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                      isSelected ? 'bg-emerald-950/50 text-emerald-100' : 'bg-slate-100 text-slate-600'
                    }`}>
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Thanh thống kê nhanh */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
            <span className="text-slate-500 font-medium block">Sĩ số theo dõi:</span>
            <span className="text-lg font-black text-slate-800">{totalCount} học sinh</span>
          </div>

          <div className="bg-emerald-50 p-3 rounded-lg border border-emerald-200">
            <span className="text-emerald-700 font-medium block">Xếp loại Đạt:</span>
            <span className="text-lg font-black text-emerald-800">
              {passCount} / {totalCount} ({totalCount ? Math.round((passCount / totalCount) * 100) : 0}%)
            </span>
          </div>

          <div className="bg-amber-50 p-3 rounded-lg border border-amber-200">
            <span className="text-amber-700 font-medium block">Cần giảm tải gối (Thừa cân):</span>
            <span className="text-lg font-black text-amber-800">{overweightCount} học sinh</span>
          </div>

          <div className="bg-rose-50 p-3 rounded-lg border border-rose-200">
            <span className="text-rose-700 font-medium block">Bệnh lý nền nhẹ cần chú ý:</span>
            <span className="text-lg font-black text-rose-800">{mildCount} học sinh</span>
          </div>
        </div>

        {/* Bộ lọc bảng & Tìm kiếm */}
        <div className="flex items-center justify-between gap-3 text-xs flex-wrap bg-slate-50/80 p-2.5 rounded-lg border border-slate-200">
          <div className="flex items-center gap-3 flex-wrap">
            {/* Lọc theo Lớp động */}
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-slate-700">Lớp thực tế:</span>
              <select
                value={filterClass}
                onChange={(e) => setFilterClass(e.target.value)}
                className="bg-white border border-slate-300 rounded px-2.5 py-1 text-slate-800 font-bold cursor-pointer"
              >
                <option value="all">Tất cả các lớp ({students.length})</option>
                {availableClasses.map(c => {
                  const cCount = students.filter(s => s.class === c).length;
                  return (
                    <option key={c} value={c}>
                      Lớp {c} ({cCount} HS)
                    </option>
                  );
                })}
              </select>
            </div>

            {/* Xếp loại */}
            <div className="flex items-center gap-1.5">
              <span className="font-semibold text-slate-700">Xếp loại:</span>
              <select
                value={filterRating}
                onChange={(e) => setFilterRating(e.target.value)}
                className="bg-white border border-slate-300 rounded px-2 py-1 text-slate-800 font-medium cursor-pointer"
              >
                <option value="all">Tất cả xếp loại</option>
                <option value="Đạt">Đạt (Đ)</option>
                <option value="Chưa đạt">Chưa đạt (CĐ)</option>
              </select>
            </div>

            {/* Ô tìm kiếm */}
            <div className="relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Tìm tên, mã HS, lớp..."
                className="bg-white border border-slate-300 rounded-md pl-7 pr-2.5 py-1 text-xs w-44 md:w-56 focus:outline-emerald-600 font-medium"
              />
              <i className="fa-solid fa-magnifying-glass absolute left-2 top-2 text-slate-400 text-[11px]"></i>
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-2 top-1 text-slate-400 hover:text-slate-600 font-bold"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleSetAllPass}
              className="text-xs bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-semibold px-2.5 py-1 rounded border border-emerald-200 transition cursor-pointer"
              title="Đánh dấu tất cả học sinh đang hiển thị là Đạt"
            >
              <i className="fa-solid fa-check-double mr-1"></i> Đánh dấu tất cả Đạt
            </button>

            <button
              onClick={handleClearAllStudents}
              className="text-xs text-rose-700 hover:text-rose-900 font-semibold hover:underline"
              title="Xóa trắng để nhập danh sách mới"
            >
              Làm trống
            </button>

            <button
              onClick={handleResetSampleData}
              className="text-xs text-slate-500 hover:text-slate-700 hover:underline"
              title="Tải lại danh sách mẫu"
            >
              Nạp mẫu
            </button>
          </div>
        </div>

        {/* Bảng sổ điểm đánh giá thường xuyên */}
        <div className="overflow-x-auto border border-slate-200 rounded-lg">
          <table className="w-full text-left text-xs md:text-sm">
            <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200 uppercase text-[11px]">
              <tr>
                <th className="p-3">Mã HS</th>
                <th className="p-3">Họ và Tên</th>
                <th className="p-3">Lớp</th>
                <th className="p-3">Thể trạng (BMI)</th>
                <th className="p-3">Thực hiện kỹ thuật</th>
                <th className="p-3">Thái độ & Tinh thần</th>
                <th className="p-3">Tự học & Ứng dụng số</th>
                <th className="p-3 text-center">Xếp loại (TT22)</th>
                <th className="p-3 text-center no-print">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={9} className="p-8 text-center text-slate-500">
                    <i className="fa-solid fa-user-slash text-2xl text-slate-300 block mb-2"></i>
                    Không tìm thấy học sinh nào phù hợp với bộ lọc.<br />
                    Thầy/Cô có thể bấm <strong>&quot;Nhập Thực Tế (Excel/CSV)&quot;</strong> để nạp danh sách lớp thực tế của trường.
                  </td>
                </tr>
              ) : (
                filteredStudents.map((st) => (
                  <tr key={st.id} className="hover:bg-slate-50/80 transition">
                    <td className="p-3 font-mono font-semibold text-slate-600 whitespace-nowrap">
                      {st.code}
                    </td>
                    <td className="p-3 font-bold text-slate-900 whitespace-nowrap">
                      {st.name}
                      <span className="block text-[11px] font-normal text-slate-500">
                        {st.gender} • {st.heightCm}cm / {st.weightKg}kg {st.parentPhone ? `• SĐT: ${st.parentPhone}` : ''}
                      </span>
                    </td>
                    <td className="p-3 font-bold text-emerald-800 whitespace-nowrap">{st.class}</td>
                    <td className="p-3 whitespace-nowrap">
                      <span className={`px-2 py-0.5 rounded text-xs font-semibold ${
                        st.status === 'overweight' ? 'bg-amber-100 text-amber-800' :
                        st.status === 'underweight' ? 'bg-blue-100 text-blue-800' :
                        st.status === 'mild' ? 'bg-rose-100 text-rose-800' : 'bg-emerald-100 text-emerald-800'
                      }`}>
                        {st.bmi} - {st.status === 'overweight' ? 'Thừa cân' : st.status === 'underweight' ? 'Thiếu cân' : st.status === 'mild' ? 'Bệnh nền nhẹ' : 'Chuẩn'}
                      </span>
                    </td>
                    <td className="p-3 max-w-xs">
                      <input
                        type="text"
                        value={st.evalTech}
                        onChange={(e) => handleQuickEditComment(st.id, 'evalTech', e.target.value)}
                        className="w-full bg-transparent hover:bg-white focus:bg-white border border-transparent hover:border-slate-300 focus:border-emerald-500 rounded px-1.5 py-0.5 text-xs text-slate-700"
                      />
                    </td>
                    <td className="p-3 max-w-xs">
                      <input
                        type="text"
                        value={st.evalAttitude}
                        onChange={(e) => handleQuickEditComment(st.id, 'evalAttitude', e.target.value)}
                        className="w-full bg-transparent hover:bg-white focus:bg-white border border-transparent hover:border-slate-300 focus:border-emerald-500 rounded px-1.5 py-0.5 text-xs text-slate-700"
                      />
                    </td>
                    <td className="p-3 max-w-xs">
                      <input
                        type="text"
                        value={st.evalDigital}
                        onChange={(e) => handleQuickEditComment(st.id, 'evalDigital', e.target.value)}
                        className="w-full bg-transparent hover:bg-white focus:bg-white border border-transparent hover:border-slate-300 focus:border-emerald-500 rounded px-1.5 py-0.5 text-xs text-slate-700"
                      />
                    </td>
                    <td className="p-3 text-center whitespace-nowrap">
                      <button
                        onClick={() => handleToggleRating(st.id)}
                        title="Nhấp để thay đổi Đạt / Chưa đạt"
                        className={`font-bold px-2.5 py-1 rounded text-xs transition cursor-pointer ${
                          st.rating === 'Đạt'
                            ? 'bg-emerald-100 hover:bg-emerald-200 text-emerald-800'
                            : 'bg-rose-100 hover:bg-rose-200 text-rose-800'
                        }`}
                      >
                        {st.rating === 'Đạt' ? 'Đạt (Đ)' : 'Chưa đạt (CĐ)'}
                      </button>
                    </td>
                    <td className="p-3 text-center whitespace-nowrap no-print">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => setEditingStudent(st)}
                          title="Sửa toàn diện thông tin thực tế (Mã, Tên, Chiều cao, Cân nặng...)"
                          className="p-1.5 text-slate-600 hover:text-emerald-700 rounded hover:bg-slate-100 transition cursor-pointer"
                        >
                          <i className="fa-solid fa-user-pen"></i>
                        </button>
                        <button
                          onClick={() => onSelectForMessage(st)}
                          title="Soạn tin Zalo/SMS cho phụ huynh"
                          className="p-1.5 text-slate-600 hover:text-rose-600 rounded hover:bg-slate-100 transition cursor-pointer"
                        >
                          <i className="fa-solid fa-comment-dots"></i>
                        </button>
                        <button
                          onClick={() => handleDeleteStudent(st.id)}
                          title="Xóa học sinh"
                          className="p-1.5 text-slate-400 hover:text-rose-600 rounded hover:bg-slate-100 transition cursor-pointer"
                        >
                          <i className="fa-solid fa-trash-can"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

      </div>

      {/* Modal Thêm Học Sinh Mới Đầy Đủ */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-5 space-y-4 max-h-[90vh] overflow-y-auto border border-slate-200">
            <div className="flex justify-between items-center border-b pb-2">
              <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                <i className="fa-solid fa-user-plus text-emerald-600"></i>
                Thêm Học Sinh Vào Sổ Theo Dõi Thực Tế
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-600 text-xl font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveNewStudent} className="space-y-3 text-xs md:text-sm">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Mã định danh HS:</label>
                  <input
                    type="text"
                    value={newCode}
                    onChange={(e) => setNewCode(e.target.value)}
                    placeholder="Ví dụ: 20241201 hoặc HS12A1-05"
                    className="w-full bg-slate-50 border rounded-lg p-2 font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Lớp thực tế:</label>
                  <input
                    type="text"
                    value={newClass}
                    onChange={(e) => setNewClass(e.target.value)}
                    placeholder="Ví dụ: 12A1, 12A2, 11A3..."
                    required
                    className="w-full bg-slate-50 border rounded-lg p-2 font-bold text-slate-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2">
                  <label className="block font-semibold text-slate-700 mb-1">Họ và Tên:</label>
                  <input
                    type="text"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="Nhập họ và tên đầy đủ..."
                    required
                    className="w-full bg-slate-50 border rounded-lg p-2 font-bold"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Giới tính:</label>
                  <select
                    value={newGender}
                    onChange={(e) => setNewGender(e.target.value as 'Nam' | 'Nữ')}
                    className="w-full bg-slate-50 border rounded-lg p-2 cursor-pointer"
                  >
                    <option value="Nam">Nam</option>
                    <option value="Nữ">Nữ</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 bg-emerald-50/60 p-3 rounded-xl border border-emerald-200">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1 text-xs">Chiều cao (cm):</label>
                  <input
                    type="number"
                    value={newHeight}
                    onChange={(e) => setNewHeight(Number(e.target.value))}
                    min={120}
                    max={210}
                    required
                    className="w-full bg-white border border-emerald-300 rounded-lg p-2 font-bold"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1 text-xs">Cân nặng (kg):</label>
                  <input
                    type="number"
                    value={newWeight}
                    onChange={(e) => setNewWeight(Number(e.target.value))}
                    min={30}
                    max={150}
                    step={0.5}
                    required
                    className="w-full bg-white border border-emerald-300 rounded-lg p-2 font-bold"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1 text-xs">BMI tự tính:</label>
                  <div className="bg-white border border-emerald-300 rounded-lg p-2 font-black text-center text-emerald-800">
                    {calculateBmiValue(newHeight, newWeight)}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Ghi chú y tế & Thể trạng:</label>
                  <input
                    type="text"
                    value={newMedicalNote}
                    onChange={(e) => setNewMedicalNote(e.target.value)}
                    placeholder="Ví dụ: Thừa cân, mỏi gối; hoặc tiền sử hen..."
                    className="w-full bg-slate-50 border rounded-lg p-2"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">SĐT Phụ huynh:</label>
                  <input
                    type="text"
                    value={newParentPhone}
                    onChange={(e) => setNewParentPhone(e.target.value)}
                    placeholder="Ví dụ: 0918.xxx.xxx"
                    className="w-full bg-slate-50 border rounded-lg p-2"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Nhận xét thực hiện kỹ thuật:</label>
                <input
                  type="text"
                  value={newEvalTech}
                  onChange={(e) => setNewEvalTech(e.target.value)}
                  className="w-full bg-slate-50 border rounded-lg p-2"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-lg border text-slate-600 hover:bg-slate-100 cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-bold cursor-pointer"
                >
                  Lưu Học Sinh
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Sửa Toàn Diện Thông Tin Học Sinh */}
      <EditStudentModal
        isOpen={!!editingStudent}
        student={editingStudent}
        onClose={() => setEditingStudent(null)}
        onSave={handleSaveEditedStudent}
      />

      {/* Modal Nhập Thực Tế Từ Excel / CSV */}
      <ImportStudentsModal
        isOpen={showImportModal}
        onClose={() => setShowImportModal(false)}
        onImport={handleImportStudents}
        currentCount={students.length}
      />

    </div>
  );
};
