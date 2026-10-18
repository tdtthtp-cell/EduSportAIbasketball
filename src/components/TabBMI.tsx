import React, { useState, useMemo } from 'react';
import { calculateBmiValue, INITIAL_STUDENTS } from '../data/students';
import { StudentProfile, HealthStatus } from '../types';

interface TabBMIProps {
  students?: StudentProfile[];
  onUpdateStudents?: (students: StudentProfile[]) => void;
  onSwitchToTheTrang?: () => void;
  onSelectForMessage?: (student: StudentProfile) => void;
  onShowToast?: (message: string) => void;
}

interface BmiCategoryInfo {
  status: HealthStatus;
  label: string;
  badgeClass: string;
  advice: string;
}

function getBmiCategoryInfo(bmi: number): BmiCategoryInfo {
  if (bmi < 18.5) {
    return {
      status: 'underweight',
      label: 'Thiếu cân (BMI < 18.5)',
      badgeClass: 'bg-blue-100 text-blue-800 border-blue-300',
      advice: 'Học sinh có thể trạng gầy, cơ lực còn yếu. Khuyến nghị giáo viên giao lượng vận động vừa sức, ưu tiên các bài tập phát triển sức mạnh bền bỉ và sức bền chung; hướng dẫn gia đình tăng cường dinh dưỡng giàu đạm thực vật, cá sông Bến Tre, sữa hạt và nghỉ ngơi hợp lý.'
    };
  }
  if (bmi >= 23.0) {
    return {
      status: 'overweight',
      label: bmi >= 25.0 ? 'Thừa cân / Béo phì (BMI ≥ 25.0)' : 'Tiền béo phì / Nguy cơ (BMI 23 - 24.9)',
      badgeClass: 'bg-amber-100 text-amber-800 border-amber-300',
      advice: 'Học sinh có thể trạng thừa cân, khớp gối và cổ chân chịu tải lớn khi nhảy tiếp đất. Tuyệt đối không ép nhảy đập bóng liên tục trên mặt sân cứng bê tông; thay thế bằng các bài tập chuyền bóng kỹ thuật tại chỗ, di chuyển bước nhỏ, kéo dài thời gian khởi động và uống nước bù khoáng.'
    };
  }
  return {
    status: 'standard',
    label: 'Thể lực chuẩn (BMI 18.5 - 22.9)',
    badgeClass: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    advice: 'Học sinh có thể trạng phát triển cân đối và lý tưởng. Khuyến khích giáo viên phân công làm nhóm trưởng thị phạm động tác mẫu, tham gia đầy đủ các bài tập đối kháng, thi đấu nâng cao và duy trì cường độ vận động tích cực.'
  };
}

export const TabBMI: React.FC<TabBMIProps> = ({
  students = INITIAL_STUDENTS,
  onUpdateStudents,
  onSwitchToTheTrang,
  onSelectForMessage,
  onShowToast
}) => {
  // Lọc học sinh theo lớp
  const [selectedClass, setSelectedClass] = useState<string>('all');
  const [selectedStudentId, setSelectedStudentId] = useState<string>('');

  // Thông số thể trạng
  const [studentName, setStudentName] = useState<string>('Lê Khánh An');
  const [studentClass, setStudentClass] = useState<string>('10A1');
  const [height, setHeight] = useState<number>(155);
  const [weight, setWeight] = useState<number>(65.4);
  const [age, setAge] = useState<number>(15);
  const [gender, setGender] = useState<'Nam' | 'Nữ'>('Nữ');
  const [medicalNote, setMedicalNote] = useState<string>('Thừa cân độ 1, mỏi khớp gối khi nhảy tiếp đất liên tục');

  // Thông báo đã lưu
  const [savedSuccessInfo, setSavedSuccessInfo] = useState<{
    name: string;
    className: string;
    bmi: number;
    statusLabel: string;
    badgeClass: string;
    student: StudentProfile;
  } | null>(null);

  // Kết quả tính toán
  const [calculatedResult, setCalculatedResult] = useState<{
    bmi: number;
    category: BmiCategoryInfo;
    idealWeightMin: number;
    idealWeightMax: number;
    maxHeartRate: number;
  }>(() => {
    const initBmi = calculateBmiValue(155, 65.4);
    const hM = 155 / 100;
    return {
      bmi: initBmi,
      category: getBmiCategoryInfo(initBmi),
      idealWeightMin: Math.round(18.5 * hM * hM * 10) / 10,
      idealWeightMax: Math.round(22.9 * hM * hM * 10) / 10,
      maxHeartRate: 220 - 15
    };
  });

  // Danh sách các lớp lọc
  const classList = useMemo(() => {
    return ['10A1', '10A3', '12C1', '12C2', '12C3'];
  }, []);

  // Lọc học sinh theo lớp đã chọn
  const filteredStudents = useMemo(() => {
    if (selectedClass === 'all') return students;
    return students.filter(s => s.class === selectedClass);
  }, [students, selectedClass]);

  // Khi giáo viên chọn một học sinh trong danh sách
  const handleSelectExistingStudent = (studentId: string) => {
    setSelectedStudentId(studentId);
    if (!studentId) return;

    const st = students.find(s => s.id === studentId);
    if (st) {
      setStudentName(st.name);
      setStudentClass(st.class);
      setHeight(st.heightCm);
      setWeight(st.weightKg);
      setGender(st.gender);
      setAge(st.class.startsWith('10') ? 15 : st.class.startsWith('11') ? 16 : 17);
      if (st.medicalNote) setMedicalNote(st.medicalNote);

      const bmiVal = calculateBmiValue(st.heightCm, st.weightKg);
      const hM = st.heightCm / 100;
      setCalculatedResult({
        bmi: bmiVal,
        category: getBmiCategoryInfo(bmiVal),
        idealWeightMin: Math.round(18.5 * hM * hM * 10) / 10,
        idealWeightMax: Math.round(22.9 * hM * hM * 10) / 10,
        maxHeartRate: 220 - (st.class.startsWith('10') ? 15 : 17)
      });
    }
  };

  // Áp dụng mẫu nhanh
  const handleApplyPreset = (h: number, w: number, g: 'Nam' | 'Nữ', a: number, sampleName: string) => {
    setHeight(h);
    setWeight(w);
    setGender(g);
    setAge(a);
    setStudentName(sampleName);
    setSelectedStudentId('');
    const bmiVal = calculateBmiValue(h, w);
    const hM = h / 100;
    setCalculatedResult({
      bmi: bmiVal,
      category: getBmiCategoryInfo(bmiVal),
      idealWeightMin: Math.round(18.5 * hM * hM * 10) / 10,
      idealWeightMax: Math.round(22.9 * hM * hM * 10) / 10,
      maxHeartRate: 220 - a
    });
  };

  // TÍNH TOÁN & ĐỒNG THỜI LƯU HỒ SƠ HỌC SINH
  const handleCalculateAndSave = () => {
    if (!height || !weight || height <= 0 || weight <= 0) {
      alert('Vui lòng nhập chiều cao (cm) và cân nặng (kg) hợp lệ!');
      return;
    }

    const bmiVal = calculateBmiValue(height, weight);
    const hM = height / 100;
    const catInfo = getBmiCategoryInfo(bmiVal);

    const calcRes = {
      bmi: bmiVal,
      category: catInfo,
      idealWeightMin: Math.round(18.5 * hM * hM * 10) / 10,
      idealWeightMax: Math.round(22.9 * hM * hM * 10) / 10,
      maxHeartRate: 220 - age
    };
    setCalculatedResult(calcRes);

    // Đồng thời cập nhật hoặc tạo mới học sinh trong danh sách quản lý
    let targetStudent: StudentProfile;

    if (selectedStudentId) {
      // Cập nhật học sinh hiện có
      const existing = students.find(s => s.id === selectedStudentId);
      targetStudent = {
        ...(existing || {
          id: selectedStudentId,
          code: `HS-${studentClass}-${Date.now().toString().slice(-4)}`,
          name: studentName,
          class: studentClass,
          gender: gender,
          heightCm: height,
          weightKg: weight,
          bmi: bmiVal,
          status: catInfo.status,
          medicalNote: medicalNote,
          evalTech: 'Động tác tiếp xúc bóng chắc, di chuyển cự ly ngắn tốt.',
          evalAttitude: 'Có ý thức nỗ lực rèn luyện, chủ động hoàn thành bài tập thích ứng.',
          evalDigital: 'Sử dụng app theo dõi lượng calo tiêu hao và biểu đồ nhịp tim.',
          rating: 'Đạt',
          parentPhone: '0977.xxx.xxx'
        }),
        heightCm: height,
        weightKg: weight,
        bmi: bmiVal,
        status: catInfo.status,
        medicalNote: medicalNote || `Đã cập nhật chỉ số BMI: ${bmiVal} (${catInfo.label})`
      };

      const updatedList = students.map(s => s.id === selectedStudentId ? targetStudent : s);
      if (onUpdateStudents) {
        onUpdateStudents(updatedList);
      }
    } else {
      // Thêm mới hoặc tìm theo tên và lớp
      const existingIndex = students.findIndex(s => s.name.toLowerCase() === studentName.toLowerCase() && s.class === studentClass);
      if (existingIndex >= 0) {
        targetStudent = {
          ...students[existingIndex],
          heightCm: height,
          weightKg: weight,
          bmi: bmiVal,
          status: catInfo.status,
          medicalNote: medicalNote || students[existingIndex].medicalNote
        };
        const updatedList = [...students];
        updatedList[existingIndex] = targetStudent;
        if (onUpdateStudents) onUpdateStudents(updatedList);
      } else {
        targetStudent = {
          id: `s-${studentClass.toLowerCase()}-${Date.now().toString().slice(-4)}`,
          code: `HS${studentClass}-${String(students.length + 1).padStart(2, '0')}`,
          name: studentName || 'Học sinh mới',
          class: studentClass,
          gender: gender,
          heightCm: height,
          weightKg: weight,
          bmi: bmiVal,
          status: catInfo.status,
          medicalNote: medicalNote || `Chỉ số BMI: ${bmiVal} (${catInfo.label})`,
          evalTech: 'Động tác kỹ thuật cơ bản đúng biên độ.',
          evalAttitude: 'Tích cực tham gia hoạt động GDTC.',
          evalDigital: 'Biết tra cứu phác đồ thể trạng trên ứng dụng.',
          rating: 'Đạt',
          parentPhone: '0918.xxx.xxx'
        };
        if (onUpdateStudents) {
          onUpdateStudents([...students, targetStudent]);
        }
      }
    }

    // Hiển thị thông báo thành công
    setSavedSuccessInfo({
      name: targetStudent.name,
      className: targetStudent.class,
      bmi: bmiVal,
      statusLabel: catInfo.label,
      badgeClass: catInfo.badgeClass,
      student: targetStudent
    });

    if (onShowToast) {
      onShowToast(`Đã tính toán & lưu thành công hồ sơ thể trạng học sinh ${targetStudent.name} (${targetStudent.class}) - BMI: ${bmiVal}!`);
    }
  };

  return (
    <div id="tab-bmi" className="tab-content block space-y-5">
      <div className="bg-white rounded-xl p-5 md:p-6 border border-slate-200 shadow-sm max-w-4xl mx-auto space-y-5">
        
        {/* TIÊU ĐỀ TAB */}
        <div className="border-b pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-base md:text-lg font-bold text-slate-900 flex items-center gap-2">
              <i className="fa-solid fa-calculator text-emerald-700"></i>
              <span>Đánh Giá Thể Trạng BMI Lứa Tuổi Học Sinh THPT (15 - 18 Tuổi)</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Áp dụng thang đo nhân trắc học học sinh Việt Nam kết hợp chỉ dẫn an toàn vận động GDPT 2018
            </p>
          </div>
          <span className="text-xs bg-emerald-50 text-emerald-800 font-bold px-3 py-1 rounded-full border border-emerald-200 self-start sm:self-auto">
            Tự động lưu vào hồ sơ lớp
          </span>
        </div>

        {/* BỘ LỌC CHỌN HỌC SINH CÓ SẴN THEO 5 LỚP (10A1, 10A3, 12C1, 12C2, 12C3) */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="font-bold text-xs uppercase text-slate-700 flex items-center gap-1.5">
              <i className="fa-solid fa-filter text-emerald-600"></i>
              Chọn Học Sinh Từ Danh Sách Lớp Để Đo & Cập Nhật Hồ Sơ:
            </span>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => { setSelectedClass('all'); setSelectedStudentId(''); }}
                className={`px-2.5 py-1 rounded-md text-xs font-semibold transition ${
                  selectedClass === 'all'
                    ? 'bg-emerald-800 text-white'
                    : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-100'
                }`}
              >
                Tất cả ({students.length})
              </button>
              {classList.map(cls => (
                <button
                  key={cls}
                  type="button"
                  onClick={() => { setSelectedClass(cls); setSelectedStudentId(''); }}
                  className={`px-2.5 py-1 rounded-md text-xs font-semibold transition ${
                    selectedClass === cls
                      ? 'bg-emerald-800 text-white'
                      : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {cls} ({students.filter(s => s.class === cls).length})
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Chọn học sinh cần đo đạc thể trạng:
              </label>
              <select
                value={selectedStudentId}
                onChange={(e) => handleSelectExistingStudent(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs font-semibold text-slate-800 focus:ring-1 focus:ring-emerald-500"
              >
                <option value="">-- Nhập thông số mới hoặc chọn học sinh --</option>
                {filteredStudents.map(st => (
                  <option key={st.id} value={st.id}>
                    [{st.class}] {st.name} — Cao: {st.heightCm}cm | Nặng: {st.weightKg}kg | BMI: {st.bmi} ({st.status === 'overweight' ? 'Thừa cân' : st.status === 'underweight' ? 'Thiếu cân' : 'Chuẩn'})
                  </option>
                ))}
              </select>
            </div>

            {/* Nút bấm mẫu thể trạng nhanh */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Hoặc chọn mẫu kiểm tra nhanh:
              </label>
              <div className="flex flex-wrap items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => handleApplyPreset(155, 65.4, 'Nữ', 15, 'Lê Khánh An')}
                  className="px-2 py-1 bg-amber-50 hover:bg-amber-100 text-amber-800 rounded border border-amber-200 text-xs font-medium transition cursor-pointer"
                >
                  Thừa cân (155cm, 65.4kg)
                </button>
                <button
                  type="button"
                  onClick={() => handleApplyPreset(172, 48, 'Nam', 17, 'Nguyễn Văn Nam')}
                  className="px-2 py-1 bg-blue-50 hover:bg-blue-100 text-blue-800 rounded border border-blue-200 text-xs font-medium transition cursor-pointer"
                >
                  Thiếu cân (172cm, 48kg)
                </button>
                <button
                  type="button"
                  onClick={() => handleApplyPreset(165, 56, 'Nam', 17, 'Trần Minh Quang')}
                  className="px-2 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded border border-emerald-200 text-xs font-medium transition cursor-pointer"
                >
                  Chuẩn (165cm, 56kg)
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* FORM NHẬP THÔNG SỐ THỂ TRẠNG */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 text-xs md:text-sm">
          <div className="col-span-2">
            <label className="block font-semibold text-slate-700 mb-1">Họ và tên học sinh:</label>
            <input
              type="text"
              value={studentName}
              onChange={(e) => setStudentName(e.target.value)}
              placeholder="VD: Lê Khánh An"
              className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 font-bold text-slate-800 focus:ring-1 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Lớp:</label>
            <select
              value={studentClass}
              onChange={(e) => setStudentClass(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 font-bold text-slate-800 focus:ring-1 focus:ring-emerald-500"
            >
              {classList.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Chiều cao (cm):</label>
            <input
              type="number"
              value={height}
              onChange={(e) => setHeight(Number(e.target.value))}
              className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 font-bold text-slate-800 focus:ring-1 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Cân nặng (kg):</label>
            <input
              type="number"
              value={weight}
              onChange={(e) => setWeight(Number(e.target.value))}
              step={0.5}
              className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 font-bold text-slate-800 focus:ring-1 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Giới tính & Tuổi:</label>
            <div className="flex gap-1">
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value as 'Nam' | 'Nữ')}
                className="w-1/2 bg-slate-50 border border-slate-300 rounded-lg p-2 font-medium text-slate-800 text-xs"
              >
                <option value="Nam">Nam</option>
                <option value="Nữ">Nữ</option>
              </select>
              <select
                value={age}
                onChange={(e) => setAge(Number(e.target.value))}
                className="w-1/2 bg-slate-50 border border-slate-300 rounded-lg p-2 font-medium text-slate-800 text-xs"
              >
                <option value={15}>15t</option>
                <option value={16}>16t</option>
                <option value={17}>17t</option>
                <option value={18}>18t</option>
              </select>
            </div>
          </div>
        </div>

        {/* Ghi chú sức khỏe sư phạm */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Ghi chú bệnh nền / tình trạng vận động cần lưu tâm:
          </label>
          <input
            type="text"
            value={medicalNote}
            onChange={(e) => setMedicalNote(e.target.value)}
            placeholder="VD: Thừa cân, mỏi khớp gối khi nhảy tiếp đất; cần giảm tải xung lực."
            className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs text-slate-800 focus:ring-1 focus:ring-emerald-500"
          />
        </div>

        {/* NÚT TÍNH TOÁN & ĐỒNG THỜI LƯU THÔNG TIN HỌC SINH */}
        <button
          type="button"
          onClick={handleCalculateAndSave}
          className="w-full bg-emerald-800 hover:bg-emerald-900 text-white font-bold py-3 rounded-xl text-sm transition cursor-pointer shadow-md flex items-center justify-center gap-2 border border-emerald-700"
        >
          <i className="fa-solid fa-floppy-disk text-amber-300 text-base"></i>
          <span>Tính Toán & Lưu Hồ Sơ Phác Đồ An Toàn Sư Phạm</span>
        </button>

        {/* THÔNG BÁO LƯU THÀNH CÔNG RỰC RỠ KÈM HÀNH ĐỘNG NHANH */}
        {savedSuccessInfo && (
          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-950 space-y-2 animate-fade-in shadow-xs">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-emerald-200 pb-2">
              <span className="font-bold text-sm flex items-center gap-2">
                <i className="fa-solid fa-circle-check text-emerald-600 text-base"></i>
                <span>Đã lưu thành công vào hồ sơ học sinh: <strong>{savedSuccessInfo.name} ({savedSuccessInfo.className})</strong></span>
              </span>
              <span className={`px-3 py-1 rounded-full text-xs font-bold border ${savedSuccessInfo.badgeClass}`}>
                {savedSuccessInfo.statusLabel}
              </span>
            </div>
            <p className="text-xs text-emerald-800">
              Chỉ số BMI đã được đồng bộ sang tất cả các phân hệ: <strong>Gợi ý phác đồ thể trạng</strong>, <strong>Đánh giá thường xuyên TT22</strong>, <strong>Dinh dưỡng học đường Bến Tre</strong> và <strong>Cổng thông báo Zalo/SMS phụ huynh</strong>.
            </p>
            <div className="flex flex-wrap items-center gap-2 pt-1">
              {onSwitchToTheTrang && (
                <button
                  type="button"
                  onClick={onSwitchToTheTrang}
                  className="px-3 py-1.5 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 transition"
                >
                  <i className="fa-solid fa-person-running text-amber-300"></i>
                  <span>Xem Phác Đồ Bài Tập Thích Ứng Ngay</span>
                </button>
              )}
              {onSelectForMessage && (
                <button
                  type="button"
                  onClick={() => onSelectForMessage(savedSuccessInfo.student)}
                  className="px-3 py-1.5 bg-blue-700 hover:bg-blue-800 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 transition"
                >
                  <i className="fa-brands fa-facebook-messenger text-amber-300"></i>
                  <span>Soạn Tin Nhắn Báo Phụ Huynh Học Sinh Này</span>
                </button>
              )}
            </div>
            
            {/* Hướng dẫn đồng bộ sang điện thoại */}
            <div className="bg-white/90 p-2.5 rounded-lg border border-emerald-200 text-[11px] text-slate-700 flex items-center gap-2 mt-1">
              <i className="fa-solid fa-mobile-screen-button text-emerald-700 text-sm shrink-0"></i>
              <span>
                <strong>Xem trên điện thoại:</strong> Dữ liệu đã lưu an toàn vào máy này. Để xem được trên điện thoại, Thầy/Cô chỉ cần bấm nút <strong>&quot;Sao lưu & Đồng bộ&quot;</strong> ở góc trên thanh công cụ để sao chép mã đồng bộ gửi qua Zalo là xong!
              </span>
            </div>
          </div>
        )}

        {/* THANH HIỂN THỊ DẢI BMI CHUẨN */}
        <div className="space-y-1.5 pt-1">
          <div className="flex justify-between text-[11px] font-semibold text-slate-600">
            <span>&lt; 18.5 (Thiếu cân)</span>
            <span>18.5 - 22.9 (Chuẩn)</span>
            <span>23.0 - 24.9 (Nguy cơ)</span>
            <span>&ge; 25.0 (Thừa cân / Béo phì)</span>
          </div>
          <div className="h-3.5 w-full rounded-full flex overflow-hidden bg-slate-200">
            <div className="w-[30%] bg-blue-400" title="Thiếu cân (< 18.5)"></div>
            <div className="w-[35%] bg-emerald-500" title="Bình thường (18.5 - 22.9)"></div>
            <div className="w-[15%] bg-amber-400" title="Tiền thừa cân (23 - 24.9)"></div>
            <div className="w-[20%] bg-rose-500" title="Béo phì (>= 25)"></div>
          </div>
        </div>

        {/* KẾT QUẢ CHI TIẾT & CHỈ DẪN SƯ PHẠM */}
        {calculatedResult && (
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs md:text-sm space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-3">
              <div>
                <span className="text-slate-500 text-xs">Chỉ số khối cơ thể (BMI):</span>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-black text-slate-900">{calculatedResult.bmi}</span>
                  <span className="text-xs text-slate-500">kg/m²</span>
                </div>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-bold border ${calculatedResult.category.badgeClass}`}>
                {calculatedResult.category.label}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="bg-white p-2.5 rounded-lg border border-slate-200">
                <span className="font-semibold text-slate-700 block">Khoảng cân nặng lý tưởng cho chiều cao {height}cm:</span>
                <span className="text-emerald-700 font-bold text-sm">
                  {calculatedResult.idealWeightMin} kg — {calculatedResult.idealWeightMax} kg
                </span>
              </div>
              <div className="bg-white p-2.5 rounded-lg border border-slate-200">
                <span className="font-semibold text-slate-700 block">Nhịp tim tối đa lý thuyết (HR Max):</span>
                <span className="text-blue-700 font-bold text-sm">
                  {calculatedResult.maxHeartRate} bpm (Vùng an toàn: {Math.round(calculatedResult.maxHeartRate * 0.6)} - {Math.round(calculatedResult.maxHeartRate * 0.75)} bpm)
                </span>
              </div>
            </div>

            <div className="space-y-1.5 pt-1">
              <p className="text-slate-800 font-semibold flex items-center gap-1.5">
                <i className="fa-solid fa-notes-medical text-emerald-700"></i>
                <span>Khuyến nghị sư phạm & Dinh dưỡng học đường Bến Tre:</span>
              </p>
              <p className="text-slate-600 leading-relaxed bg-white p-3 rounded-lg border border-slate-200">
                {calculatedResult.category.advice}
              </p>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
