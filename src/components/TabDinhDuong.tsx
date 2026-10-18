import React, { useState, useMemo } from 'react';
import { StudentProfile } from '../types';
import { INITIAL_STUDENTS } from '../data/students';

interface TabDinhDuongProps {
  students?: StudentProfile[];
}

export const TabDinhDuong: React.FC<TabDinhDuongProps> = ({ students = INITIAL_STUDENTS }) => {
  const [activeSubTab, setActiveSubTab] = useState<'tong-quan' | 'thuc-don' | 'khau-phan-lop' | 'so-cap-cuu'>('khau-phan-lop');
  const [selectedClassFilter, setSelectedClassFilter] = useState<string>('all');
  const [copiedStudentId, setCopiedStudentId] = useState<string | null>(null);
  const [copiedClassSummary, setCopiedClassSummary] = useState<boolean>(false);

  // Available classes dynamically extracted from real students data
  const availableClasses = useMemo(() => {
    return Array.from(new Set(students.map(s => s.class))).filter(Boolean).sort();
  }, [students]);

  // Filtered students according to class selection
  const classFilteredStudents = useMemo(() => {
    if (selectedClassFilter === 'all') return students;
    return students.filter(s => s.class === selectedClassFilter);
  }, [students, selectedClassFilter]);

  // Nutritional breakdown for selected class
  const classStats = useMemo(() => {
    const total = classFilteredStudents.length;
    const overweight = classFilteredStudents.filter(s => s.status === 'overweight').length;
    const underweight = classFilteredStudents.filter(s => s.status === 'underweight').length;
    const mild = classFilteredStudents.filter(s => s.status === 'mild').length;
    const standard = classFilteredStudents.filter(s => s.status === 'standard').length;
    const totalWaterLiters = Math.round(classFilteredStudents.reduce((acc, s) => acc + (s.weightKg * 0.04), 0) * 10) / 10;
    const totalCoconutWaterLiters = Math.round(total * 0.25 * 10) / 10; // ~250ml per student
    return { total, overweight, underweight, mild, standard, totalWaterLiters, totalCoconutWaterLiters };
  }, [classFilteredStudents]);

  const getNutritionalAdvice = (s: StudentProfile) => {
    if (s.status === 'overweight') {
      return `Giảm đường bột tinh chế; tuyệt đối hạn chế trà sữa, nước ngọt có gas. Tăng rau xanh Bến Tre (bầu, bí, rau ngót), ăn bưởi da xanh tráng miệng. Uống nước dừa xiêm nhạt không thêm đường.`;
    }
    if (s.status === 'underweight') {
      return `Bổ sung năng lượng và đạm lành mạnh: 2 quả chuối xiêm chín sau giờ tập; thêm cá rô đồng, cá lóc kho tộ, trứng gà và đậu phộng rang. Uống thêm 1 ly sữa ấm vào buổi tối trước 21h.`;
    }
    if (s.status === 'mild') {
      return `Giữ ấm cơ thể, kiêng uống nước đá lạnh buốt sau khi vận động ra mồ hôi. Uống nước dừa tươi ấm hoặc nước lọc nguội từng ngụm nhỏ. Bổ sung vitamin C từ cam sành để tăng sức đề kháng phế quản.`;
    }
    return `Duy trì khẩu phần cân đối: 2 chén cơm trắng/lứt, đạm từ cá sông/thịt nạc, canh rau củ thanh nhiệt. Bù khoáng tự nhiên 1 trái dừa xiêm sau các tiết học thể chất gắng sức.`;
  };

  const handleCopyStudentAdvice = (s: StudentProfile) => {
    const text = `[TƯ VẤN DINH DƯỠNG THPT HUỲNH TẤN PHÁT]
Kính gửi Phụ huynh em ${s.name} (Lớp ${s.class}):
- Chiều cao: ${s.heightCm} cm • Cân nặng: ${s.weightKg} kg • BMI: ${s.bmi} (${s.status === 'overweight' ? 'Thừa cân' : s.status === 'underweight' ? 'Thiếu cân' : s.status === 'mild' ? 'Lưu ý bệnh nền nhẹ' : 'Đạt chuẩn'}).
- Nhu cầu nước tối thiểu mỗi ngày: ${(s.weightKg * 0.04).toFixed(1)} Lít (bao gồm nước lọc và nước dừa bù khoáng).
- Lời khuyên dinh dưỡng học đường: ${getNutritionalAdvice(s)}
Trân trọng thông báo từ Giáo viên Giáo dục Thể chất!`;
    navigator.clipboard.writeText(text);
    setCopiedStudentId(s.id);
    setTimeout(() => setCopiedStudentId(null), 2000);
  };

  const handleCopyClassAdvice = () => {
    const classNameDisplay = selectedClassFilter === 'all' ? 'Toàn bộ các lớp' : `Lớp ${selectedClassFilter}`;
    const text = `[BÁO CÁO NHU CẦU DINH DƯỠNG & BÙ KHOÁNG GDTC - TRƯỜNG THPT HUỲNH TẤN PHÁT]
Đối tượng: ${classNameDisplay} (Sĩ số: ${classStats.total} học sinh)
1. Thống kê thể trạng & Nhu cầu khẩu phần:
- Thể lực đạt chuẩn: ${classStats.standard} học sinh.
- Thừa cân cần giảm calo/nước ngọt: ${classStats.overweight} học sinh.
- Thiếu cân cần bồi bổ đạm/chuối xiêm: ${classStats.underweight} học sinh.
- Bệnh nền cần kiêng nước đá, bù nước ấm: ${classStats.mild} học sinh.
2. Khuyến nghị bù nước sau giờ học Thể chất:
- Tổng lượng nước dừa tươi Bến Tre bù khoáng cần thiết: ~${classStats.totalCoconutWaterLiters} Lít (mỗi học sinh ~250ml - 1 trái dừa xiêm).
- Hạn chế tối đa việc học sinh uống nước ngọt có gas hoặc trà sữa trước cổng trường.
Trân trọng!`;
    navigator.clipboard.writeText(text);
    setCopiedClassSummary(true);
    setTimeout(() => setCopiedClassSummary(false), 2500);
  };

  return (
    <div id="tab-dinhduong" className="tab-content block space-y-4">
      <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs space-y-5">
        
        {/* Tiêu đề */}
        <div className="border-b pb-3 flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <h2 className="text-base md:text-lg font-bold text-slate-900 flex items-center gap-2">
              <i className="fa-solid fa-bowl-rice text-orange-600"></i>
              Chuyên Đề: Dinh Dưỡng Nông Thôn Cho Học Sinh THPT Vận Động Thể Chất
            </h2>
            <p className="text-xs text-slate-500">
              Áp dụng cho điều kiện kinh tế - nông nghiệp tỉnh Bến Tre (Châu Hưng) • Tận dụng nguồn thực phẩm sẵn có tại địa phương
            </p>
          </div>

          {/* Sub tabs */}
          <div className="flex items-center gap-1.5 text-xs flex-wrap">
            <button
              onClick={() => setActiveSubTab('khau-phan-lop')}
              className={`px-3 py-1.5 rounded-lg font-bold transition cursor-pointer flex items-center gap-1.5 ${
                activeSubTab === 'khau-phan-lop'
                  ? 'bg-orange-600 text-white shadow-xs'
                  : 'bg-orange-50 hover:bg-orange-100 text-orange-800 border border-orange-200'
              }`}
            >
              <i className="fa-solid fa-user-tag text-xs"></i>
              <span>Khẩu Phần Theo Lớp ({classFilteredStudents.length})</span>
            </button>
            <button
              onClick={() => setActiveSubTab('tong-quan')}
              className={`px-3 py-1.5 rounded-lg font-bold transition cursor-pointer ${
                activeSubTab === 'tong-quan'
                  ? 'bg-orange-600 text-white shadow-xs'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              Nguồn Chất Tại Chỗ
            </button>
            <button
              onClick={() => setActiveSubTab('thuc-don')}
              className={`px-3 py-1.5 rounded-lg font-bold transition cursor-pointer ${
                activeSubTab === 'thuc-don'
                  ? 'bg-orange-600 text-white shadow-xs'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              Thực Đơn Mẫu 1 Ngày
            </button>
            <button
              onClick={() => setActiveSubTab('so-cap-cuu')}
              className={`px-3 py-1.5 rounded-lg font-bold transition cursor-pointer ${
                activeSubTab === 'so-cap-cuu'
                  ? 'bg-orange-600 text-white shadow-xs'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              Xử Trí Sốc Nhiệt / Chuột Rút
            </button>
          </div>
        </div>

        {/* THANH BỘ LỌC THEO LỚP HỌC (10A1, 10A3, 12C1, 12C2, 12C3) */}
        <div className="bg-orange-50/60 p-3.5 rounded-xl border border-orange-200/80">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <span className="w-8 h-8 rounded-lg bg-orange-600 text-white flex items-center justify-center text-sm font-black shrink-0 shadow-2xs">
                <i className="fa-solid fa-utensils"></i>
              </span>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-800 uppercase tracking-wide">
                    Lọc Dinh Dưỡng Theo Lớp Học:
                  </span>
                  <span className="bg-orange-200 text-orange-900 text-[10px] font-bold px-2 py-0.5 rounded">
                    {selectedClassFilter === 'all' ? 'Toàn bộ 5 lớp' : `Lớp ${selectedClassFilter}`}
                  </span>
                </div>
                <span className="text-[11px] text-slate-600 block">
                  {selectedClassFilter === 'all'
                    ? `Đang xem toàn trường (${students.length} học sinh) • Bấm vào từng lớp để theo dõi nhu cầu dinh dưỡng tập trung`
                    : `Đang quản lý kế hoạch dinh dưỡng & bù nước cho lớp ${selectedClassFilter} (${classFilteredStudents.length} học sinh)`}
                </span>
              </div>
            </div>

            {/* Nút lọc nhanh theo 5 lớp */}
            <div className="flex items-center gap-1.5 flex-wrap">
              <button
                onClick={() => setSelectedClassFilter('all')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                  selectedClassFilter === 'all'
                    ? 'bg-orange-700 text-white shadow-xs'
                    : 'bg-white hover:bg-orange-100 text-slate-700 border border-orange-300'
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
                    onClick={() => setSelectedClassFilter(cls)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                      isSelected
                        ? 'bg-orange-700 text-white shadow-xs'
                        : 'bg-white hover:bg-orange-100 text-slate-700 border border-orange-300'
                    }`}
                  >
                    <i className={`fa-solid fa-graduation-cap text-[10px] ${isSelected ? 'text-amber-200' : 'text-orange-600'}`}></i>
                    <span>Lớp {cls}</span>
                    <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                      isSelected ? 'bg-orange-900/60 text-orange-100' : 'bg-orange-100 text-orange-800'
                    }`}>
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Thống kê nhanh nhu cầu dinh dưỡng của lớp đang chọn */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mt-3 pt-3 border-t border-orange-200/60 text-xs">
            <div className="bg-white p-2.5 rounded-lg border border-orange-200 shadow-2xs">
              <span className="text-slate-500 block text-[11px] font-medium">Sĩ số lớp:</span>
              <span className="font-extrabold text-slate-900 text-sm">{classStats.total} học sinh</span>
            </div>

            <div className="bg-white p-2.5 rounded-lg border border-orange-200 shadow-2xs">
              <span className="text-amber-700 block text-[11px] font-medium">Cần giảm calo/đường:</span>
              <span className="font-extrabold text-amber-800 text-sm">{classStats.overweight} HS (Thừa cân)</span>
            </div>

            <div className="bg-white p-2.5 rounded-lg border border-orange-200 shadow-2xs">
              <span className="text-blue-700 block text-[11px] font-medium">Cần tăng đạm & năng lượng:</span>
              <span className="font-extrabold text-blue-800 text-sm">{classStats.underweight} HS (Thiếu cân)</span>
            </div>

            <div className="bg-white p-2.5 rounded-lg border border-orange-200 shadow-2xs">
              <span className="text-emerald-700 block text-[11px] font-medium">Nước dừa tươi cần bù:</span>
              <span className="font-extrabold text-emerald-800 text-sm">~{classStats.totalCoconutWaterLiters} Lít (Cả lớp)</span>
            </div>
          </div>
        </div>

        {/* Tab 0: Khẩu phần và quản lý dinh dưỡng theo từng lớp học */}
        {activeSubTab === 'khau-phan-lop' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50 p-3 rounded-lg border border-slate-200">
              <div>
                <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                  <i className="fa-solid fa-list-check text-orange-600"></i>
                  Danh Sách Khẩu Phần Dinh Dưỡng: {selectedClassFilter === 'all' ? 'Toàn Trường (5 Lớp)' : `Lớp ${selectedClassFilter}`} ({classFilteredStudents.length} học sinh)
                </h3>
                <p className="text-xs text-slate-500">
                  Phân bổ dinh dưỡng cá nhân hóa theo thể trạng BMI, cân nặng thực tế và nguồn thực phẩm Bến Tre.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopyClassAdvice}
                  className="bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition cursor-pointer shadow-2xs"
                >
                  <i className={`fa-solid ${copiedClassSummary ? 'fa-check' : 'fa-copy'}`}></i>
                  <span>{copiedClassSummary ? 'Đã sao chép báo cáo!' : 'Sao chép báo cáo lớp'}</span>
                </button>
                <button
                  onClick={() => window.print()}
                  className="bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 text-xs font-semibold px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition cursor-pointer"
                >
                  <i className="fa-solid fa-print"></i>
                  <span>In sổ dinh dưỡng</span>
                </button>
              </div>
            </div>

            {/* Bảng danh sách học sinh theo lớp */}
            <div className="overflow-x-auto border border-slate-200 rounded-xl shadow-2xs bg-white">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-slate-100/90 text-slate-700 font-bold border-b border-slate-200 uppercase text-[11px] tracking-wider">
                  <tr>
                    <th className="py-2.5 px-3 w-12 text-center">STT</th>
                    <th className="py-2.5 px-3 w-28">Mã HS / Lớp</th>
                    <th className="py-2.5 px-3">Họ và tên</th>
                    <th className="py-2.5 px-3 w-28 text-center">Thể trạng (BMI)</th>
                    <th className="py-2.5 px-3 w-28 text-center">Nhu cầu nước/ngày</th>
                    <th className="py-2.5 px-3">Khuyến nghị dinh dưỡng học đường</th>
                    <th className="py-2.5 px-3 w-28 text-center no-print">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {classFilteredStudents.map((s, idx) => {
                    const isCopied = copiedStudentId === s.id;
                    const waterNeed = (s.weightKg * 0.04).toFixed(1);
                    return (
                      <tr key={s.id} className="hover:bg-orange-50/40 transition">
                        <td className="py-2.5 px-3 text-center font-medium text-slate-500">{idx + 1}</td>
                        <td className="py-2.5 px-3">
                          <span className="font-bold text-slate-800 block">{s.code}</span>
                          <span className="text-[11px] bg-slate-200/80 text-slate-700 px-1.5 py-0.2 rounded font-semibold">
                            Lớp {s.class}
                          </span>
                        </td>
                        <td className="py-2.5 px-3">
                          <span className="font-bold text-slate-900 block">{s.name}</span>
                          <span className="text-[11px] text-slate-500">
                            {s.gender} • {s.heightCm} cm • {s.weightKg} kg
                          </span>
                        </td>
                        <td className="py-2.5 px-3 text-center">
                          <span className={`font-bold px-2 py-0.5 rounded text-[11px] inline-block ${
                            s.status === 'overweight' ? 'bg-amber-100 text-amber-800 border border-amber-300' :
                            s.status === 'underweight' ? 'bg-blue-100 text-blue-800 border border-blue-300' :
                            s.status === 'mild' ? 'bg-rose-100 text-rose-800 border border-rose-300' :
                            'bg-emerald-100 text-emerald-800 border border-emerald-300'
                          }`}>
                            BMI {s.bmi}
                          </span>
                          <span className="block text-[10px] text-slate-500 mt-0.5">
                            {s.status === 'overweight' ? 'Thừa cân' :
                             s.status === 'underweight' ? 'Thiếu cân' :
                             s.status === 'mild' ? 'Bệnh nền nhẹ' : 'Đạt chuẩn'}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 text-center">
                          <span className="font-bold text-blue-700 text-xs block">{waterNeed} Lít</span>
                          <span className="text-[10px] text-slate-500">Nước + Nước dừa</span>
                        </td>
                        <td className="py-2.5 px-3 text-slate-600 leading-relaxed text-[11px]">
                          {getNutritionalAdvice(s)}
                        </td>
                        <td className="py-2.5 px-3 text-center no-print">
                          <button
                            onClick={() => handleCopyStudentAdvice(s)}
                            title="Sao chép lời khuyên dinh dưỡng gửi phụ huynh qua Zalo"
                            className={`px-2.5 py-1 rounded text-[11px] font-semibold transition cursor-pointer flex items-center justify-center gap-1 w-full ${
                              isCopied 
                                ? 'bg-emerald-700 text-white' 
                                : 'bg-orange-50 hover:bg-orange-100 text-orange-800 border border-orange-200'
                            }`}
                          >
                            <i className={`fa-solid ${isCopied ? 'fa-check' : 'fa-comment-dots'}`}></i>
                            <span>{isCopied ? 'Đã chép' : 'Gửi Zalo'}</span>
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 1: Tổng quan nguồn chất dinh dưỡng nông thôn */}
        {activeSubTab === 'tong-quan' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs md:text-sm">
              
              {/* Cột 1: Nguồn đạm */}
              <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200 space-y-2">
                <div className="flex items-center gap-2 font-bold text-emerald-900 text-sm">
                  <div className="w-8 h-8 rounded-lg bg-emerald-200 flex items-center justify-center text-emerald-800">
                    <i className="fa-solid fa-drumstick-bite"></i>
                  </div>
                  <span>Nguồn Đạm Địa Phương</span>
                </div>
                <p className="text-slate-600 leading-relaxed text-xs">
                  Cá sông và cá đồng (cá lóc, cá rô đồng, cá basa, tép trấu sông Hàm Luông, Ba Lai), trứng gà vịt thả vườn, đậu hũ tươi, đậu phộng rang.
                </p>
                <div className="bg-white p-2.5 rounded-lg border border-emerald-100 text-[11px] text-slate-700 space-y-1">
                  <p><strong>• Tác dụng:</strong> Phục hồi và tái tạo sợi cơ sau các tiết nhảy đập bóng, chạy luồn cọc.</p>
                  <p><strong>• Gợi ý:</strong> Canh chua cá lóc, trứng chiên cà chua, tàu hũ dồn thịt.</p>
                </div>
              </div>

              {/* Cột 2: Bù nước & khoáng nước dừa xiêm */}
              <div className="p-4 bg-amber-50 rounded-xl border border-amber-200 space-y-2">
                <div className="flex items-center gap-2 font-bold text-amber-900 text-sm">
                  <div className="w-8 h-8 rounded-lg bg-amber-200 flex items-center justify-center text-amber-800">
                    <i className="fa-solid fa-faucet-drip"></i>
                  </div>
                  <span>Bù Nước & Khoáng Tự Nhiên</span>
                </div>
                <p className="text-slate-600 leading-relaxed text-xs">
                  <strong>Nước dừa tươi xiêm Bến Tre</strong> dồi dào kali, magie và chất điện giải tự nhiên tốt nhất cho vận động viên học đường, giá thành rẻ và sẵn có khắp các vườn dừa xứ sở.
                </p>
                <div className="bg-white p-2.5 rounded-lg border border-amber-100 text-[11px] text-slate-700 space-y-1">
                  <p><strong>• Lưu ý quan trọng:</strong> Chỉ uống sau buổi tập 15-20 phút (khi thân nhiệt đã hạ bớt).</p>
                  <p><strong>• Cảnh báo:</strong> Tuyệt đối không cho đá lạnh buốt uống ừng ực ngay khi vừa chạy xong vì dễ gây viêm họng co thắt phế quản.</p>
                </div>
              </div>

              {/* Cột 3: Vitamin & Tinh bột lành */}
              <div className="p-4 bg-blue-50 rounded-xl border border-blue-200 space-y-2">
                <div className="flex items-center gap-2 font-bold text-blue-900 text-sm">
                  <div className="w-8 h-8 rounded-lg bg-blue-200 flex items-center justify-center text-blue-800">
                    <i className="fa-solid fa-carrot"></i>
                  </div>
                  <span>Vitamin & Tinh Bột Lành</span>
                </div>
                <p className="text-slate-600 leading-relaxed text-xs">
                  Khoai lang luộc, ngô bắp nếp, chuối xiêm chín, rau ngót, đọt nhãn lồng nấu canh, rau má đồng giải nhiệt.
                </p>
                <div className="bg-white p-2.5 rounded-lg border border-blue-100 text-[11px] text-slate-700 space-y-1">
                  <p><strong>• Cung cấp Glycogen:</strong> Giúp cơ bắp dự trữ năng lượng bền bỉ trong suốt 90 phút hoạt động dưới trời nắng ngoài sân trường.</p>
                  <p><strong>• Magie chống chuột rút:</strong> Chuối xiêm và rau ngót giàu magie giúp ngăn ngừa co cứng cơ bắp chân.</p>
                </div>
              </div>

            </div>

            {/* Banner quy tắc 3 KHÔNG */}
            <div className="bg-rose-50 border border-rose-200 rounded-xl p-4 text-xs">
              <span className="font-bold text-rose-800 text-sm flex items-center gap-2 mb-1.5">
                <i className="fa-solid fa-triangle-exclamation text-rose-600"></i>
                Quy Tắc &quot;3 KHÔNG&quot; Của Giáo Viên Thể Chất Khi Hướng Dẫn Học Sinh:
              </span>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-slate-700">
                <div className="bg-white p-2.5 rounded-lg border border-rose-100">
                  <strong className="text-rose-700">1. Không nhịn bữa sáng:</strong> Nhịn đói đi học dễ dẫn đến tụt đường huyết, chóng mặt, té ngã trên sân bê tông khi vận động gắng sức.
                </div>
                <div className="bg-white p-2.5 rounded-lg border border-rose-100">
                  <strong className="text-rose-700">2. Không trà sữa / nước ngọt có gas:</strong> Hàm lượng đường hóa học cao gây no ảo, lợi tiểu làm mất nước tế bào nhanh hơn trong tiết thể dục.
                </div>
                <div className="bg-white p-2.5 rounded-lg border border-rose-100">
                  <strong className="text-rose-700">3. Không uống nước ồ ạt một lúc:</strong> Uống từng ngụm nhỏ 50-100ml để nước hấp thu đều vào tế bào mà không gây ức chế dạ dày.
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Thực đơn mẫu */}
        {activeSubTab === 'thuc-don' && (
          <div className="space-y-3 text-xs md:text-sm">
            <h3 className="font-bold text-slate-900 text-sm">
              Thực Đơn Mẫu 1 Ngày Dành Cho Học Sinh THPT Chuẩn Bị Tiết Học Thể Dục Ngoài Trời:
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 space-y-1.5">
                <span className="font-bold text-emerald-800 uppercase block">1. Bữa Sáng (6:00 - 6:30)</span>
                <p className="text-slate-600">Ăn trước tiết học ít nhất 45 - 60 phút:</p>
                <ul className="list-disc list-inside text-slate-700 space-y-1">
                  <li>1 củ khoai lang luộc + 1 quả trứng gà luộc</li>
                  <li>Hoặc: Bát cháo cá lóc / hủ tiếu giò nạc</li>
                  <li>Uống 1 ly nước ấm nhỏ 150ml</li>
                </ul>
              </div>

              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 space-y-1.5">
                <span className="font-bold text-blue-800 uppercase block">2. Giữa Giờ Tập (7:45 - 8:30)</span>
                <p className="text-slate-600">Trong thời gian giải lao 5 phút:</p>
                <ul className="list-disc list-inside text-slate-700 space-y-1">
                  <li>Uống 2-3 ngụm nước lọc mát</li>
                  <li>Nếu mệt: ngậm lát chanh muối mỏng hoặc 1 múi cam sành</li>
                  <li>Tránh tuyệt đối uống đá lạnh tê họng</li>
                </ul>
              </div>

              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 space-y-1.5">
                <span className="font-bold text-amber-800 uppercase block">3. Sau Khi Tan Tiết (9:00 - 9:30)</span>
                <p className="text-slate-600">Hồi phục cơ bắp và bù khoáng:</p>
                <ul className="list-disc list-inside text-slate-700 space-y-1">
                  <li>Uống 1 trái dừa tươi xiêm nguyên chất</li>
                  <li>Ăn 1 quả chuối xiêm chín để chống mỏi cơ</li>
                  <li>Lau khô mồ hôi trước khi quạt gió mạnh</li>
                </ul>
              </div>

              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 space-y-1.5">
                <span className="font-bold text-orange-800 uppercase block">4. Bữa Trưa (11:30 - 12:00)</span>
                <p className="text-slate-600">Phục hồi năng lượng học buổi chiều:</p>
                <ul className="list-disc list-inside text-slate-700 space-y-1">
                  <li>2 bát cơm trắng / cơm gạo lứt</li>
                  <li>Canh rau ngót nấu tép sông / cá rô</li>
                  <li>Đậu hũ chiên sả hoặc thịt kho trứng</li>
                  <li>Nghỉ trưa ít nhất 30 - 45 phút</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Sơ cấp cứu học đường */}
        {activeSubTab === 'so-cap-cuu' && (
          <div className="space-y-3 text-xs md:text-sm">
            <h3 className="font-bold text-slate-900 text-sm">
              Cẩm Nang Sơ Cấp Cứu Nhanh Cho Giáo Viên GDTC Trên Sân Bãi Trường Học:
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
              <div className="bg-rose-50 border border-rose-200 p-3.5 rounded-lg space-y-1.5">
                <span className="font-bold text-rose-800 flex items-center gap-1.5 text-sm">
                  <i className="fa-solid fa-sun text-rose-600"></i> Say Nắng / Sốc Nhiệt
                </span>
                <p className="text-slate-700"><strong>Dấu hiệu:</strong> Mặt đỏ gay hoặc tái nhợt, thở dốc, hoa mắt, vã mồ hôi lạnh.</p>
                <p className="text-slate-700"><strong>Xử trí:</strong> Đưa ngay học sinh vào bóng râm mát, nới lỏng cổ áo, chườm khăn mát vào trán và gáy; cho uống từng ngụm nhỏ nước dừa hoặc nước lọc pha ít muối.</p>
              </div>

              <div className="bg-amber-50 border border-amber-200 p-3.5 rounded-lg space-y-1.5">
                <span className="font-bold text-amber-800 flex items-center gap-1.5 text-sm">
                  <i className="fa-solid fa-person-falling text-amber-600"></i> Tụt Đường Huyết (Đói Lả)
                </span>
                <p className="text-slate-700"><strong>Dấu hiệu:</strong> Tay run rẩy, vã mồ hôi trán, tim đập nhanh, chân đứng không vững.</p>
                <p className="text-slate-700"><strong>Xử trí:</strong> Cho ngồi tựa lưng nghỉ ngơi, uống ngay 1 cốc nước đường ấm hoặc ngậm 1 viên kẹo ngọt; không để học sinh đứng dậy đi lại ngay.</p>
              </div>

              <div className="bg-blue-50 border border-blue-200 p-3.5 rounded-lg space-y-1.5">
                <span className="font-bold text-blue-800 flex items-center gap-1.5 text-sm">
                  <i className="fa-solid fa-bone text-blue-600"></i> Chuột Rút Cơ Bắp Chân
                </span>
                <p className="text-slate-700"><strong>Dấu hiệu:</strong> Cơ bắp chuối co rút cứng đờ, đau nhói, không gập được bàn chân.</p>
                <p className="text-slate-700"><strong>Xử trí:</strong> Đặt học sinh ngồi duỗi thẳng chân, người hỗ trợ dùng tay đẩy ngược các ngón chân về phía cẳng chân từ từ để kéo giãn cơ bắp; xoa bóp nhẹ nhàng, không bóp giật cục.</p>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
