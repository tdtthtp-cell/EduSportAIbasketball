import React, { useState } from 'react';
import { StudentProfile, SportKey, ZaloMessageItem } from '../types';
import { SPORTS_LIST } from '../data/curriculum';

interface TabPhuHuynhProps {
  students: StudentProfile[];
  currentSport: SportKey;
  currentTeacherName: string;
  initialSelectedStudent?: StudentProfile | null;
}

export const TabPhuHuynh: React.FC<TabPhuHuynhProps> = ({
  students,
  currentSport,
  currentTeacherName,
  initialSelectedStudent
}) => {
  const [parentClassFilter, setParentClassFilter] = useState<string>('all');
  const [selectedStudentId, setSelectedStudentId] = useState<string>(
    initialSelectedStudent?.id || students[0]?.id || ''
  );
  const [templateType, setTemplateType] = useState<string>('overweight');
  const [customContent, setCustomContent] = useState<string>('');
  const [isEditingCustom, setIsEditingCustom] = useState<boolean>(false);
  const [copiedSuccess, setCopiedSuccess] = useState<boolean>(false);

  const availableClasses = Array.from(new Set(students.map(s => s.class))).filter(Boolean).sort();

  const classFilteredStudents = students.filter(s => {
    if (parentClassFilter !== 'all' && s.class !== parentClassFilter) return false;
    return true;
  });

  const sportObj = SPORTS_LIST.find(s => s.key === currentSport) || SPORTS_LIST[0];
  const currentStudent = students.find(s => s.id === selectedStudentId) || classFilteredStudents[0] || students[0];

  // Initial sent messages list
  const [sentHistory, setSentHistory] = useState<ZaloMessageItem[]>([
    {
      id: 'msg-1',
      studentId: 's-10a1-01',
      studentName: 'Lê Khánh An',
      className: '10A1',
      senderName: currentTeacherName,
      timestamp: '10:30 Hôm nay',
      type: 'overweight',
      content: `Kính gửi Phụ huynh em Lê Khánh An (Lớp 10A1),
Hôm nay trong tiết Giáo dục thể chất (${sportObj.name}), nhà trường đã kiểm tra chỉ số vận động của em An. Thể trạng em phát triển tốt, tuy nhiên em hơi thừa cân (BMI 27.2) và có dấu hiệu mỏi khớp gối khi giảm chấn nhảy tiếp đất liên tục trên sân xi măng. Thầy đã điều chỉnh giáo án riêng, ưu tiên động tác tại chỗ và không bắt em nhảy cao quá sức. Nhờ quý Phụ huynh phối hợp nhắc em hạn chế uống nước ngọt đóng chai, ăn nhiều rau củ và ngủ đủ giấc trước 22h30. Trân trọng cám ơn Quý Phụ Huynh!`,
      status: 'sent'
    },
    {
      id: 'msg-2',
      studentId: 's-12c1-01',
      studentName: 'Đặng Quốc Anh',
      className: '12C1',
      senderName: currentTeacherName,
      timestamp: '08:15 Hôm qua',
      type: 'mild',
      content: `Kính gửi Phụ huynh em Đặng Quốc Anh (Lớp 12C1),
Trong giờ học Thể chất môn Bóng rổ hôm nay, em Quốc Anh đã thực hiện tốt kỹ thuật chuyền bóng và phối hợp nhóm. Nhắc nhở em duy trì thói quen bù nước khoáng sau vận động để bảo đảm thể lực tốt nhất. Trân trọng thông báo đến Quý Phụ huynh!`,
      status: 'sent'
    }
  ]);

  const generateMessageText = (st: StudentProfile, tType: string): string => {
    if (!st) return '';
    const teacherPrefix = currentTeacherName ? `Thầy/Cô ${currentTeacherName}` : 'Bộ môn GDTC';
    
    if (tType === 'overweight') {
      return `Kính gửi Phụ huynh em ${st.name} (Lớp ${st.class}),
Hôm nay trong tiết Giáo dục thể chất (${sportObj.name}), nhà trường đã kiểm tra chỉ số vận động của em. Thể trạng em phát triển tốt, tuy nhiên em có xu hướng thừa cân (BMI ${st.bmi}) và có dấu hiệu căng mỏi khớp gối khi giảm chấn trên nền sân bê tông. ${teacherPrefix} đã chủ động điều chỉnh phác đồ tập luyện riêng: ưu tiên kỹ thuật tại chỗ, bước lướt ngắn và không bắt em nhảy cao quá tải. Nhờ quý Phụ huynh phối hợp nhắc em hạn chế uống nước ngọt đóng chai, nước dừa có gas hay trà sữa, tăng cường rau xanh và ngủ đủ giấc trước 22h30. Trân trọng cảm ơn Quý Phụ Huynh!`;
    }

    if (tType === 'underweight') {
      return `Kính gửi Phụ huynh em ${st.name} (Lớp ${st.class}),
Trong tiết Thể chất (${sportObj.name}) hôm nay, em ${st.name} có tinh thần tập luyện rất tự giác và hòa đồng. Tuy nhiên thể lực và sức bền cơ bắp của em còn hơi yếu (BMI ${st.bmi}), nhanh mỏi sau 15 phút tập ngoài trời. Thầy/Cô đã bố trí cho em nghỉ ngơi giữa các hiệp và uống nước bù khoáng. Kính nhờ gia đình tăng cường bổ sung bữa ăn sáng đủ đạm (trứng gà, cá sông, canh đậu hũ) và bữa phụ nhẹ trước giờ đi học để em có đủ năng lượng vận động. Trân trọng!`;
    }

    if (tType === 'mild') {
      return `Kính gửi Phụ huynh em ${st.name} (Lớp ${st.class}),
Nhà trường xin gửi thông báo y tế học đường: Tiết Thể chất hôm nay, giáo viên đã áp dụng phác đồ bảo vệ sức khỏe cho học sinh có tiền sử bệnh lý nền nhẹ (${st.medicalNote}). Em đã hoàn thành tốt các bài tập hít thở 4 thì và kỹ thuật không gắng sức trong vùng nhịp tim an toàn. Kính nhờ Phụ huynh luôn nhắc em kiểm tra bình thuốc xịt / dụng cụ y tế cá nhân trong cặp sách trước mỗi buổi học GDTC. Trân trọng!`;
    }

    return `Kính gửi Phụ huynh em ${st.name} (Lớp ${st.class}),
Thầy/Cô ${currentTeacherName} - Bộ môn GDTC xin biểu dương em ${st.name} trong tiết học hôm nay: Em thực hiện động tác kỹ thuật rất chuẩn xác, đạt chuẩn rèn luyện thể lực tốt và tích cực ứng dụng công nghệ số quay video giúp đỡ các bạn trong lớp cùng tiến bộ. Kính chúc gia đình thật nhiều sức khỏe!`;
  };

  const currentDisplayMessage = isEditingCustom && customContent
    ? customContent
    : generateMessageText(currentStudent, templateType);

  const handleSendZalo = () => {
    const newMsg: ZaloMessageItem = {
      id: `msg-${Date.now()}`,
      studentId: currentStudent.id,
      studentName: currentStudent.name,
      className: currentStudent.class,
      senderName: currentTeacherName,
      timestamp: 'Vừa xong',
      type: templateType as any,
      content: currentDisplayMessage,
      status: 'sent'
    };

    setSentHistory([newMsg, ...sentHistory]);
    alert(`Đã gửi thông báo sức khỏe cho Phụ huynh em ${currentStudent.name} qua Zalo OA trường THPT Huỳnh Tấn Phát thành công!`);
    setIsEditingCustom(false);
  };

  const handleCopyMessage = () => {
    navigator.clipboard.writeText(currentDisplayMessage);
    setCopiedSuccess(true);
    setTimeout(() => setCopiedSuccess(false), 2500);
  };

  return (
    <div id="tab-phuhuynh" className="tab-content block space-y-4">
      <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs max-w-4xl mx-auto space-y-5">
        
        {/* Tiêu đề */}
        <div className="flex items-center justify-between border-b pb-3">
          <div>
            <h2 className="text-base md:text-lg font-bold text-slate-900 flex items-center gap-2">
              <i className="fa-brands fa-whatsapp text-emerald-600 text-xl"></i>
              Cổng Thông Báo Phụ Huynh (Zalo OA / SMS Edu THPT Huỳnh Tấn Phát)
            </h2>
            <p className="text-xs text-slate-500">
              Cầu nối giữa Giáo viên Thể chất và Gia đình: Tư vấn thể trạng, chế độ sinh hoạt và an toàn vận động
            </p>
          </div>
          <span className="text-xs bg-rose-100 text-rose-800 font-bold px-2.5 py-1 rounded-full border border-rose-200 flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-rose-600 animate-ping"></span>
            Tin tức sức khỏe
          </span>
        </div>

        {/* Cấu hình gửi tin */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs md:text-sm bg-slate-50 p-3.5 rounded-lg border border-slate-200">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Lọc theo lớp thực tế:
            </label>
            <select
              value={parentClassFilter}
              onChange={(e) => {
                setParentClassFilter(e.target.value);
                const filtered = e.target.value === 'all'
                  ? students
                  : students.filter(s => s.class === e.target.value);
                if (filtered[0]) {
                  setSelectedStudentId(filtered[0].id);
                  setTemplateType(filtered[0].status);
                  setIsEditingCustom(false);
                }
              }}
              className="w-full bg-white border border-slate-300 rounded-lg p-2 font-bold text-slate-800 focus:ring-1 focus:ring-emerald-500 cursor-pointer"
            >
              <option value="all">Tất cả các lớp ({students.length})</option>
              {availableClasses.map(c => (
                <option key={c} value={c}>
                  Lớp {c} ({students.filter(s => s.class === c).length} HS)
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Chọn học sinh cần liên hệ:
            </label>
            {classFilteredStudents.length === 0 ? (
              <div className="p-2 bg-white border border-slate-300 rounded-lg text-slate-400 text-xs">
                Không có học sinh trong lớp này
              </div>
            ) : (
              <select
                value={currentStudent?.id || ''}
                onChange={(e) => {
                  setSelectedStudentId(e.target.value);
                  const st = students.find(s => s.id === e.target.value);
                  if (st) setTemplateType(st.status);
                  setIsEditingCustom(false);
                }}
                className="w-full bg-white border border-slate-300 rounded-lg p-2 font-medium text-slate-800 focus:ring-1 focus:ring-emerald-500 cursor-pointer"
              >
                {classFilteredStudents.map((st) => (
                  <option key={st.id} value={st.id}>
                    [{st.class}] {st.name} ({st.code} {st.parentPhone ? `• SĐT: ${st.parentPhone}` : ''})
                  </option>
                ))}
              </select>
            )}
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Mẫu tin nhắn chuyên môn:
            </label>
            <select
              value={templateType}
              onChange={(e) => {
                setTemplateType(e.target.value);
                setIsEditingCustom(false);
              }}
              className="w-full bg-white border border-slate-300 rounded-lg p-2 font-medium text-slate-800 focus:ring-1 focus:ring-emerald-500 cursor-pointer"
            >
              <option value="overweight">1. Thừa cân: Điều chỉnh phác đồ giảm tải khớp gối</option>
              <option value="underweight">2. Thiếu cân: Nhắc nhở dinh dưỡng & Bữa sáng</option>
              <option value="mild">3. Bệnh nền nhẹ (Hen suyễn): Phối hợp thuốc xịt</option>
              <option value="praise">4. Biểu dương: Thể lực xuất sắc & Giúp đỡ bạn học</option>
            </select>
          </div>
        </div>

        {/* Khung mô phỏng tin nhắn */}
        <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
          <div className="flex justify-between items-center text-slate-500 text-xs">
            <span className="font-bold text-slate-700 flex items-center gap-1.5">
              <i className="fa-solid fa-user-tie text-emerald-700"></i>
              Người gửi: <span id="zaloSenderName" className="text-emerald-800 font-semibold">{currentTeacherName}</span>
            </span>
            <span className="text-slate-400">Thời gian tạo: Vừa xong</span>
          </div>

          {/* Hộp thoại nội dung tin nhắn */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 text-slate-800 text-xs md:text-sm space-y-2 shadow-2xs">
            <div className="flex justify-between items-center border-b pb-2">
              <span className="font-bold text-emerald-800 flex items-center gap-1.5">
                <i className="fa-solid fa-envelope-open-text text-emerald-600"></i>
                Kính gửi Phụ huynh em {currentStudent?.name} ({currentStudent?.class})
              </span>
              <button
                onClick={() => {
                  if (!isEditingCustom) {
                    setCustomContent(generateMessageText(currentStudent, templateType));
                  }
                  setIsEditingCustom(!isEditingCustom);
                }}
                className="text-xs text-slate-500 hover:text-emerald-700 underline cursor-pointer"
              >
                {isEditingCustom ? 'Khóa chỉnh sửa' : 'Tùy chỉnh nội dung'}
              </button>
            </div>

            {isEditingCustom ? (
              <textarea
                value={customContent}
                onChange={(e) => setCustomContent(e.target.value)}
                rows={6}
                className="w-full bg-slate-50 border border-emerald-300 rounded-lg p-2.5 text-xs md:text-sm text-slate-800 focus:outline-emerald-600 leading-relaxed font-sans"
              />
            ) : (
              <p className="text-slate-700 leading-relaxed whitespace-pre-line">
                {currentDisplayMessage}
              </p>
            )}
          </div>

          {/* Nút thao tác gửi & sao chép */}
          <div className="flex flex-wrap justify-end gap-2 pt-1">
            <button
              onClick={handleCopyMessage}
              className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold px-3 py-1.5 rounded-lg text-xs flex items-center gap-1.5 border border-slate-300 transition cursor-pointer"
            >
              <i className="fa-solid fa-copy"></i>
              <span>{copiedSuccess ? 'Đã sao chép!' : 'Sao chép văn bản'}</span>
            </button>

            <button
              onClick={handleSendZalo}
              className="bg-emerald-700 hover:bg-emerald-800 text-white font-semibold px-4 py-1.5 rounded-lg text-xs flex items-center gap-1.5 shadow-xs transition cursor-pointer"
            >
              <i className="fa-solid fa-paper-plane"></i>
              <span>Gửi Ngay Qua Zalo OA Trường</span>
            </button>
          </div>
        </div>

        {/* Lịch sử tin nhắn đã gửi */}
        <div className="space-y-3 pt-2">
          <h3 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
            <i className="fa-solid fa-clock-rotate-left text-slate-500"></i>
            Nhật Ký Tin Nhắn Tư Vấn Sức Khỏe Đã Gửi:
          </h3>

          <div className="space-y-2.5 text-xs">
            {sentHistory.map((item) => (
              <div key={item.id} className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1.5">
                <div className="flex justify-between items-center text-slate-500">
                  <span className="font-bold text-slate-800">
                    Phụ huynh em: {item.studentName} (Lớp {item.className})
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded text-[10px] font-semibold">
                      Đã gửi • {item.timestamp}
                    </span>
                  </div>
                </div>
                <p className="text-slate-600 line-clamp-2 italic">&quot;{item.content}&quot;</p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
