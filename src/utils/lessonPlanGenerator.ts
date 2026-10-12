import { DetailedKHBDPlan, SportKey, GradeLevel, LessonDiagramImage } from '../types';

interface GenerateKHBDParams {
  schoolName: string;
  schoolLocation?: string;
  subjectName: string;
  grade: GradeLevel;
  gradeBlock?: string;
  className: string;
  lessonTitle: string;
  durationOption: '1 tiết' | '2 tiết';
  teacherName: string;
  ttcmName?: string;
  sgkReference: string;
  sportKey: SportKey;
  aiFocusType?: 'tracking' | 'cardio' | 'form';
  customPrompt?: string;
  existingImages?: LessonDiagramImage[];
}

export function generateStandardKHBD(params: GenerateKHBDParams): DetailedKHBDPlan {
  const {
    schoolName = 'THPT Huỳnh Tấn Phát',
    schoolLocation = 'xã Châu Hưng',
    subjectName = 'Giáo dục Thể chất',
    grade = '10',
    gradeBlock = `Khối ${params.grade || '10'}`,
    className = '10A1',
    lessonTitle,
    durationOption = '1 tiết',
    teacherName = 'Nguyễn Trung Hiếu',
    ttcmName = 'Nguyễn Tấn Phước',
    sgkReference,
    sportKey = 'bong-ro',
    aiFocusType = 'tracking',
    customPrompt = '',
    existingImages = []
  } = params;

  // Xử lý Căn cứ SGK bám sát theo Khối lớp dạy (dạy lớp 10 thì căn cứ SGK 10, lớp 11 căn cứ SGK 11, lớp 12 căn cứ SGK 12)
  let resolvedSgkRef = sgkReference?.trim();
  if (!resolvedSgkRef) {
    resolvedSgkRef = `SGK Giáo dục Thể chất ${grade} - Bộ sách Kết nối tri thức với cuộc sống`;
  } else {
    // Nếu tham chiếu có chứa số khối lệch với khối đang dạy (ví dụ dạy lớp 10 mà có KNTT 12 hoặc SGK 12), tự động chuẩn hóa về khối đang dạy
    if (grade === '10' && (resolvedSgkRef.includes('12') || resolvedSgkRef.includes('11'))) {
      resolvedSgkRef = resolvedSgkRef.replace(/\b12\b/g, '10').replace(/\b11\b/g, '10');
    } else if (grade === '11' && (resolvedSgkRef.includes('12') || resolvedSgkRef.includes('10'))) {
      resolvedSgkRef = resolvedSgkRef.replace(/\b12\b/g, '11').replace(/\b10\b/g, '11');
    } else if (grade === '12' && (resolvedSgkRef.includes('10') || resolvedSgkRef.includes('11'))) {
      resolvedSgkRef = resolvedSgkRef.replace(/\b10\b/g, '12').replace(/\b11\b/g, '12');
    }
  }

  const isDoublePeriod = durationOption === '2 tiết';
  const durationText = isDoublePeriod ? '2 tiết (Thời lượng: 90 phút)' : '1 tiết (Thời lượng: 45 phút)';

  // Determine sport display name
  const sportNames: Record<SportKey, string> = {
    'bong-chuyen': 'Bóng chuyền',
    'bong-ro': 'Bóng rổ',
    'cau-long': 'Cầu lông',
    'bong-da': 'Bóng đá',
    'da-cau': 'Đá cầu'
  };
  const sportName = sportNames[sportKey] || 'Giáo dục Thể chất';

  // 1. Objectives Formulation
  const healthCare = `Biết chủ động vệ sinh sân tập trường ${schoolName} (Điểm trường ${schoolLocation}), kiểm tra an toàn dụng cụ và trang phục; biết theo dõi sức khỏe và tiền sử bệnh nền cá nhân (hen suyễn, tim mạch nhẹ, đau mỏi khớp gối); biết tự đo và kiểm soát nhịp tim; thực hiện hồi tĩnh và bù khoáng đúng cách với nước dừa tươi Bến Tre sau khi vận động ra mồ hôi.`;

  const basicMotor = `Nắm vững yếu lĩnh kỹ thuật cơ bản của bài dạy "${lessonTitle}"; phối hợp nhịp nhàng giữa bước di chuyển, tư thế trọng tâm và động tác phát lực tay/chân; sửa được các lỗi sai phổ biến (đặt sai chân trụ, vung tay cứng nhắc, nhảy tiếp đất gối thẳng trên sân xi măng).`;

  const sportsActivities = `Biết quan sát tranh ảnh kỹ thuật và video thị phạm 3D; tự giác phối hợp tập luyện cá nhân, cặp đôi và theo nhóm; biết vận dụng kỹ thuật vào các trò chơi vận động bổ trợ và tình huống thi đấu tập đúng luật môn ${sportName}.`;

  const selfControl = `Chủ động tìm hiểu nội dung bài học trong SGK và học liệu số trước giờ lên lớp; tự giác hoàn thành số lần lặp lại động tác theo yêu cầu của giáo viên; biết tự đánh giá và điều chỉnh mức độ gắng sức phù hợp với thể trạng cá nhân.`;

  const communication = `Biết phân công nhiệm vụ và phối hợp ăn ý với bạn cùng cặp, cùng tổ; sử dụng ngôn ngữ thể thao chuẩn xác để trao đổi, góp ý và tương trợ bạn học còn yếu kỹ thuật cùng tiến bộ.`;

  let digitalAndAiCompetency = '';
  if (aiFocusType === 'cardio') {
    digitalAndAiCompetency = `Học sinh biết sử dụng thiết bị đo nhịp tim (Smartband / app cảm biến quang học trên smartphone) để đo nhịp tim trước, trong và sau giờ học; biết nhận diện ngưỡng nhịp tim an toàn (115 - 135 bpm) nhằm cảnh báo nguy cơ quá tải vận động.`;
  } else if (aiFocusType === 'form') {
    digitalAndAiCompetency = `Học sinh biết ứng dụng mô hình trí tuệ nhân tạo nhận diện tư thế (MediaPipe Pose Estimation) để đối chiếu khung xương chuyển động cơ thể với hình ảnh kỹ thuật mẫu; phát hiện góc lệch khớp gối và góc vung tay sai lệch để tự điều chỉnh.`;
  } else {
    digitalAndAiCompetency = `Học sinh biết sử dụng smartphone quay video chuyển động ở chế độ quay chậm 60fps (Slow-motion), ứng dụng công cụ AI Motion Tracking để phân tích góc vung tay/chân, quỹ đạo bay của bóng/cầu và đối chiếu với hình ảnh minh họa kỹ thuật chuẩn của bài học.`;
  }

  const diligence = `Tích cực, kiên trì luyện tập vượt khó; nỗ lực hoàn thành khối lượng bài tập theo phân hóa thể lực trên sân tập.`;
  const honesty = `Trung thực trong luyện tập, tự giác thực hiện đủ số lần quy định, khách quan khi đánh giá đồng đẳng và chấm điểm kỹ thuật cho bạn học.`;
  const solidarity = `Có tinh thần đoàn kết, tương trợ bạn học có thể lực yếu hoặc thừa cân; có trách nhiệm giữ gìn an toàn sân bãi và bảo quản dụng cụ tập luyện của nhà trường.`;

  // 2. Equipment
  const teacherTools = [
    `Địa điểm & Sân bãi: Sân tập GDTC trường ${schoolName} (Điểm trường ${schoolLocation}) - mặt sân sạch sẽ, thông thoáng, bảo đảm an toàn.`,
    `Còi chỉ huy, đồng hồ bấm giờ sư phạm, bảng kế hoạch bài dạy số hóa trên máy tính bảng/smartphone.`,
    `Dụng cụ chuyên môn môn ${sportName}: Lưới đạt chuẩn, bóng/cầu thi đấu đủ cơ số cho các tổ học tập.`,
    `Tranh ảnh kỹ thuật giải phẫu động tác in màu khổ lớn và video thị phạm chuyển động 3D.`,
    `Cọc tiêu zíc zắc (4 - 6 cọc), vạch kẻ sân và khu vực trạm phân luồng giảm tải thể trạng.`
  ];

  const studentTools = [
    `Trang phục thể dục đúng quy định của trường ${schoolName}, giày bata hoặc giày thể thao đế bám tốt.`,
    `Khăn lau mồ hôi, bình nước cá nhân (nước lọc ấm hoặc nước dừa tươi bù khoáng).`,
    `Học sinh có bệnh lý nền (hen phế quản) mang theo bình thuốc xịt cá nhân theo chỉ định y tế.`
  ];

  const digitalAndAiTools = [
    `Smartphone / tablet của nhóm học tập cài đặt ứng dụng quay chậm 60fps và công cụ AI Motion Tracking.`,
    `Bảng theo dõi số hóa chỉ số thể trạng BMI và nhịp tim học sinh của lớp ${className}.`
  ];

  // 3. Process Activities (4 activities strictly following 4 steps)
  
  // Activity 1: Mở đầu / Khởi động
  const act1Time = isDoublePeriod ? '10 - 15 phút' : '5 - 10 phút';
  const act1Steps = [
    {
      stepNumber: 1 as const,
      stepName: 'Bước 1: Chuyển giao nhiệm vụ',
      roleTag: 'GV',
      content: [
        `- Tập hợp lớp theo đội hình 4 hàng ngang so le (cự ly 1 sải tay theo sơ đồ đội hình kèm theo).`,
        `- Phổ biến mục tiêu, nội dung bài dạy: "${lessonTitle}", yêu cầu thái độ tập luyện và an toàn sân bãi.`,
        `- Giao nhiệm vụ cho Cán sự lớp điều khiển lớp khởi động chung; giao nhiệm vụ kiểm tra sức khỏe, rà soát học sinh có bệnh nền nhẹ (hen suyễn, tim mạch, đau mỏi gối).`,
        `- Yêu cầu học sinh mở ứng dụng đo nhịp tim ban đầu (nhịp tim nghỉ ngơi: 75 - 85 bpm).`
      ]
    },
    {
      stepNumber: 2 as const,
      stepName: 'Bước 2: Thực hiện nhiệm vụ',
      roleTag: 'HS',
      content: [
        `- Cán sự lớp điều khiển cả lớp chạy nhẹ nhàng 2 vòng quanh sân trường (khoảng 200m).`,
        `- Thực hiện khởi động chung xoay các khớp: cổ tay, cổ chân, khuỷu tay, bả vai, hông, gối; ép dẻo dọc, ép dẻo ngang với biên độ tăng dần.`,
        `- *Lưu ý phân hóa:* Học sinh thừa cân/đau mỏi gối đặt hai tay lên đùi để đỡ tải, không ngồi xổm sâu trên mặt sân bê tông cứng.`,
        `- Thực hiện khởi động chuyên môn môn ${sportName}: chạy bước nhỏ, nâng cao đùi nhẹ nhàng, trò chơi vận động làm nóng cơ thể.`
      ]
    },
    {
      stepNumber: 3 as const,
      stepName: 'Bước 3: Báo cáo, thảo luận',
      roleTag: 'HS/Cán sự/GV',
      content: [
        `- Cán sự lớp báo cáo tình hình hoàn thành bài khởi động và sĩ số của lớp với giáo viên.`,
        `- Các học sinh có biểu hiện mệt mỏi, khó thở hoặc đau khớp chủ động giơ tay báo cáo tình trạng với GV để chuyển sang trạm vận động thích ứng.`
      ]
    },
    {
      stepNumber: 4 as const,
      stepName: 'Bước 4: Kết luận, nhận định',
      roleTag: 'GV',
      content: [
        `- Giáo viên nhận xét tinh thần, tác phong khởi động của học sinh (đạt nhịp tim mục tiêu 105 - 120 bpm).`,
        `- Nhắc nhở các trường hợp xoay khớp chưa đủ biên độ; bố trí vị trí tập luyện phù hợp cho học sinh cần giảm tải.`
      ]
    }
  ];

  // Activity 2: Hình thành kiến thức mới
  const act2Time = isDoublePeriod ? '20 - 25 phút' : '10 - 15 phút';
  const act2Steps = [
    {
      stepNumber: 1 as const,
      stepName: 'Bước 1: Chuyển giao nhiệm vụ',
      roleTag: 'GV',
      content: [
        `- Giáo viên giới thiệu tên kỹ thuật: "${lessonTitle}", phân tích vị trí và tầm quan trọng của kỹ thuật trong thi đấu môn ${sportName}.`,
        `- Cho học sinh quan sát Hình ảnh minh họa kỹ thuật sinh cơ học (đính kèm trong KHBD) kết hợp chiếu clip thị phạm chuyển động 3D.`,
        `- Giáo viên thị phạm hoàn chỉnh động tác mẫu 2 - 3 lần ở tốc độ bình thường và tốc độ quay chậm từ các góc nhìn khác nhau (trực diện và góc nghiêng).`,
        `- Nêu các câu hỏi định hướng: "Điểm tiếp xúc bóng/cầu ở đâu?", "Góc gập của khớp gối và khuỷu tay như thế nào?", "Lực phát ra từ bộ phận nào trước?".`
      ]
    },
    {
      stepNumber: 2 as const,
      stepName: 'Bước 2: Thực hiện nhiệm vụ',
      roleTag: 'HS',
      content: [
        `- Học sinh tập trung quan sát giáo viên làm mẫu, đối chiếu với tranh ảnh giải phẫu kỹ thuật.`,
        `- Thực hiện mô phỏng động tác không bóng tại chỗ 5 - 10 lần theo khẩu lệnh chỉ huy chậm của giáo viên để định hình đường vung tay và bộ chân.`,
        `- Cặp đôi quan sát lẫn nhau, hỗ trợ chỉ ra cảm giác tiếp xúc bóng/cầu đúng vị trí.`
      ]
    },
    {
      stepNumber: 3 as const,
      stepName: 'Bước 3: Báo cáo, thảo luận',
      roleTag: 'HS/Cán sự/GV',
      content: [
        `- Giáo viên gọi 2 học sinh (1 nam, 1 nữ) lên thực hiện lại động tác mô phỏng trước lớp.`,
        `- Các học sinh bên dưới quan sát, thảo luận và nhận xét về: tư thế chuẩn bị, góc vung tay và điểm chạm bóng so với Hình ảnh kỹ thuật chuẩn.`
      ]
    },
    {
      stepNumber: 4 as const,
      stepName: 'Bước 4: Kết luận, nhận định',
      roleTag: 'GV',
      content: [
        `- Giáo viên nhận xét, chốt lại yếu lĩnh cốt lõi của động tác; giải thích cơ chế lực (Đạp chân -> Xoay thân -> Vung tay đón bóng).`,
        `- Chỉ rõ các sai lầm học sinh thường mắc: đặt sai chân trụ, gồng cứng cổ tay, không hoãn xung khi tiếp đất gây áp lực lên khớp gối trên sân xi măng.`
      ]
    }
  ];

  // Activity 3: Luyện tập
  const act3Time = isDoublePeriod ? '35 - 40 phút' : '15 - 20 phút';
  const act3Steps = [
    {
      stepNumber: 1 as const,
      stepName: 'Bước 1: Chuyển giao nhiệm vụ',
      roleTag: 'GV',
      content: [
        `- Giáo viên chia lớp thành các tổ luyện tập theo sơ đồ phân làn sân bãi (Hình minh họa đính kèm):`,
        `  + Luyện tập cá nhân: Tập tiếp xúc bóng/cầu treo cố định hoặc đánh bóng vào tường cự ly 3 - 5m (10 - 15 lần).`,
        `  + Luyện tập cặp đôi: Đứng đối diện cự ly 3 - 4m luân phiên tung và thực hiện kỹ thuật (15 - 20 lần/học sinh).`,
        `  + Luyện tập tổ/nhóm: Phối hợp di chuyển thực hiện kỹ thuật qua lưới / cọc tiêu.`,
        `- *Nhiệm vụ Năng lực số & AI:* Mỗi cặp đôi sử dụng điện thoại quay lại 1 đoạn video 10 - 15 giây chế độ Slow-motion 60fps để tự phân tích góc vung tay.`,
        `- *Nhiệm vụ phân hóa thể trạng:* Nhóm thừa cân / đau khớp gối tập trung vào kỹ thuật tại chỗ, bước lướt ngắn (3m), không nhảy tiếp đất liên tục.`
      ]
    },
    {
      stepNumber: 2 as const,
      stepName: 'Bước 2: Thực hiện nhiệm vụ',
      roleTag: 'HS',
      content: [
        `- Các tổ vào vị trí quy định trên sân tập trường ${schoolName}, triển khai luyện tập nghiêm túc theo khẩu lệnh còi.`,
        `- Các cặp đôi luân phiên thực hiện kỹ thuật và hỗ trợ cầm điện thoại ghi hình chuyển động cho bạn.`,
        `- Nhóm học sinh thừa cân tập luyện tại trạm giảm tải tải trọng cơ gối; nhóm thể lực yếu được nghỉ ngơi ngắt quãng 2 phút giữa các đợt tập.`,
        `- Giáo viên quan sát bao quát toàn sân, trực tiếp uốn nắn, sửa sai tư thế cho từng học sinh.`
      ]
    },
    {
      stepNumber: 3 as const,
      stepName: 'Bước 3: Báo cáo, thảo luận',
      roleTag: 'HS/Cán sự/GV',
      content: [
        `- Nhóm trưởng từng tổ báo cáo số lượng thực hiện và mức độ thành thạo của các thành viên trong tổ.`,
        `- Đại diện cặp đôi mở đoạn video Slow-motion vừa quay trên điện thoại, chỉ ra điểm chạm bóng và góc vung tay đã chuẩn hay còn lỗi so với Hình ảnh kỹ thuật mẫu.`
      ]
    },
    {
      stepNumber: 4 as const,
      stepName: 'Bước 4: Kết luận, nhận định',
      roleTag: 'GV',
      content: [
        `- Giáo viên biểu dương các cặp đôi có tinh thần tự giác cao và ứng dụng tốt video AI để tự sửa sai.`,
        `- Trực tiếp sửa lỗi kỹ thuật chung của cả lớp; nhắc nhở học sinh điều hòa nhịp thở và kiểm tra nhịp tim sau bài tập luyện.`
      ]
    }
  ];

  // Activity 4: Vận dụng & Kết thúc
  const act4Time = '5 phút';
  const act4Steps = [
    {
      stepNumber: 1 as const,
      stepName: 'Bước 1: Chuyển giao nhiệm vụ',
      roleTag: 'GV',
      content: [
        `- Tập hợp lớp về đội hình 4 hàng ngang giãn cách.`,
        `- Hướng dẫn các động tác thả lỏng hồi tĩnh: rũ tay, rung lắc cơ đùi, thả lỏng bắp chuối, bài tập thở sâu dưỡng sinh 4 thì.`,
        `- Giao nhiệm vụ tự học tại nhà và câu hỏi vận động: "Làm thế nào để ứng dụng kỹ thuật này khi thi đấu tập trong các buổi rèn luyện ngoại khóa?".`,
        `- Hướng dẫn chế độ dinh dưỡng phục hồi vùng nông thôn Bến Tre (uống nước dừa xiêm tươi sau 15 phút, ăn đủ đạm cá sông/trứng vườn).`
      ]
    },
    {
      stepNumber: 2 as const,
      stepName: 'Bước 2: Thực hiện nhiệm vụ',
      roleTag: 'HS',
      content: [
        `- Học sinh thực hiện các động tác thả lỏng toàn thân theo nhịp đếm chậm của giáo viên.`,
        `- Thực hành hít thở sâu 4 thì (hít vào 3s - giữ hơi 2s - thở ra từ từ 4s - nghỉ 2s) để đưa nhịp tim từ từ hạ xuống dưới 95 bpm.`,
        `- Lắng nghe và ghi nhớ nhiệm vụ tự rèn luyện tại nhà.`
      ]
    },
    {
      stepNumber: 3 as const,
      stepName: 'Bước 3: Báo cáo, thảo luận',
      roleTag: 'HS/Cán sự/GV',
      content: [
        `- Học sinh trả lời nhanh câu hỏi vận dụng của giáo viên về tình huống thực tế khi chơi thể thao.`,
        `- Học sinh tự kiểm tra lại chỉ số nhịp tim hồi phục sau bài tập và báo cáo với cán sự lớp.`
      ]
    },
    {
      stepNumber: 4 as const,
      stepName: 'Bước 4: Kết luận, nhận định',
      roleTag: 'GV',
      content: [
        `- Giáo viên tổng kết, đánh giá mức độ đạt được mục tiêu của tiết học theo Thông tư 22/BGDĐT.`,
        `- Biểu dương tinh thần đoàn kết, nỗ lực của học sinh lớp ${className}, đặc biệt khen ngợi các em thừa cân/thể lực yếu đã kiên trì hoàn thành bài tập.`,
        `- Phân công học sinh thu dọn dụng cụ sân bãi gọn gàng vào kho thể dục và giải tán lớp học.`
      ]
    }
  ];

  // Add custom prompt adaptations if teacher supplied one
  if (customPrompt.trim()) {
    act3Steps[0].content.push(`- *Ghi chú điều chỉnh riêng của giáo viên:* ${customPrompt.trim()}`);
  }

  // Ensure default diagrams exist
  let images = existingImages;
  if (!images || images.length === 0) {
    if (sportKey === 'bong-chuyen') {
      images = [
        {
          id: 'diag-bc-tech',
          title: 'Hình 1: Sơ đồ minh họa kỹ thuật động tác sinh cơ học (Bóng chuyền)',
          caption: 'Minh họa góc tiếp xúc bóng, góc mở khuỷu tay 110°, độ gập gối 135° và quỹ đạo bóng bay bổng qua mép lưới.',
          type: 'biomechanics',
          svgType: 'volleyball-serve-low'
        },
        {
          id: 'diag-bc-court',
          title: 'Hình 2: Sơ đồ tổ chức đội hình luyện tập & phân luồng thể trạng sân bãi',
          caption: 'Bố trí 4 hàng ngang so le cự ly 1 sải tay (2m), phân làn trạm chuẩn, trạm giảm tải gối và vị trí camera AI 60fps.',
          type: 'formation',
          svgType: 'court-formation'
        }
      ];
    } else if (sportKey === 'bong-ro') {
      images = [
        {
          id: 'diag-br-tech',
          title: 'Hình 1: Quỹ đạo Parabol góc phóng 48° - 52° vào vành rổ 3.05m',
          caption: 'Động tác phát lực: Gập miết cổ tay, giải phóng bóng tại đỉnh cao bước nhảy, bóng xoay ngược bay vào rổ.',
          type: 'technique',
          svgType: 'basketball-shoot'
        },
        {
          id: 'diag-br-court',
          title: 'Hình 2: Sơ đồ cọc tiêu zíc zắc và đội hình tập luyện bóng rổ',
          caption: 'Bố trí cọc tiêu zíc zắc cách nhau 2.5m, học sinh phân luồng 2 hàng di chuyển an toàn.',
          type: 'formation',
          svgType: 'court-formation'
        }
      ];
    } else if (sportKey === 'cau-long') {
      images = [
        {
          id: 'diag-cl-court',
          title: 'Hình 1: Sơ đồ bộ bước di chuyển 4 góc sân cầu lông',
          caption: 'Minh họa vị trí TTCB trung tâm đón cầu và 4 hướng bước chân: tiến phải, tiến trái, lùi bật nhảy phải, lùi trái.',
          type: 'court',
          svgType: 'badminton-court'
        },
        {
          id: 'diag-cl-form',
          title: 'Hình 2: Sơ đồ tổ chức tập luyện phân luồng trên sân trường',
          caption: 'Đội hình tập trung 4 hàng ngang cự ly 1 sải tay, trạm tập ve cầu và trạm phân tích video AI.',
          type: 'formation',
          svgType: 'court-formation'
        }
      ];
    } else {
      images = [
        {
          id: 'diag-default-form',
          title: 'Hình 1: Sơ đồ tổ chức đội hình luyện tập & phân luồng thể trạng',
          caption: 'Đội hình tập trung 4 hàng ngang giãn cách, trạm kỹ thuật chính và trạm thích ứng thể lực.',
          type: 'formation',
          svgType: 'court-formation'
        }
      ];
    }
  }

  return {
    schoolName,
    schoolLocation,
    subjectName,
    grade,
    gradeBlock,
    className,
    lessonTitle,
    durationOption,
    durationText,
    teacherName,
    ttcmName,
    sgkReference: resolvedSgkRef,
    sportKey,
    objectives: {
      specificCompetencies: {
        healthCare,
        basicMotor,
        sportsActivities
      },
      generalCompetencies: {
        selfControl,
        communication
      },
      digitalAndAiCompetency,
      qualities: {
        diligence,
        honesty,
        solidarity
      }
    },
    equipment: {
      teacherTools,
      studentTools,
      digitalAndAiTools
    },
    activities: [
      {
        id: 'act-1',
        activityNumber: 1,
        title: 'Hoạt động 1: Mở đầu / Khởi động (5 - 10 phút)',
        timeRange: act1Time,
        targetHeartRate: 'Nhịp tim mục tiêu: 105 - 120 bpm',
        objective: 'Tạo tâm thế tích cực, làm nóng các nhóm cơ lớn, kích hoạt hệ tuần hoàn và rà soát an toàn sức khỏe học sinh.',
        steps: act1Steps
      },
      {
        id: 'act-2',
        activityNumber: 2,
        title: 'Hoạt động 2: Hình thành kiến thức mới (10 - 15 phút)',
        timeRange: act2Time,
        objective: 'Học sinh nắm vững tư thế chuẩn bị, yếu lĩnh kỹ thuật cơ bản và nhận diện được điểm tiếp xúc bóng/cầu chuẩn xác.',
        steps: act2Steps
      },
      {
        id: 'act-3',
        activityNumber: 3,
        title: 'Hoạt động 3: Luyện tập (15 - 20 phút)',
        timeRange: act3Time,
        targetHeartRate: 'Nhịp tim mục tiêu: 125 - 145 bpm (Phân hóa thể lực)',
        objective: 'Thực hành thuần thục kỹ thuật cá nhân và cặp đôi; tích hợp quay video AI slow-motion để tự đối chiếu sửa sai.',
        steps: act3Steps
      },
      {
        id: 'act-4',
        activityNumber: 4,
        title: 'Hoạt động 4: Vận dụng & Kết thúc (5 phút)',
        timeRange: act4Time,
        targetHeartRate: 'Nhịp tim hạ nhiệt: < 95 bpm',
        objective: 'Hồi tĩnh thả lỏng toàn thân, củng cố kiến thức, đánh giá xếp loại theo TT22 và hướng dẫn dinh dưỡng học đường tại nhà.',
        steps: act4Steps
      }
    ],
    images
  };
}
