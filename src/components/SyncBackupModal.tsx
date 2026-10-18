import React, { useState } from 'react';
import { StudentProfile, SportKey, GradeLevel, Role } from '../types';
import { INITIAL_STUDENTS } from '../data/students';
import { syncAllStudentsToCloud } from '../firebase';

interface SyncBackupModalProps {
  isOpen: boolean;
  onClose: () => void;
  students: StudentProfile[];
  onUpdateStudents: (students: StudentProfile[]) => void;
  currentSport: SportKey;
  currentGrade: GradeLevel;
  userRole: Role;
  customUserName: string;
  onShowToast: (msg: string) => void;
}

export const SyncBackupModal: React.FC<SyncBackupModalProps> = ({
  isOpen,
  onClose,
  students,
  onUpdateStudents,
  currentSport,
  currentGrade,
  userRole,
  customUserName,
  onShowToast
}) => {
  const [activeTab, setActiveTab] = useState<'sync' | 'file' | 'reset'>('sync');
  const [syncCodeInput, setSyncCodeInput] = useState<string>('');
  const [statusMessage, setStatusMessage] = useState<{ text: string; type: 'success' | 'error' | 'info' } | null>(null);
  const [isSyncingCloud, setIsSyncingCloud] = useState<boolean>(false);

  const handleSyncToCloud = async () => {
    setIsSyncingCloud(true);
    setStatusMessage(null);
    try {
      await syncAllStudentsToCloud(students);
      setStatusMessage({
        text: `Đồng bộ thành công ${students.length} học sinh lên Đám Mây Firebase Firestore! Khi mở trang tdc3htp.com trên bất kỳ thiết bị nào (điện thoại, máy tính), dữ liệu sẽ tự động tải về ngay.`,
        type: 'success'
      });
      onShowToast(`Đã đồng bộ ${students.length} học sinh lên Đám Mây Firestore thành công!`);
    } catch (err) {
      setStatusMessage({
        text: 'Lỗi đồng bộ Đám Mây: ' + (err instanceof Error ? err.message : String(err)),
        type: 'error'
      });
    } finally {
      setIsSyncingCloud(false);
    }
  };

  if (!isOpen) return null;

  // Chuẩn bị gói dữ liệu đồng bộ
  const backupPayload = {
    version: 'edusport_v4',
    timestamp: new Date().toISOString(),
    school: 'THPT Huỳnh Tấn Phát',
    currentSport,
    currentGrade,
    userRole,
    customUserName,
    studentCount: students.length,
    students
  };

  // Tạo mã chuỗi đồng bộ Base64 an toàn UTF-8
  const generateSyncCode = () => {
    try {
      const jsonStr = JSON.stringify(backupPayload);
      // Mã hóa an toàn UTF-8 sang base64
      const base64 = btoa(encodeURIComponent(jsonStr));
      return base64;
    } catch {
      return JSON.stringify(backupPayload);
    }
  };

  // Sao chép mã đồng bộ vào Clipboard
  const handleCopySyncCode = () => {
    const code = generateSyncCode();
    navigator.clipboard.writeText(code).then(() => {
      setStatusMessage({
        text: 'Đã sao chép mã đồng bộ thành công! Thầy/Cô hãy mở Zalo gửi tin nhắn cho chính mình (Cloud của tôi), sau đó mở điện thoại dán vào nhé.',
        type: 'success'
      });
      onShowToast('Đã sao chép mã đồng bộ dữ liệu vào bộ nhớ tạm!');
    }).catch(() => {
      setStatusMessage({
        text: 'Không thể tự động sao chép. Vui lòng bấm giữ và copy trực tiếp trong ô bên dưới.',
        type: 'error'
      });
    });
  };

  // Áp dụng mã đồng bộ từ thiết bị khác
  const handleApplySyncCode = () => {
    setStatusMessage(null);
    if (!syncCodeInput.trim()) {
      setStatusMessage({ text: 'Vui lòng dán mã đồng bộ vào ô bên dưới trước khi bấm Đồng Bộ!', type: 'error' });
      return;
    }

    try {
      let rawJson = '';
      const input = syncCodeInput.trim();
      if (input.startsWith('{')) {
        rawJson = input;
      } else {
        rawJson = decodeURIComponent(atob(input));
      }

      const parsed = JSON.parse(rawJson);
      if (parsed && Array.isArray(parsed.students)) {
        onUpdateStudents(parsed.students);
        // Lưu ngay vào localStorage thiết bị này
        localStorage.setItem('edusport_students', JSON.stringify(parsed.students));
        setStatusMessage({
          text: `Đồng bộ thành công ${parsed.students.length} học sinh vào thiết bị này! Dữ liệu đã được cập nhật hoàn tất.`,
          type: 'success'
        });
        onShowToast(`Đã đồng bộ ${parsed.students.length} học sinh từ thiết bị khác thành công!`);
        setSyncCodeInput('');
      } else {
        setStatusMessage({ text: 'Mã đồng bộ không đúng định dạng hồ sơ học sinh EduSport.', type: 'error' });
      }
    } catch {
      setStatusMessage({
        text: 'Mã đồng bộ không hợp lệ hoặc bị thiếu ký tự khi sao chép. Vui lòng thử lại.',
        type: 'error'
      });
    }
  };

  // Xuất file JSON tải về
  const handleDownloadBackupFile = () => {
    try {
      const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(backupPayload, null, 2));
      const downloadAnchor = document.createElement('a');
      const dateStr = new Date().toISOString().slice(0, 10);
      downloadAnchor.setAttribute('href', dataStr);
      downloadAnchor.setAttribute('download', `EduSport-DuLieu-HocSinh-${dateStr}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();

      setStatusMessage({
        text: 'Đã tải tệp sao lưu về máy. Thầy/Cô có thể gửi tệp này qua Zalo hoặc Google Drive để mở trên điện thoại.',
        type: 'success'
      });
      onShowToast('Đã tải tệp sao lưu (.json) thành công!');
    } catch {
      setStatusMessage({ text: 'Lỗi khi tạo tệp sao lưu.', type: 'error' });
    }
  };

  // Nhập file JSON tải lên
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    setStatusMessage(null);
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        const parsed = JSON.parse(content);
        if (parsed && Array.isArray(parsed.students)) {
          onUpdateStudents(parsed.students);
          localStorage.setItem('edusport_students', JSON.stringify(parsed.students));
          setStatusMessage({
            text: `Nhập tệp sao lưu thành công! Đã nạp ${parsed.students.length} hồ sơ học sinh.`,
            type: 'success'
          });
          onShowToast(`Đã khôi phục ${parsed.students.length} học sinh từ tệp sao lưu!`);
        } else if (Array.isArray(parsed)) {
          onUpdateStudents(parsed);
          localStorage.setItem('edusport_students', JSON.stringify(parsed));
          setStatusMessage({
            text: `Nhập tệp sao lưu thành công! Đã nạp ${parsed.length} hồ sơ học sinh.`,
            type: 'success'
          });
          onShowToast(`Đã khôi phục ${parsed.length} học sinh từ tệp!`);
        } else {
          setStatusMessage({ text: 'Tệp JSON không chứa mảng danh sách học sinh hợp lệ.', type: 'error' });
        }
      } catch {
        setStatusMessage({ text: 'Tệp tải lên không phải là tệp JSON hợp lệ.', type: 'error' });
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  // Lưu nhanh vào máy hiện tại
  const handleQuickSaveCurrent = () => {
    localStorage.setItem('edusport_students', JSON.stringify(students));
    localStorage.setItem('edusport_user_name', customUserName);
    setStatusMessage({
      text: `Đã lưu ${students.length} hồ sơ học sinh vào bộ nhớ máy này lúc ${new Date().toLocaleTimeString('vi-VN')}!`,
      type: 'success'
    });
    onShowToast('Đã lưu dữ liệu vào bộ nhớ máy này thành công!');
  };

  // Khôi phục dữ liệu ban đầu
  const handleResetToDefault = () => {
    if (window.confirm('Thầy/Cô có chắc chắn muốn khôi phục về danh sách 5 lớp gốc (10A1, 10A3, 12C1, 12C2, 12C3 - 70 học sinh) của trường THPT Huỳnh Tấn Phát?')) {
      onUpdateStudents(INITIAL_STUDENTS);
      localStorage.setItem('edusport_students', JSON.stringify(INITIAL_STUDENTS));
      setStatusMessage({
        text: 'Đã khôi phục danh sách học sinh về mặc định chuẩn trường THPT Huỳnh Tấn Phát thành công.',
        type: 'info'
      });
      onShowToast('Đã đặt lại dữ liệu học sinh mặc định!');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/60 backdrop-blur-xs animate-fadeIn">
      <div 
        className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl max-h-[92vh] flex flex-col overflow-hidden text-slate-800"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Modal */}
        <div className="bg-gradient-to-r from-slate-900 via-emerald-950 to-teal-950 text-white p-4 flex items-center justify-between border-b border-emerald-800/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600/30 border border-emerald-400/40 flex items-center justify-center text-emerald-300 text-lg">
              <i className="fa-solid fa-cloud-arrow-up"></i>
            </div>
            <div>
              <h2 className="text-base md:text-lg font-bold flex items-center gap-2">
                Trung Tâm Sao Lưu & Đồng Bộ Thiết Bị
                <span className="text-[11px] bg-amber-400 text-slate-950 font-black px-2 py-0.5 rounded uppercase">
                  PC ⇄ Điện Thoại
                </span>
              </h2>
              <p className="text-xs text-emerald-200/80">
                Lưu trữ hồ sơ học sinh và đồng bộ dữ liệu giữa Máy tính & Điện thoại di động
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition cursor-pointer text-sm"
          >
            ✕
          </button>
        </div>

        {/* Thông báo trạng thái nếu có */}
        {statusMessage && (
          <div className={`mx-4 mt-3 p-3 rounded-xl text-xs flex items-start gap-2 ${
            statusMessage.type === 'success'
              ? 'bg-emerald-50 text-emerald-900 border border-emerald-200'
              : statusMessage.type === 'error'
              ? 'bg-rose-50 text-rose-900 border border-rose-200'
              : 'bg-blue-50 text-blue-900 border border-blue-200'
          }`}>
            <i className={`fa-solid mt-0.5 ${
              statusMessage.type === 'success' ? 'fa-circle-check text-emerald-600' :
              statusMessage.type === 'error' ? 'fa-triangle-exclamation text-rose-600' : 'fa-circle-info text-blue-600'
            }`}></i>
            <span className="font-medium flex-1">{statusMessage.text}</span>
          </div>
        )}

        {/* Thông tin giải thích nhanh */}
        <div className="px-4 pt-3 pb-1">
          <div className="bg-amber-50 border border-amber-200/80 rounded-xl p-2.5 flex items-start gap-2.5 text-xs text-amber-950">
            <i className="fa-solid fa-lightbulb text-amber-600 text-base mt-0.5 shrink-0"></i>
            <div className="space-y-1">
              <p className="font-bold">
                Tại sao mở trên điện thoại chưa thấy cập nhật từ máy tính?
              </p>
              <p className="text-amber-900 text-[11px] leading-relaxed">
                Ứng dụng lưu hồ sơ trực tiếp vào <strong>bộ nhớ trình duyệt (LocalStorage)</strong> của thiết bị. Vì trình duyệt máy tính và điện thoại là 2 bộ nhớ riêng biệt, Thầy/Cô hãy dùng tính năng <strong>&quot;Mã Đồng Bộ&quot;</strong> hoặc <strong>&quot;Xuất Tệp&quot;</strong> dưới đây để chuyển dữ liệu qua Zalo chỉ trong 10 giây!
              </p>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-200 px-4 text-xs font-bold gap-2">
          <button
            onClick={() => setActiveTab('sync')}
            className={`py-2.5 px-3 border-b-2 transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'sync'
                ? 'border-emerald-700 text-emerald-800 bg-emerald-50/50'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <i className="fa-solid fa-bolt text-amber-500"></i>
            <span>Mã Đồng Bộ Siêu Tốc (Gửi Zalo)</span>
          </button>

          <button
            onClick={() => setActiveTab('file')}
            className={`py-2.5 px-3 border-b-2 transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'file'
                ? 'border-emerald-700 text-emerald-800 bg-emerald-50/50'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <i className="fa-solid fa-file-arrow-up text-emerald-600"></i>
            <span>Xuất / Nhập Tệp (.JSON)</span>
          </button>

          <button
            onClick={() => setActiveTab('reset')}
            className={`py-2.5 px-3 border-b-2 transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'reset'
                ? 'border-rose-700 text-rose-800 bg-rose-50/50'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <i className="fa-solid fa-rotate-left text-slate-400"></i>
            <span>Khôi Phục Gốc</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-4 overflow-y-auto space-y-4 text-xs">
          {/* TAB 1: MÃ ĐỒNG BỘ SIÊU TỐC */}
          {activeTab === 'sync' && (
            <div className="space-y-4">
              {/* Bước 1: Máy tính tạo mã */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-emerald-700 text-white font-bold flex items-center justify-center text-xs">
                      1
                    </span>
                    <span className="font-bold text-slate-900 text-sm">
                      Nếu Thầy/Cô đang ngồi trên MÁY TÍNH (đã có dữ liệu):
                    </span>
                  </div>
                  <span className="text-[11px] bg-emerald-100 text-emerald-800 font-semibold px-2 py-0.5 rounded">
                    Đang có {students.length} học sinh
                  </span>
                </div>
                <p className="text-slate-600 text-[11px]">
                  Bấm nút dưới đây để sao chép mã đồng bộ chứa toàn bộ danh sách và chỉ số BMI. Sau đó gửi tin nhắn cho chính mình qua Zalo (Cloud của tôi):
                </p>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={handleSyncToCloud}
                    disabled={isSyncingCloud}
                    className="bg-teal-700 hover:bg-teal-800 disabled:opacity-50 text-white font-bold px-4 py-2 rounded-lg flex items-center gap-2 shadow-sm transition cursor-pointer"
                  >
                    <i className={`fa-solid ${isSyncingCloud ? 'fa-spinner fa-spin' : 'fa-cloud-arrow-up'} text-amber-300`}></i>
                    <span>{isSyncingCloud ? 'Đang Đẩy Lên Đám Mây...' : 'Đẩy Toàn Bộ Lên Đám Mây Firestore'}</span>
                  </button>
                  <button
                    onClick={handleCopySyncCode}
                    className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-4 py-2 rounded-lg flex items-center gap-2 shadow-sm transition cursor-pointer"
                  >
                    <i className="fa-solid fa-copy"></i>
                    <span>Sao Chép Mã Gửi Zalo</span>
                  </button>
                  <button
                    onClick={handleQuickSaveCurrent}
                    className="bg-slate-200 hover:bg-slate-300 text-slate-800 font-semibold px-3 py-2 rounded-lg flex items-center gap-1.5 transition cursor-pointer"
                  >
                    <i className="fa-solid fa-floppy-disk text-slate-600"></i>
                    <span>Lưu Máy Này</span>
                  </button>
                </div>
              </div>

              {/* Bước 2: Điện thoại nhận mã */}
              <div className="bg-emerald-50/50 border border-emerald-200 rounded-xl p-3 space-y-2.5">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-emerald-700 text-white font-bold flex items-center justify-center text-xs">
                    2
                  </span>
                  <span className="font-bold text-emerald-950 text-sm">
                    Khi mở trên ĐIỆN THOẠI (tdc3htp.com):
                  </span>
                </div>
                <p className="text-emerald-900 text-[11px]">
                  Sao chép mã từ tin nhắn Zalo, dán vào ô bên dưới rồi bấm <strong>&quot;Đồng Bộ Ngay Vào Điện Thoại&quot;</strong>:
                </p>
                <div className="space-y-2">
                  <textarea
                    rows={3}
                    value={syncCodeInput}
                    onChange={(e) => setSyncCodeInput(e.target.value)}
                    placeholder="Dán mã đồng bộ nhận từ Zalo vào đây..."
                    className="w-full text-xs font-mono p-2.5 rounded-lg border border-emerald-300 bg-white focus:outline-emerald-600 text-slate-800 placeholder:text-slate-400"
                  />
                  <div className="flex justify-end">
                    <button
                      onClick={handleApplySyncCode}
                      className="bg-teal-700 hover:bg-teal-800 text-white font-bold px-4 py-2 rounded-lg flex items-center gap-2 shadow-sm transition cursor-pointer"
                    >
                      <i className="fa-solid fa-cloud-arrow-down"></i>
                      <span>Đồng Bộ Ngay Vào Điện Thoại Này</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Mẹo xử lý Cache trên điện thoại */}
              <div className="bg-slate-100 p-2.5 rounded-lg text-slate-600 text-[11px] flex items-center gap-2">
                <i className="fa-solid fa-arrows-rotate text-emerald-600"></i>
                <span>
                  <strong>Mẹo:</strong> Nếu mở điện thoại thấy chưa có nút mới hoặc giao diện cũ, hãy vuốt từ trên xuống để làm mới (Reload) hoặc vào Cài đặt trình duyệt điện thoại xóa bộ nhớ đệm (Clear Cache).
                </span>
              </div>
            </div>
          )}

          {/* TAB 2: XUẤT NHẬP TỆP FILE */}
          {activeTab === 'file' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {/* Xuất file */}
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-2 flex flex-col justify-between">
                  <div>
                    <h3 className="font-bold text-slate-900 flex items-center gap-1.5 text-sm">
                      <i className="fa-solid fa-download text-emerald-700"></i>
                      Xuất Tệp Dữ Liệu Hồ Sơ
                    </h3>
                    <p className="text-slate-600 text-[11px] mt-1 leading-relaxed">
                      Tải về tệp <code className="bg-slate-200 px-1 py-0.5 rounded text-emerald-900 font-bold">.json</code> chứa toàn bộ {students.length} học sinh của các lớp 10A1, 10A3, 12C1, 12C2, 12C3 cùng các chỉ số đã lưu.
                    </p>
                  </div>
                  <button
                    onClick={handleDownloadBackupFile}
                    className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-2 px-3 rounded-lg flex items-center justify-center gap-2 transition cursor-pointer mt-3"
                  >
                    <i className="fa-solid fa-file-arrow-down"></i>
                    <span>Tải Về Tệp Sao Lưu (.json)</span>
                  </button>
                </div>

                {/* Nhập file */}
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-2 flex flex-col justify-between">
                  <div>
                    <h3 className="font-bold text-slate-900 flex items-center gap-1.5 text-sm">
                      <i className="fa-solid fa-upload text-teal-700"></i>
                      Nạp Tệp Dữ Liệu Vào Máy
                    </h3>
                    <p className="text-slate-600 text-[11px] mt-1 leading-relaxed">
                      Chọn tệp <code className="bg-slate-200 px-1 py-0.5 rounded text-teal-900 font-bold">.json</code> đã lưu từ máy tính hoặc thiết bị khác để nạp vào điện thoại/trình duyệt này.
                    </p>
                  </div>
                  <label className="w-full bg-teal-700 hover:bg-teal-800 text-white font-bold py-2 px-3 rounded-lg flex items-center justify-center gap-2 transition cursor-pointer mt-3 text-center">
                    <i className="fa-solid fa-folder-open"></i>
                    <span>Chọn Tệp JSON Để Nạp</span>
                    <input
                      type="file"
                      accept=".json"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: KHÔI PHỤC DANH SÁCH GỐC */}
          {activeTab === 'reset' && (
            <div className="bg-rose-50/60 border border-rose-200 rounded-xl p-4 space-y-3">
              <h3 className="font-bold text-rose-950 flex items-center gap-2 text-sm">
                <i className="fa-solid fa-triangle-exclamation text-rose-600"></i>
                Khôi Phục Danh Sách Học Sinh Chuẩn Của Trường
              </h3>
              <p className="text-rose-900 text-[11px] leading-relaxed">
                Hành động này sẽ thiết lập lại danh sách về <strong>70 học sinh chuẩn</strong> của 5 lớp: <strong>10A1, 10A3, 12C1, 12C2, 12C3</strong> theo danh sách gốc của Trường THPT Huỳnh Tấn Phát. Mọi chỉnh sửa tự tạo trước đó sẽ được thay thế bằng danh mục gốc.
              </p>
              <button
                onClick={handleResetToDefault}
                className="bg-rose-700 hover:bg-rose-800 text-white font-bold py-2 px-4 rounded-lg flex items-center gap-2 transition cursor-pointer"
              >
                <i className="fa-solid fa-rotate-left"></i>
                <span>Xác Nhận Khôi Phục Về Danh Sách Mặc Định Gốc</span>
              </button>
            </div>
          )}
        </div>

        {/* Footer Modal */}
        <div className="bg-slate-50 border-t border-slate-200 p-3 px-4 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Bộ nhớ cục bộ an toàn • Không thu thập dữ liệu cá nhân</span>
          </div>
          <button
            onClick={onClose}
            className="bg-slate-200 hover:bg-slate-300 text-slate-800 font-semibold px-4 py-1.5 rounded-lg transition cursor-pointer"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};
