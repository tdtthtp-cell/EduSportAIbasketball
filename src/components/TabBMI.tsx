import React, { useState } from 'react';
import { classifyBmiCategory, calculateBmiValue } from '../data/students';

interface TabBMIProps {
  onSwitchToTheTrang?: () => void;
}

export const TabBMI: React.FC<TabBMIProps> = ({ onSwitchToTheTrang }) => {
  const [height, setHeight] = useState<number>(168);
  const [weight, setWeight] = useState<number>(74.5);
  const [age, setAge] = useState<number>(17);
  const [gender, setGender] = useState<'Nam' | 'Nữ'>('Nam');
  const [calculatedResult, setCalculatedResult] = useState<{
    bmi: number;
    category: ReturnType<typeof classifyBmiCategory>;
    idealWeightMin: number;
    idealWeightMax: number;
    maxHeartRate: number;
  } | null>(() => {
    const initBmi = calculateBmiValue(168, 74.5);
    const hM = 168 / 100;
    return {
      bmi: initBmi,
      category: classifyBmiCategory(initBmi),
      idealWeightMin: Math.round(18.5 * hM * hM * 10) / 10,
      idealWeightMax: Math.round(22.9 * hM * hM * 10) / 10,
      maxHeartRate: 220 - 17
    };
  });

  const handleCalculate = () => {
    if (!height || !weight || height <= 0 || weight <= 0) {
      alert('Vui lòng nhập chiều cao và cân nặng hợp lệ!');
      return;
    }

    const bmiVal = calculateBmiValue(height, weight);
    const hM = height / 100;
    const cat = classifyBmiCategory(bmiVal);

    setCalculatedResult({
      bmi: bmiVal,
      category: cat,
      idealWeightMin: Math.round(18.5 * hM * hM * 10) / 10,
      idealWeightMax: Math.round(22.9 * hM * hM * 10) / 10,
      maxHeartRate: 220 - age
    });
  };

  const handleApplyPreset = (h: number, w: number, g: 'Nam' | 'Nữ', a: number) => {
    setHeight(h);
    setWeight(w);
    setGender(g);
    setAge(a);
    const bmiVal = calculateBmiValue(h, w);
    const hM = h / 100;
    setCalculatedResult({
      bmi: bmiVal,
      category: classifyBmiCategory(bmiVal),
      idealWeightMin: Math.round(18.5 * hM * hM * 10) / 10,
      idealWeightMax: Math.round(22.9 * hM * hM * 10) / 10,
      maxHeartRate: 220 - a
    });
  };

  return (
    <div id="tab-bmi" className="tab-content block space-y-4">
      <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs max-w-3xl mx-auto space-y-5">
        
        <div className="border-b pb-3">
          <h2 className="text-base md:text-lg font-bold text-slate-900 flex items-center gap-2">
            <i className="fa-solid fa-calculator text-teal-600"></i>
            Đánh Giá Thể Trạng BMI Lứa Tuổi Học Sinh THPT (15 - 18 Tuổi)
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Áp dụng thang đo chuẩn nhân trắc học học sinh Việt Nam kết hợp chỉ dẫn an toàn vận động GDPT 2018
          </p>
        </div>

        {/* Nút bấm mẫu nhanh */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="font-semibold text-slate-600">Mẫu thể trạng nhanh:</span>
          <button
            onClick={() => handleApplyPreset(168, 74.5, 'Nam', 17)}
            className="px-2.5 py-1 bg-amber-50 hover:bg-amber-100 text-amber-800 rounded border border-amber-200 font-medium transition cursor-pointer"
          >
            HS Thừa cân (168cm, 74.5kg)
          </button>
          <button
            onClick={() => handleApplyPreset(172, 48, 'Nam', 17)}
            className="px-2.5 py-1 bg-blue-50 hover:bg-blue-100 text-blue-800 rounded border border-blue-200 font-medium transition cursor-pointer"
          >
            HS Thiếu cân (172cm, 48kg)
          </button>
          <button
            onClick={() => handleApplyPreset(165, 56, 'Nam', 17)}
            className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded border border-emerald-200 font-medium transition cursor-pointer"
          >
            HS Chuẩn (165cm, 56kg)
          </button>
        </div>

        {/* Khung nhập liệu */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs md:text-sm">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Chiều cao (cm):</label>
            <input
              type="number"
              value={height}
              onChange={(e) => setHeight(Number(e.target.value))}
              className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 font-bold text-slate-800 focus:ring-1 focus:ring-teal-500"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Cân nặng (kg):</label>
            <input
              type="number"
              value={weight}
              onChange={(e) => setWeight(Number(e.target.value))}
              step={0.5}
              className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 font-bold text-slate-800 focus:ring-1 focus:ring-teal-500"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Tuổi học sinh:</label>
            <select
              value={age}
              onChange={(e) => setAge(Number(e.target.value))}
              className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 font-medium text-slate-800"
            >
              <option value={15}>15 tuổi (Lớp 10)</option>
              <option value={16}>16 tuổi (Lớp 11)</option>
              <option value={17}>17 tuổi (Lớp 12)</option>
              <option value={18}>18 tuổi (Lớp 12)</option>
            </select>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Giới tính:</label>
            <select
              value={gender}
              onChange={(e) => setGender(e.target.value as 'Nam' | 'Nữ')}
              className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 font-medium text-slate-800"
            >
              <option value="Nam">Nam sinh</option>
              <option value="Nữ">Nữ sinh</option>
            </select>
          </div>
        </div>

        <button
          onClick={handleCalculate}
          className="w-full bg-teal-700 hover:bg-teal-800 text-white font-bold py-2.5 rounded-lg text-sm transition cursor-pointer shadow-xs flex items-center justify-center gap-2"
        >
          <i className="fa-solid fa-calculator"></i>
          <span>Tính Toán & Nhận Phác Đồ An Toàn Sư Phạm</span>
        </button>

        {/* Thanh hiển thị trực quan dải BMI */}
        <div className="space-y-1.5 pt-2">
          <div className="flex justify-between text-[11px] font-semibold text-slate-600">
            <span>&lt; 18.5 (Thiếu cân)</span>
            <span>18.5 - 22.9 (Chuẩn)</span>
            <span>23.0 - 24.9 (Nguy cơ)</span>
            <span>&gt;= 25.0 (Thừa cân / Béo phì)</span>
          </div>
          <div className="h-3 w-full rounded-full flex overflow-hidden bg-slate-200">
            <div className="w-[30%] bg-blue-400" title="Thiếu cân (< 18.5)"></div>
            <div className="w-[35%] bg-emerald-500" title="Bình thường (18.5 - 22.9)"></div>
            <div className="w-[15%] bg-amber-400" title="Tiền thừa cân (23 - 24.9)"></div>
            <div className="w-[20%] bg-rose-500" title="Béo phì (>= 25)"></div>
          </div>
        </div>

        {/* Kết quả chi tiết */}
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
                  {calculatedResult.maxHeartRate} bpm (Ngưỡng an toàn khi tập: {Math.round(calculatedResult.maxHeartRate * 0.6)} - {Math.round(calculatedResult.maxHeartRate * 0.75)} bpm)
                </span>
              </div>
            </div>

            <div className="space-y-1.5 pt-1">
              <p className="text-slate-800 font-semibold flex items-center gap-1.5">
                <i className="fa-solid fa-notes-medical text-teal-600"></i>
                Khuyến nghị sư phạm & Dinh dưỡng học đường:
              </p>
              <p className="text-slate-600 leading-relaxed bg-white p-3 rounded-lg border border-slate-200">
                {calculatedResult.category.advice}
              </p>
            </div>

            {onSwitchToTheTrang && (
              <div className="pt-2 flex justify-end">
                <button
                  onClick={onSwitchToTheTrang}
                  className="bg-emerald-800 hover:bg-emerald-900 text-white font-semibold px-4 py-2 rounded-lg text-xs flex items-center gap-1.5 transition cursor-pointer"
                >
                  <i className="fa-solid fa-person-running text-amber-300"></i>
                  <span>Xem Phác Đồ Bài Tập Chi Tiết Tại Tab &quot;Gợi Ý Thể Trạng&quot;</span>
                </button>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
};
