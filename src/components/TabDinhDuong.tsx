import React, { useState } from 'react';

export const TabDinhDuong: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<'tong-quan' | 'thuc-don' | 'so-cap-cuu'>('tong-quan');

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
          <div className="flex items-center gap-1.5 text-xs">
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
