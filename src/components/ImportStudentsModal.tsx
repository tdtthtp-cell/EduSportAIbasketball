import React, { useState } from 'react';
import { StudentProfile, HealthStatus } from '../types';
import { calculateBmiValue } from '../data/students';

interface ImportStudentsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (students: StudentProfile[], replaceAll: boolean) => void;
  currentCount: number;
}

export const ImportStudentsModal: React.FC<ImportStudentsModalProps> = ({
  isOpen,
  onClose,
  onImport,
  currentCount
}) => {
  const [activeTab, setActiveTab] = useState<'paste' | 'file' | 'json'>('paste');
  const [pastedText, setPastedText] = useState<string>('');
  const [replaceAll, setReplaceAll] = useState<boolean>(false);
  const [parsedPreview, setParsedPreview] = useState<StudentProfile[]>([]);
  const [parseError, setParseError] = useState<string | null>(null);

  if (!isOpen) return null;

  // Sample real data that teachers can try with 1 click
  const sampleExcelData = `Mã HS	Họ và tên	Lớp	Giới tính	Chiều cao	Cân nặng	Ghi chú sức khỏe	SĐT Phụ huynh
20241201	Nguyễn Minh Triết	12A1	Nam	170	62	Thể lực tốt, nhanh nhẹn	0918.111.222
20241202	Trần Mỹ Duyên	12A1	Nữ	158	44	Thể lực hơi yếu, nhanh mệt	0918.333.444
20241203	Huỳnh Quốc Bảo	12A1	Nam	172	78	Thừa cân độ 1, đau gối khi nhảy tiếp đất	0918.555.666
20241204	Lê Phương Thảo	12A1	Nữ	162	51	Tiền sử hen suyễn khi trời lạnh	0918.777.888
20241205	Phạm Hoàng Phúc	12A2	Nam	167	58	Thể trạng chuẩn, kỹ thuật tốt	0918.999.000
20241101	Võ Thành Đạt	11A3	Nam	174	82	Thừa cân, cần giảm tải bài tập gối	0977.123.456
20241001	Đặng Thu Thảo	10A5	Nữ	155	40	Thiếu cân, cần bổ sung dinh dưỡng	0988.654.321`;

  const handleParseText = (text: string) => {
    setPastedText(text);
    setParseError(null);

    if (!text.trim()) {
      setParsedPreview([]);
      return;
    }

    const lines = text.trim().split(/\r?\n/);
    const parsed: StudentProfile[] = [];

    lines.forEach((line, idx) => {
      // Skip empty lines
      if (!line.trim()) return;

      // Determine separator: Tab \t (Excel copy) or Comma , or Semicolon ;
      let parts: string[] = [];
      if (line.includes('\t')) {
        parts = line.split('\t');
      } else if (line.includes(';')) {
        parts = line.split(';');
      } else if (line.includes(',')) {
        parts = line.split(',');
      } else {
        parts = line.trim().split(/\s{2,}/); // 2+ spaces
      }

      parts = parts.map(p => p.trim());

      // If it looks like a header line, skip it
      const firstColLower = parts[0]?.toLowerCase() || '';
      if (
        firstColLower.includes('mã') ||
        firstColLower.includes('stt') ||
        firstColLower.includes('code') ||
        parts[1]?.toLowerCase().includes('họ')
      ) {
        return;
      }

      // Format expected:
      // [0] Mã HS
      // [1] Họ và tên
      // [2] Lớp
      // [3] Giới tính (optional)
      // [4] Chiều cao (optional, default 165)
      // [5] Cân nặng (optional, default 55)
      // [6] Ghi chú sức khỏe (optional)
      // [7] SĐT Phụ huynh (optional)

      let code = parts[0] || `HS-${Date.now().toString().slice(-4)}-${idx}`;
      let name = parts[1] || '';
      let className = parts[2] || '12A1';
      let genderStr = parts[3] || 'Nam';
      let gender: 'Nam' | 'Nữ' = genderStr.toLowerCase().includes('nữ') ? 'Nữ' : 'Nam';

      let height = parseFloat(parts[4]) || 165;
      let weight = parseFloat(parts[5]) || 58;
      let medicalNote = parts[6] || 'Thể trạng bình thường';
      let parentPhone = parts[7] || '';

      // Fallback if user only pasted 2-3 columns: Code, Name, Class
      if (!name && parts[0]) {
        name = parts[0];
        code = `HS-${idx + 1}`;
      }

      if (name) {
        const bmi = calculateBmiValue(height, weight);
        let status: HealthStatus = 'standard';
        if (medicalNote.toLowerCase().includes('hen') || medicalNote.toLowerCase().includes('tim')) {
          status = 'mild';
        } else if (bmi >= 24) {
          status = 'overweight';
        } else if (bmi < 18.5) {
          status = 'underweight';
        }

        parsed.push({
          id: `real-${Date.now()}-${idx}-${Math.random().toString(36).substr(2, 4)}`,
          code,
          name,
          class: className,
          gender,
          heightCm: height,
          weightKg: weight,
          bmi,
          status,
          medicalNote,
          parentPhone,
          evalTech: 'Thực hiện đúng kỹ thuật cơ bản',
          evalAttitude: 'Tự giác, tích cực tập luyện',
          evalDigital: 'Chủ động dùng camera phân tích động tác',
          rating: 'Đạt'
        });
      }
    });

    if (parsed.length === 0) {
      setParseError('Không nhận diện được dòng dữ liệu hợp lệ. Vui lòng kiểm tra định dạng!');
    } else {
      setParsedPreview(parsed);
    }
  };

  const handleApplyImport = () => {
    if (parsedPreview.length === 0) {
      alert('Chưa có dữ liệu học sinh nào được nhận diện để nhập!');
      return;
    }

    onImport(parsedPreview, replaceAll);
    onClose();
  };

  const handleDownloadSampleCsv = () => {
    const csvContent = "\uFEFF" + `Mã HS,Họ và tên,Lớp,Giới tính,Chiều cao,Cân nặng,Ghi chú sức khỏe,SĐT Phụ huynh
20241201,Nguyễn Minh Triết,12A1,Nam,170,62,Thể lực tốt nhanh nhẹn,0918111222
20241202,Trần Mỹ Duyên,12A1,Nữ,158,44,Thể lực hơi yếu,0918333444
20241203,Huỳnh Quốc Bảo,12A1,Nam,172,78,Thừa cân độ 1 mỏi gối,0918555666
20241204,Lê Phương Thảo,12A1,Nữ,162,51,Tiền sử hen suyễn khi trời lạnh,0918777888
20241205,Phạm Hoàng Phúc,12A2,Nam,167,58,Thể trạng chuẩn,0918999000`;

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'Danh_Sach_Hoc_Sinh_Mau_THPT_HuynhTanPhat.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      handleParseText(content);
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full p-5 space-y-4 max-h-[92vh] overflow-y-auto border border-slate-200">
        
        {/* Header */}
        <div className="flex justify-between items-center border-b pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center text-lg font-black">
              <i className="fa-solid fa-file-excel"></i>
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base md:text-lg">
                Nhập Danh Sách Học Sinh Thực Tế
              </h3>
              <p className="text-xs text-slate-500">
                Hỗ trợ sao chép trực tiếp từ bảng tính Excel, vnEdu, SMAS hoặc nhập tệp CSV của trường
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 text-xl font-bold cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Tab chuyển đổi cách thức nhập */}
        <div className="flex border-b border-slate-200 text-xs font-bold">
          <button
            onClick={() => setActiveTab('paste')}
            className={`py-2 px-4 border-b-2 transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'paste'
                ? 'border-emerald-700 text-emerald-800 bg-emerald-50/50'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <i className="fa-solid fa-paste"></i>
            <span>Sao Chép & Dán Từ Excel (Khuyên Dùng)</span>
          </button>
          <button
            onClick={() => setActiveTab('file')}
            className={`py-2 px-4 border-b-2 transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'file'
                ? 'border-emerald-700 text-emerald-800 bg-emerald-50/50'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <i className="fa-solid fa-file-csv"></i>
            <span>Tải Tệp CSV / Excel</span>
          </button>
        </div>

        {/* Tab 1: Paste từ Excel */}
        {activeTab === 'paste' && (
          <div className="space-y-3 text-xs">
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-slate-600 space-y-1 leading-relaxed">
              <p className="font-bold text-slate-800 flex items-center gap-1.5">
                <i className="fa-solid fa-circle-info text-emerald-600"></i> Hướng dẫn nhập nhanh:
              </p>
              <p>
                1. Mở file Excel danh sách lớp của Thầy/Cô (vnEdu / SMAS).<br />
                2. Chọn các cột: <strong>Mã HS | Họ và tên | Lớp | Giới tính | Chiều cao (cm) | Cân nặng (kg) | Ghi chú sức khỏe | SĐT Phụ huynh</strong>.<br />
                3. Bấm <strong>Ctrl + C</strong> (Copy) và dán (<strong>Ctrl + V</strong>) vào ô dưới đây. Hệ thống tự động tách cột và tính chỉ số BMI tức thì!
              </p>
              <div className="pt-1 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleParseText(sampleExcelData)}
                  className="text-xs bg-emerald-700 text-white font-semibold px-2.5 py-1 rounded hover:bg-emerald-800 transition cursor-pointer"
                >
                  <i className="fa-solid fa-magic mr-1"></i> Dán Dữ Liệu Thực Tế Mẫu Để Xem Thử
                </button>
                <button
                  type="button"
                  onClick={handleDownloadSampleCsv}
                  className="text-xs bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold px-2.5 py-1 rounded transition cursor-pointer"
                >
                  <i className="fa-solid fa-download mr-1"></i> Tải File Mẫu (.CSV)
                </button>
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Dán dữ liệu từ bảng tính vào đây:
              </label>
              <textarea
                value={pastedText}
                onChange={(e) => handleParseText(e.target.value)}
                rows={5}
                placeholder="Dán các dòng từ Excel vào đây (mỗi dòng một học sinh)..."
                className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 font-mono text-xs text-slate-800 focus:outline-emerald-600"
              />
            </div>
          </div>
        )}

        {/* Tab 2: Upload File CSV */}
        {activeTab === 'file' && (
          <div className="space-y-3 text-xs">
            <div className="border-2 border-dashed border-slate-300 rounded-xl p-6 text-center space-y-2 bg-slate-50">
              <i className="fa-solid fa-cloud-arrow-up text-3xl text-emerald-600"></i>
              <p className="font-bold text-slate-700 text-sm">Chọn tệp CSV từ máy tính</p>
              <p className="text-slate-500">Hỗ trợ tệp bảng tính định dạng .csv xuất từ Excel hoặc vnEdu</p>
              <input
                type="file"
                accept=".csv,.txt"
                onChange={handleFileUpload}
                className="block mx-auto text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-emerald-700 file:text-white hover:file:bg-emerald-800 cursor-pointer"
              />
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                onClick={handleDownloadSampleCsv}
                className="text-xs text-emerald-800 font-semibold hover:underline"
              >
                <i className="fa-solid fa-download mr-1"></i> Tải file Excel mẫu (.csv) về máy
              </button>
            </div>
          </div>
        )}

        {/* Lỗi phân tích nếu có */}
        {parseError && (
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-rose-800 text-xs font-semibold flex items-center gap-2">
            <i className="fa-solid fa-triangle-exclamation text-rose-600"></i>
            <span>{parseError}</span>
          </div>
        )}

        {/* Khung xem trước dữ liệu được nhận diện */}
        {parsedPreview.length > 0 && (
          <div className="space-y-2 border-t pt-3">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-slate-800 flex items-center gap-1.5">
                <i className="fa-solid fa-circle-check text-emerald-600"></i>
                Xem trước danh sách ({parsedPreview.length} học sinh sẵn sàng nhập):
              </span>
              <span className="text-slate-500 italic">
                BMI và thể trạng được AI tính toán tự động
              </span>
            </div>

            <div className="max-h-48 overflow-y-auto border border-slate-200 rounded-lg text-xs">
              <table className="w-full text-left">
                <thead className="bg-slate-100 text-slate-700 font-semibold sticky top-0 border-b border-slate-200">
                  <tr>
                    <th className="p-2">Mã HS</th>
                    <th className="p-2">Họ và Tên</th>
                    <th className="p-2">Lớp</th>
                    <th className="p-2">Giới tính</th>
                    <th className="p-2">Cao / Nặng</th>
                    <th className="p-2">BMI & Thể trạng</th>
                    <th className="p-2">Ghi chú sức khỏe</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {parsedPreview.map((st, i) => (
                    <tr key={i} className="hover:bg-slate-50">
                      <td className="p-2 font-mono font-medium text-slate-600">{st.code}</td>
                      <td className="p-2 font-bold text-slate-800">{st.name}</td>
                      <td className="p-2 font-semibold text-emerald-800">{st.class}</td>
                      <td className="p-2">{st.gender}</td>
                      <td className="p-2">{st.heightCm}cm / {st.weightKg}kg</td>
                      <td className="p-2">
                        <span className={`px-1.5 py-0.5 rounded text-[11px] font-semibold ${
                          st.status === 'overweight' ? 'bg-amber-100 text-amber-800' :
                          st.status === 'underweight' ? 'bg-blue-100 text-blue-800' :
                          st.status === 'mild' ? 'bg-rose-100 text-rose-800' : 'bg-emerald-100 text-emerald-800'
                        }`}>
                          {st.bmi} ({st.status === 'overweight' ? 'Thừa cân' : st.status === 'underweight' ? 'Thiếu cân' : st.status === 'mild' ? 'Bệnh nền' : 'Chuẩn'})
                        </span>
                      </td>
                      <td className="p-2 text-slate-600 truncate max-w-xs">{st.medicalNote}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tùy chọn thay thế hay thêm vào */}
        <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="replaceCheck"
              checked={replaceAll}
              onChange={(e) => setReplaceAll(e.target.checked)}
              className="w-4 h-4 accent-emerald-600 cursor-pointer"
            />
            <label htmlFor="replaceCheck" className="text-slate-800 font-medium cursor-pointer">
              Xóa sạch dữ liệu mẫu cũ và <strong>thay thế toàn bộ</strong> bằng danh sách thực tế này
            </label>
          </div>
          <span className="text-slate-500">
            Hiện tại trong hệ thống có: <strong>{currentCount}</strong> học sinh
          </span>
        </div>

        {/* Footer actions */}
        <div className="flex justify-end gap-2 pt-2 border-t">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg border border-slate-300 text-slate-600 hover:bg-slate-100 font-semibold cursor-pointer text-xs md:text-sm"
          >
            Đóng
          </button>
          <button
            type="button"
            onClick={handleApplyImport}
            disabled={parsedPreview.length === 0}
            className="px-5 py-2 rounded-lg bg-emerald-700 hover:bg-emerald-800 disabled:opacity-40 text-white font-bold transition cursor-pointer text-xs md:text-sm shadow-xs flex items-center gap-1.5"
          >
            <i className="fa-solid fa-check"></i>
            <span>Nhập {parsedPreview.length > 0 ? `${parsedPreview.length} Học Sinh` : ''} Vào Hệ Thống</span>
          </button>
        </div>

      </div>
    </div>
  );
};
