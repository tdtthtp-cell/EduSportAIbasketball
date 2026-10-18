import React, { useState, useEffect } from 'react';
import { StudentProfile, HealthStatus } from '../types';
import { calculateBmiValue } from '../data/students';

interface EditStudentModalProps {
  isOpen: boolean;
  student: StudentProfile | null;
  onClose: () => void;
  onSave: (updated: StudentProfile) => void;
}

export const EditStudentModal: React.FC<EditStudentModalProps> = ({
  isOpen,
  student,
  onClose,
  onSave
}) => {
  const [code, setCode] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [className, setClassName] = useState<string>('');
  const [gender, setGender] = useState<'Nam' | 'Nữ'>('Nam');
  const [heightCm, setHeightCm] = useState<number>(165);
  const [weightKg, setWeightKg] = useState<number>(60);
  const [status, setStatus] = useState<HealthStatus>('standard');
  const [medicalNote, setMedicalNote] = useState<string>('');
  const [parentPhone, setParentPhone] = useState<string>('');
  const [evalTech, setEvalTech] = useState<string>('');
  const [evalAttitude, setEvalAttitude] = useState<string>('');
  const [evalDigital, setEvalDigital] = useState<string>('');
  const [rating, setRating] = useState<'Đạt' | 'Chưa đạt'>('Đạt');

  useEffect(() => {
    if (student) {
      setCode(student.code);
      setName(student.name);
      setClassName(student.class);
      setGender(student.gender);
      setHeightCm(student.heightCm);
      setWeightKg(student.weightKg);
      setStatus(student.status);
      setMedicalNote(student.medicalNote);
      setParentPhone(student.parentPhone || '');
      setEvalTech(student.evalTech);
      setEvalAttitude(student.evalAttitude);
      setEvalDigital(student.evalDigital);
      setRating(student.rating);
    }
  }, [student]);

  if (!isOpen || !student) return null;

  const currentBmi = calculateBmiValue(heightCm, weightKg);

  const handleHeightOrWeightChange = (h: number, w: number) => {
    setHeightCm(h);
    setWeightKg(w);
    const calculated = calculateBmiValue(h, w);
    // Auto-update status if not a mild condition
    if (medicalNote.toLowerCase().includes('hen') || medicalNote.toLowerCase().includes('tim')) {
      setStatus('mild');
    } else if (calculated >= 24) {
      setStatus('overweight');
    } else if (calculated < 18.5) {
      setStatus('underweight');
    } else {
      setStatus('standard');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      alert('Vui lòng nhập họ và tên học sinh!');
      return;
    }

    const updated: StudentProfile = {
      ...student,
      code: code.trim() || student.code,
      name: name.trim(),
      class: className.trim() || student.class,
      gender,
      heightCm,
      weightKg,
      bmi: currentBmi,
      status,
      medicalNote: medicalNote.trim() || 'Thể trạng bình thường',
      parentPhone: parentPhone.trim(),
      evalTech: evalTech.trim() || 'Nắm vững kỹ thuật cơ bản',
      evalAttitude: evalAttitude.trim() || 'Tích cực rèn luyện',
      evalDigital: evalDigital.trim() || 'Biết dùng thiết bị ghi hình chuyển động',
      rating
    };

    onSave(updated);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-5 space-y-4 max-h-[92vh] overflow-y-auto border border-slate-200">
        
        {/* Header */}
        <div className="flex justify-between items-center border-b pb-2.5">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
              <i className="fa-solid fa-user-pen"></i>
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">
                Cập Nhật Thông Tin Thực Tế Của Học Sinh
              </h3>
              <p className="text-xs text-slate-500">
                Điều chỉnh mã định danh, lớp, chiều cao, cân nặng và thể trạng
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

        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs md:text-sm">
          
          {/* Mã HS & Lớp */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Mã định danh HS (Mã thực tế):
              </label>
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="Ví dụ: 20241201 hoặc HS12A1-03"
                className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 font-mono font-medium focus:ring-1 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Lớp học thực tế:
              </label>
              <input
                type="text"
                value={className}
                onChange={(e) => setClassName(e.target.value)}
                placeholder="Ví dụ: 12A1, 12A2, 11A3..."
                required
                className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 font-bold text-slate-800 focus:ring-1 focus:ring-emerald-500"
              />
            </div>
          </div>

          {/* Họ và tên & Giới tính */}
          <div className="grid grid-cols-3 gap-3">
            <div className="col-span-2">
              <label className="block font-semibold text-slate-700 mb-1">
                Họ và Tên học sinh:
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Nhập họ và tên đầy đủ..."
                required
                className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 font-bold text-slate-900 focus:ring-1 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Giới tính:
              </label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value as 'Nam' | 'Nữ')}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 font-medium text-slate-800 focus:ring-1 focus:ring-emerald-500 cursor-pointer"
              >
                <option value="Nam">Nam</option>
                <option value="Nữ">Nữ</option>
              </select>
            </div>
          </div>

          {/* Chiều cao, cân nặng, BMI hiển thị */}
          <div className="grid grid-cols-3 gap-3 bg-emerald-50/60 p-3 rounded-xl border border-emerald-200">
            <div>
              <label className="block font-semibold text-slate-700 mb-1 text-xs">
                Chiều cao (cm):
              </label>
              <input
                type="number"
                value={heightCm}
                onChange={(e) => handleHeightOrWeightChange(Number(e.target.value), weightKg)}
                min={100}
                max={220}
                required
                className="w-full bg-white border border-emerald-300 rounded-lg p-2 font-bold text-slate-800"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1 text-xs">
                Cân nặng (kg):
              </label>
              <input
                type="number"
                value={weightKg}
                onChange={(e) => handleHeightOrWeightChange(heightCm, Number(e.target.value))}
                min={25}
                max={150}
                step={0.5}
                required
                className="w-full bg-white border border-emerald-300 rounded-lg p-2 font-bold text-slate-800"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1 text-xs">
                Chỉ số BMI:
              </label>
              <div className="bg-white border border-emerald-300 rounded-lg p-2 font-black text-emerald-800 text-center">
                {currentBmi}
              </div>
            </div>
          </div>

          {/* Thể trạng & SĐT phụ huynh */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Phân loại thể trạng:
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as HealthStatus)}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 font-medium text-slate-800 cursor-pointer"
              >
                <option value="standard">Thể lực đạt chuẩn</option>
                <option value="overweight">Thừa cân / Béo phì (BMI &gt;= 24)</option>
                <option value="underweight">Thiếu cân / Thể lực yếu</option>
                <option value="mild">Có bệnh nền nhẹ (Hen suyễn, tim mạch)</option>
              </select>
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                SĐT Phụ huynh (để gửi Zalo/SMS):
              </label>
              <input
                type="text"
                value={parentPhone}
                onChange={(e) => setParentPhone(e.target.value)}
                placeholder="Ví dụ: 0918.xxx.xxx"
                className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-slate-800"
              />
            </div>
          </div>

          {/* Ghi chú y tế & sư phạm */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Ghi chú y tế & Sư phạm an toàn:
            </label>
            <textarea
              value={medicalNote}
              onChange={(e) => setMedicalNote(e.target.value)}
              rows={2}
              placeholder="Ví dụ: Thừa cân mỏi khớp gối trên sân xi măng; hoặc có tiền sử hen phế quản nhẹ..."
              className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-slate-800 focus:ring-1 focus:ring-emerald-500"
            />
          </div>

          {/* Nhận xét & Đánh giá TT22 */}
          <div className="space-y-2 border-t pt-3">
            <div className="flex justify-between items-center">
              <span className="font-bold text-slate-800 text-xs uppercase">
                Đánh Giá Thường Xuyên (Thông tư 22):
              </span>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-xs text-slate-600">Xếp loại:</span>
                <button
                  type="button"
                  onClick={() => setRating(rating === 'Đạt' ? 'Chưa đạt' : 'Đạt')}
                  className={`px-3 py-1 rounded font-bold text-xs cursor-pointer ${
                    rating === 'Đạt'
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                      : 'bg-rose-100 text-rose-800 border border-rose-300'
                  }`}
                >
                  {rating === 'Đạt' ? 'Đạt (Đ)' : 'Chưa đạt (CĐ)'}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
              <div>
                <label className="block text-slate-600 mb-0.5">Kỹ thuật động tác:</label>
                <input
                  type="text"
                  value={evalTech}
                  onChange={(e) => setEvalTech(e.target.value)}
                  className="w-full bg-slate-50 border rounded p-1.5"
                />
              </div>
              <div>
                <label className="block text-slate-600 mb-0.5">Thái độ rèn luyện:</label>
                <input
                  type="text"
                  value={evalAttitude}
                  onChange={(e) => setEvalAttitude(e.target.value)}
                  className="w-full bg-slate-50 border rounded p-1.5"
                />
              </div>
              <div>
                <label className="block text-slate-600 mb-0.5">Ứng dụng số / Tự học:</label>
                <input
                  type="text"
                  value={evalDigital}
                  onChange={(e) => setEvalDigital(e.target.value)}
                  className="w-full bg-slate-50 border rounded p-1.5"
                />
              </div>
            </div>
          </div>

          {/* Footer buttons */}
          <div className="flex justify-end gap-2 pt-3 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-slate-300 text-slate-600 hover:bg-slate-100 font-semibold cursor-pointer"
            >
              Hủy Bỏ
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-bold transition cursor-pointer shadow-xs"
            >
              Lưu Thông Tin Thực Tế
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
