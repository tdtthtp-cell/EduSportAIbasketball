import React, { useState, useMemo, useEffect } from 'react';
import { SportKey, GradeLevel, Role, StudentProfile } from '../types';
import {
  SPORTS_LIST,
  getPPCTForSportAndGrade,
  getLessonsForSportAndGrade,
  getPPCTForSport,
  LESSONS_DATABASE
} from '../data/curriculum';
import { LessonDiagrams } from './LessonDiagrams';
import { generateStandardKHBD } from '../utils/lessonPlanGenerator';
import { exportLessonPlanToWord } from '../utils/exportWord';

interface TabKHBDProps {
  currentSport: SportKey;
  currentGrade: GradeLevel;
  currentTeacherName: string;
  userRole: Role;
  students?: StudentProfile[];
}

export const TabKHBD: React.FC<TabKHBDProps> = ({
  currentSport,
  currentGrade,
  currentTeacherName,
  userRole,
  students = []
}) => {
  const [activeSubView, setActiveSubView] = useState<'khbd' | 'ppct'>('khbd');
  const [ppctSemesterFilter, setPpctSemesterFilter] = useState<'all' | 'HK1' | 'HK2'>('all');
  const [ppctSearchTerm, setPpctSearchTerm] = useState<string>('');

  // Form Controls - Inputs from keyboard as requested
  const [schoolName, setSchoolName] = useState<string>('THPT Huỳnh Tấn Phát');
  const [schoolLocation, setSchoolLocation] = useState<string>('xã Châu Hưng'); // Gợi ý nhanh: xã Châu Hưng, Xã Thạnh Trị
  const [subjectTitle, setSubjectTitle] = useState<string>('Giáo dục Thể chất');
  const [gradeSelect, setGradeSelect] = useState<GradeLevel>(currentGrade); // Khối lớp (Khối 10, 11, 12)
  const [classNameInput, setClassNameInput] = useState<string>(`${currentGrade}A1`); // Lớp: Khối lớp
  const [teacherInput, setTeacherInput] = useState<string>(currentTeacherName || 'Bồ Công Lâm');
  const [ttcmName, setTtcmName] = useState<string>('Nguyễn Thị Hoa'); // TTCM: nhập từ bàn phím
  const [durationOption, setDurationOption] = useState<'1 tiết' | '2 tiết'>('1 tiết');

  // Dynamically load all 70 periods/lessons according to chosen sport and grade
  const lessons = useMemo(() => {
    return getLessonsForSportAndGrade(currentSport, gradeSelect);
  }, [currentSport, gradeSelect]);

  const [selectedLessonIndex, setSelectedLessonIndex] = useState<number>(0);

  // Sync gradeSelect when currentGrade prop changes
  useEffect(() => {
    if (currentGrade && currentGrade !== gradeSelect) {
      setGradeSelect(currentGrade);
      setClassNameInput(`${currentGrade}A1`);
    }
  }, [currentGrade]);

  // Keep selectedLessonIndex within bounds when lessons change
  useEffect(() => {
    if (selectedLessonIndex >= lessons.length) {
      setSelectedLessonIndex(0);
    }
  }, [lessons.length, selectedLessonIndex]);

  // Ngày tháng soạn giáo án (nhập trực tiếp từ bàn phím)
  const today = new Date();
  const [planDay, setPlanDay] = useState<string>(() => String(today.getDate()).padStart(2, '0'));
  const [planMonth, setPlanMonth] = useState<string>(() => String(today.getMonth() + 1).padStart(2, '0'));
  const [planYear, setPlanYear] = useState<string>(() => String(today.getFullYear()));

  // Căn cứ SGK: Luôn chuẩn hóa bám sát theo Khối lớp đang dạy (Lớp 10 -> SGK 10, Lớp 11 -> SGK 11, Lớp 12 -> SGK 12)
  const getDefaultSgkForGrade = (grade: GradeLevel) =>
    `SGK Giáo dục Thể chất ${grade} - Bộ sách Kết nối tri thức với cuộc sống`;
  const [sgkInput, setSgkInput] = useState<string>(() => getDefaultSgkForGrade(currentGrade));

  const [aiFocus, setAiFocus] = useState<'tracking' | 'cardio' | 'form'>('tracking');
  const [customAiPrompt, setCustomAiPrompt] = useState<string>('');
  const [isGeneratingAi, setIsGeneratingAi] = useState<boolean>(false);
  const [aiSuccessMessage, setAiSuccessMessage] = useState<string>('');
  const [copySuccess, setCopySuccess] = useState<boolean>(false);
  const [customUploadedImages, setCustomUploadedImages] = useState<string[]>([]);
  const [showPrintModal, setShowPrintModal] = useState<boolean>(false);

  const availableRealClasses = Array.from(new Set(students.map(s => s.class))).filter(Boolean).sort();
  const currentLesson = lessons[selectedLessonIndex] || lessons[0];
  const sportObj = SPORTS_LIST.find(s => s.key === currentSport) || SPORTS_LIST[0];

  // Generate detailed lesson plan
  const detailedPlan = useMemo(() => {
    return generateStandardKHBD({
      schoolName,
      schoolLocation,
      subjectName: subjectTitle,
      grade: gradeSelect,
      gradeBlock: `Khối ${gradeSelect}`,
      className: classNameInput,
      lessonTitle: currentLesson.title,
      durationOption,
      teacherName: teacherInput,
      ttcmName,
      sgkReference: sgkInput,
      sportKey: currentSport,
      aiFocusType: aiFocus,
      customPrompt: customAiPrompt,
      existingImages: currentLesson.images
    });
  }, [
    schoolName,
    schoolLocation,
    subjectTitle,
    gradeSelect,
    classNameInput,
    currentLesson.title,
    sgkInput,
    currentLesson.images,
    durationOption,
    teacherInput,
    ttcmName,
    currentSport,
    aiFocus,
    customAiPrompt
  ]);

  const handleGenerateAI = () => {
    setIsGeneratingAi(true);
    setTimeout(() => {
      setIsGeneratingAi(false);
      setAiSuccessMessage(
        customAiPrompt.trim()
          ? `Chuyên gia AI GDTC đã cấu trúc lại KHBD theo yêu cầu: "${customAiPrompt.trim()}", bảo đảm 100% chuẩn 4 hoạt động × 4 bước tổ chức thực hiện của CV 5512/BGDĐT!`
          : `Đã kết xuất Kế hoạch bài dạy chi tiết chuẩn Công văn 5512/BGDĐT & Công văn 7791/BGDĐT cho ${durationOption} (${durationOption === '1 tiết' ? '45 phút' : '90 phút'})!`
      );
    }, 600);
  };

  const handleCopyPlan = () => {
    let fullText = `SỞ GD&ĐT VĨNH LONG               CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM
TRƯỜNG THPT HUỲNH TẤN PHÁT          Độc lập - Tự do - Hạnh phúc
-----------------------------------------------------------------
KẾ HOẠCH BÀI DẠY (THEO CÔNG VĂN 5512/BGDĐT VÀ CÔNG VĂN 7791/BGDĐT)

TÊN BÀI DẠY: ${detailedPlan.lessonTitle.toUpperCase()}
THỜI LƯỢNG: ${detailedPlan.durationText.toUpperCase()}
GIÁO VIÊN GIẢNG DẠY: ${detailedPlan.teacherName}
TỔ TRƯỞNG: ${ttcmName}
ĐỊA ĐIỂM: ${schoolLocation}
CĂN CỨ: ${detailedPlan.sgkReference} • PHÂN MÔN: ${sportObj.name}

1. MỤC TIÊU BÀI DẠY:
1.1. Năng lực đặc thù:
- Năng lực chăm sóc sức khỏe: ${detailedPlan.objectives.specificCompetencies.healthCare}
- Năng lực vận động cơ bản: ${detailedPlan.objectives.specificCompetencies.basicMotor}
- Năng lực hoạt động TDTT: ${detailedPlan.objectives.specificCompetencies.sportsActivities}
1.2. Năng lực chung:
- Năng lực tự chủ và tự học: ${detailedPlan.objectives.generalCompetencies.selfControl}
- Năng lực giao tiếp và hợp tác: ${detailedPlan.objectives.generalCompetencies.communication}
1.3. Năng lực số & AI:
${detailedPlan.objectives.digitalAndAiCompetency}
1.4. Phẩm chất chủ yếu:
- Chăm chỉ: ${detailedPlan.objectives.qualities.diligence}
- Trung thực: ${detailedPlan.objectives.qualities.honesty}
- Đoàn kết & trách nhiệm: ${detailedPlan.objectives.qualities.solidarity}

2. THIẾT BỊ DẠY HỌC & HỌC LIỆU:
- Giáo viên: ${detailedPlan.equipment.teacherTools.join(' ')}
- Học sinh: ${detailedPlan.equipment.studentTools.join(' ')}
- Học liệu số & thiết bị AI: ${detailedPlan.equipment.digitalAndAiTools.join(' ')}

3. TIẾN TRÌNH DẠY HỌC (CHUẨN CÔNG VĂN 5512):\n`;

    detailedPlan.activities.forEach((act) => {
      fullText += `\n${act.title.toUpperCase()}\n* Mục tiêu: ${act.objective}\n`;
      act.steps.forEach((st) => {
        fullText += `\n+ ${st.stepName} (${st.roleTag}):\n`;
        st.content.forEach((c) => {
          fullText += `  ${c}\n`;
        });
      });
    });

    fullText += `\n\nNƠI KÝ XÁC NHẬN CỦA TỔ TRƯỞNG & GIÁO VIÊN:
${schoolLocation}, ngày ${planDay || '...'} tháng ${planMonth || '...'} năm ${planYear || '20...'}
TỔ TRƯỞNG
(Ký và ghi rõ họ tên)

${ttcmName}


${schoolLocation}, ngày ${planDay || '...'} tháng ${planMonth || '...'} năm ${planYear || '20...'}
GIÁO VIÊN SOẠN BÀI
(Ký và ghi rõ họ tên)

${detailedPlan.teacherName}`;

    navigator.clipboard.writeText(fullText);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2500);
  };

  const handleExportWord = () => {
    exportLessonPlanToWord(detailedPlan, {
      schoolLocation,
      planDay,
      planMonth,
      planYear,
      ttcmName,
      teacherName: detailedPlan.teacherName
    });
  };

  const handlePrint = () => {
    setShowPrintModal(true);
    try {
      window.print();
    } catch (err) {
      console.warn('Browser print dialog intercepted or blocked:', err);
    }
  };

  const handleCustomImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setCustomUploadedImages([...customUploadedImages, event.target.result as string]);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const sportPPCT = useMemo(() => getPPCTForSportAndGrade(currentSport, gradeSelect), [currentSport, gradeSelect]);

  const filteredPPCT = sportPPCT.filter((r) => {
    if (ppctSemesterFilter !== 'all' && r.semester !== ppctSemesterFilter) return false;
    if (ppctSearchTerm.trim()) {
      const q = ppctSearchTerm.toLowerCase();
      return (
        r.lessonTitle.toLowerCase().includes(q) ||
        r.theme.toLowerCase().includes(q) ||
        String(r.period) === q
      );
    }
    return true;
  });

  return (
    <div id="tab-khbd" className="tab-content block space-y-4">
      <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs space-y-4">
        
        {/* Header với nút hành động */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-200 pb-3">
          <div>
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <span className="bg-amber-400 text-slate-950 text-[11px] font-black px-2.5 py-0.5 rounded uppercase shadow-2xs">
                CHUYÊN GIA AI GDTC 4.0
              </span>
              <span className="bg-emerald-700 text-white text-[11px] font-bold px-2 py-0.5 rounded">
                CHUẨN CV 5512 & CV 7791/BGDĐT
              </span>
              <span className="bg-blue-100 text-blue-800 text-[11px] font-bold px-2 py-0.5 rounded border border-blue-300">
                4 HOẠT ĐỘNG × 4 BƯỚC TỔ CHỨC
              </span>
            </div>
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <i className="fa-solid fa-graduation-cap text-emerald-700"></i>
              Soạn Kế Hoạch Bài Dạy Chuẩn Chuyên Gia & Trợ Lý Chuyển Đổi Số
            </h2>
            <p className="text-xs text-slate-500">
              Cấu trúc sư phạm hoàn chỉnh theo Công văn 5512/BGDĐT và Công văn 7791/BGDĐT • Kèm hình ảnh minh họa thực thi trên sân tập
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {/* Toggle KHBD / PPCT */}
            <div className="bg-slate-100 p-1 rounded-lg border border-slate-200 flex text-xs font-bold">
              <button
                onClick={() => setActiveSubView('khbd')}
                className={`px-3 py-1.5 rounded-md transition cursor-pointer flex items-center gap-1.5 ${
                  activeSubView === 'khbd'
                    ? 'bg-emerald-800 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <i className="fa-solid fa-file-pen"></i>
                <span>Soạn KHBD Chi Tiết</span>
              </button>
              <button
                onClick={() => setActiveSubView('ppct')}
                className={`px-3 py-1.5 rounded-md transition cursor-pointer flex items-center gap-1.5 ${
                  activeSubView === 'ppct'
                    ? 'bg-emerald-800 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <i className="fa-solid fa-calendar-days"></i>
                <span>Khung PPCT 70 Tiết</span>
              </button>
            </div>

            <button
              onClick={handleCopyPlan}
              className="bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold px-3 py-2 rounded-lg flex items-center gap-1.5 border border-slate-300 transition cursor-pointer"
              title="Sao chép toàn bộ nội dung giáo án vào bộ nhớ tạm"
            >
              <i className="fa-solid fa-copy text-slate-600"></i>
              <span>{copySuccess ? 'Đã sao chép KHBD!' : 'Sao chép văn bản'}</span>
            </button>

            <button
              onClick={handleExportWord}
              className="bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold px-3 py-2 rounded-lg flex items-center gap-1.5 transition cursor-pointer shadow-xs"
              title="Tải ngay file Word (.doc) chuẩn mẫu A4 nộp Tổ chuyên môn hoặc in ấn"
            >
              <i className="fa-solid fa-file-word"></i>
              <span>Tải File Word (.doc)</span>
            </button>

            <button
              onClick={handlePrint}
              className="bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold px-3.5 py-2 rounded-lg flex items-center gap-1.5 transition cursor-pointer shadow-xs"
              title="Mở hộp thoại xuất & in văn bản chuẩn A4"
            >
              <i className="fa-solid fa-print"></i>
              <span>Xuất Văn Bản In / PDF</span>
            </button>
          </div>
        </div>

        {/* ==================== SUB-VIEW 1: SOẠN KHBD CHI TIẾT ==================== */}
        {activeSubView === 'khbd' && (
          <div className="space-y-4">
            
            {/* BẢNG THÔNG TIN ĐẦU VÀO SƯ PHẠM (NHẬP TỪ BÀN PHÍM THEO YÊU CẦU GV) */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3.5 text-xs md:text-sm">
              <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                <span className="font-bold text-slate-800 uppercase text-xs flex items-center gap-1.5">
                  <i className="fa-solid fa-keyboard text-emerald-700"></i>
                  Thông Tin Bài Dạy (Nhập Trực Tiếp Từ Bàn Phím):
                </span>
                <span className="text-xs text-emerald-700 font-semibold italic">
                  * TTCM, Địa điểm, Khối lớp, Lớp học nhập từ bàn phím linh hoạt
                </span>
              </div>

              {/* Hàng 1: Lớp: Khối lớp & Tên bài dạy & Thời lượng */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3">
                
                {/* 1. Lớp: Khối lớp (4 cột) */}
                <div className="lg:col-span-4">
                  <label className="block font-bold text-slate-800 mb-1 text-xs flex items-center justify-between">
                    <span>Lớp: Khối lớp (Nhập từ bàn phím):</span>
                    <span className="text-slate-400 font-normal text-[11px]">Khối & Tên lớp</span>
                  </label>
                  <div className="flex gap-1.5">
                    {/* Chọn Khối lớp */}
                    <select
                      value={gradeSelect}
                      onChange={(e) => {
                        const g = e.target.value as GradeLevel;
                        setGradeSelect(g);
                        setClassNameInput(`${g}A1`);
                        setSgkInput(getDefaultSgkForGrade(g));
                      }}
                      className="w-1/2 bg-white border border-slate-300 rounded-lg p-2 font-bold text-slate-800 cursor-pointer shadow-2xs"
                      title="Chọn khối lớp (Khối 10, Khối 11, Khối 12) - Tự động đồng bộ SGK theo khối"
                    >
                      <option value="10">Khối 10</option>
                      <option value="11">Khối 11</option>
                      <option value="12">Khối 12</option>
                    </select>

                    {/* Nhập Lớp cụ thể từ bàn phím */}
                    <input
                      type="text"
                      list="classListSuggest"
                      value={classNameInput}
                      onChange={(e) => setClassNameInput(e.target.value)}
                      placeholder="Nhập lớp (VD: 10A1, 11A2, 12A1)..."
                      className="w-1/2 bg-white border border-slate-300 rounded-lg p-2 font-bold text-emerald-900 shadow-2xs"
                      title="Nhập lớp từ bàn phím (ví dụ: 10A1, 10A2, 11A3, 12A1...)"
                    />
                    <datalist id="classListSuggest">
                      {availableRealClasses.map(c => (
                        <option key={c} value={c} />
                      ))}
                      <option value={`Khối ${gradeSelect}`} />
                      <option value={`${gradeSelect}A1`} />
                      <option value={`${gradeSelect}A2`} />
                      <option value={`${gradeSelect}A3`} />
                    </datalist>
                  </div>
                </div>

                {/* 2. Tên bài dạy (5 cột) */}
                <div className="lg:col-span-5">
                  <div className="flex items-center justify-between mb-1">
                    <label className="block font-bold text-slate-800 text-xs">
                      Tên bài dạy (Theo PPCT & SGK Khối {gradeSelect}):
                    </label>
                    <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      {lessons.length} tiết chuẩn hóa
                    </span>
                  </div>
                  <select
                    value={selectedLessonIndex}
                    onChange={(e) => {
                      const idx = Number(e.target.value);
                      setSelectedLessonIndex(idx);
                      const l = lessons[idx];
                      if (l) {
                        setSgkInput(l.sgkRef || getDefaultSgkForGrade(gradeSelect));
                      }
                    }}
                    className="w-full bg-white border border-slate-300 rounded-lg p-2 font-bold text-emerald-900 cursor-pointer text-xs shadow-2xs"
                  >
                    <optgroup label={`HỌC KỲ I (Tiết 1 - ${Math.min(35, lessons.length)})`}>
                      {lessons.slice(0, 35).map((l, idx) => (
                        <option key={l.id} value={idx}>
                          [Tiết {l.periodNumber}] {l.title}
                        </option>
                      ))}
                    </optgroup>
                    {lessons.length > 35 && (
                      <optgroup label={`HỌC KỲ II (Tiết 36 - ${lessons.length})`}>
                        {lessons.slice(35).map((l, idx) => (
                          <option key={l.id} value={35 + idx}>
                            [Tiết {l.periodNumber}] {l.title}
                          </option>
                        ))}
                      </optgroup>
                    )}
                  </select>
                </div>

                {/* 3. Thời lượng (3 cột) */}
                <div className="lg:col-span-3">
                  <label className="block font-bold text-slate-800 mb-1 text-xs">
                    Thời lượng bài dạy:
                  </label>
                  <select
                    value={durationOption}
                    onChange={(e) => setDurationOption(e.target.value as any)}
                    className="w-full bg-white border border-slate-300 rounded-lg p-2 font-bold text-slate-800 cursor-pointer shadow-2xs"
                  >
                    <option value="1 tiết">1 tiết (45 phút)</option>
                    <option value="2 tiết">2 tiết (90 phút)</option>
                  </select>
                </div>

              </div>

              {/* HÀNG CĂN CỨ SGK BÁM SÁT THEO KHỐI LỚP ĐANG DẠY */}
              <div className="bg-emerald-50/50 p-3 rounded-xl border border-emerald-200">
                <div className="flex flex-col md:flex-row md:items-center gap-2.5">
                  <div className="flex items-center gap-2 flex-1">
                    <label className="font-bold text-emerald-950 text-xs flex items-center gap-1.5 whitespace-nowrap">
                      <i className="fa-solid fa-book-open text-emerald-700"></i>
                      <span>Căn cứ SGK (Theo Khối {gradeSelect} - Nhập từ bàn phím):</span>
                    </label>
                    <input
                      type="text"
                      list="sgkListSuggest"
                      value={sgkInput}
                      onChange={(e) => setSgkInput(e.target.value)}
                      placeholder={`Căn cứ SGK cho Khối ${gradeSelect}...`}
                      className="flex-1 bg-white border border-emerald-400 rounded-lg px-3 py-1.5 text-xs font-semibold text-slate-900 shadow-2xs focus:ring-2 focus:ring-emerald-500"
                    />
                    <datalist id="sgkListSuggest">
                      <option value={`SGK Giáo dục Thể chất ${gradeSelect} - Bộ sách Kết nối tri thức với cuộc sống`} />
                      <option value={`SGK GDTC ${gradeSelect} (KNTT, Tr. 4 - 10)`} />
                      <option value={`SGK GDTC ${gradeSelect} (KNTT, Tr. 11 - 15)`} />
                      <option value={`SGK GDTC ${gradeSelect} (KNTT, Tr. 18 - 25)`} />
                      <option value={`SGK GDTC ${gradeSelect} (KNTT, Tr. 26 - 32)`} />
                    </datalist>
                  </div>
                </div>
              </div>

              {/* Hàng 2: Trường, Địa điểm trường, Giáo viên, TTCM (Tổ trưởng chuyên môn) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3 pt-1">
                
                {/* Tên trường (3 cột) */}
                <div className="lg:col-span-3">
                  <label className="block font-bold text-slate-700 mb-1 text-xs">
                    Tên trường (Nhập từ bàn phím):
                  </label>
                  <input
                    type="text"
                    value={schoolName}
                    onChange={(e) => setSchoolName(e.target.value)}
                    placeholder="VD: THPT Huỳnh Tấn Phát..."
                    className="w-full bg-white border border-slate-300 rounded-lg p-2 font-semibold text-slate-800 shadow-2xs"
                  />
                </div>

                {/* Địa điểm trường (nhập từ bàn phím - Gợi ý nhanh: Xã Châu Hưng, Xã Thạnh Trị) (4 cột) */}
                <div className="lg:col-span-4">
                  <label className="block font-bold text-slate-700 mb-1 text-xs flex items-center justify-between">
                    <span className="flex items-center gap-1">
                      <i className="fa-solid fa-location-dot text-emerald-700"></i>
                      <span>Địa điểm trường (Bàn phím):</span>
                    </span>
                    <span className="bg-emerald-100 text-emerald-800 font-bold text-[10px] px-1.5 py-0.5 rounded">
                      Xã Châu Hưng & Thạnh Trị
                    </span>
                  </label>
                  <input
                    type="text"
                    list="schoolLocationSuggest"
                    value={schoolLocation}
                    onChange={(e) => setSchoolLocation(e.target.value)}
                    placeholder="Gõ địa điểm (VD: Xã Châu Hưng, Xã Thạnh Trị)..."
                    className="w-full bg-white border-2 border-emerald-500 rounded-lg p-2 font-bold text-emerald-950 shadow-2xs focus:ring-2 focus:ring-emerald-400"
                    title="Địa điểm trường nhập từ bàn phím (trường có 2 điểm đóng trên 2 xã Châu Hưng và Thạnh Trị)"
                  />
                  <datalist id="schoolLocationSuggest">
                    <option value="Xã Châu Hưng" />
                    <option value="Xã Thạnh Trị" />
                    <option value="Điểm 1 (Xã Châu Hưng)" />
                    <option value="Điểm 2 (Xã Thạnh Trị)" />
                    <option value="Điểm trường Xã Châu Hưng" />
                    <option value="Điểm trường Xã Thạnh Trị" />
                    <option value="Cơ sở Xã Châu Hưng" />
                    <option value="Cơ sở Xã Thạnh Trị" />
                    <option value="THPT Huỳnh Tấn Phát (Xã Châu Hưng)" />
                    <option value="THPT Huỳnh Tấn Phát (Xã Thạnh Trị)" />
                  </datalist>

                  {/* Nút chọn nhanh gợi ý 2 điểm trường đóng trên 2 xã: Xã Châu Hưng & Xã Thạnh Trị */}
                  <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                    <span className="text-[10px] text-slate-500 italic">Gợi ý nhanh:</span>
                    <button
                      type="button"
                      onClick={() => setSchoolLocation('Xã Châu Hưng')}
                      className="text-[10px] bg-emerald-100 hover:bg-emerald-200 text-emerald-950 font-bold px-2 py-0.5 rounded border border-emerald-300 transition cursor-pointer"
                    >
                      📍 Xã Châu Hưng
                    </button>
                    <button
                      type="button"
                      onClick={() => setSchoolLocation('Xã Thạnh Trị')}
                      className="text-[10px] bg-emerald-100 hover:bg-emerald-200 text-emerald-950 font-bold px-2 py-0.5 rounded border border-emerald-300 transition cursor-pointer"
                    >
                      📍 Xã Thạnh Trị
                    </button>
                    <button
                      type="button"
                      onClick={() => setSchoolLocation('Điểm 1 (Xã Châu Hưng)')}
                      className="text-[10px] bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold px-1.5 py-0.5 rounded border border-slate-300 transition cursor-pointer"
                    >
                      Điểm 1
                    </button>
                    <button
                      type="button"
                      onClick={() => setSchoolLocation('Điểm 2 (Xã Thạnh Trị)')}
                      className="text-[10px] bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold px-1.5 py-0.5 rounded border border-slate-300 transition cursor-pointer"
                    >
                      Điểm 2
                    </button>
                  </div>
                </div>

                {/* Giáo viên giảng dạy (3 cột) */}
                <div className="lg:col-span-3">
                  <label className="block font-bold text-slate-700 mb-1 text-xs">
                    Giáo viên dạy (Bàn phím):
                  </label>
                  <input
                    type="text"
                    value={teacherInput}
                    onChange={(e) => setTeacherInput(e.target.value)}
                    placeholder="Tên GV..."
                    className="w-full bg-white border border-slate-300 rounded-lg p-2 font-bold text-slate-800 shadow-2xs"
                  />
                  <div className="flex items-center gap-1.5 mt-1">
                    <span className="text-[10px] text-slate-500 italic">Chọn nhanh:</span>
                    <button
                      type="button"
                      onClick={() => setTeacherInput('Bồ Công Lâm')}
                      className="text-[10px] bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold px-1.5 py-0.5 rounded border border-slate-300 transition cursor-pointer"
                    >
                      Bồ Công Lâm
                    </button>
                    <button
                      type="button"
                      onClick={() => setTeacherInput('Nguyễn Thị Hoa')}
                      className="text-[10px] bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold px-1.5 py-0.5 rounded border border-slate-300 transition cursor-pointer"
                    >
                      Nguyễn Thị Hoa
                    </button>
                  </div>
                </div>

                {/* TTCM: Tổ trưởng chuyên môn (nhập từ bàn phím) (2 cột) */}
                <div className="lg:col-span-2">
                  <label className="block font-bold text-slate-700 mb-1 text-xs flex items-center justify-between">
                    <span className="flex items-center gap-1">
                      <i className="fa-solid fa-signature text-emerald-700"></i>
                      <span>TTCM (Bàn phím):</span>
                    </span>
                  </label>
                  <input
                    type="text"
                    list="ttcmSuggest"
                    value={ttcmName}
                    onChange={(e) => setTtcmName(e.target.value)}
                    placeholder="Gõ tên TTCM..."
                    className="w-full bg-white border-2 border-emerald-500 rounded-lg p-2 font-bold text-emerald-950 shadow-2xs focus:ring-2 focus:ring-emerald-400"
                    title="Tên Tổ trưởng chuyên môn (TTCM) nhập trực tiếp từ bàn phím"
                  />
                  <datalist id="ttcmSuggest">
                    <option value="Nguyễn Thị Hoa" />
                    <option value="Nguyễn Tấn Phước" />
                    <option value="Bồ Công Lâm" />
                    <option value="Nguyễn Trung Hiếu" />
                    <option value="Tổ trưởng CM GDTC - QPAN" />
                  </datalist>
                  <div className="flex items-center gap-1.5 mt-1">
                    <span className="text-[10px] text-slate-500 italic">Chọn nhanh:</span>
                    <button
                      type="button"
                      onClick={() => setTtcmName('Nguyễn Thị Hoa')}
                      className="text-[10px] bg-emerald-100 hover:bg-emerald-200 text-emerald-950 font-bold px-1.5 py-0.5 rounded border border-emerald-300 transition cursor-pointer"
                    >
                      Nguyễn Thị Hoa
                    </button>
                    <button
                      type="button"
                      onClick={() => setTtcmName('Nguyễn Tấn Phước')}
                      className="text-[10px] bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold px-1.5 py-0.5 rounded border border-slate-300 transition cursor-pointer"
                    >
                      Nguyễn Tấn Phước
                    </button>
                  </div>
                </div>

              </div>

              {/* Hàng 3: Tích hợp Năng lực số & AI và Tùy biến AI Prompt */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1 border-t border-slate-200">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1 text-xs">
                    Trọng tâm Năng lực Số & Năng lực AI:
                  </label>
                  <select
                    value={aiFocus}
                    onChange={(e) => setAiFocus(e.target.value as any)}
                    className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs font-medium cursor-pointer"
                  >
                    <option value="tracking">Video Slow-motion 60fps & AI Motion Tracking</option>
                    <option value="cardio">AI Nhịp tim thời gian thực & Cảnh báo quá tải</option>
                    <option value="form">Mô hình AI Pose Estimation nhận diện khung xương</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block font-semibold text-slate-700 mb-1 text-xs">
                    Yêu cầu điều chỉnh riêng với Chuyên gia AI (Nếu có):
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={customAiPrompt}
                      onChange={(e) => setCustomAiPrompt(e.target.value)}
                      placeholder="Ví dụ: 'Tăng cường trò chơi tiếp sức khởi động', 'Lớp có 4 học sinh thừa cân cần bài tập riêng'..."
                      className="flex-1 bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-xs focus:outline-emerald-600"
                    />
                    <button
                      onClick={handleGenerateAI}
                      disabled={isGeneratingAi}
                      className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-4 py-1.5 rounded-lg text-xs transition cursor-pointer disabled:opacity-50 shrink-0 shadow-2xs"
                    >
                      {isGeneratingAi ? 'Đang soạn...' : 'Tạo Lại Với AI'}
                    </button>
                  </div>
                </div>
              </div>

              {aiSuccessMessage && (
                <div className="bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs p-2.5 rounded-lg flex items-center justify-between">
                  <span className="flex items-center gap-1.5 font-semibold">
                    <i className="fa-solid fa-circle-check text-emerald-600"></i>
                    {aiSuccessMessage}
                  </span>
                  <button
                    onClick={() => setAiSuccessMessage('')}
                    className="text-emerald-700 hover:text-emerald-900 font-bold ml-2 cursor-pointer"
                  >
                    ✕
                  </button>
                </div>
              )}
            </div>

            {/* KHUNG VĂN BẢN KẾ HOẠCH BÀI DẠY (TRÌNH BÀY CHUẨN CV 5512 & CV 7791 - FONT TIMES NEW ROMAN - CỠ CHỮ 13) */}
            <div
              id="lessonPlanDocument"
              className="bg-white border border-slate-300 rounded-xl p-6 md:p-8 text-slate-900 leading-relaxed space-y-6 shadow-sm print-card khbd-document"
              style={{
                fontFamily: "'Times New Roman', Times, 'Tinos', serif",
                fontSize: '13pt',
                lineHeight: '1.45'
              }}
            >
              {/* Huy hiệu định dạng chuẩn: Times New Roman, Cỡ 13pt */}
              <div className="flex items-center justify-between no-print border-b border-emerald-200 pb-2 text-[13pt] text-emerald-950 font-semibold bg-emerald-50/70 p-2.5 rounded-lg">
                <span className="flex items-center gap-2">
                  <i className="fa-solid fa-file-signature text-emerald-700"></i>
                  <span>Định dạng văn bản: <strong>Font Times New Roman • Cỡ chữ 13 (13pt)</strong> chuẩn CV 5512/BGDĐT</span>
                </span>
              </div>

              {/* Header văn bản hành chính sư phạm: Bảng không viền, 2 cột 2 dòng căn giữa, phông chữ 12, tuyệt đối không nhảy dòng */}
              <div className="border-b-2 border-slate-900 pb-4">
                <table
                  className="w-full border-none border-collapse text-center mb-3"
                  style={{ fontFamily: "'Times New Roman', Times, serif", fontSize: '12pt' }}
                >
                  <tbody>
                    <tr className="border-none">
                      <td className="w-[42%] p-1 text-center border-none align-top whitespace-nowrap">
                        <p className="font-semibold text-slate-900 uppercase" style={{ fontSize: '12pt', margin: 0 }}>
                          Sở GD&ĐT VĨNH LONG
                        </p>
                      </td>
                      <td className="w-[58%] p-1 text-center border-none align-top whitespace-nowrap">
                        <p className="font-bold text-slate-950 uppercase" style={{ fontSize: '12pt', margin: 0 }}>
                          CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM
                        </p>
                      </td>
                    </tr>
                    <tr className="border-none">
                      <td className="w-[42%] p-1 text-center border-none align-top whitespace-nowrap">
                        <p className="font-bold text-slate-950 uppercase" style={{ fontSize: '12pt', margin: 0 }}>
                          TRƯỜNG THPT HUỲNH TẤN PHÁT
                        </p>
                        <div className="w-28 h-[1px] bg-slate-800 mx-auto mt-0.5"></div>
                      </td>
                      <td className="w-[58%] p-1 text-center border-none align-top whitespace-nowrap">
                        <p className="font-bold text-slate-950" style={{ fontSize: '12pt', margin: 0 }}>
                          Độc lập - Tự do - Hạnh phúc
                        </p>
                        <div className="w-36 h-[1px] bg-slate-800 mx-auto mt-0.5"></div>
                      </td>
                    </tr>
                  </tbody>
                </table>

                <div className="text-center space-y-1 pt-1">
                  <h1 className="text-[15pt] md:text-[16pt] font-black text-slate-950 uppercase mt-1 tracking-tight">
                    KẾ HOẠCH BÀI DẠY
                  </h1>
                  <p className="text-[13pt] font-bold text-slate-600 italic">
                    (Căn cứ theo Công văn số 5512/BGDĐT-GDTrH và Công văn số 7791/BGDĐT-GDTrH)
                  </p>
                  <div className="pt-2 space-y-1">
                    <p className="text-[13.5pt] font-black text-emerald-950 uppercase">
                      TÊN BÀI DẠY: {detailedPlan.lessonTitle}
                    </p>
                    <p className="text-[13pt] text-slate-800 font-semibold">
                      Môn học: <span className="text-emerald-900 font-bold">{detailedPlan.subjectName}</span> • Lớp: <span className="text-emerald-900 font-bold">Khối {detailedPlan.grade} ({detailedPlan.className})</span> • Phân môn: <span className="text-emerald-900 font-bold">{sportObj.name}</span> • Thời lượng: <span className="text-emerald-900 font-bold">{detailedPlan.durationText}</span>
                    </p>
                    <p className="text-[13pt] text-slate-700">
                      Giáo viên giảng dạy: <strong className="text-slate-900">{detailedPlan.teacherName}</strong> • TỔ TRƯỞNG: <strong className="text-emerald-950">{ttcmName}</strong> • Căn cứ SGK: <em>{detailedPlan.sgkReference}</em>
                    </p>
                  </div>
                </div>
              </div>

              {/* 1. MỤC TIÊU BÀI DẠY (TIMES NEW ROMAN CỠ CHỮ 13) */}
              <section className="space-y-3">
                <h2 className="font-black text-emerald-950 text-[13.5pt] flex items-center gap-2 uppercase border-b border-emerald-100 pb-1">
                  <span className="w-6 h-6 rounded bg-emerald-800 text-white flex items-center justify-center text-xs font-sans">1</span>
                  I. MỤC TIÊU BÀI DẠY
                </h2>

                <div className="space-y-2.5 ml-2 text-[13pt]">
                  {/* 1.1. Năng lực đặc thù */}
                  <div>
                    <h3 className="font-bold text-slate-950 text-[13pt]">1. Năng lực đặc thù:</h3>
                    <ul className="list-disc list-inside space-y-1 mt-1 text-slate-800 ml-3">
                      <li>
                        <strong>Năng lực chăm sóc sức khỏe:</strong> {detailedPlan.objectives.specificCompetencies.healthCare}
                      </li>
                      <li>
                        <strong>Năng lực vận động cơ bản:</strong> {detailedPlan.objectives.specificCompetencies.basicMotor}
                      </li>
                      <li>
                        <strong>Năng lực hoạt động TDTT:</strong> {detailedPlan.objectives.specificCompetencies.sportsActivities}
                      </li>
                    </ul>
                  </div>

                  {/* 1.2. Năng lực chung */}
                  <div>
                    <h3 className="font-bold text-slate-950 text-[13pt]">2. Năng lực chung:</h3>
                    <ul className="list-disc list-inside space-y-1 mt-1 text-slate-800 ml-3">
                      <li>
                        <strong>Năng lực tự chủ và tự học:</strong> {detailedPlan.objectives.generalCompetencies.selfControl}
                      </li>
                      <li>
                        <strong>Năng lực giao tiếp và hợp tác:</strong> {detailedPlan.objectives.generalCompetencies.communication}
                      </li>
                    </ul>
                  </div>

                  {/* 1.3. Năng lực số & AI */}
                  <div className="bg-emerald-50/70 p-3 rounded-lg border border-emerald-200">
                    <h3 className="font-bold text-emerald-950 text-[13pt] flex items-center gap-1.5">
                      <i className="fa-solid fa-microchip text-emerald-700"></i>
                      3. Năng lực số & Năng lực AI:
                    </h3>
                    <p className="mt-1 text-slate-900 leading-relaxed ml-2 text-[13pt]">
                      {detailedPlan.objectives.digitalAndAiCompetency}
                    </p>
                  </div>

                  {/* 1.4. Phẩm chất */}
                  <div>
                    <h3 className="font-bold text-slate-950 text-[13pt]">4. Phẩm chất chủ yếu:</h3>
                    <ul className="list-disc list-inside space-y-1 mt-1 text-slate-800 ml-3">
                      <li>
                        <strong>Chăm chỉ:</strong> {detailedPlan.objectives.qualities.diligence}
                      </li>
                      <li>
                        <strong>Trung thực:</strong> {detailedPlan.objectives.qualities.honesty}
                      </li>
                      <li>
                        <strong>Đoàn kết, trách nhiệm:</strong> {detailedPlan.objectives.qualities.solidarity}
                      </li>
                    </ul>
                  </div>
                </div>
              </section>

              {/* 2. THIẾT BỊ DẠY HỌC & HỌC LIỆU (TIMES NEW ROMAN CỠ CHỮ 13) */}
              <section className="space-y-3">
                <h2 className="font-black text-emerald-950 text-[13.5pt] flex items-center gap-2 uppercase border-b border-emerald-100 pb-1">
                  <span className="w-6 h-6 rounded bg-emerald-800 text-white flex items-center justify-center text-xs font-sans">2</span>
                  II. THIẾT BỊ DẠY HỌC & HỌC LIỆU
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-[13pt] ml-2">
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
                    <span className="font-bold text-slate-950 block text-[13pt]">1. Thiết bị giáo viên:</span>
                    <ul className="list-disc list-inside space-y-1 text-slate-800 text-[13pt]">
                      {detailedPlan.equipment.teacherTools.map((item, i) => (
                        <li key={i}>{item}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
                    <span className="font-bold text-slate-950 block text-[13pt]">2. Dụng cụ học sinh:</span>
                    <ul className="list-disc list-inside space-y-1 text-slate-800 text-[13pt]">
                      {detailedPlan.equipment.studentTools.map((item, i) => (
                        <li key={i}>{item}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-200 space-y-1">
                    <span className="font-bold text-emerald-950 block text-[13pt]">3. Học liệu số & Thiết bị AI:</span>
                    <ul className="list-disc list-inside space-y-1 text-slate-800 text-[13pt]">
                      {detailedPlan.equipment.digitalAndAiTools.map((item, i) => (
                        <li key={i}>{item}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* HÌNH ẢNH MINH HỌA MANG TÍNH THỰC THI CAO TRÊN SÂN TẬP */}
                <div className="mt-3 ml-2 space-y-3">
                  <div className="flex items-center justify-between border-b pb-1">
                    <span className="font-bold text-[13pt] uppercase text-slate-900 flex items-center gap-1.5">
                      <i className="fa-solid fa-images text-emerald-700"></i>
                      Hình Ảnh Minh Họa Mang Tính Thực Thi Cao Trên Sân Tập:
                    </span>
                    <label className="text-xs text-emerald-700 hover:underline font-semibold cursor-pointer flex items-center gap-1 no-print font-sans">
                      <i className="fa-solid fa-plus"></i>
                      <span>Đính kèm ảnh thực tế</span>
                      <input type="file" accept="image/*" onChange={handleCustomImageUpload} className="hidden" />
                    </label>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                    {detailedPlan.images.map((img) => (
                      <LessonDiagrams key={img.id} image={img} />
                    ))}

                    {customUploadedImages.map((src, i) => (
                      <div key={i} className="bg-slate-900 border border-slate-700 rounded-xl p-3 text-white space-y-2">
                        <span className="font-bold text-xs text-amber-400 font-sans">Ảnh thực tế sân tập #{i + 1}</span>
                        <img src={src} alt="Minh họa riêng" className="w-full h-44 object-cover rounded-lg border border-slate-800" />
                        <p className="text-[12pt] text-slate-300 italic font-serif">Ảnh chụp thực tế học sinh THPT Huỳnh Tấn Phát thực hành trên sân tập.</p>
                      </div>
                    ))}
                  </div>
                </div>
              </section>

              {/* 3. TIẾN TRÌNH DẠY HỌC (4 HOẠT ĐỘNG CHUẨN CV 5512 x 4 BƯỚC TỔ CHỨC - FONT TIMES NEW ROMAN CỠ CHỮ 13) */}
              <section className="space-y-4">
                <h2 className="font-black text-emerald-950 text-[13.5pt] flex items-center gap-2 uppercase border-b border-emerald-100 pb-1">
                  <span className="w-6 h-6 rounded bg-emerald-800 text-white flex items-center justify-center text-xs font-sans">3</span>
                  III. TIẾN TRÌNH DẠY HỌC (CHUẨN CÔNG VĂN 5512/BGDĐT)
                </h2>

                <div className="space-y-4 ml-2">
                  {detailedPlan.activities.map((activity) => (
                    <div
                      key={activity.id}
                      className="border border-slate-200 rounded-xl p-4 bg-slate-50/60 hover:bg-slate-50 transition space-y-3"
                    >
                      {/* Tiêu đề hoạt động */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-200 pb-2 gap-1">
                        <div>
                          <h3 className="font-black text-emerald-950 text-[13pt] uppercase flex items-center gap-1.5">
                            <i className="fa-solid fa-flag-checkered text-emerald-700"></i>
                            {activity.title}
                          </h3>
                          <p className="text-[13pt] text-slate-800 mt-0.5">
                            <strong>Mục tiêu hoạt động:</strong> {activity.objective}
                          </p>
                        </div>
                        {activity.targetHeartRate && (
                          <span className="bg-emerald-100 text-emerald-950 text-xs font-bold px-2.5 py-1 rounded-md border border-emerald-300 whitespace-nowrap self-start sm:self-auto font-sans">
                            {activity.targetHeartRate}
                          </span>
                        )}
                      </div>

                      {/* 4 BƯỚC TỔ CHỨC THỰC HIỆN BẮT BUỘC THEO CV 5512 */}
                      <div className="space-y-2.5 pt-1 text-[13pt]">
                        {activity.steps.map((step) => (
                          <div
                            key={step.stepNumber}
                            className={`p-3 rounded-lg border ${
                              step.stepNumber === 1
                                ? 'bg-blue-50/60 border-blue-200'
                                : step.stepNumber === 2
                                ? 'bg-white border-slate-200'
                                : step.stepNumber === 3
                                ? 'bg-amber-50/60 border-amber-200'
                                : 'bg-emerald-50/60 border-emerald-200'
                            }`}
                          >
                            <div className="flex items-center justify-between mb-1">
                              <span className="font-bold text-slate-950 text-[13pt] uppercase flex items-center gap-1.5">
                                <span
                                  className={`w-5 h-5 rounded-full text-white flex items-center justify-center text-[10px] font-bold font-sans ${
                                    step.stepNumber === 1
                                      ? 'bg-blue-600'
                                      : step.stepNumber === 2
                                      ? 'bg-slate-700'
                                      : step.stepNumber === 3
                                      ? 'bg-amber-600'
                                      : 'bg-emerald-700'
                                  }`}
                                >
                                  {step.stepNumber}
                                </span>
                                {step.stepName}
                              </span>
                              <span
                                className={`text-xs font-bold px-2 py-0.5 rounded uppercase font-sans ${
                                  step.roleTag === 'GV'
                                    ? 'bg-blue-100 text-blue-800'
                                    : step.roleTag === 'HS'
                                    ? 'bg-slate-200 text-slate-800'
                                    : 'bg-emerald-100 text-emerald-800'
                                }`}
                              >
                                {step.roleTag}
                              </span>
                            </div>

                            <div className="text-slate-800 text-[13pt] leading-relaxed space-y-1 ml-6">
                              {step.content.map((p, idx) => (
                                <p key={idx}>{p}</p>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* CHỮ KÝ PHÊ DUYỆT SƯ PHẠM (TIMES NEW ROMAN CỠ CHỮ 13 - NGANG NHAU HOÀN TOÀN, TUYỆT ĐỐI KHÔNG NHẢY DÒNG, VỪA VẶN CHỮ KÝ) */}
              <div className="pt-6 border-t border-slate-300 space-y-3">
                {/* 2 CỘT KÝ DUYỆT: TỔ TRƯỞNG & GIÁO VIÊN SOẠN BÀI - TUYỆT ĐỐI NGANG NHAU */}
                <div className="grid grid-cols-2 gap-4 text-center text-[13pt]">
                  {/* HÀNG 1: ĐỊA DANH VÀ NGÀY THÁNG - XÃ CHÂU HƯNG XUẤT HIỆN NƠI KÝ XÁC NHẬN CỦA TỔ TRƯỞNG THEO THỂ THỨC HÀNH CHÍNH */}
                  <div className="text-center overflow-x-auto">
                    <div className="inline-flex items-center justify-center gap-1 text-slate-800 italic text-[13pt] whitespace-nowrap">
                      <input
                        type="text"
                        value={schoolLocation}
                        onChange={(e) => setSchoolLocation(e.target.value)}
                        placeholder="Địa điểm..."
                        className="font-bold text-slate-900 bg-transparent border-b border-dashed border-slate-400 focus:border-emerald-600 px-1 py-0.5 text-center min-w-[90px] text-[13pt]"
                        style={{ fontFamily: "'Times New Roman', Times, serif", fontSize: '13pt' }}
                        title="Địa danh xác nhận của TỔ TRƯỞNG theo thể thức hành chính (VD: xã Châu Hưng)"
                      />
                      <span>, ngày</span>
                      <input
                        type="text"
                        value={planDay}
                        onChange={(e) => setPlanDay(e.target.value)}
                        placeholder="ngày..."
                        className="w-9 font-bold text-slate-900 bg-transparent border-b border-dashed border-slate-400 focus:border-emerald-600 px-0.5 py-0.5 text-center text-[13pt]"
                        style={{ fontFamily: "'Times New Roman', Times, serif", fontSize: '13pt' }}
                        title="Nhập ngày xác nhận từ bàn phím"
                      />
                      <span>tháng</span>
                      <input
                        type="text"
                        value={planMonth}
                        onChange={(e) => setPlanMonth(e.target.value)}
                        placeholder="tháng..."
                        className="w-9 font-bold text-slate-900 bg-transparent border-b border-dashed border-slate-400 focus:border-emerald-600 px-0.5 py-0.5 text-center text-[13pt]"
                        style={{ fontFamily: "'Times New Roman', Times, serif", fontSize: '13pt' }}
                        title="Nhập tháng xác nhận từ bàn phím"
                      />
                      <span>năm</span>
                      <input
                        type="text"
                        value={planYear}
                        onChange={(e) => setPlanYear(e.target.value)}
                        placeholder="năm..."
                        className="w-12 font-bold text-slate-900 bg-transparent border-b border-dashed border-slate-400 focus:border-emerald-600 px-0.5 py-0.5 text-center text-[13pt]"
                        style={{ fontFamily: "'Times New Roman', Times, serif", fontSize: '13pt' }}
                        title="Nhập năm xác nhận từ bàn phím"
                      />
                    </div>
                  </div>

                  <div className="text-center overflow-x-auto">
                    <div className="inline-flex items-center justify-center gap-1 text-slate-800 italic text-[13pt] whitespace-nowrap">
                      <span>{schoolLocation}, ngày</span>
                      <span className="font-bold text-slate-900 px-0.5">{planDay || '...'}</span>
                      <span>tháng</span>
                      <span className="font-bold text-slate-900 px-0.5">{planMonth || '...'}</span>
                      <span>năm</span>
                      <span className="font-bold text-slate-900 px-0.5">{planYear || '20...'}</span>
                    </div>
                  </div>

                  {/* HÀNG 2: TIÊU ĐỀ CHỨC DANH - CÙNG HÀNG */}
                  <div className="font-bold uppercase text-slate-900 py-1 flex items-center justify-center text-[13pt] whitespace-nowrap">
                    TỔ TRƯỞNG
                  </div>
                  <div className="font-bold uppercase text-slate-900 py-1 flex items-center justify-center text-[13pt] whitespace-nowrap">
                    GIÁO VIÊN SOẠN BÀI
                  </div>

                  {/* HÀNG 3: CHÚ THÍCH HÀNH CHÍNH - CÙNG HÀNG */}
                  <div className="text-slate-600 italic text-[13pt] flex items-center justify-center whitespace-nowrap">
                    (Ký và ghi rõ họ tên)
                  </div>
                  <div className="text-slate-600 italic text-[13pt] flex items-center justify-center whitespace-nowrap">
                    (Ký và ghi rõ họ tên)
                  </div>

                  {/* HÀNG 4: KHOẢNG TRỐNG KÝ TÊN - VỪA VẶN CHỮ KÝ (h-10) */}
                  <div className="h-10 flex items-center justify-center">
                    <span className="text-slate-300 italic text-[11pt] select-none">(Ký tên)</span>
                  </div>
                  <div className="h-10 flex items-center justify-center">
                    <span className="text-slate-300 italic text-[11pt] select-none">(Ký tên)</span>
                  </div>

                  {/* HÀNG 5: HỌ VÀ TÊN - CÙNG 1 HÀNG GRID, TUYỆT ĐỐI NGANG NHAU HOÀN TOÀN, ĐỒNG ĐỀU MÀU SẮC VÀ ĐỘ CAO */}
                  <div className="flex items-center justify-center whitespace-nowrap">
                    <input
                      type="text"
                      value={ttcmName}
                      onChange={(e) => setTtcmName(e.target.value)}
                      placeholder="Nhập họ và tên Tổ trưởng..."
                      className="font-bold text-center text-slate-900 bg-white/70 hover:bg-white focus:bg-white border-b-2 border-slate-300 focus:border-emerald-600 px-3 py-1 text-[13pt] w-4/5 shadow-2xs transition"
                      style={{ fontFamily: "'Times New Roman', Times, serif", fontSize: '13pt' }}
                      title="Nhập họ và tên Tổ trưởng từ bàn phím"
                    />
                  </div>
                  <div className="flex items-center justify-center whitespace-nowrap">
                    <input
                      type="text"
                      value={teacherInput}
                      onChange={(e) => setTeacherInput(e.target.value)}
                      placeholder="Nhập họ và tên Giáo viên..."
                      className="font-bold text-center text-slate-900 bg-white/70 hover:bg-white focus:bg-white border-b-2 border-slate-300 focus:border-emerald-600 px-3 py-1 text-[13pt] w-4/5 shadow-2xs transition"
                      style={{ fontFamily: "'Times New Roman', Times, serif", fontSize: '13pt' }}
                      title="Nhập họ và tên Giáo viên từ bàn phím"
                    />
                  </div>
                </div>
              </div>

            </div>

          </div>
        )}

        {/* ==================== SUB-VIEW 2: KHUNG PPCT 70 TIẾT ==================== */}
        {activeSubView === 'ppct' && (
          <div className="space-y-4">
            
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs">
              <div>
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <span className="bg-emerald-800 text-white font-bold px-2 py-0.5 rounded text-[11px]">
                    {sportObj.name} • {sportObj.desc}
                  </span>
                  <span className="bg-amber-100 text-amber-900 border border-amber-300 font-bold px-2 py-0.5 rounded text-[11px]">
                    Khối {gradeSelect} (Năm học 2026 - 2027)
                  </span>
                  <span className="text-slate-500 font-semibold text-[11px]">
                    Hiển thị {filteredPPCT.length} / {sportPPCT.length} tiết
                  </span>
                </div>
                <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                  <i className="fa-solid fa-list-ol text-emerald-700"></i>
                  Khung Phân Phối Chương Trình Môn GDTC THPT (70 Tiết Chuẩn Hóa)
                </h3>
                <p className="text-slate-500 mt-0.5 text-xs">
                  Căn cứ Chương trình GDPT 2018 Bộ GD&ĐT • Khung phân phối chương trình chính thức THPT Huỳnh Tấn Phát • Địa điểm: {schoolLocation}
                </p>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                {/* Chọn Khối lớp trong PPCT */}
                <div className="flex items-center bg-white border border-slate-300 rounded-lg p-0.5 shadow-2xs">
                  <span className="text-[11px] font-bold text-slate-500 px-2">Khối:</span>
                  {(['10', '11', '12'] as GradeLevel[]).map((g) => (
                    <button
                      key={g}
                      onClick={() => {
                        setGradeSelect(g);
                        setClassNameInput(`${g}A1`);
                        setSgkInput(getDefaultSgkForGrade(g));
                      }}
                      className={`px-2.5 py-1 rounded text-xs font-bold transition cursor-pointer ${
                        gradeSelect === g
                          ? 'bg-emerald-800 text-white shadow-xs'
                          : 'text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      K{g}
                    </button>
                  ))}
                </div>

                {/* Tìm kiếm bài học */}
                <div className="relative">
                  <input
                    type="text"
                    value={ppctSearchTerm}
                    onChange={(e) => setPpctSearchTerm(e.target.value)}
                    placeholder="Tìm tên bài, chủ đề, tiết số..."
                    className="bg-white border border-slate-300 rounded-lg pl-7 pr-3 py-1.5 font-medium text-xs text-slate-800 shadow-2xs w-44 md:w-56 focus:ring-1 focus:ring-emerald-500"
                  />
                  <i className="fa-solid fa-search absolute left-2.5 top-2.5 text-slate-400 text-xs"></i>
                  {ppctSearchTerm && (
                    <button
                      onClick={() => setPpctSearchTerm('')}
                      className="absolute right-2 top-2 text-slate-400 hover:text-slate-600 text-xs cursor-pointer"
                    >
                      <i className="fa-solid fa-xmark"></i>
                    </button>
                  )}
                </div>

                {/* Lọc theo học kỳ */}
                <select
                  value={ppctSemesterFilter}
                  onChange={(e) => setPpctSemesterFilter(e.target.value as any)}
                  className="bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 font-bold text-slate-800 cursor-pointer shadow-2xs"
                >
                  <option value="all">Tất cả 70 tiết (35 tuần)</option>
                  <option value="HK1">Học kỳ I (Tiết 1 - 35)</option>
                  <option value="HK2">Học kỳ II (Tiết 36 - 70)</option>
                </select>

                <button
                  onClick={() => window.print()}
                  className="bg-slate-800 hover:bg-slate-700 text-white font-semibold px-3 py-1.5 rounded-lg transition cursor-pointer shadow-xs flex items-center gap-1"
                >
                  <i className="fa-solid fa-print"></i>
                  <span>In PPCT</span>
                </button>
              </div>
            </div>

            {/* Bảng PPCT 70 Tiết */}
            <div className="overflow-x-auto border border-slate-200 rounded-xl bg-white shadow-xs">
              <table className="w-full text-left text-xs md:text-sm">
                <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200 uppercase text-[11px] sticky top-0">
                  <tr>
                    <th className="p-3 text-center">Tiết số</th>
                    <th className="p-3 text-center">Tuần</th>
                    <th className="p-3 text-center">Học kỳ</th>
                    <th className="p-3">Chủ đề bài học</th>
                    <th className="p-3">Nội dung chi tiết (Thời lượng: 45 phút)</th>
                    <th className="p-3">Căn cứ SGK</th>
                    <th className="p-3">Ghi chú & Yêu cầu</th>
                    <th className="p-3 text-center no-print">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredPPCT.map((row) => (
                    <tr key={`${row.grade}-${row.period}`} className="hover:bg-slate-50 transition">
                      <td className="p-3 text-center font-black text-emerald-800 whitespace-nowrap">
                        Tiết {row.period}
                      </td>
                      <td className="p-3 text-center font-medium text-slate-600 whitespace-nowrap">
                        Tuần {row.week}
                      </td>
                      <td className="p-3 text-center whitespace-nowrap">
                        <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                          row.semester === 'HK1' ? 'bg-blue-50 text-blue-700 border border-blue-200' : 'bg-amber-50 text-amber-700 border border-amber-200'
                        }`}>
                          {row.semester}
                        </span>
                      </td>
                      <td className="p-3 font-semibold text-slate-800 whitespace-nowrap">
                        {row.theme}
                      </td>
                      <td className="p-3 font-medium text-slate-900">
                        {row.lessonTitle}
                      </td>
                      <td className="p-3 text-slate-700 font-semibold whitespace-nowrap">
                        {row.sgkPages}
                      </td>
                      <td className="p-3 text-slate-600 text-xs">
                        <span className="bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                          {row.notes}
                        </span>
                      </td>
                      <td className="p-3 text-center whitespace-nowrap no-print">
                        <button
                          onClick={() => {
                            setGradeSelect(row.grade);
                            setClassNameInput(`${row.grade}A1`);
                            setSgkInput(`${row.sgkPages} • ${row.theme}`);
                            const pIdx = row.period - 1;
                            if (pIdx >= 0 && pIdx < lessons.length) {
                              setSelectedLessonIndex(pIdx);
                            }
                            setActiveSubView('khbd');
                          }}
                          className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-3 py-1.5 rounded-lg text-xs transition cursor-pointer shadow-xs flex items-center gap-1.5 mx-auto"
                          title={`Soạn ngay kế hoạch bài dạy cho Tiết ${row.period}: ${row.lessonTitle}`}
                        >
                          <i className="fa-solid fa-file-pen text-amber-300"></i>
                          <span>Soạn KHBD</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

          </div>
        )}

      </div>

      {/* ==================== MODAL XEM TRƯỚC BẢN IN & XUẤT VĂN BẢN CHUẨN A4 ==================== */}
      {showPrintModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 overflow-y-auto no-print">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[95vh] flex flex-col border border-slate-300">
            {/* Modal Header */}
            <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50 rounded-t-2xl">
              <div>
                <h3 className="font-bold text-slate-900 text-sm md:text-base flex items-center gap-2">
                  <i className="fa-solid fa-print text-emerald-700"></i>
                  <span>Hộp Thoại Xuất & In Kế Hoạch Bài Dạy Chuẩn A4</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Định dạng theo Công văn 5512/BGDĐT & CV 7791/BGDĐT • {schoolLocation} • Khối {gradeSelect}
                </p>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                <button
                  onClick={() => {
                    try {
                      window.print();
                    } catch (e) {
                      console.warn('Print error:', e);
                    }
                  }}
                  className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs px-3.5 py-2 rounded-lg flex items-center gap-1.5 transition cursor-pointer shadow-xs"
                  title="In trực tiếp ra máy in hoặc lưu PDF"
                >
                  <i className="fa-solid fa-print"></i>
                  <span>In Ra Máy In / PDF</span>
                </button>

                <button
                  onClick={handleExportWord}
                  className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs px-3.5 py-2 rounded-lg flex items-center gap-1.5 transition cursor-pointer shadow-xs"
                  title="Tải ngay file Word (.doc) để nộp Tổ chuyên môn hoặc mở in trong Word"
                >
                  <i className="fa-solid fa-file-word"></i>
                  <span>Tải File Word (.doc)</span>
                </button>

                <button
                  onClick={handleCopyPlan}
                  className="bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold text-xs px-3 py-2 rounded-lg flex items-center gap-1.5 transition cursor-pointer"
                  title="Sao chép toàn bộ văn bản"
                >
                  <i className="fa-solid fa-copy"></i>
                  <span>{copySuccess ? 'Đã sao chép!' : 'Sao chép'}</span>
                </button>

                <button
                  onClick={() => setShowPrintModal(false)}
                  className="bg-slate-100 hover:bg-red-50 text-slate-600 hover:text-red-600 font-bold text-xs px-2.5 py-2 rounded-lg border border-slate-300 transition cursor-pointer"
                  title="Đóng hộp thoại"
                >
                  <i className="fa-solid fa-xmark text-sm"></i>
                </button>
              </div>
            </div>

            {/* Modal Body: A4 Paper Preview (Font Times New Roman - Cỡ Chữ 13) */}
            <div className="p-4 sm:p-6 overflow-y-auto flex-1 bg-slate-100">
              <div
                className="bg-white mx-auto shadow-md p-6 sm:p-10 max-w-3xl border border-slate-300 rounded-sm khbd-preview-paper text-slate-950 space-y-4"
                style={{
                  fontFamily: "'Times New Roman', Times, 'Tinos', serif",
                  fontSize: '13pt',
                  lineHeight: '1.45'
                }}
              >
                {/* Tiêu ngữ hành chính: Bảng không viền, 2 cột 2 dòng căn giữa, phông chữ 12, tuyệt đối không nhảy dòng */}
                <table
                  className="w-full border-none border-collapse text-center mb-3"
                  style={{ fontFamily: "'Times New Roman', Times, serif", fontSize: '12pt' }}
                >
                  <tbody>
                    <tr className="border-none">
                      <td className="w-[42%] p-1 text-center border-none align-top whitespace-nowrap">
                        <p className="font-semibold text-slate-900 uppercase" style={{ fontSize: '12pt', margin: 0 }}>
                          Sở GD&ĐT VĨNH LONG
                        </p>
                      </td>
                      <td className="w-[58%] p-1 text-center border-none align-top whitespace-nowrap">
                        <p className="font-bold text-slate-950 uppercase" style={{ fontSize: '12pt', margin: 0 }}>
                          CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM
                        </p>
                      </td>
                    </tr>
                    <tr className="border-none">
                      <td className="w-[42%] p-1 text-center border-none align-top whitespace-nowrap">
                        <p className="font-bold text-slate-950 uppercase" style={{ fontSize: '12pt', margin: 0 }}>
                          TRƯỜNG THPT HUỲNH TẤN PHÁT
                        </p>
                        <div className="w-28 h-[1px] bg-slate-800 mx-auto mt-0.5"></div>
                      </td>
                      <td className="w-[58%] p-1 text-center border-none align-top whitespace-nowrap">
                        <p className="font-bold text-slate-950" style={{ fontSize: '12pt', margin: 0 }}>
                          Độc lập - Tự do - Hạnh phúc
                        </p>
                        <div className="w-36 h-[1px] bg-slate-800 mx-auto mt-0.5"></div>
                      </td>
                    </tr>
                  </tbody>
                </table>

                {/* Tiêu đề KHBD */}
                <div className="text-center space-y-1 pt-2">
                  <h1 className="text-[15pt] font-black uppercase text-slate-950">
                    KẾ HOẠCH BÀI DẠY (CÔNG VĂN 5512/BGDĐT)
                  </h1>
                  <p className="font-bold text-slate-800 text-[13pt]">
                    Môn học: {subjectTitle} • Lớp: Khối {gradeSelect} ({classNameInput})
                  </p>
                  <p className="font-black text-emerald-950 text-[13.5pt] uppercase">
                    Tên bài dạy: {detailedPlan.lessonTitle}
                  </p>
                  <p className="text-[13pt] text-slate-700">
                    Thời lượng: {detailedPlan.durationText} • Căn cứ SGK: {sgkInput}
                  </p>
                </div>

                {/* Mục tiêu */}
                <div className="space-y-2 pt-2 border-t border-slate-200">
                  <h4 className="font-bold uppercase text-slate-950 text-[13pt]">I. MỤC TIÊU BÀI DẠY:</h4>
                  <div className="space-y-1 text-slate-800 text-[13pt] pl-3">
                    <p><strong>1. Năng lực đặc thù:</strong> Chăm sóc sức khỏe, Vận động cơ bản, Hoạt động TDTT.</p>
                    <p><strong>2. Năng lực chung:</strong> Tự chủ & tự học, Giao tiếp & hợp tác.</p>
                    <p><strong>3. Năng lực số & AI:</strong> {detailedPlan.objectives.digitalAndAiCompetency}</p>
                    <p><strong>4. Phẩm chất:</strong> Chăm chỉ, trung thực, đoàn kết và trách nhiệm.</p>
                  </div>
                </div>

                {/* Thiết bị dạy học */}
                <div className="space-y-2 pt-2 border-t border-slate-200">
                  <h4 className="font-bold uppercase text-slate-950 text-[13pt]">II. THIẾT BỊ DẠY HỌC & HỌC LIỆU:</h4>
                  <div className="space-y-1 text-slate-800 text-[13pt] pl-3">
                    <p><strong>- Giáo viên:</strong> {detailedPlan.equipment.teacherTools.join('; ')}</p>
                    <p><strong>- Học sinh:</strong> {detailedPlan.equipment.studentTools.join('; ')}</p>
                    <p><strong>- Thiết bị số & AI:</strong> {detailedPlan.equipment.digitalAndAiTools.join('; ')}</p>
                  </div>
                </div>

                {/* Tiến trình 4 hoạt động */}
                <div className="space-y-3 pt-2 border-t border-slate-200">
                  <h4 className="font-bold uppercase text-slate-950 text-[13pt]">III. TIẾN TRÌNH DẠY HỌC (4 HOẠT ĐỘNG × 4 BƯỚC):</h4>
                  <div className="space-y-2.5 pl-2">
                    {detailedPlan.activities.map((act) => (
                      <div key={act.id} className="border-l-2 border-emerald-600 pl-3 space-y-1 text-[13pt]">
                        <p className="font-bold text-[13pt] uppercase text-slate-950">
                          {act.title} <span className="font-normal text-slate-600 italic">({act.objective})</span>
                        </p>
                        {act.steps.map((st) => (
                          <div key={st.stepNumber} className="text-[13pt] text-slate-800 pl-2">
                            <span className="font-bold text-slate-950">+ {st.stepName} ({st.roleTag}):</span>
                            <span className="ml-1 text-slate-700">{st.content[0]}</span>
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Phần ký duyệt chuẩn - Đồng bộ ngang nhau tuyệt đối, xã Châu Hưng xuất hiện nơi ký xác nhận của TỔ TRƯỞNG, tuyệt đối không nhảy dòng, vừa vặn chữ ký */}
                <div className="pt-6 border-t border-slate-300">
                  <div className="grid grid-cols-2 text-center text-[13pt] gap-4">
                    {/* Hàng 1: Địa danh và ngày tháng - Xã Châu Hưng xuất hiện nơi ký xác nhận của TỔ TRƯỞNG */}
                    <div className="italic text-slate-800 text-[13pt] whitespace-nowrap">
                      {schoolLocation}, ngày {planDay || '...'} tháng {planMonth || '...'} năm {planYear || '20...'}
                    </div>
                    <div className="italic text-slate-800 text-[13pt] whitespace-nowrap">
                      {schoolLocation}, ngày {planDay || '...'} tháng {planMonth || '...'} năm {planYear || '20...'}
                    </div>

                    {/* Hàng 2: Chức danh */}
                    <div className="font-bold uppercase text-slate-950 text-[13pt] whitespace-nowrap">TỔ TRƯỞNG</div>
                    <div className="font-bold uppercase text-slate-950 text-[13pt] whitespace-nowrap">GIÁO VIÊN SOẠN BÀI</div>

                    {/* Hàng 3: Chú thích */}
                    <div className="text-slate-600 italic text-[13pt] whitespace-nowrap">(Ký và ghi rõ họ tên)</div>
                    <div className="text-slate-600 italic text-[13pt] whitespace-nowrap">(Ký và ghi rõ họ tên)</div>

                    {/* Hàng 4: Khoảng trống ký tên - Vừa vặn chữ ký (h-10) */}
                    <div className="h-10 flex items-center justify-center text-slate-300 italic text-[11pt]">
                      (Ký tên)
                    </div>
                    <div className="h-10 flex items-center justify-center text-slate-300 italic text-[11pt]">
                      (Ký tên)
                    </div>

                    {/* Hàng 5: Họ tên */}
                    <div className="font-bold text-slate-950 text-[13pt] whitespace-nowrap">
                      {ttcmName}
                    </div>
                    <div className="font-bold text-slate-950 text-[13pt] whitespace-nowrap">
                      {detailedPlan.teacherName}
                    </div>
                  </div>
                </div>

              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs rounded-b-2xl">
              <span className="text-slate-500 italic flex items-center gap-1.5">
                <i className="fa-solid fa-circle-check text-emerald-600"></i>
                Hỗ trợ in trực tiếp hoặc tải file Word .doc chuẩn khổ giấy A4
              </span>
              <button
                onClick={() => setShowPrintModal(false)}
                className="bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold px-4 py-1.5 rounded-lg transition cursor-pointer"
              >
                Đóng
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};
