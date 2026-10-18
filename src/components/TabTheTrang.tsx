import React, { useState } from 'react';
import { HealthStatus, StudentProfile, SportKey } from '../types';
import { SPORTS_LIST } from '../data/curriculum';

interface TabTheTrangProps {
  students: StudentProfile[];
  currentSport: SportKey;
  currentTeacherName: string;
  onSelectStudentForMessage?: (student: StudentProfile) => void;
}

export const TabTheTrang: React.FC<TabTheTrangProps> = ({
  students,
  currentSport,
  currentTeacherName,
  onSelectStudentForMessage
}) => {
  const [selectedClassFilter, setSelectedClassFilter] = useState<string>('all');
  const [selectedStudentId, setSelectedStudentId] = useState<string>(students[0]?.id || '');
  const [activeFilter, setActiveFilter] = useState<HealthStatus>('overweight');
  const [copiedNotification, setCopiedNotification] = useState<boolean>(false);

  // Available classes dynamically extracted from real students data
  const availableClasses = Array.from(new Set(students.map(s => s.class))).filter(Boolean).sort();

  const classFilteredStudents = students.filter(s => {
    if (selectedClassFilter !== 'all' && s.class !== selectedClassFilter) return false;
    return true;
  });

  const currentStudent = students.find(s => s.id === selectedStudentId) || classFilteredStudents[0] || students[0];
  const sportObj = SPORTS_LIST.find(s => s.key === currentSport) || SPORTS_LIST[0];

  const handleClassSelect = (cls: string) => {
    setSelectedClassFilter(cls);
    const filtered = cls === 'all' ? students : students.filter(s => s.class === cls);
    if (filtered.length > 0) {
      const sameStatus = filtered.find(s => s.status === activeFilter);
      if (sameStatus) {
        setSelectedStudentId(sameStatus.id);
      } else {
        setSelectedStudentId(filtered[0].id);
        setActiveFilter(filtered[0].status);
      }
    }
  };

  const handleStudentChange = (id: string) => {
    setSelectedStudentId(id);
    const st = students.find(s => s.id === id);
    if (st) {
      setActiveFilter(st.status);
    }
  };

  const handleFilterClick = (status: HealthStatus) => {
    setActiveFilter(status);
    // Find the first student matching this filter within the currently filtered class
    const match = classFilteredStudents.find(s => s.status === status) || students.find(s => s.status === status);
    if (match) {
      setSelectedStudentId(match.id);
      if (selectedClassFilter !== 'all' && match.class !== selectedClassFilter) {
        setSelectedClassFilter('all');
      }
    }
  };

  const handleCopyRegimen = () => {
    const textToCopy = `[PHÁC ĐỒ TẬP LUYỆN GDTC - THPT HUỲNH TẤN PHÁT]
Phân môn: ${sportObj.name}
Đối tượng: ${activeFilter === 'overweight' ? 'Thừa cân/Béo phì' : activeFilter === 'underweight' ? 'Thiếu cân/Yếu' : activeFilter === 'mild' ? 'Bệnh nền nhẹ' : 'Thể lực chuẩn'}
Giáo viên phụ trách: ${currentTeacherName}
Học sinh: ${currentStudent?.name || '---'} (BMI: ${currentStudent?.bmi || '---'})
Cảnh báo an toàn: ${getCoreWarning(activeFilter)}
Hệ thống bài tập:
${getExerciseStepsText(activeFilter, sportObj.name)}`;

    navigator.clipboard.writeText(textToCopy);
    setCopiedNotification(true);
    setTimeout(() => setCopiedNotification(false), 2500);
  };

  function getCoreWarning(filter: HealthStatus) {
    switch (filter) {
      case 'overweight':
        return 'TUYỆT ĐỐI KHÔNG ÉP HỌC SINH nhảy cao tiếp đất gối thẳng liên tục hoặc chạy cự ly rút đích quá dài gây sốc tim và thoái hóa sụn khớp gối sớm trên nền sân bê tông trường học.';
      case 'underweight':
        return 'KHÔNG ÁP DỤNG KHỐI LƯỢNG VẬN ĐỘNG DỒN DẬP; chia nhỏ các đợt tập, cho học sinh nghỉ giữa quãng từ 2-3 phút và uống nước dừa bù khoáng để phòng ngừa tụt đường huyết đột ngột.';
      case 'mild':
        return 'CẢNH BÁO Y TẾ HỌC ĐƯỜNG: Học sinh luôn phải mang theo thuốc xịt cắt cơn cá nhân bên người; giáo viên quan sát sắc diện môi, nhịp thở; cho phép học sinh chủ động dừng tập ngay khi có triệu chứng khó thở.';
      case 'standard':
        return 'Khởi động đầy đủ các khớp lớn; duy trì tải lượng vận động phù hợp theo chuẩn PPCT 70 tiết, hướng dẫn học sinh kỹ thuật tiếp đất hoãn xung an toàn trên mặt sân xi măng.';
    }
  }

  function getExerciseStepsText(filter: HealthStatus, sportName: string) {
    if (filter === 'overweight') {
      return `1. Khởi động thích ứng & Căng cơ tĩnh (6 - 8 phút): Nhịp tim duy trì 105 - 120 bpm. Xoay nhẹ nhàng các khớp cổ chân, cổ tay, khớp gối có đỡ tải; ép dẻo dọc, ép dẻo ngang.
2. Bài tập kỹ thuật giảm áp lực tải trọng (${sportName}): Chuyền bóng cao tay/đón bắt bóng tại chỗ, mô phỏng tay chạm bóng không bật nhảy; di chuyển bước lướt ngắn 3-5m.
3. Ứng dụng AI ghi nhận & Tự hồi tĩnh: Dùng camera AI / smartphone đo nhịp tim hồi phục sau bài tập dưới 100 bpm.`;
    }
    if (filter === 'underweight') {
      return `1. Khởi động làm ấm & Kích hoạt trương lực cơ (5 phút): Nhịp tim 100 - 115 bpm. Bài tập tay không, xoay khớp và hít thở sâu.
2. Bài tập kỹ thuật khéo léo & Cảm giác bóng/cầu (${sportName}): Tập kỹ thuật chạm bóng/cầu ở cự ly ngắn; phát huy độ khéo léo, bỏ nhỏ, quan sát chiến thuật thay vì va chạm mạnh.
3. Nghỉ ngơi giữa quãng & Bù năng lượng: Nghỉ 2-3 phút giữa các hiệp, uống từng ngụm nước dừa tươi hoặc nước lọc ấm.`;
    }
    if (filter === 'mild') {
      return `1. Khởi động nhẹ nhàng trong bóng râm (6 phút): Vận động khớp với cường độ thấp, tập trung điều hòa nhịp thở.
2. Bài tập kỹ thuật kiểm soát & Trọng tài hỗ trợ (${sportName}): Thực hiện tư thế chuẩn bị, động tác tay không bóng; tham gia vai trò bấm giờ, hỗ trợ đồng đội.
3. Bài tập thở 4 thì dưỡng sinh: Hít sâu 3s - Giữ hơi 2s - Thở ra chậm 4s - Nghỉ 2s giúp tăng thông khí phổi an toàn.`;
    }
    return `1. Khởi động toàn diện (8-10 phút): Chạy bước nhỏ, nâng cao đùi, gót chạm mông, ép dọc, ép ngang.
2. Thực hành kỹ thuật trọng tâm (${sportName}): Bật nhảy chuyền bóng, phát bóng qua lưới, thi đấu tập có chiến thuật.
3. Thả lỏng & Đánh giá AI: Rung lắc cơ bắp, dùng video AI phân tích quỹ đạo bóng và độ vung tay.`;
  }

  return (
    <div id="tab-thetrang" className="tab-content block space-y-4">
      
      {/* Banner Card tiêu đề */}
      <div className="bg-white rounded-xl p-4 md:p-5 border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700 text-xl shrink-0 shadow-2xs">
            <i className="fa-solid fa-wave-square"></i>
          </div>
          <div>
            <h2 className="text-base md:text-lg font-bold text-slate-900 flex items-center gap-2">
              Gợi Ý Bài Tập Thể Trạng & Hướng Dẫn Giáo Viên
            </h2>
            <p className="text-xs md:text-sm text-slate-600">
              Phác đồ tập luyện cá nhân hóa theo thể lực (thừa cân, thiếu cân, bệnh nền nhẹ), kèm kỹ thuật chi tiết và cảnh báo an toàn sư phạm.
            </p>
          </div>
        </div>

        {/* Bộ lọc thể trạng */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => handleFilterClick('overweight')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer shadow-2xs ${
              activeFilter === 'overweight'
                ? 'bg-emerald-800 text-white shadow-xs'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
          >
            THỪA CÂN / BÉO PHÌ
          </button>
          <button
            onClick={() => handleFilterClick('underweight')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
              activeFilter === 'underweight'
                ? 'bg-emerald-800 text-white shadow-xs'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
          >
            THIẾU CÂN / THỂ LỰC YẾU
          </button>
          <button
            onClick={() => handleFilterClick('mild')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
              activeFilter === 'mild'
                ? 'bg-emerald-800 text-white shadow-xs'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
          >
            Phác đồ lưu ý CÓ BỆNH NỀN NHẸ (Hen suyễn, tim mạch)
          </button>
          <button
            onClick={() => handleFilterClick('standard')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
              activeFilter === 'standard'
                ? 'bg-emerald-800 text-white shadow-xs'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
          >
            THỂ LỰC ĐẠT CHUẨN
          </button>
        </div>
      </div>

      {/* THANH BỘ LỌC THEO LỚP HỌC (10A1, 10A3, 12C1, 12C2, 12C3) */}
      <div className="bg-white rounded-xl p-3.5 border border-slate-200/90 shadow-2xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <span className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center text-sm font-black shrink-0">
              <i className="fa-solid fa-users-rectangle"></i>
            </span>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-800 uppercase tracking-wide">
                  Lọc Học Sinh Theo Lớp:
                </span>
                <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded">
                  {selectedClassFilter === 'all' ? 'Toàn bộ 5 lớp' : `Lớp ${selectedClassFilter}`}
                </span>
              </div>
              <span className="text-[11px] text-slate-500 block">
                {selectedClassFilter === 'all' 
                  ? `Đang hiển thị toàn trường (${students.length} học sinh) • Bấm vào từng lớp bên dưới để quản lý tập trung` 
                  : `Đang quản lý tập trung danh sách lớp ${selectedClassFilter} (${classFilteredStudents.length} học sinh)`}
              </span>
            </div>
          </div>

          {/* Danh sách nút chọn 5 lớp */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <button
              onClick={() => handleClassSelect('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                selectedClassFilter === 'all'
                  ? 'bg-emerald-800 text-white shadow-xs'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200'
              }`}
            >
              <i className="fa-solid fa-layer-group text-[10px]"></i>
              <span>Tất cả ({students.length})</span>
            </button>
            {availableClasses.map((cls) => {
              const count = students.filter(s => s.class === cls).length;
              const isSelected = selectedClassFilter === cls;
              return (
                <button
                  key={cls}
                  onClick={() => handleClassSelect(cls)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-emerald-800 text-white shadow-xs'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200'
                  }`}
                >
                  <i className={`fa-solid fa-graduation-cap text-[10px] ${isSelected ? 'text-amber-300' : 'text-emerald-600'}`}></i>
                  <span>Lớp {cls}</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                    isSelected ? 'bg-emerald-950/50 text-emerald-100' : 'bg-slate-200 text-slate-600'
                  }`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Thống kê nhanh thể lực theo lớp đang chọn */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mt-3 pt-3 border-t border-slate-100 text-xs">
          <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200 flex items-center justify-between">
            <div>
              <span className="text-slate-500 block text-[11px] font-medium">Sĩ số theo dõi:</span>
              <span className="font-extrabold text-slate-800 text-sm">{classFilteredStudents.length} học sinh</span>
            </div>
            <i className="fa-solid fa-users text-slate-400 text-base"></i>
          </div>

          <div className="bg-amber-50 p-2.5 rounded-lg border border-amber-200 flex items-center justify-between">
            <div>
              <span className="text-amber-700 block text-[11px] font-medium">Thừa cân / Béo phì:</span>
              <span className="font-extrabold text-amber-800 text-sm">
                {classFilteredStudents.filter(s => s.status === 'overweight').length} HS
              </span>
            </div>
            <i className="fa-solid fa-weight-scale text-amber-500 text-base"></i>
          </div>

          <div className="bg-blue-50 p-2.5 rounded-lg border border-blue-200 flex items-center justify-between">
            <div>
              <span className="text-blue-700 block text-[11px] font-medium">Thiếu cân / Yếu:</span>
              <span className="font-extrabold text-blue-800 text-sm">
                {classFilteredStudents.filter(s => s.status === 'underweight').length} HS
              </span>
            </div>
            <i className="fa-solid fa-person text-blue-500 text-base"></i>
          </div>

          <div className="bg-rose-50 p-2.5 rounded-lg border border-rose-200 flex items-center justify-between">
            <div>
              <span className="text-rose-700 block text-[11px] font-medium">Lưu ý bệnh nền nhẹ:</span>
              <span className="font-extrabold text-rose-800 text-sm">
                {classFilteredStudents.filter(s => s.status === 'mild').length} HS
              </span>
            </div>
            <i className="fa-solid fa-heart-pulse text-rose-500 text-base"></i>
          </div>
        </div>
      </div>

      {/* Lưới 2 cột */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* Cột trái: Thiết kế bài tập cho HS cụ thể */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs">
            <div className="flex items-center gap-2 text-slate-900 font-bold text-sm mb-3">
              <i className="fa-solid fa-sliders text-emerald-600"></i>
              <span>THIẾT KẾ BÀI TẬP CHO HỌC SINH CỤ THỂ</span>
            </div>

            <div className="space-y-3 text-xs md:text-sm">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-slate-700">
                    Lọc theo lớp thực tế:
                  </label>
                  <select
                    value={selectedClassFilter}
                    onChange={(e) => handleClassSelect(e.target.value)}
                    className="bg-slate-50 border border-slate-300 rounded px-2 py-1 font-bold text-slate-800 text-xs cursor-pointer"
                  >
                    <option value="all">Tất cả lớp ({students.length} HS)</option>
                    {availableClasses.map(c => (
                      <option key={c} value={c}>
                        Lớp {c} ({students.filter(s => s.class === c).length} HS)
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">
                    Chọn học sinh của <span className="text-emerald-700 font-bold">{currentTeacherName}</span>:
                  </label>
                  {classFilteredStudents.length === 0 ? (
                    <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-500 text-xs">
                      Chưa có học sinh nào trong lớp này.
                    </div>
                  ) : (
                    <select
                      value={currentStudent?.id || ''}
                      onChange={(e) => handleStudentChange(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 font-medium text-slate-800 focus:ring-1 focus:ring-emerald-500 cursor-pointer"
                    >
                      {classFilteredStudents.map((st) => (
                        <option key={st.id} value={st.id}>
                          [{st.class}] {st.name} ({st.code} • BMI {st.bmi} - {st.status === 'overweight' ? 'Thừa cân' : st.status === 'underweight' ? 'Thiếu cân' : st.status === 'mild' ? 'Bệnh nền' : 'Đạt chuẩn'})
                        </option>
                      ))}
                    </select>
                  )}
                </div>
              </div>

              {/* Thẻ hồ sơ học sinh */}
              {currentStudent && (
                <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 space-y-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold text-slate-900 text-sm">{currentStudent.name}</h3>
                      <p className="text-xs text-slate-500">
                        Lớp {currentStudent.class} • Chiều cao: {currentStudent.heightCm} cm • Cân nặng: {currentStudent.weightKg} kg
                      </p>
                    </div>
                    <span className={`font-bold px-2 py-0.5 rounded text-xs ${
                      currentStudent.status === 'overweight' ? 'bg-amber-100 text-amber-800' :
                      currentStudent.status === 'underweight' ? 'bg-blue-100 text-blue-800' :
                      currentStudent.status === 'mild' ? 'bg-rose-100 text-rose-800' : 'bg-emerald-100 text-emerald-800'
                    }`}>
                      BMI {currentStudent.bmi}
                    </span>
                  </div>

                  <div className="text-xs text-slate-600 bg-white p-2 rounded border border-slate-200">
                    <span className="font-bold text-rose-700 flex items-center gap-1">
                      <i className="fa-solid fa-triangle-exclamation"></i> Ghi chú y tế & sư phạm:
                    </span>
                    <span className="mt-1 block text-slate-700">{currentStudent.medicalNote}</span>
                  </div>

                  {onSelectStudentForMessage && (
                    <button
                      onClick={() => onSelectStudentForMessage(currentStudent)}
                      className="w-full bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 font-semibold py-1.5 rounded text-xs flex items-center justify-center gap-1.5 transition cursor-pointer"
                    >
                      <i className="fa-solid fa-comment-sms"></i>
                      <span>Gửi tin nhắn tư vấn phụ huynh em này</span>
                    </button>
                  )}
                </div>
              )}

              {/* Gợi ý thiết bị & công nghệ số hỗ trợ */}
              <div className="bg-emerald-50/70 border border-emerald-200 rounded-lg p-3 text-xs space-y-1.5">
                <div className="font-bold text-emerald-900 flex items-center gap-1.5">
                  <i className="fa-solid fa-mobile-screen-button text-emerald-600"></i>
                  <span>Năng lực AI & Số hỗ trợ:</span>
                </div>
                <p className="text-slate-700 leading-relaxed">
                  Dùng camera điện thoại thông minh quay chế độ 60fps / Slow-motion, sử dụng ứng dụng phân tích tư thế chuyển động (MediaPipe AI / Coach&apos;s Eye) để phát hiện lệch góc gập gối khi tiếp đất và độ mở khớp vai.
                </p>
              </div>

              {/* Vùng nhịp tim an toàn */}
              <div className="bg-blue-50/70 border border-blue-200 rounded-lg p-3 text-xs space-y-1">
                <span className="font-bold text-blue-900 flex items-center gap-1.5">
                  <i className="fa-solid fa-heart-pulse text-blue-600"></i> Dải nhịp tim an toàn khuyến nghị:
                </span>
                <p className="text-blue-800">
                  {activeFilter === 'overweight' && 'Duy trì nhịp tim trong ngưỡng 110 - 130 bpm (Vùng đốt mỡ hiếu khí, tránh gắng sức kỵ khí gây áp lực tim gối).'}
                  {activeFilter === 'underweight' && 'Duy trì 105 - 120 bpm, nghỉ cách quãng không để nhịp tim vượt 140 bpm kéo dài.'}
                  {activeFilter === 'mild' && 'Giữ nhịp tim dưới 115 bpm, luôn theo dõi nhịp thở và sắc diện.'}
                  {activeFilter === 'standard' && 'Ngưỡng tập luyện hiệu quả: 125 - 155 bpm (Phát triển sức bền và phản xạ tốc độ).'}
                </p>
              </div>

            </div>
          </div>
        </div>

        {/* Cột phải: Phác đồ tập luyện chi tiết */}
        <div className="lg:col-span-8 space-y-4">
          <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs space-y-4">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-3 gap-2">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  {activeFilter === 'overweight' ? 'HỌC SINH CÓ CHỈ SỐ BMI >= 24 (LỨA TUỔI 15-18 THPT)' :
                   activeFilter === 'underweight' ? 'HỌC SINH CÓ CHỈ SỐ BMI < 18.5 (THIẾU CÂN)' :
                   activeFilter === 'mild' ? 'HỌC SINH CÓ TIỀN SỬ BỆNH LÝ NHẸ (THEO DÕI ĐẶC BIỆT)' :
                   'HỌC SINH THỂ LỰC ĐẠT CHUẨN GDPT 2018'}
                </span>
                <h3 className="text-base md:text-lg font-bold text-slate-900 mt-1">
                  {activeFilter === 'overweight' && 'Phác đồ rèn luyện cho học sinh THỪA CÂN / BÉO PHÌ'}
                  {activeFilter === 'underweight' && 'Phác đồ rèn luyện cho học sinh THIẾU CÂN / THỂ LỰC YẾU'}
                  {activeFilter === 'mild' && 'Phác đồ lưu ý cho học sinh CÓ BỆNH NỀN NHẸ (Hen suyễn, tim mạch nhẹ)'}
                  {activeFilter === 'standard' && 'Phác đồ rèn luyện cho học sinh THỂ LỰC ĐẠT CHUẨN'}
                </h3>
                <p className="text-xs text-slate-500 font-medium">
                  Áp dụng cho phân môn: <strong className="text-emerald-700">{sportObj.name}</strong> • Trường THPT Huỳnh Tấn Phát
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopyRegimen}
                  className="text-xs bg-emerald-50 hover:bg-emerald-100 text-emerald-800 px-3 py-1.5 rounded-lg flex items-center gap-1.5 font-semibold border border-emerald-200 transition cursor-pointer"
                >
                  <i className="fa-solid fa-copy"></i>
                  <span>{copiedNotification ? 'Đã sao chép!' : 'Sao chép'}</span>
                </button>
                <button
                  onClick={() => window.print()}
                  className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1.5 rounded-lg flex items-center gap-1.5 font-medium border border-slate-200 transition cursor-pointer"
                >
                  <i className="fa-solid fa-print"></i> <span>In phác đồ</span>
                </button>
              </div>
            </div>

            {/* Cảnh báo cốt lõi màu hồng đỏ */}
            <div className={`p-3.5 rounded-r-lg border-l-4 ${
              activeFilter === 'mild' || activeFilter === 'overweight' ? 'bg-rose-50 border-rose-500 text-rose-900' :
              activeFilter === 'underweight' ? 'bg-amber-50 border-amber-500 text-amber-900' :
              'bg-emerald-50 border-emerald-500 text-emerald-900'
            }`}>
              <div className="flex items-start gap-2">
                <i className={`fa-solid fa-triangle-exclamation mt-0.5 text-sm ${
                  activeFilter === 'mild' || activeFilter === 'overweight' ? 'text-rose-600' :
                  activeFilter === 'underweight' ? 'text-amber-600' : 'text-emerald-600'
                }`}></i>
                <div className="text-xs md:text-sm leading-relaxed font-medium">
                  <strong className="uppercase font-bold">Lưu ý cốt lõi cho giáo viên: </strong>
                  {getCoreWarning(activeFilter)}
                </div>
              </div>
            </div>

            {/* Hệ thống bài tập thực hành trên lớp */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                Hệ Thống Bài Tập Thực Hành Trên Lớp (Chi Tiết Từng Bước Theo Phân Môn {sportObj.name}):
              </h4>
              
              <div className="space-y-2.5 text-xs md:text-sm">
                
                {/* Bước 1 */}
                <div className="p-3 rounded-lg border border-slate-200 bg-slate-50/60 hover:bg-white transition">
                  <div className="font-bold text-emerald-800 flex items-center justify-between">
                    <span>1. Khởi động thích ứng & Căng cơ tĩnh (6 - 8 phút)</span>
                    <span className="text-xs bg-slate-200 text-slate-700 px-2 py-0.5 rounded font-normal">
                      {activeFilter === 'overweight' ? 'Nhịp tim duy trì 105 - 120 bpm' :
                       activeFilter === 'mild' ? 'Nhịp tim < 110 bpm' : 'Nhịp tim 110 - 130 bpm'}
                    </span>
                  </div>
                  <p className="text-slate-600 mt-1 leading-relaxed">
                    {activeFilter === 'overweight'
                      ? 'Xoay nhẹ nhàng các khớp cổ chân, cổ tay, khớp gối có đỡ tải (hai tay đặt trên gối để san sẻ trọng lượng cơ thể); ép dẻo dọc, ép dẻo ngang với biên độ nâng dần. Tránh gập duỗi gối đột ngột hay ngồi xổm sâu trên sân bê tông.'
                      : activeFilter === 'underweight'
                      ? 'Làm ấm toàn thân bằng các động tác kéo giãn mềm mại, bài tập tay không tại chỗ. Kích hoạt cơ vai, cơ tay và cổ chân mà không tiêu hao nhiều năng lượng trước giờ học.'
                      : activeFilter === 'mild'
                      ? 'Thực hiện khởi động chậm trong bóng râm mát; xoay các khớp ở biên độ trung bình; kiểm tra nhịp thở đều đặn, không bắt chạy tăng tốc trong phần khởi động.'
                      : 'Chạy nhẹ nhàng 2 vòng sân trường, xoay đều các khớp lớn, ép dọc, ép ngang, nâng cao đùi và lườn bụng.'}
                  </p>
                </div>

                {/* Bước 2 */}
                <div className="p-3 rounded-lg border border-slate-200 bg-slate-50/60 hover:bg-white transition">
                  <div className="font-bold text-emerald-800 flex items-center justify-between">
                    <span>
                      2. Bài tập kỹ thuật giảm áp lực tải trọng (Phân môn {sportObj.name})
                    </span>
                    <span className="text-xs bg-slate-200 text-slate-700 px-2 py-0.5 rounded font-normal">
                      Tập cá nhân / Cặp đôi
                    </span>
                  </div>
                  <div className="text-slate-600 mt-1 leading-relaxed space-y-1">
                    {sportObj.key === 'bong-chuyen' && (
                      activeFilter === 'overweight' ? (
                        <>
                          <p>• <strong>Kỹ thuật chuyền bóng cao tay tại chỗ:</strong> Đứng tư thế chuẩn bị chân trước chân sau, gối khuỵu nhẹ, tập trung đón bóng và chuyền bóng tay không hoặc bóng treo để rèn điểm tiếp xúc bóng, không yêu cầu nhảy đập bóng.</p>
                          <p>• <strong>Di chuyển bước lướt ngắn:</strong> Tập bước lướt ngang chạm vật tiêu cự ly 3m - 5m thay vì chạy bứt tốc 9m, giữ trọng tâm ổn định để không tạo xung lực mạnh lên đầu gối.</p>
                        </>
                      ) : activeFilter === 'mild' ? (
                        <>
                          <p>• Tập mô phỏng không bóng ở tư thế đứng tĩnh, tập trung vào yếu lĩnh vung tay và đón bóng chuẩn xác.</p>
                          <p>• Đứng chuyền bóng nhẹ cặp đôi cự ly 3m, cho phép dừng lại hít thở sâu khi thấy nhịp tim đập nhanh.</p>
                        </>
                      ) : (
                        <>
                          <p>• Thực hiện kỹ thuật chuyền bóng cao tay, phát bóng qua lưới ở cự ly quy định.</p>
                          <p>• Luyện tập phối hợp bước đà bật nhảy đập bóng và chắn bóng đôi nhịp nhàng.</p>
                        </>
                      )
                    )}

                    {sportObj.key === 'bong-ro' && (
                      activeFilter === 'overweight' ? (
                        <>
                          <p>• <strong>Chuyền bóng hai tay trước ngực và qua đầu:</strong> Đứng tại chỗ cách nhau 3m chuyền bóng chuẩn xác, miết cổ tay phát lực, không cần bật nhảy.</p>
                          <p>• <strong>Ném rổ tại chỗ:</strong> Đứng cự ly ném phạt 4.6m, đẩy bóng vào rổ theo hình cầu vồng parabol, tiếp đất nhẹ nhàng bằng hai chân hoãn xung.</p>
                        </>
                      ) : activeFilter === 'mild' ? (
                        <>
                          <p>• Luyện tập nhồi bóng tại chỗ tay thuận và tay nghịch; chuyền bóng dội tường kiểm soát lực.</p>
                          <p>• Ném rổ cự ly gần 1.5 - 2m không bật nhảy, giảm thiểu tối đa gắng sức.</p>
                        </>
                      ) : (
                        <>
                          <p>• Chạy luồn cọc zíc zắc dẫn bóng tốc độ cao; nhảy dừng bắt bóng xoay chân trụ.</p>
                          <p>• Nhảy ném rổ một tay trên vai sau khi dẫn bóng tốc độ.</p>
                        </>
                      )
                    )}

                    {sportObj.key === 'cau-long' && (
                      activeFilter === 'overweight' ? (
                        <>
                          <p>• <strong>Bước trượt ngang và tiến lùi cự ly ngắn:</strong> Tập kỹ thuật ve cầu, bỏ nhỏ sát lưới mà không cần nhảy smash đập cầu trên không.</p>
                          <p>• Giữ vợt trước ngực, tập trung cổ tay linh hoạt để điều khiển điểm rơi quả cầu.</p>
                        </>
                      ) : (
                        <>
                          <p>• Luyện bộ chân di chuyển 4 góc sân, lùi chéo bật nhảy đập cầu thuận tay.</p>
                          <p>• Đánh cầu qua lại với bạn liên tục 15-20 đường cầu giữ nhịp độ cao.</p>
                        </>
                      )
                    )}

                    {(sportObj.key === 'bong-da' || sportObj.key === 'da-cau') && (
                      <p>
                        • Tập cảm giác tiếp xúc bóng/cầu bằng lòng bàn chân và mu bàn chân cự ly ngắn 3-4m; giảm thiểu các pha tranh chấp tì đè hoặc bứt tốc cự ly dài.
                      </p>
                    )}
                  </div>
                </div>

                {/* Bước 3 */}
                <div className="p-3 rounded-lg border border-slate-200 bg-slate-50/60 hover:bg-white transition">
                  <div className="font-bold text-emerald-800 flex items-center justify-between">
                    <span>3. Ứng dụng AI ghi nhận & Tự hồi tĩnh</span>
                    <span className="text-xs bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-normal">
                      Năng lực AI & Công nghệ
                    </span>
                  </div>
                  <p className="text-slate-600 mt-1 leading-relaxed">
                    Sử dụng thiết bị đếm bước chân hoặc camera AI kiểm tra chỉ số nhịp tim hồi phục sau bài tập (mục tiêu trở về dưới 100 bpm trong vòng 3 phút). Thả lỏng toàn thân, thả lỏng bắp chuối, hít thở sâu với bóng tự do.
                  </p>
                </div>

              </div>
            </div>

            {/* Lời khuyên dinh dưỡng Bến Tre */}
            <div className="bg-amber-50/90 border border-amber-200 p-3.5 rounded-lg text-xs space-y-1.5">
              <span className="font-bold text-amber-900 flex items-center gap-1.5 text-xs md:text-sm">
                <i className="fa-solid fa-leaf text-amber-600"></i> Hướng dẫn sinh hoạt & Dinh dưỡng tại nhà (Đặc thù Bến Tre - Châu Hưng):
              </span>
              <p className="text-amber-800 leading-relaxed">
                {activeFilter === 'overweight' && (
                  'Tăng cường rau xanh, củ quả tại địa phương; uống nước lọc vừa đủ trước - trong - sau buổi tập; tuyệt đối hạn chế nước ngọt đóng chai, nước có gas hoặc trà sữa trước giờ tập thể chất. Sau buổi tập có thể uống 1 ly nước dừa tươi nguyên chất để bù khoáng nhưng không thêm đường hay sữa đặc.'
                )}
                {activeFilter === 'underweight' && (
                  'Bổ sung đạm từ cá sông đánh bắt tại địa phương (cá lóc, cá trê, cá basa), trứng gà thả vườn, canh đậu hũ; ăn bữa phụ nhẹ (chuối chín, khoai lang luộc) trước giờ tập 60 phút để không bị đói lả.'
                )}
                {activeFilter === 'mild' && (
                  'Giữ ấm đường thở khi tập vào sáng sớm; uống nước ấm từng ngụm nhỏ; tránh thức ăn gây kích ứng dị ứng; nghỉ ngơi ngủ đủ giấc 7-8 tiếng mỗi đêm.'
                )}
                {activeFilter === 'standard' && (
                  'Duy trì khẩu phần cân đối: tinh bột lành từ gạo và khoai bắp, đạm cá và thịt nạc, bù đủ nước dừa và nước lọc khi hoạt động dưới trời nắng ngoài sân trường.'
                )}
              </p>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
};
