import React from 'react';
import { LessonDiagramImage } from '../types';

interface LessonDiagramsProps {
  image: LessonDiagramImage;
}

export const LessonDiagrams: React.FC<LessonDiagramsProps> = ({ image }) => {
  const { svgType, title, caption } = image;

  const renderSvgContent = () => {
    switch (svgType) {
      // BÓNG CHUYỀN: Phát bóng thấp tay nghiêng mình
      case 'volleyball-serve-low':
        return (
          <svg viewBox="0 0 500 240" className="w-full h-auto max-h-56 bg-slate-900 rounded-lg">
            {/* Sân và Lưới */}
            <line x1="20" y1="210" x2="480" y2="210" stroke="#34d399" strokeWidth="4" />
            <text x="25" y="230" fill="#94a3b8" fontSize="11" fontFamily="sans-serif">Mặt sân bê tông THPT Huỳnh Tấn Phát</text>
            <line x1="380" y1="210" x2="380" y2="70" stroke="#f59e0b" strokeWidth="4" />
            <rect x="376" y="70" width="8" height="60" fill="#fbbf24" stroke="#d97706" />
            <text x="360" y="60" fill="#fbbf24" fontSize="11" fontWeight="bold">Lưới 2.24m - 2.43m</text>

            {/* Vận động viên tư thế nghiêng mình */}
            <circle cx="120" cy="95" r="14" fill="#38bdf8" /> {/* Đầu */}
            <line x1="120" y1="109" x2="135" y2="160" stroke="#38bdf8" strokeWidth="6" strokeLinecap="round" /> {/* Thân nghiêng */}
            {/* Chân trước & chân sau */}
            <polyline points="135,160 115,185 110,210" stroke="#38bdf8" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
            <polyline points="135,160 155,185 160,210" stroke="#38bdf8" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
            {/* Tay không thuận tung bóng */}
            <polyline points="126,120 100,125 90,135" stroke="#38bdf8" strokeWidth="4" strokeLinecap="round" />
            {/* Quả bóng đang tung */}
            <circle cx="85" cy="115" r="11" fill="#facc15" stroke="#ca8a04" strokeWidth="2" />
            <path d="M 85 140 Q 85 125 85 120" stroke="#facc15" strokeWidth="2" strokeDasharray="3,3" />
            <text x="50" y="105" fill="#facc15" fontSize="10">Tung 40-50cm</text>
            
            {/* Tay thuận vung từ sau ra trước */}
            <path d="M 160 140 Q 140 145 105 142" stroke="#f43f5e" strokeWidth="4" fill="none" strokeDasharray="4,4" />
            <line x1="126" y1="120" x2="160" y2="135" stroke="#38bdf8" strokeWidth="5" strokeLinecap="round" />
            <polyline points="160,135 110,138" stroke="#f43f5e" strokeWidth="4" strokeLinecap="round" />
            <text x="140" y="125" fill="#f43f5e" fontSize="10" fontWeight="bold">Lực vung cườm tay</text>

            {/* Quỹ đạo bóng qua lưới */}
            <path d="M 90 120 Q 220 30 380 90 T 470 170" fill="none" stroke="#10b981" strokeWidth="3" strokeDasharray="5,4" />
            <text x="210" y="55" fill="#10b981" fontSize="11" fontWeight="bold">Quỹ đạo bóng qua lưới</text>
            <circle cx="395" cy="98" r="8" fill="#facc15" />
          </svg>
        );

      // BÓNG CHUYỀN: Chuyền bóng cao tay bằng 2 tay
      case 'volleyball-pass-high':
        return (
          <svg viewBox="0 0 500 240" className="w-full h-auto max-h-56 bg-slate-900 rounded-lg">
            <line x1="20" y1="210" x2="480" y2="210" stroke="#34d399" strokeWidth="4" />
            <text x="25" y="230" fill="#94a3b8" fontSize="11">TTCB: Chân trước chân sau, gối chùng 135°</text>

            {/* Người thực hiện chuyền bóng */}
            <circle cx="250" cy="80" r="14" fill="#38bdf8" />
            <line x1="250" y1="94" x2="250" y2="155" stroke="#38bdf8" strokeWidth="6" strokeLinecap="round" />
            {/* 2 Chân gập hoãn xung */}
            <polyline points="250,155 230,180 220,210" stroke="#38bdf8" strokeWidth="5" strokeLinecap="round" />
            <polyline points="250,155 270,180 280,210" stroke="#38bdf8" strokeWidth="5" strokeLinecap="round" />

            {/* 2 Tay giơ đón bóng hình chiếc phễu trước trán */}
            <polyline points="250,105 225,85 238,62" stroke="#f43f5e" strokeWidth="5" strokeLinecap="round" />
            <polyline points="250,105 275,85 262,62" stroke="#f43f5e" strokeWidth="5" strokeLinecap="round" />

            {/* Quả bóng tiếp xúc */}
            <circle cx="250" cy="50" r="14" fill="#facc15" stroke="#ea580c" strokeWidth="2" />
            <text x="210" y="28" fill="#fbbf24" fontSize="11" fontWeight="bold">Điểm tiếp xúc cách trán 15-20cm</text>
            <path d="M 235 65 Q 250 72 265 65" stroke="#38bdf8" strokeWidth="2" fill="none" />
            
            {/* Mũi tên lực đẩy toàn thân */}
            <line x1="250" y1="180" x2="250" y2="120" stroke="#10b981" strokeWidth="3" markerEnd="url(#arrow)" />
            <text x="280" y="140" fill="#10b981" fontSize="10">Đạp chân đẩy thân</text>

            {/* Góc khuỷu tay */}
            <text x="175" y="95" fill="#f43f5e" fontSize="10">Góc khuỷu ~110°</text>
            <text x="290" y="95" fill="#f43f5e" fontSize="10">Ngón tay mở bao bóng</text>
          </svg>
        );

      // BÓNG RỔ: Nhảy ném rổ một tay trên vai & Đường Parabol
      case 'basketball-shoot':
        return (
          <svg viewBox="0 0 500 240" className="w-full h-auto max-h-56 bg-slate-900 rounded-lg">
            <line x1="20" y1="215" x2="480" y2="215" stroke="#34d399" strokeWidth="4" />
            {/* Cột rổ và Bảng rổ */}
            <line x1="450" y1="215" x2="450" y2="40" stroke="#94a3b8" strokeWidth="6" />
            <line x1="450" y1="50" x2="420" y2="50" stroke="#94a3b8" strokeWidth="4" />
            <rect x="415" y="30" width="6" height="50" fill="#f8fafc" stroke="#dc2626" strokeWidth="2" />
            <line x1="415" y1="65" x2="385" y2="65" stroke="#ea580c" strokeWidth="4" /> {/* Vành rổ */}
            <path d="M 385 65 L 392 90 L 408 90 L 415 65" stroke="#f8fafc" strokeWidth="1.5" fill="none" strokeDasharray="3,3" /> {/* Lưới */}
            <text x="365" y="55" fill="#ea580c" fontSize="10" fontWeight="bold">Vành rổ 3.05m</text>

            {/* Cầu thủ bật nhảy ném bóng */}
            <circle cx="110" cy="100" r="13" fill="#38bdf8" />
            <line x1="110" y1="113" x2="115" y2="155" stroke="#38bdf8" strokeWidth="5" />
            <polyline points="115,155 105,175 110,195" stroke="#38bdf8" strokeWidth="4" />
            <polyline points="115,155 125,175 120,195" stroke="#38bdf8" strokeWidth="4" />
            <text x="85" y="210" fill="#94a3b8" fontSize="10">Điểm bật nhảy</text>

            {/* Tay ném góc chữ L (90 độ) */}
            <polyline points="112,120 135,110 130,78" stroke="#f43f5e" strokeWidth="4" strokeLinecap="round" />
            <polyline points="130,78 140,68" stroke="#f43f5e" strokeWidth="3" /> {/* Cổ tay gập */}
            
            {/* Quả bóng rổ tại đỉnh cao nhất */}
            <circle cx="140" cy="58" r="13" fill="#ea580c" stroke="#c2410c" strokeWidth="2" />
            <path d="M 127 58 Q 140 58 153 58" stroke="#431407" strokeWidth="1.5" />

            {/* Đường bay Parabol tối ưu */}
            <path d="M 145 55 Q 260 5 400 65" fill="none" stroke="#facc15" strokeWidth="3" strokeDasharray="6,4" />
            <text x="235" y="22" fill="#facc15" fontSize="11" fontWeight="bold">Góc phóng tối ưu 48° - 52°</text>
            <text x="145" y="95" fill="#f43f5e" fontSize="10">Gập miết cổ tay theo bóng</text>
          </svg>
        );

      // CẦU LÔNG: Di chuyển 4 góc sân & Kỹ thuật đập cầu
      case 'badminton-court':
        return (
          <svg viewBox="0 0 500 240" className="w-full h-auto max-h-56 bg-slate-900 rounded-lg">
            {/* Phác thảo mặt sân cầu lông từ trên xuống */}
            <rect x="70" y="20" width="360" height="200" fill="#065f46" stroke="#f8fafc" strokeWidth="3" rx="4" />
            {/* Lưới giữa sân */}
            <line x1="250" y1="20" x2="250" y2="220" stroke="#facc15" strokeWidth="3" strokeDasharray="5,3" />
            <text x="235" y="15" fill="#facc15" fontSize="10" fontWeight="bold">LƯỚI</text>

            {/* Vạch giao cầu ngắn 1.98m */}
            <line x1="205" y1="20" x2="205" y2="220" stroke="#f8fafc" strokeWidth="1.5" />
            <line x1="295" y1="20" x2="295" y2="220" stroke="#f8fafc" strokeWidth="1.5" />
            {/* Vạch trung tâm */}
            <line x1="70" y1="120" x2="205" y2="120" stroke="#f8fafc" strokeWidth="1.5" />
            <line x1="295" y1="120" x2="430" y2="120" stroke="#f8fafc" strokeWidth="1.5" />

            {/* Vị trí trung tâm đón cầu */}
            <circle cx="160" cy="120" r="10" fill="#38bdf8" />
            <text x="140" y="145" fill="#38bdf8" fontSize="10" fontWeight="bold">TTCB Trung Tâm</text>

            {/* 4 Mũi tên bước di chuyển 4 góc */}
            {/* Góc 1: Tiến phải */}
            <line x1="168" y1="112" x2="200" y2="45" stroke="#f43f5e" strokeWidth="2.5" />
            <polygon points="200,45 190,52 198,58" fill="#f43f5e" />
            <text x="180" y="38" fill="#f43f5e" fontSize="9">Tiến phải</text>

            {/* Góc 2: Tiến trái */}
            <line x1="168" y1="128" x2="200" y2="195" stroke="#f43f5e" strokeWidth="2.5" />
            <polygon points="200,195 190,188 198,182" fill="#f43f5e" />
            <text x="180" y="210" fill="#f43f5e" fontSize="9">Tiến trái</text>

            {/* Góc 3: Lùi phải bật nhảy đập cầu */}
            <line x1="152" y1="112" x2="95" y2="45" stroke="#a855f7" strokeWidth="2.5" />
            <polygon points="95,45 105,52 97,58" fill="#a855f7" />
            <text x="75" y="38" fill="#a855f7" fontSize="9">Lùi bật nhảy</text>

            {/* Góc 4: Lùi trái */}
            <line x1="152" y1="128" x2="95" y2="195" stroke="#a855f7" strokeWidth="2.5" />
            <polygon points="95,195 105,188 97,182" fill="#a855f7" />
            <text x="75" y="210" fill="#a855f7" fontSize="9">Lùi trái</text>

            {/* Quả cầu lông */}
            <circle cx="340" cy="100" r="5" fill="#f8fafc" />
            <text x="315" y="85" fill="#f8fafc" fontSize="10">Ô sân đối phương</text>
          </svg>
        );

      // SƠ ĐỒ ĐỘI HÌNH & TỔ CHỨC LỚP HỌC TRÊN SÂN BÃI
      case 'court-formation':
      default:
        return (
          <svg viewBox="0 0 500 240" className="w-full h-auto max-h-56 bg-slate-900 rounded-lg">
            {/* Khu vực giáo viên */}
            <rect x="225" y="20" width="50" height="25" fill="#047857" stroke="#34d399" strokeWidth="2" rx="4" />
            <text x="233" y="37" fill="#f8fafc" fontSize="10" fontWeight="bold">GV (▲)</text>

            {/* Cự ly 1 sải tay */}
            <line x1="250" y1="50" x2="250" y2="70" stroke="#94a3b8" strokeWidth="1.5" strokeDasharray="3,3" />
            <text x="255" y="65" fill="#94a3b8" fontSize="9">Khoảng cách 5 - 7m</text>

            {/* 4 Hàng ngang tập hợp học sinh */}
            {[80, 115, 150, 185].map((y, rowIdx) => (
              <g key={rowIdx}>
                <text x="35" y={y + 8} fill="#94a3b8" fontSize="10">Hàng {rowIdx + 1}:</text>
                {[90, 130, 170, 210, 250, 290, 330, 370, 410, 450].map((x, colIdx) => (
                  <circle
                    key={colIdx}
                    cx={x}
                    cy={y + 5}
                    r="6"
                    fill={rowIdx === 3 && colIdx > 6 ? '#f59e0b' : '#38bdf8'}
                  />
                ))}
              </g>
            ))}

            {/* Chú thích màu sắc */}
            <circle cx="80" cy="225" r="5" fill="#38bdf8" />
            <text x="92" y="228" fill="#94a3b8" fontSize="9">Nhóm thể lực chuẩn</text>
            <circle cx="210" cy="225" r="5" fill="#f59e0b" />
            <text x="222" y="228" fill="#f59e0b" fontSize="9">Nhóm thừa cân / bệnh nền nhẹ (Giảm tải)</text>
            <rect x="390" y="218" width="80" height="15" fill="#1e293b" stroke="#38bdf8" rx="3" />
            <text x="395" y="229" fill="#38bdf8" fontSize="8">Camera AI 60fps</text>
          </svg>
        );
    }
  };

  return (
    <div className="bg-slate-900/95 border border-slate-700/80 rounded-xl p-3.5 space-y-2 text-white">
      <div className="flex items-center justify-between">
        <span className="font-bold text-xs uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
          <i className="fa-solid fa-image text-emerald-500"></i>
          {title}
        </span>
        <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded font-mono border border-slate-700">
          Minh họa chuyên môn GDPT 2018
        </span>
      </div>

      <div className="overflow-hidden rounded-lg border border-slate-800">
        {renderSvgContent()}
      </div>

      <p className="text-[11px] text-slate-300 italic leading-relaxed bg-slate-800/60 p-2 rounded border border-slate-700/50">
        <strong className="text-amber-400 font-semibold">Chỉ dẫn kỹ thuật:</strong> {caption}
      </p>
    </div>
  );
};
