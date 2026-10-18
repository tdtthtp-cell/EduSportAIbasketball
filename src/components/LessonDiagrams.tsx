import React, { useState } from 'react';
import { LessonDiagramImage } from '../types';

interface LessonDiagramsProps {
  image: LessonDiagramImage;
}

export const LessonDiagrams: React.FC<LessonDiagramsProps> = ({ image }) => {
  const { svgType, title, caption } = image;
  const [isZoomed, setIsZoomed] = useState(false);

  const renderSvgContent = (isModal: boolean = false) => {
    const heightClass = isModal ? "w-full h-auto max-h-[70vh]" : "w-full h-auto max-h-64 md:max-h-72";

    switch (svgType) {
      // ==========================================
      // BÓNG RỔ: Nhảy ném rổ một tay trên vai & Đường Parabol tối ưu
      // ==========================================
      case 'basketball-shoot':
        return (
          <svg
            viewBox="0 0 680 340"
            className={`${heightClass} rounded-xl shadow-inner select-none`}
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              {/* Nền nhà thi đấu thể thao */}
              <linearGradient id="bbGymBg" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#091426" />
                <stop offset="65%" stopColor="#102542" />
                <stop offset="100%" stopColor="#1a365d" />
              </linearGradient>

              {/* Sàn gỗ bóng rổ vân gỗ cao cấp */}
              <linearGradient id="bbHardwood" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#d97706" />
                <stop offset="30%" stopColor="#f59e0b" />
                <stop offset="70%" stopColor="#d97706" />
                <stop offset="100%" stopColor="#b45309" />
              </linearGradient>

              {/* Quả bóng rổ 3D rực rỡ */}
              <radialGradient id="bbBallGrad" cx="35%" cy="35%" r="65%">
                <stop offset="0%" stopColor="#ff9a3c" />
                <stop offset="45%" stopColor="#ea580c" />
                <stop offset="85%" stopColor="#c2410c" />
                <stop offset="100%" stopColor="#7c2d12" />
              </radialGradient>

              {/* Áo đấu học sinh Huỳnh Tấn Phát */}
              <linearGradient id="bbJerseyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#059669" />
                <stop offset="100%" stopColor="#064e3b" />
              </linearGradient>

              {/* Da người vận động viên */}
              <linearGradient id="bbSkinGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#fed7aa" />
                <stop offset="100%" stopColor="#fbbd69" />
              </linearGradient>

              {/* Vệt hào quang phát sáng quỹ đạo Parabol */}
              <filter id="bbGlow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            {/* Khung nền sàn đấu trường */}
            <rect x="0" y="0" width="680" height="340" fill="url(#bbGymBg)" rx="12" />

            {/* Đèn spotlight nhà thể thao chiếu xuống sân */}
            <path d="M 200 0 L 100 280 L 640 280 L 480 0 Z" fill="#38bdf8" fillOpacity="0.04" />
            <path d="M 500 0 L 400 280 L 670 280 L 600 0 Z" fill="#fbbf24" fillOpacity="0.04" />

            {/* Mặt sàn bóng rổ THPT Huỳnh Tấn Phát */}
            <rect x="0" y="270" width="680" height="70" fill="url(#bbHardwood)" />
            {/* Các đường vân ván sàn gỗ */}
            <line x1="0" y1="285" x2="680" y2="285" stroke="#b45309" strokeWidth="1" opacity="0.6" />
            <line x1="0" y1="300" x2="680" y2="300" stroke="#b45309" strokeWidth="1" opacity="0.6" />
            <line x1="0" y1="315" x2="680" y2="315" stroke="#b45309" strokeWidth="1" opacity="0.6" />
            <line x1="0" y1="330" x2="680" y2="330" stroke="#b45309" strokeWidth="1" opacity="0.6" />

            {/* Vạch giới hạn sân thể thao & Vạch 3 điểm */}
            <line x1="0" y1="270" x2="680" y2="270" stroke="#ffffff" strokeWidth="3" opacity="0.9" />
            <path d="M 260 270 A 240 70 0 0 1 540 270" fill="none" stroke="#ffffff" strokeWidth="2.5" strokeDasharray="6,4" opacity="0.75" />
            <text x="280" y="286" fill="#fef08a" fontSize="10" fontWeight="bold" fontFamily="sans-serif">
              Vạch ném phạt 5.8m
            </text>

            {/* BẢNG RỔ & VÀNH RỔ CHUẨN QUỐC GIA (FIBA 3.05m) */}
            <g id="basketballHoopStructure">
              {/* Trụ rổ chịu lực kiên cố phía sau */}
              <rect x="625" y="60" width="16" height="210" fill="#334155" rx="3" />
              {/* Đệm bọc an toàn chân cột rổ sư phạm */}
              <rect x="618" y="200" width="30" height="70" fill="#0284c7" stroke="#38bdf8" strokeWidth="2" rx="4" />
              <text x="633" y="240" fill="#ffffff" fontSize="9" fontWeight="bold" transform="rotate(-90 633 240)" textAnchor="middle">
                ĐỆM BẢO HỘ
              </text>

              {/* Tay đòn vươn ra của bảng rổ */}
              <line x1="625" y1="95" x2="555" y2="95" stroke="#475569" strokeWidth="8" strokeLinecap="round" />
              <line x1="625" y1="130" x2="560" y2="105" stroke="#475569" strokeWidth="6" strokeLinecap="round" />

              {/* Bảng rổ mica/kính cường lực viền đỏ */}
              <rect x="550" y="45" width="10" height="95" fill="#f8fafc" fillOpacity="0.85" stroke="#dc2626" strokeWidth="3" rx="2" />
              {/* Ô vuông nhắm đích bắn rổ trên bảng */}
              <rect x="549" y="80" width="4" height="32" fill="#dc2626" />

              {/* Vành rổ lò xo cam neon ở độ cao chuẩn 3.05m */}
              <rect x="502" y="106" width="48" height="6" fill="#ea580c" stroke="#fed7aa" strokeWidth="1" rx="2" />
              <circle cx="504" cy="109" r="4" fill="#ea580c" />

              {/* Lưới rổ trắng đan tỉ mỉ */}
              <path
                d="M 504 112 L 512 148 L 542 148 L 550 112 Z"
                fill="#ffffff"
                fillOpacity="0.15"
                stroke="#f1f5f9"
                strokeWidth="1.5"
                strokeDasharray="4,2"
              />
              <line x1="514" y1="112" x2="538" y2="148" stroke="#ffffff" strokeWidth="1" opacity="0.7" />
              <line x1="538" y1="112" x2="514" y2="148" stroke="#ffffff" strokeWidth="1" opacity="0.7" />

              {/* Chỉ dẫn kích thước vành rổ 3.05m */}
              <line x1="490" y1="109" x2="490" y2="270" stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="3,3" />
              <circle cx="490" cy="109" r="3" fill="#f59e0b" />
              <circle cx="490" cy="270" r="3" fill="#f59e0b" />
              <rect x="445" y="175" width="88" height="20" fill="#0f172a" stroke="#f59e0b" strokeWidth="1.5" rx="4" />
              <text x="489" y="189" fill="#fbbf24" fontSize="10.5" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">
                Vành rổ: 3.05m
              </text>
            </g>

            {/* QUỸ ĐẠO PARABOL TỐI ƯU CỦA ĐƯỜNG BÓNG */}
            <g id="parabolicTrajectory">
              {/* Quỹ đạo phát sáng (Apex ~ 4.1m) */}
              <path
                d="M 230 85 Q 360 10 515 106"
                fill="none"
                stroke="#f59e0b"
                strokeWidth="4"
                strokeDasharray="8,6"
                filter="url(#bbGlow)"
              />
              {/* Bóng ở các điểm bay mô phỏng liên hoàn */}
              <circle cx="310" cy="50" r="9" fill="url(#bbBallGrad)" opacity="0.45" />
              <circle cx="375" cy="35" r="10" fill="url(#bbBallGrad)" opacity="0.65" />
              <circle cx="445" cy="55" r="11" fill="url(#bbBallGrad)" opacity="0.8" />
              {/* Quả bóng đang chui vào vành rổ ngọt ngào */}
              <circle cx="515" cy="106" r="12" fill="url(#bbBallGrad)" />

              {/* Điểm cực đại Đỉnh Parabol (Apex) */}
              <rect x="330" y="8" width="90" height="20" fill="#047857" stroke="#34d399" strokeWidth="1.5" rx="4" />
              <text x="375" y="22" fill="#ffffff" fontSize="9.5" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">
                Đỉnh Parabol ~ 4m
              </text>
              <line x1="375" y1="28" x2="375" y2="35" stroke="#34d399" strokeWidth="1.5" />

              {/* Góc phóng bóng 48° - 52° */}
              <path d="M 230 85 L 285 85" stroke="#38bdf8" strokeWidth="1.5" strokeDasharray="3,2" />
              <path d="M 255 85 A 25 25 0 0 0 250 68" fill="none" stroke="#38bdf8" strokeWidth="2.5" />
              <rect x="245" y="48" width="84" height="18" fill="#0284c7" stroke="#38bdf8" strokeWidth="1" rx="3" />
              <text x="287" y="61" fill="#ffffff" fontSize="9.5" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">
                Góc ném: 48° - 52°
              </text>
            </g>

            {/* VẬN ĐỘNG VIÊN BẬT NHẢY NÉM BÓNG TRÊN KHÔNG (HỌC SINH THPT HUỲNH TẤN PHÁT) */}
            <g id="basketballPlayer">
              {/* Bóng đổ hoãn xung trên mặt sân */}
              <ellipse cx="175" cy="272" rx="35" ry="7" fill="#000000" opacity="0.55" />

              {/* Cẳng chân sau (gập khớp gối lấy đà bật nhảy) */}
              <path d="M 170 205 L 160 238 L 150 258" stroke="url(#bbSkinGrad)" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round" />
              {/* Giày thể thao chân sau */}
              <path d="M 150 258 L 140 262 L 152 266 Z" fill="#ef4444" stroke="#ffffff" strokeWidth="1.5" />

              {/* Cẳng chân trước (duỗi căng vươn theo bóng) */}
              <path d="M 185 205 L 182 238 L 178 255" stroke="url(#bbSkinGrad)" strokeWidth="11" strokeLinecap="round" strokeLinejoin="round" />
              {/* Giày thể thao chân trước */}
              <path d="M 178 255 L 175 264 L 190 264 Z" fill="#ef4444" stroke="#ffffff" strokeWidth="1.5" />

              {/* Quần đùi thể thao xanh lá sọc vàng */}
              <path d="M 158 178 L 198 178 L 192 215 L 156 215 Z" fill="#064e3b" stroke="#facc15" strokeWidth="2" />

              {/* Thân người & Áo đấu số 10 THPT Huỳnh Tấn Phát */}
              <path d="M 160 120 L 195 116 L 198 180 L 158 180 Z" fill="url(#bbJerseyGrad)" rx="3" />
              {/* Số áo 10 màu vàng nghệ */}
              <text x="178" y="152" fill="#facc15" fontSize="16" fontWeight="900" textAnchor="middle" fontFamily="sans-serif">
                10
              </text>
              <text x="178" y="164" fill="#a7f3d0" fontSize="7" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">
                HTP
              </text>

              {/* Đầu & Mắt tập trung vào vành rổ */}
              <circle cx="178" cy="98" r="15" fill="url(#bbSkinGrad)" />
              {/* Mái tóc gọn gàng */}
              <path d="M 166 94 Q 178 82 192 90 Q 186 98 188 102 L 172 102 Z" fill="#1e293b" />
              {/* Ánh mắt kiên định */}
              <circle cx="188" cy="97" r="2" fill="#0f172a" />

              {/* TAY TRÁI (TAY ĐỠ BÓNG - BÊN HÔNG) */}
              <path d="M 168 126 L 180 108 L 200 95" fill="none" stroke="url(#bbSkinGrad)" strokeWidth="8" strokeLinecap="round" />
              {/* Bàn tay trái vừa mở rộng đỡ bên hông bóng */}
              <path d="M 200 95 L 206 90 L 202 85" fill="none" stroke="url(#bbSkinGrad)" strokeWidth="5" strokeLinecap="round" />

              {/* TAY PHẢI (TAY NÉM THUẬN - GÓC THƯỚC THỢ 90° CHUẨN MỰC) */}
              <path d="M 188 122 L 208 120 L 216 88" fill="none" stroke="url(#bbSkinGrad)" strokeWidth="9" strokeLinecap="round" strokeLinejoin="round" />
              {/* Góc đo khuỷu tay 90 độ màu vàng sáng */}
              <path d="M 205 120 L 205 112 L 213 112" fill="none" stroke="#facc15" strokeWidth="2" />
              <rect x="210" y="118" width="76" height="18" fill="#1e293b" stroke="#facc15" strokeWidth="1" rx="3" />
              <text x="248" y="131" fill="#facc15" fontSize="9" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">
                Khuỷu tay: 90°
              </text>

              {/* Cổ tay gập theo bóng (Follow-through / Goose neck) */}
              <path d="M 216 88 L 225 78 L 230 82" fill="none" stroke="url(#bbSkinGrad)" strokeWidth="7" strokeLinecap="round" />

              {/* QUẢ BÓNG RỔ TẠI ĐIỂM RA TAY CAO NHẤT */}
              <g id="basketballAtRelease">
                <circle cx="228" cy="74" r="16" fill="url(#bbBallGrad)" stroke="#7c2d12" strokeWidth="1" />
                {/* Rãnh bóng rổ chuẩn */}
                <path d="M 214 74 Q 228 74 242 74" fill="none" stroke="#292524" strokeWidth="1.5" />
                <path d="M 228 60 Q 228 74 228 88" fill="none" stroke="#292524" strokeWidth="1.5" />
                <path d="M 216 64 Q 228 74 240 84" fill="none" stroke="#292524" strokeWidth="1.2" />
                {/* Mũi tên xoay ngược bóng (Backspin) */}
                <path d="M 240 60 A 14 14 0 0 1 242 78" fill="none" stroke="#ffffff" strokeWidth="2" strokeDasharray="3,2" />
                <polygon points="242,78 245,71 238,73" fill="#ffffff" />
                <rect x="180" y="44" width="65" height="16" fill="#047857" stroke="#34d399" strokeWidth="1" rx="3" />
                <text x="212" y="55" fill="#ffffff" fontSize="8" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">
                  Miết bóng ⟲
                </text>
              </g>

              {/* Hướng phát lực toàn thân từ chân lên tay */}
              <line x1="165" y1="230" x2="185" y2="120" stroke="#34d399" strokeWidth="3" strokeDasharray="4,3" />
              <polygon points="185,120 180,128 190,126" fill="#34d399" />
              <text x="135" y="190" fill="#34d399" fontSize="9" fontWeight="bold" fontFamily="sans-serif">
                Lực đạp chân ⇈
              </text>
            </g>

            {/* BẢNG CHỈ DẪN KỸ THUẬT SƯ PHẠM RÕ RÀNG */}
            <g id="legendBox">
              <rect x="15" y="15" width="220" height="65" fill="#0f172a" fillOpacity="0.9" stroke="#38bdf8" strokeWidth="1.5" rx="8" />
              <text x="25" y="32" fill="#38bdf8" fontSize="11" fontWeight="bold" fontFamily="sans-serif">
                BÓNG RỔ: NHẢY NÉM 1 TAY TRÊN VAI
              </text>
              <text x="25" y="48" fill="#e2e8f0" fontSize="9" fontFamily="sans-serif">
                • 1. Khuỷu tay 90°, mắt nhìn vành rổ 3.05m
              </text>
              <text x="25" y="61" fill="#e2e8f0" fontSize="9" fontFamily="sans-serif">
                • 2. Bật nhảy đồng thời duỗi khớp, góc ném ~50°
              </text>
              <text x="25" y="73" fill="#e2e8f0" fontSize="9" fontFamily="sans-serif">
                • 3. Gập miết cổ tay, tạo xoáy ngược (Backspin)
              </text>
            </g>
          </svg>
        );

      // ==========================================
      // BÓNG CHUYỀN: Phát bóng thấp tay nghiêng mình
      // ==========================================
      case 'volleyball-serve-low':
        return (
          <svg
            viewBox="0 0 680 340"
            className={`${heightClass} rounded-xl shadow-inner select-none`}
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient id="vbBg" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#0c1e33" />
                <stop offset="60%" stopColor="#1e3a5f" />
                <stop offset="100%" stopColor="#2c5282" />
              </linearGradient>

              {/* Sân bóng chuyền Taraflex xanh ngọc & cam Bến Tre */}
              <linearGradient id="vbCourt" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#047857" />
                <stop offset="70%" stopColor="#059669" />
                <stop offset="100%" stopColor="#10b981" />
              </linearGradient>

              {/* Bóng chuyền Mikasa 3 màu vàng/xanh/trắng */}
              <radialGradient id="vbBallGrad" cx="35%" cy="35%" r="65%">
                <stop offset="0%" stopColor="#fef08a" />
                <stop offset="40%" stopColor="#eab308" />
                <stop offset="75%" stopColor="#1d4ed8" />
                <stop offset="100%" stopColor="#1e3a8a" />
              </radialGradient>
            </defs>

            {/* Sân bãi & Không gian */}
            <rect x="0" y="0" width="680" height="340" fill="url(#vbBg)" rx="12" />
            <rect x="0" y="260" width="680" height="80" fill="url(#vbCourt)" />
            <line x1="0" y1="260" x2="680" y2="260" stroke="#ffffff" strokeWidth="3" />
            <line x1="160" y1="260" x2="160" y2="340" stroke="#facc15" strokeWidth="3" strokeDasharray="6,4" />
            <text x="80" y="280" fill="#fef08a" fontSize="10" fontWeight="bold" fontFamily="sans-serif">
              Vạch phát bóng 9m
            </text>

            {/* LƯỚI BÓNG CHUYỀN CHUẨN QUỐC TẾ (2.24m - 2.43m) */}
            <g id="volleyballNet">
              {/* Trụ lưới bên phải */}
              <rect x="520" y="55" width="14" height="210" fill="#cbd5e1" rx="2" />
              {/* Lưới mắt cáo */}
              <rect x="516" y="70" width="8" height="90" fill="#ffffff" fillOpacity="0.25" stroke="#ffffff" strokeWidth="2" />
              <line x1="500" y1="70" x2="530" y2="70" stroke="#dc2626" strokeWidth="4" /> {/* Băng dải trên đỏ */}
              <line x1="500" y1="160" x2="530" y2="160" stroke="#ffffff" strokeWidth="3" />
              {/* Cọc ăng-ten giới hạn đỏ trắng */}
              <line x1="512" y1="40" x2="512" y2="160" stroke="#ef4444" strokeWidth="3" strokeDasharray="8,8" />
              <text x="538" y="75" fill="#facc15" fontSize="11" fontWeight="bold" fontFamily="sans-serif">
                Lưới: 2.24m - 2.43m
              </text>
            </g>

            {/* CẦU THỦ THỰC HIỆN PHÁT BÓNG NGHIÊNG MÌNH */}
            <g id="volleyballServer">
              {/* Bóng chân */}
              <ellipse cx="140" cy="265" rx="35" ry="6" fill="#000000" opacity="0.5" />

              {/* Chân trước & chân sau nghiêng 90° so với lưới */}
              <path d="M 120 205 L 105 235 L 98 260" stroke="#fed7aa" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M 155 205 L 158 235 L 165 260" stroke="#fed7aa" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round" />
              <polygon points="98,260 88,264 102,266" fill="#3b82f6" />
              <polygon points="165,260 162,266 178,265" fill="#3b82f6" />

              {/* Quần và thân nghiêng mình */}
              <path d="M 115 180 L 160 178 L 155 212 L 120 212 Z" fill="#064e3b" stroke="#facc15" strokeWidth="1.5" />
              <path d="M 122 120 L 162 128 L 158 182 L 118 180 Z" fill="#059669" rx="2" />
              <text x="140" y="155" fill="#facc15" fontSize="14" fontWeight="bold" textAnchor="middle">HTP</text>

              {/* Đầu vận động viên hướng về phía bóng & lưới */}
              <circle cx="142" cy="100" r="14" fill="#fed7aa" />
              <path d="M 132 94 Q 144 86 156 94 Q 150 102 152 106 L 138 106 Z" fill="#1e293b" />

              {/* Tay trái tung bóng nhịp nhàng */}
              <path d="M 130 130 L 110 138 L 95 125" fill="none" stroke="#fed7aa" strokeWidth="7" strokeLinecap="round" />
              <circle cx="95" cy="105" r="13" fill="url(#vbBallGrad)" stroke="#1e3a8a" strokeWidth="1" />
              {/* Vạch bay của quả bóng tung */}
              <path d="M 95 125 L 95 106" stroke="#facc15" strokeWidth="2" strokeDasharray="3,2" />
              <rect x="52" y="80" width="70" height="18" fill="#1e293b" stroke="#facc15" strokeWidth="1" rx="3" />
              <text x="87" y="92" fill="#facc15" fontSize="9" fontWeight="bold" textAnchor="middle">
                Tung 40-50cm
              </text>

              {/* Tay phải vung cánh cung từ sau ra trước (Lực cườm tay) */}
              <path d="M 158 130 L 195 145 L 205 170" fill="none" stroke="#fed7aa" strokeWidth="8" strokeLinecap="round" />
              <path d="M 205 170 Q 155 195 105 120" fill="none" stroke="#ef4444" strokeWidth="3" strokeDasharray="5,3" />
              <text x="160" y="195" fill="#f87171" fontSize="9.5" fontWeight="bold">
                Vung tay hình cánh cung ➔
              </text>

              {/* Điểm tiếp xúc cườm tay vào tâm dưới quả bóng */}
              <rect x="30" y="132" width="90" height="18" fill="#047857" stroke="#34d399" strokeWidth="1" rx="3" />
              <text x="75" y="144" fill="#ffffff" fontSize="9" fontWeight="bold" textAnchor="middle">
                Đánh cườm tay
              </text>
            </g>

            {/* Quỹ đạo bóng bay vồng qua lưới sang sân đối phương */}
            <path d="M 95 105 Q 320 20 520 85 T 660 180" fill="none" stroke="#34d399" strokeWidth="3.5" strokeDasharray="6,4" />
            <circle cx="530" cy="90" r="10" fill="url(#vbBallGrad)" opacity="0.8" />
            <text x="320" y="45" fill="#34d399" fontSize="11" fontWeight="bold">
              Quỹ đạo bóng qua mép trên lưới
            </text>

            {/* Bảng tóm tắt kỹ thuật */}
            <g id="vbLegend">
              <rect x="15" y="15" width="220" height="60" fill="#0f172a" fillOpacity="0.9" stroke="#38bdf8" strokeWidth="1.5" rx="8" />
              <text x="25" y="32" fill="#38bdf8" fontSize="11" fontWeight="bold">
                BÓNG CHUYỀN: PHÁT BÓNG THẤP TAY
              </text>
              <text x="25" y="48" fill="#e2e8f0" fontSize="9">
                • Đứng nghiêng mình 90° so với lưới
              </text>
              <text x="25" y="61" fill="#e2e8f0" fontSize="9">
                • Tung bóng 40-50cm, tiếp xúc cườm tay tâm bóng
              </text>
            </g>
          </svg>
        );

      // ==========================================
      // BÓNG CHUYỀN: Chuyền bóng cao tay bằng 2 tay
      // ==========================================
      case 'volleyball-pass-high':
        return (
          <svg
            viewBox="0 0 680 340"
            className={`${heightClass} rounded-xl shadow-inner select-none`}
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient id="vbPassBg" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#082f49" />
                <stop offset="100%" stopColor="#0f172a" />
              </linearGradient>
              <radialGradient id="vbBallGrad2" cx="35%" cy="35%" r="65%">
                <stop offset="0%" stopColor="#fef08a" />
                <stop offset="45%" stopColor="#eab308" />
                <stop offset="85%" stopColor="#2563eb" />
                <stop offset="100%" stopColor="#1e3a8a" />
              </radialGradient>
            </defs>

            <rect x="0" y="0" width="680" height="340" fill="url(#vbPassBg)" rx="12" />
            <rect x="0" y="270" width="680" height="70" fill="#047857" />
            <line x1="0" y1="270" x2="680" y2="270" stroke="#ffffff" strokeWidth="3" />

            {/* VẬN ĐỘNG VIÊN TRỰC DIỆN CHUYỀN BÓNG */}
            <g id="passHighAthlete">
              <ellipse cx="270" cy="275" rx="55" ry="8" fill="#000000" opacity="0.6" />

              {/* 2 Chân gối chùng 135° vững chắc */}
              <path d="M 255 195 L 225 235 L 210 270" stroke="#fed7aa" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M 285 195 L 315 235 L 330 270" stroke="#fed7aa" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" />
              <polygon points="210,270 195,274 215,276" fill="#ef4444" />
              <polygon points="330,270 325,276 345,274" fill="#ef4444" />

              {/* Lực đạp chân từ dưới lên */}
              <line x1="270" y1="260" x2="270" y2="190" stroke="#34d399" strokeWidth="3" strokeDasharray="4,3" />
              <polygon points="270,190 265,198 275,198" fill="#34d399" />
              <text x="280" y="225" fill="#34d399" fontSize="10" fontWeight="bold">
                Lực đạp đất
              </text>

              {/* Thân người & Áo số 7 */}
              <rect x="245" y="130" width="50" height="70" fill="#065f46" stroke="#facc15" strokeWidth="2" rx="4" />
              <text x="270" y="170" fill="#facc15" fontSize="18" fontWeight="bold" textAnchor="middle">7</text>

              {/* Đầu ngửa góc 45° đón bóng */}
              <circle cx="270" cy="105" r="16" fill="#fed7aa" />
              <path d="M 255 98 Q 270 88 285 98 L 285 106 L 255 106 Z" fill="#1e293b" />

              {/* CÁNH TAY TẠO HÌNH CHIẾC PHỄU TRƯỚC TRÁN (CÁCH 15-20CM) */}
              <path d="M 246 135 L 220 100 L 250 68" fill="none" stroke="#fed7aa" strokeWidth="9" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M 294 135 L 320 100 L 290 68" fill="none" stroke="#fed7aa" strokeWidth="9" strokeLinecap="round" strokeLinejoin="round" />

              {/* Quả bóng tiếp xúc trên trán */}
              <circle cx="270" cy="50" r="20" fill="url(#vbBallGrad2)" stroke="#1e3a8a" strokeWidth="1.5" />
              <path d="M 250 65 Q 270 72 290 65" stroke="#facc15" strokeWidth="3" fill="none" />

              {/* Chú thích điểm đón bóng */}
              <rect x="180" y="18" width="180" height="20" fill="#0f172a" stroke="#facc15" strokeWidth="1.5" rx="4" />
              <text x="270" y="32" fill="#fbbf24" fontSize="10" fontWeight="bold" textAnchor="middle">
                Đón bóng trước trán 15 - 20cm
              </text>
            </g>

            {/* Ô PHÓNG TO HÌNH CHIẾC PHỄU CỦA 10 NGÓN TAY */}
            <g id="funnelZoomBox" transform="translate(430, 40)">
              <rect x="0" y="0" width="225" height="190" fill="#0f172a" stroke="#38bdf8" strokeWidth="2" rx="8" />
              <text x="15" y="24" fill="#38bdf8" fontSize="11" fontWeight="bold">
                CẬN CẢNH: HÌNH CHIẾC PHỄU
              </text>
              {/* Bóng nhỏ mô phỏng */}
              <circle cx="112" cy="75" r="32" fill="url(#vbBallGrad2)" opacity="0.6" stroke="#ffffff" strokeWidth="1" strokeDasharray="3,2" />
              {/* Hai bàn tay mở bao quanh quả bóng */}
              <path d="M 70 105 Q 80 75 100 55" stroke="#fed7aa" strokeWidth="7" fill="none" strokeLinecap="round" />
              <path d="M 155 105 Q 145 75 125 55" stroke="#fed7aa" strokeWidth="7" fill="none" strokeLinecap="round" />
              {/* Ngón cái tạo hình tam giác */}
              <line x1="88" y1="100" x2="105" y2="92" stroke="#facc15" strokeWidth="4" />
              <line x1="136" y1="100" x2="119" y2="92" stroke="#facc15" strokeWidth="4" />

              <text x="112" y="125" fill="#facc15" fontSize="9.5" fontWeight="bold" textAnchor="middle">
                Ngón tay mở đều - Không dính lòng tay
              </text>
              <text x="112" y="145" fill="#e2e8f0" fontSize="9" textAnchor="middle">
                Tiếp xúc bằng các đốt chai ngón tay
              </text>
              <text x="112" y="165" fill="#34d399" fontSize="9" textAnchor="middle">
                Duỗi khớp cổ tay đẩy bóng đi cao bổng
              </text>
            </g>

            {/* Chú thích chung */}
            <g id="passLegend">
              <rect x="15" y="15" width="210" height="55" fill="#0f172a" fillOpacity="0.9" stroke="#34d399" strokeWidth="1.5" rx="8" />
              <text x="25" y="32" fill="#34d399" fontSize="11" fontWeight="bold">
                CHUYỀN BÓNG CAO TAY 2 TAY
              </text>
              <text x="25" y="48" fill="#e2e8f0" fontSize="9">
                • Phối hợp lực: Đạp chân - Nâng thân - Đẩy tay
              </text>
            </g>
          </svg>
        );

      // ==========================================
      // CẦU LÔNG: Di chuyển 4 góc sân & Kỹ thuật đập cầu Smash
      // ==========================================
      case 'badminton-court':
        return (
          <svg
            viewBox="0 0 680 340"
            className={`${heightClass} rounded-xl shadow-inner select-none`}
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient id="badmintonFloor" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#064e3b" />
                <stop offset="50%" stopColor="#047857" />
                <stop offset="100%" stopColor="#065f46" />
              </linearGradient>
            </defs>

            {/* Nền nhà thi đấu cầu lông */}
            <rect x="0" y="0" width="680" height="340" fill="#0b1727" rx="12" />

            {/* Mặt thảm sân cầu lông BWF màu xanh chuẩn */}
            <rect x="60" y="25" width="560" height="280" fill="url(#badmintonFloor)" stroke="#ffffff" strokeWidth="3" rx="4" />

            {/* Vạch biên đôi & vạch biên đơn */}
            <rect x="85" y="40" width="510" height="250" fill="none" stroke="#ffffff" strokeWidth="2" opacity="0.9" />

            {/* Lưới giữa sân 1.55m */}
            <line x1="340" y1="20" x2="340" y2="310" stroke="#facc15" strokeWidth="4" strokeDasharray="6,3" />
            <rect x="330" y="10" width="20" height="15" fill="#facc15" rx="2" />
            <text x="340" y="22" fill="#0f172a" fontSize="9" fontWeight="bold" textAnchor="middle">LƯỚI</text>

            {/* Vạch giao cầu ngắn 1.98m hai bên */}
            <line x1="280" y1="25" x2="280" y2="305" stroke="#ffffff" strokeWidth="2" />
            <line x1="400" y1="25" x2="400" y2="305" stroke="#ffffff" strokeWidth="2" />

            {/* Đường trung tâm phân chia ô giao cầu */}
            <line x1="85" y1="165" x2="280" y2="165" stroke="#ffffff" strokeWidth="2" />
            <line x1="400" y1="165" x2="595" y2="165" stroke="#ffffff" strokeWidth="2" />

            {/* VỊ TRÍ TRUNG TÂM ĐÓN CẦU (TTCB) */}
            <g id="centerPlayer">
              <circle cx="210" cy="165" r="14" fill="#38bdf8" stroke="#ffffff" strokeWidth="2" />
              <text x="210" y="169" fill="#0f172a" fontSize="9" fontWeight="black" textAnchor="middle">GV/HS</text>
              <text x="210" y="195" fill="#38bdf8" fontSize="10.5" fontWeight="bold" textAnchor="middle">
                TTCB TRUNG TÂM
              </text>
            </g>

            {/* 4 MŨI TÊN BƯỚC DI CHUYỂN 4 GÓC SÂN CHUẨN XÁC */}
            {/* 1. Tiến phải (Bỏ nhỏ lưới phải) */}
            <path d="M 220 155 Q 260 110 275 60" fill="none" stroke="#f43f5e" strokeWidth="3" markerEnd="url(#arrowRed)" />
            <rect x="255" y="45" width="70" height="18" fill="#f43f5e" rx="3" />
            <text x="290" y="58" fill="#ffffff" fontSize="8.5" fontWeight="bold" textAnchor="middle">1. Lưới Phải</text>

            {/* 2. Tiến trái (Kéo lưới trái) */}
            <path d="M 220 175 Q 260 220 275 270" fill="none" stroke="#f43f5e" strokeWidth="3" />
            <rect x="255" y="275" width="70" height="18" fill="#f43f5e" rx="3" />
            <text x="290" y="288" fill="#ffffff" fontSize="8.5" fontWeight="bold" textAnchor="middle">2. Lưới Trái</text>

            {/* 3. Lùi phải bật nhảy ĐẬP CẦU (Smash) */}
            <path d="M 195 155 Q 140 100 110 55" fill="none" stroke="#a855f7" strokeWidth="3" />
            <rect x="90" y="45" width="85" height="18" fill="#9333ea" rx="3" />
            <text x="132" y="58" fill="#ffffff" fontSize="8.5" fontWeight="bold" textAnchor="middle">3. Đập Cầu Smash</text>

            {/* 4. Lùi trái (Phông cầu trái tay) */}
            <path d="M 195 175 Q 140 230 110 270" fill="none" stroke="#a855f7" strokeWidth="3" />
            <rect x="90" y="275" width="85" height="18" fill="#9333ea" rx="3" />
            <text x="132" y="288" fill="#ffffff" fontSize="8.5" fontWeight="bold" textAnchor="middle">4. Phông Trái Tay</text>

            {/* Quả cầu lông đang cắm dốc sang sân đối phương */}
            <g id="shuttlecock" transform="translate(480, 150)">
              <ellipse cx="0" cy="0" rx="8" ry="4" fill="#ffffff" />
              <polygon points="4,-4 16,-8 16,8 4,4" fill="#f1f5f9" stroke="#94a3b8" strokeWidth="1" />
              {/* Vệt tốc độ smash dốc đứng */}
              <line x1="-35" y1="-25" x2="-5" y2="-5" stroke="#ef4444" strokeWidth="2.5" strokeDasharray="4,2" />
              <text x="0" y="25" fill="#f87171" fontSize="9" fontWeight="bold" textAnchor="middle">
                Cầu cắm dốc 70°
              </text>
            </g>

            {/* Bảng chú dẫn */}
            <g id="badmintonLegend">
              <rect x="75" y="5" width="220" height="32" fill="#0f172a" stroke="#38bdf8" strokeWidth="1" rx="4" />
              <text x="85" y="23" fill="#38bdf8" fontSize="10" fontWeight="bold">
                CẦU LÔNG: DI CHUYỂN BƯỚC ĐỆM 4 GÓC
              </text>
            </g>
          </svg>
        );

      // ==========================================
      // SƠ ĐỒ ĐỘI HÌNH & TỔ CHỨC LỚP HỌC TRÊN SÂN BÃI (PHÂN HÓA AN TOÀN SƯ PHẠM)
      // ==========================================
      case 'court-formation':
      default:
        return (
          <svg
            viewBox="0 0 680 340"
            className={`${heightClass} rounded-xl shadow-inner select-none`}
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Mặt sân thể dục đa năng THPT Huỳnh Tấn Phát */}
            <rect x="0" y="0" width="680" height="340" fill="#0b1727" rx="12" />
            <rect x="25" y="20" width="630" height="295" fill="#0f291e" stroke="#10b981" strokeWidth="2.5" rx="8" />

            {/* VỊ TRÍ GIÁO VIÊN (GV) CHỈ HUY */}
            <g id="teacherPosition">
              <rect x="300" y="32" width="80" height="34" fill="#047857" stroke="#34d399" strokeWidth="2" rx="6" />
              <text x="340" y="53" fill="#ffffff" fontSize="12" fontWeight="bold" textAnchor="middle">
                GIÁO VIÊN (▲)
              </text>
              {/* Tầm quan sát bao quát của GV */}
              <path d="M 340 68 L 100 135 L 580 135 Z" fill="#34d399" fillOpacity="0.06" />
              <text x="340" y="80" fill="#94a3b8" fontSize="9.5" textAnchor="middle">
                Khoảng cách an toàn 5 - 7m
              </text>
            </g>

            {/* 4 TỔ HỌC SINH (HÀNG NGANG GIÃN CÁCH SO LE - 1 SẢI TAY) */}
            {[
              { row: 1, y: 110, label: "Tổ 1" },
              { row: 2, y: 155, label: "Tổ 2" },
              { row: 3, y: 200, label: "Tổ 3" },
              { row: 4, y: 245, label: "Tổ 4" }
            ].map(({ row, y, label }) => (
              <g key={row}>
                {/* Nhãn tổ bên trái */}
                <rect x="40" y={y - 12} width="48" height="24" fill="#1e293b" stroke="#475569" strokeWidth="1" rx="4" />
                <text x="64" y={y + 4} fill="#e2e8f0" fontSize="10" fontWeight="bold" textAnchor="middle">
                  {label}
                </text>

                {/* Học sinh trong hàng: 8 học sinh mỗi tổ, phân màu theo thể trạng an toàn sư phạm */}
                {[130, 185, 240, 295, 350, 405, 460, 515, 570].map((x, colIdx) => {
                  // Phân hóa sư phạm:
                  // Hàng 4 cuối: một số học sinh thừa cân hoặc bệnh nền
                  const isOverweight = row === 4 && (colIdx === 6 || colIdx === 7);
                  const isUnderweight = row === 3 && colIdx === 8;
                  const isMedical = row === 4 && colIdx === 8;

                  let color = "#38bdf8"; // Bình thường
                  let statusText = "Chuẩn";
                  if (isOverweight) {
                    color = "#f59e0b";
                    statusText = "Thừa cân";
                  } else if (isUnderweight) {
                    color = "#34d399";
                    statusText = "Thiếu cân";
                  } else if (isMedical) {
                    color = "#ec4899";
                    statusText = "Bệnh nền";
                  }

                  return (
                    <g key={colIdx}>
                      <circle cx={x} cy={y} r="10" fill={color} stroke="#ffffff" strokeWidth="1.5" />
                      <circle cx={x} cy={y - 2} r="3" fill="#ffffff" opacity="0.6" />
                      {/* Vạch so le cự ly 1 sải tay */}
                      {colIdx < 8 && (
                        <line x1={x + 10} y1={y} x2={x + 45} y2={y} stroke="#334155" strokeWidth="1" strokeDasharray="2,2" />
                      )}
                    </g>
                  );
                })}
              </g>
            ))}

            {/* CÁC KHU VỰC CHỨC NĂNG BỔ TRỢ HỌC ĐƯỜNG */}
            {/* Trạm nước uống Bến Tre */}
            <g id="waterStation" transform="translate(45, 275)">
              <rect x="0" y="0" width="130" height="28" fill="#0369a1" stroke="#38bdf8" strokeWidth="1.5" rx="5" />
              <text x="65" y="18" fill="#ffffff" fontSize="9.5" fontWeight="bold" textAnchor="middle">
                💧 Trạm Nước Dừa/Bù Điện Giải
              </text>
            </g>

            {/* Trạm y tế an toàn sư phạm */}
            <g id="medicalKit" transform="translate(190, 275)">
              <rect x="0" y="0" width="125" height="28" fill="#991b1b" stroke="#f87171" strokeWidth="1.5" rx="5" />
              <text x="62" y="18" fill="#ffffff" fontSize="9.5" fontWeight="bold" textAnchor="middle">
                ➕ Tủ Y Tế / Sơ Cứu HTP
              </text>
            </g>

            {/* Camera AI phân tích động tác 60fps */}
            <g id="aiCamera" transform="translate(490, 275)">
              <rect x="0" y="0" width="145" height="28" fill="#1e1b4b" stroke="#818cf8" strokeWidth="1.5" rx="5" />
              <text x="72" y="18" fill="#c7d2fe" fontSize="9.5" fontWeight="bold" textAnchor="middle">
                📹 Camera AI Đánh Giá TT22
              </text>
            </g>

            {/* BẢNG CHÚ THÍCH PHÂN HÓA THỂ TRẠNG AN TOÀN SƯ PHẠM */}
            <g id="formationLegend" transform="translate(35, 25)">
              <rect x="0" y="0" width="230" height="55" fill="#0f172a" stroke="#34d399" strokeWidth="1" rx="6" />
              <text x="10" y="16" fill="#34d399" fontSize="9.5" fontWeight="bold">
                PHÂN HÓA THỂ TRẠNG AN TOÀN SƯ PHẠM
              </text>
              <circle cx="16" cy="30" r="5" fill="#38bdf8" />
              <text x="26" y="33" fill="#e2e8f0" fontSize="8.5">Thể lực chuẩn (Luyện nâng cao)</text>
              <circle cx="16" cy="45" r="5" fill="#f59e0b" />
              <text x="26" y="48" fill="#fbbf24" fontSize="8.5">Thừa cân / Bệnh nền nhẹ (Giảm tải)</text>
              <circle cx="150" cy="45" r="5" fill="#ec4899" />
              <text x="160" y="48" fill="#f472b6" fontSize="8.5">Chấn thương</text>
            </g>
          </svg>
        );
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-700/80 rounded-xl p-3.5 space-y-2.5 text-white shadow-md hover:border-emerald-500/50 transition-colors">
      {/* Tiêu đề & Công cụ tương tác sơ đồ */}
      <div className="flex items-center justify-between gap-2">
        <span className="font-bold text-xs uppercase tracking-wider text-emerald-400 flex items-center gap-1.5 truncate">
          <i className="fa-solid fa-chalkboard-user text-emerald-400"></i>
          <span>{title}</span>
        </span>
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            type="button"
            onClick={() => setIsZoomed(true)}
            className="text-[11px] bg-slate-800 hover:bg-emerald-700 text-slate-200 hover:text-white px-2 py-1 rounded flex items-center gap-1 border border-slate-700 transition"
            title="Phóng to xem chi tiết trên máy chiếu / màn hình lớn"
          >
            <i className="fa-solid fa-expand text-[10px]"></i>
            <span className="hidden sm:inline">Phóng to</span>
          </button>
          <span className="text-[10px] bg-emerald-950/80 text-emerald-300 px-2 py-0.5 rounded font-mono border border-emerald-800/80">
            Chuẩn CV 5512
          </span>
        </div>
      </div>

      {/* Khung hiển thị sơ đồ vector sống động */}
      <div className="overflow-hidden rounded-xl border border-slate-800 bg-slate-950 shadow-inner">
        {renderSvgContent(false)}
      </div>

      {/* Chỉ dẫn sư phạm chi tiết */}
      <div className="text-[11px] text-slate-300 italic leading-relaxed bg-slate-800/80 p-2.5 rounded-lg border border-slate-700/60 flex items-start gap-2">
        <i className="fa-solid fa-circle-info text-amber-400 mt-0.5 shrink-0"></i>
        <div>
          <strong className="text-amber-400 font-semibold not-italic">Chỉ dẫn kỹ thuật sư phạm: </strong>
          <span>{caption}</span>
        </div>
      </div>

      {/* MODAL PHÓNG TO SƠ ĐỒ CHI TIẾT DÀNH CHO GIẢNG DẠY MÁY CHIẾU */}
      {isZoomed && (
        <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-emerald-500/60 rounded-2xl max-w-4xl w-full p-5 space-y-4 shadow-2xl animate-fade-in text-white">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white">
                  <i className="fa-solid fa-chalkboard text-sm"></i>
                </span>
                <div>
                  <h3 className="font-bold text-base text-emerald-400 uppercase">{title}</h3>
                  <p className="text-xs text-slate-400">Minh họa trực quan độ nét cao phục vụ giảng dạy trên sân bãi THPT Huỳnh Tấn Phát</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsZoomed(false)}
                className="w-9 h-9 rounded-lg bg-slate-800 hover:bg-rose-600 text-slate-300 hover:text-white flex items-center justify-center transition"
              >
                <i className="fa-solid fa-xmark text-lg"></i>
              </button>
            </div>

            <div className="bg-slate-950 p-2 rounded-xl border border-slate-800">
              {renderSvgContent(true)}
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs bg-slate-800/70 p-3 rounded-xl border border-slate-700">
              <div className="flex items-center gap-2 text-slate-300">
                <i className="fa-solid fa-lightbulb text-amber-400 text-sm"></i>
                <span>{caption}</span>
              </div>
              <button
                type="button"
                onClick={() => setIsZoomed(false)}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-lg shrink-0 transition"
              >
                Đóng sơ đồ
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
