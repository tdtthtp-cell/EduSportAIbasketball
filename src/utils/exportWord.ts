import { DetailedKHBDPlan } from '../types';

interface WordExportOptions {
  schoolLocation: string;
  planDay: string;
  planMonth: string;
  planYear: string;
  ttcmName: string;
  teacherName: string;
}

export function exportLessonPlanToWord(
  plan: DetailedKHBDPlan,
  options: WordExportOptions
): void {
  const { schoolLocation, planDay, planMonth, planYear, ttcmName, teacherName } = options;

  let activitiesHtml = '';
  plan.activities.forEach((act) => {
    let stepsHtml = '';
    act.steps.forEach((st) => {
      const stepContent = st.content.map((p) => `<p style="margin-left: 20pt; text-align: justify;">${p}</p>`).join('');
      stepsHtml += `
        <p style="margin-top: 6pt; margin-bottom: 2pt;"><strong>+ ${st.stepName} (${st.roleTag}):</strong></p>
        ${stepContent}
      `;
    });

    activitiesHtml += `
      <div style="margin-top: 10pt; margin-bottom: 8pt;">
        <p style="text-transform: uppercase; font-weight: bold; color: #0f172a; margin-bottom: 2pt;">
          ${act.title}
        </p>
        <p style="margin-left: 10pt; font-style: italic; margin-bottom: 4pt;">
          <strong>* Mục tiêu:</strong> ${act.objective}
        </p>
        ${act.targetHeartRate ? `<p style="margin-left: 10pt; color: #166534; font-size: 11pt;"><em>(Chỉ số nhịp tim mục tiêu: ${act.targetHeartRate})</em></p>` : ''}
        ${stepsHtml}
      </div>
    `;
  });

  const contentHtml = `
<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
<head>
  <meta charset="utf-8">
  <title>${plan.lessonTitle}</title>
  <!--[if gte mso 9]>
  <xml>
    <w:WordDocument>
      <w:View>Print</w:View>
      <w:Zoom>100</w:Zoom>
      <w:DoNotOptimizeForBrowser/>
    </w:WordDocument>
  </xml>
  <![endif]-->
  <style>
    @page WordSection1 {
      size: 595.3pt 841.9pt; /* A4 */
      margin: 56.7pt 42.5pt 56.7pt 56.7pt; /* Top 2cm, Right 1.5cm, Bottom 2cm, Left 2cm */
      mso-header-margin: 35.4pt;
      mso-footer-margin: 35.4pt;
    }
    div.WordSection1 { page: WordSection1; }
    body {
      font-family: 'Times New Roman', Times, serif;
      font-size: 13pt;
      line-height: 1.4;
      color: #000000;
    }
    p, span, td, th, div, li {
      font-family: 'Times New Roman', Times, serif;
      font-size: 13pt;
      line-height: 1.4;
    }
    p { margin-top: 0; margin-bottom: 4pt; }
    table { width: 100%; border-collapse: collapse; }
    .header-table td { vertical-align: top; padding: 2pt; text-align: center; }
    .title-box { text-align: center; margin-top: 14pt; margin-bottom: 12pt; }
    .signature-table td {
      width: 50%;
      text-align: center;
      vertical-align: top;
      padding: 2pt;
      font-size: 13pt;
    }
  </style>
</head>
<body>
<div class="WordSection1">
  
  <!-- BẢNG TIÊU ĐỀ HÀNH CHÍNH (BẢNG KHÔNG VIỀN, 2 CỘT 2 DÒNG CĂN GIỮA, PHÔNG CHỮ 12, TUYỆT ĐỐI KHÔNG NHẢY DÒNG) -->
  <table class="header-table" style="width: 100%; border: none; border-collapse: collapse; margin-bottom: 8pt;">
    <tr>
      <td style="width: 42%; text-align: center; vertical-align: top; border: none; padding: 2pt; white-space: nowrap;">
        <p style="font-family: 'Times New Roman', Times, serif; font-size: 12pt; text-transform: uppercase; margin: 0; white-space: nowrap;">Sở GD&ĐT VĨNH LONG</p>
      </td>
      <td style="width: 58%; text-align: center; vertical-align: top; border: none; padding: 2pt; white-space: nowrap;">
        <p style="font-family: 'Times New Roman', Times, serif; font-size: 12pt; font-weight: bold; text-transform: uppercase; margin: 0; white-space: nowrap;">CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</p>
      </td>
    </tr>
    <tr>
      <td style="width: 42%; text-align: center; vertical-align: top; border: none; padding: 2pt; white-space: nowrap;">
        <p style="font-family: 'Times New Roman', Times, serif; font-size: 12pt; font-weight: bold; text-transform: uppercase; margin: 0; white-space: nowrap;">TRƯỜNG THPT HUỲNH TẤN PHÁT</p>
        <p style="font-family: 'Times New Roman', Times, serif; font-size: 10pt; margin: 0; text-align: center; white-space: nowrap;">───────</p>
      </td>
      <td style="width: 58%; text-align: center; vertical-align: top; border: none; padding: 2pt; white-space: nowrap;">
        <p style="font-family: 'Times New Roman', Times, serif; font-size: 12pt; font-weight: bold; margin: 0; white-space: nowrap;">Độc lập - Tự do - Hạnh phúc</p>
        <p style="font-family: 'Times New Roman', Times, serif; font-size: 10pt; margin: 0; text-align: center; white-space: nowrap;">───────────</p>
      </td>
    </tr>
  </table>

  <!-- TIÊU ĐỀ KẾ HOẠCH BÀI DẠY (TIMES NEW ROMAN CỠ CHỮ 13 - 14) -->
  <div class="title-box">
    <p style="font-size: 14pt; font-weight: bold; text-transform: uppercase;">KẾ HOẠCH BÀI DẠY</p>
    <p style="font-size: 13pt; font-style: italic;">(Theo Công văn số 5512/BGDĐT-GDTrH và Công văn số 7791/BGDĐT)</p>
    <p style="font-size: 13pt; margin-top: 6pt;">
      <strong>Môn học:</strong> ${plan.subjectName} | <strong>Lớp:</strong> Khối ${plan.grade} (${plan.className})
    </p>
    <p style="font-size: 13pt; font-weight: bold; text-transform: uppercase; margin-top: 4pt; color: #047857;">
      TÊN BÀI DẠY: ${plan.lessonTitle}
    </p>
    <p style="font-size: 13pt;">
      <strong>Thời lượng:</strong> ${plan.durationText}
    </p>
    <p style="font-size: 13pt; font-style: italic; color: #1e293b;">
      <strong>Căn cứ SGK:</strong> ${plan.sgkReference}
    </p>
  </div>

  <hr style="border: 0; border-top: 1px solid #000; margin-bottom: 10pt;" />

  <!-- I. MỤC TIÊU BÀI DẠY -->
  <p style="font-weight: bold; font-size: 13pt; text-transform: uppercase; margin-top: 8pt;">
    I. MỤC TIÊU BÀI DẠY:
  </p>
  
  <p style="font-weight: bold; font-size: 13pt; margin-left: 10pt; margin-top: 4pt;">1. Năng lực đặc thù:</p>
  <p style="margin-left: 20pt; text-align: justify; font-size: 13pt;">- <em>Năng lực chăm sóc sức khỏe:</em> ${plan.objectives.specificCompetencies.healthCare}</p>
  <p style="margin-left: 20pt; text-align: justify; font-size: 13pt;">- <em>Năng lực vận động cơ bản:</em> ${plan.objectives.specificCompetencies.basicMotor}</p>
  <p style="margin-left: 20pt; text-align: justify; font-size: 13pt;">- <em>Năng lực hoạt động TDTT:</em> ${plan.objectives.specificCompetencies.sportsActivities}</p>

  <p style="font-weight: bold; font-size: 13pt; margin-left: 10pt; margin-top: 4pt;">2. Năng lực chung:</p>
  <p style="margin-left: 20pt; text-align: justify; font-size: 13pt;">- <em>Tự chủ và tự học:</em> ${plan.objectives.generalCompetencies.selfControl}</p>
  <p style="margin-left: 20pt; text-align: justify; font-size: 13pt;">- <em>Giao tiếp và hợp tác:</em> ${plan.objectives.generalCompetencies.communication}</p>

  <p style="font-weight: bold; font-size: 13pt; margin-left: 10pt; margin-top: 4pt;">3. Năng lực số & AI:</p>
  <p style="margin-left: 20pt; text-align: justify; font-size: 13pt;">${plan.objectives.digitalAndAiCompetency}</p>

  <p style="font-weight: bold; font-size: 13pt; margin-left: 10pt; margin-top: 4pt;">4. Phẩm chất chủ yếu:</p>
  <p style="margin-left: 20pt; font-size: 13pt;">- <em>Chăm chỉ:</em> ${plan.objectives.qualities.diligence}</p>
  <p style="margin-left: 20pt; font-size: 13pt;">- <em>Trung thực:</em> ${plan.objectives.qualities.honesty}</p>
  <p style="margin-left: 20pt; font-size: 13pt;">- <em>Đoàn kết & trách nhiệm:</em> ${plan.objectives.qualities.solidarity}</p>

  <!-- II. THIẾT BỊ DẠY HỌC & HỌC LIỆU -->
  <p style="font-weight: bold; font-size: 13pt; text-transform: uppercase; margin-top: 12pt;">
    II. THIẾT BỊ DẠY HỌC & HỌC LIỆU:
  </p>
  <p style="margin-left: 10pt; font-size: 13pt;">- <strong>Giáo viên:</strong> ${plan.equipment.teacherTools.join('; ')}</p>
  <p style="margin-left: 10pt; font-size: 13pt;">- <strong>Học sinh:</strong> ${plan.equipment.studentTools.join('; ')}</p>
  <p style="margin-left: 10pt; font-size: 13pt;">- <strong>Học liệu số & AI:</strong> ${plan.equipment.digitalAndAiTools.join('; ')}</p>

  <!-- III. TIẾN TRÌNH DẠY HỌC -->
  <p style="font-weight: bold; font-size: 13pt; text-transform: uppercase; margin-top: 12pt;">
    III. TIẾN TRÌNH DẠY HỌC (CHUẨN CÔNG VĂN 5512/BGDĐT):
  </p>
  ${activitiesHtml}

  <!-- IV. PHÊ DUYỆT VÀ CHỮ KÝ - ĐỒNG ĐỀU NGANG NHAU (TIMES NEW ROMAN CỠ 13, TUYỆT ĐỐI KHÔNG NHẢY DÒNG, VỪA VẶN CHỮ KÝ) -->
  <table class="signature-table" style="margin-top: 18pt; width: 100%; border: none; border-collapse: collapse;">
    <!-- HÀNG 1: ĐỊA DANH VÀ NGÀY THÁNG - XÃ CHÂU HƯNG XUẤT HIỆN NƠI KÝ XÁC NHẬN CỦA TỔ TRƯỞNG THEO THỂ THỨC HÀNH CHÍNH -->
    <tr>
      <td style="width: 50%; text-align: center; vertical-align: top; font-style: italic; padding-bottom: 2pt; font-size: 13pt; border: none; white-space: nowrap;">
        ${schoolLocation || 'xã Châu Hưng'}, ngày ${planDay || '...'} tháng ${planMonth || '...'} năm ${planYear || '20...'}
      </td>
      <td style="width: 50%; text-align: center; vertical-align: top; font-style: italic; padding-bottom: 2pt; font-size: 13pt; border: none; white-space: nowrap;">
        ${schoolLocation || 'xã Châu Hưng'}, ngày ${planDay || '...'} tháng ${planMonth || '...'} năm ${planYear || '20...'}
      </td>
    </tr>
    <!-- HÀNG 2: CHỨC DANH -->
    <tr>
      <td style="font-weight: bold; text-transform: uppercase; padding: 2pt; font-size: 13pt; text-align: center; border: none; white-space: nowrap;">
        TỔ TRƯỞNG
      </td>
      <td style="font-weight: bold; text-transform: uppercase; padding: 2pt; font-size: 13pt; text-align: center; border: none; white-space: nowrap;">
        GIÁO VIÊN SOẠN BÀI
      </td>
    </tr>
    <!-- HÀNG 3: CHÚ THÍCH -->
    <tr>
      <td style="font-style: italic; font-size: 13pt; padding: 1pt; text-align: center; border: none; white-space: nowrap;">
        (Ký và ghi rõ họ tên)
      </td>
      <td style="font-style: italic; font-size: 13pt; padding: 1pt; text-align: center; border: none; white-space: nowrap;">
        (Ký và ghi rõ họ tên)
      </td>
    </tr>
    <!-- HÀNG 4: KHOẢNG TRỐNG KÝ TÊN - VỪA VẶN CHỮ KÝ (38pt) -->
    <tr>
      <td style="height: 38pt; vertical-align: bottom; font-size: 12pt; text-align: center; border: none;">
        &nbsp;
      </td>
      <td style="height: 38pt; vertical-align: bottom; font-size: 12pt; text-align: center; border: none;">
        &nbsp;
      </td>
    </tr>
    <!-- HÀNG 5: HỌ VÀ TÊN - CÙNG 1 DÒNG TRONG TABLE, TUYỆT ĐỐI NGANG NHAU -->
    <tr>
      <td style="font-weight: bold; font-size: 13pt; text-align: center; padding-top: 2pt; border: none; white-space: nowrap;">
        ${ttcmName}
      </td>
      <td style="font-weight: bold; font-size: 13pt; text-align: center; padding-top: 2pt; border: none; white-space: nowrap;">
        ${teacherName}
      </td>
    </tr>
  </table>

</div>
</body>
</html>
  `;

  // Create downloadable Blob for Microsoft Word (.doc)
  const blob = new Blob(['\ufeff' + contentHtml], {
    type: 'application/msword;charset=utf-8'
  });

  const safeFileName = `KHBD_${plan.lessonTitle.replace(/[^a-zA-Z0-9À-ỹ]/g, '_')}_Khoi_${plan.grade}.doc`;
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = safeFileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
