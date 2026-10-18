import { LessonItem, SportKey, PPCTRow } from '../types';

export interface SportInfo {
  key: SportKey;
  name: string;
  isOfficialAtSchool: boolean;
  desc: string;
  grades: string;
}

export const SPORTS_LIST: SportInfo[] = [
  {
    key: 'bong-ro',
    name: 'Bóng rổ',
    isOfficialAtSchool: true,
    desc: 'Phân môn chính thức tại THPT Huỳnh Tấn Phát (Mặc định)',
    grades: 'K10, 11, 12'
  },
  {
    key: 'bong-chuyen',
    name: 'Bóng chuyền',
    isOfficialAtSchool: true,
    desc: 'Phân môn chính thức tại THPT Huỳnh Tấn Phát',
    grades: 'K10, 11, 12'
  },
  {
    key: 'cau-long',
    name: 'Cầu lông',
    isOfficialAtSchool: true,
    desc: 'Phân môn chính thức tại THPT Huỳnh Tấn Phát',
    grades: 'K11, 12'
  },
  {
    key: 'bong-da',
    name: 'Bóng đá',
    isOfficialAtSchool: false,
    desc: 'Danh mục GDPT 2018 tham khảo',
    grades: 'K10, 11, 12'
  },
  {
    key: 'da-cau',
    name: 'Đá cầu',
    isOfficialAtSchool: false,
    desc: 'Danh mục GDPT 2018 tham khảo',
    grades: 'K10, 11, 12'
  }
];

export const TEACHERS_LIST = [
  'Bồ Công Lâm',
  'Nguyễn Thị Hoa',
  'Nguyễn Trung Hiếu',
  'Nguyễn Tấn Phước',
  'Bùi Thanh Liêm',
  'Cao Minh Thắng',
  'Phạm Thị Ngọc Du',
  'Võ Thị Yến Lan'
];

export const LESSONS_DATABASE: Record<SportKey, LessonItem[]> = {
  'bong-chuyen': [
    {
      id: 'bc-t1',
      title: 'Sử dụng các yếu tố tự nhiên và dinh dưỡng trong rèn luyện môn Bóng chuyền',
      classRef: 'Khối 12 - Tuần 1, Tiết 1',
      sgkRef: 'KNTT 12, Tr. 4 - 10',
      grade: '12',
      sportKey: 'bong-chuyen',
      periodNumber: 1,
      durationMinutes: 45,
      week: 1,
      objective: 'Hiểu và phân tích được tác động của yếu tố tự nhiên (nắng, gió sân trường mở) và dinh dưỡng phục hồi (nước dừa tươi, đạm cá sông); biết lựa chọn thời điểm vận động an toàn.',
      newKnowledge: 'Tác động của nhiệt độ, ánh sáng ngoài trời; cơ chế mất nước và điện giải trong 45 phút; nhóm chất dinh dưỡng bù đắp năng lượng sau tiết học.',
      practice: 'Thực hành thảo luận nhóm 4 học sinh; thực hiện các bài tập thích ứng hô hấp ngoài trời và đo nhịp tim nghỉ ngơi ban đầu.',
      aiDigital: 'Học sinh sử dụng ứng dụng di động đo chỉ số UV, nhiệt độ môi trường và ghi nhận vào sổ nhật ký thể lực số.',
      safetyNote: 'Tập trong bóng râm hoặc nắng nhẹ; nhắc nhở học sinh uống nước từng ngụm nhỏ 50ml trước khi vận động.',
      assessmentCriteria: 'Chỉ ra được 3 nguyên tắc dinh dưỡng bù nước và xác định được vùng nhịp tim an toàn của bản thân.',
      images: [
        {
          id: 'img-bc-form-1',
          title: 'Sơ đồ tổ chức đội hình khởi động & đo nhịp tim',
          caption: 'Đội hình 4 hàng ngang so le cự ly 1 sải tay (2m), học sinh thừa cân/bệnh nền nhẹ bố trí hàng đầu gần giáo viên để dễ theo dõi sắc diện.',
          type: 'formation',
          svgType: 'court-formation'
        }
      ]
    },
    {
      id: 'bc-t2',
      title: 'Lập kế hoạch tập luyện cá nhân môn Bóng chuyền & Ứng dụng số hóa',
      classRef: 'Khối 12 - Tuần 1, Tiết 2',
      sgkRef: 'KNTT 12, Tr. 11 - 15',
      grade: '12',
      sportKey: 'bong-chuyen',
      periodNumber: 2,
      durationMinutes: 45,
      week: 1,
      objective: 'Biết cách xây dựng kế hoạch rèn luyện cá nhân môn bóng chuyền phù hợp với thể trạng BMI; tự đánh giá lượng vận động hàng ngày.',
      newKnowledge: 'Cấu trúc bản kế hoạch rèn luyện (mục tiêu thể lực, khối lượng, thời gian nghỉ, chỉ số BMI); các công cụ số hỗ trợ theo dõi bước chân và calo.',
      practice: 'Thực hành xây dựng thời gian biểu rèn luyện tuần trên mẫu bảng số hóa; kiểm tra nhịp tim sau bài tập khởi động 8 phút.',
      aiDigital: 'Học sinh dùng điện thoại hoặc máy tính bảng lập bảng Google Sheets / ứng dụng EduSport AI theo dõi biểu đồ tiến bộ.',
      safetyNote: 'Kế hoạch phải vừa sức, không đặt mục tiêu giảm cân đột ngột gây suy kiệt sức khỏe học sinh.',
      assessmentCriteria: 'Hoàn thành bảng kế hoạch cá nhân có đủ 5 buổi/tuần và tiêu chí an toàn sức khỏe.',
      images: [
        {
          id: 'img-bc-t2-1',
          title: 'Sơ đồ phân luồng luyện tập thể chất theo thể trạng',
          caption: 'Phân chia khu vực tập luyện trên sân trường: Làn vận động chuẩn, Làn giảm tải cơ gối, và Trạm nghỉ ngơi bù nước.',
          type: 'formation',
          svgType: 'court-formation'
        }
      ]
    },
    {
      id: 'bc-t3',
      title: 'Kĩ thuật tư thế chuẩn bị và di chuyển cơ bản (bước lướt, bước chéo)',
      classRef: 'Khối 10, 11 - Tuần 2, Tiết 3',
      sgkRef: 'KNTT 10, Tr. 29 - 33',
      grade: '10',
      sportKey: 'bong-chuyen',
      periodNumber: 3,
      durationMinutes: 45,
      week: 2,
      objective: 'Thực hiện đúng kỹ thuật TTCB tầm trung và tầm thấp; di chuyển bước lướt, bước chéo linh hoạt chuyển hướng nhanh đón bóng.',
      newKnowledge: 'TTCB: hai chân rộng bằng vai, gối khuỵu 120-135°, trọng tâm hạ thấp dồn đều nửa trước bàn chân, hai tay co tự nhiên trước ngực.',
      practice: 'Di chuyển bước lướt ngang theo cọc tiêu 3m; di chuyển bước chéo tiến lùi 4m; đổi hướng theo ám hiệu còi chỉ huy của giáo viên.',
      aiDigital: 'Camera AI ghi hình phân tích góc gập khớp gối và thời gian đổi hướng di chuyển trong vòng 1.2 giây.',
      safetyNote: 'Học sinh thừa cân hạ gối vừa phải (không ngồi xổm sâu); sân bê tông cần quét sạch cát mịn chống trơn trượt.',
      assessmentCriteria: 'Di chuyển đúng kỹ thuật bước lướt 5 lần liên tục giữ thăng bằng trọng tâm ổn định.',
      images: [
        {
          id: 'img-bc-t3-1',
          title: 'Kỹ thuật TTCB và Hoãn xung bàn tay đón bóng',
          caption: 'Tư thế chuẩn bị: gối chùng hạ trọng tâm, hai tay mở hình phễu chuẩn bị tiếp xúc bóng trước trán 15-20cm.',
          type: 'biomechanics',
          svgType: 'volleyball-pass-high'
        },
        {
          id: 'img-bc-t3-2',
          title: 'Sơ đồ cọc tiêu di chuyển bước lướt cự ly ngắn',
          caption: 'Bố trí 4 trạm di chuyển quanh sân bóng chuyền, cự ly cọc tiêu 3m phù hợp giảm áp lực sụn gối cho học sinh.',
          type: 'formation',
          svgType: 'court-formation'
        }
      ]
    },
    {
      id: 'bc-t4',
      title: 'Kĩ thuật chuyền bóng cao tay bằng hai tay',
      classRef: 'Khối 11, 12 - Tuần 2, Tiết 4',
      sgkRef: 'KNTT 11, Tr. 22 - 25',
      grade: '11',
      sportKey: 'bong-chuyen',
      periodNumber: 4,
      durationMinutes: 45,
      week: 2,
      objective: 'Thực hiện đúng động tác tay đón bóng hình chiếc phễu trước trán; phối hợp lực đạp chân, vươn thân và gập cổ tay chuyền bóng đi chuẩn xác.',
      newKnowledge: 'Điểm tiếp xúc bóng cách trán 15-20cm; các ngón tay mở tự nhiên bao quanh quả bóng, ngón cái hướng vào nhau tạo góc mở rộng.',
      practice: 'Bài 1: Chuyền bóng vào tường cự ly 2m (15 lần); Bài 2: Chuyền bóng cặp đôi tại chỗ cự ly 3m; Bài 3: Di chuyển chuyền bóng cao tay.',
      aiDigital: 'Quay video slow-motion 60fps kiểm tra hình dáng bàn tay hình phễu và góc mở khuỷu tay 100-110° khi chạm bóng.',
      safetyNote: 'Bàn tay mềm mại đón bóng, thu tay hoãn xung tránh để bóng đập thẳng gây trật khớp ngón tay.',
      assessmentCriteria: 'Chuyền bóng bổng cao hơn đầu bạn đôi cự ly 3m ít nhất 4/5 lần đạt độ chuẩn xác.',
      images: [
        {
          id: 'img-bc-t4-1',
          title: 'Mô phỏng sinh cơ học kỹ thuật Chuyền bóng cao tay',
          caption: 'Động tác phối hợp lực: Đạp chân -> Nâng hông -> Đẩy cánh tay -> Miết các ngón tay đưa bóng theo quỹ đạo vòng cung.',
          type: 'biomechanics',
          svgType: 'volleyball-pass-high'
        }
      ]
    },
    {
      id: 'bc-t5',
      title: 'Kĩ thuật phát bóng thấp tay nghiêng mình (Giai đoạn tung & vung tay)',
      classRef: 'Khối 12 - Tuần 3, Tiết 5',
      sgkRef: 'KNTT 12, Tr. 26 - 29',
      grade: '12',
      sportKey: 'bong-chuyen',
      periodNumber: 5,
      durationMinutes: 45,
      week: 3,
      objective: 'Thực hiện thuần thục tư thế đứng nghiêng với lưới; tung bóng ổn định độ cao 40-50cm và xác định chính xác điểm tiếp xúc cườm tay sau dưới bóng.',
      newKnowledge: 'TTCB: đứng nghiêng so với lưới, vai không thuận hướng lưới; tay không thuận tung bóng thẳng đứng; tay thuận vung từ sau ra trước.',
      practice: 'Bài 1: Mô phỏng không bóng (20 lần); Bài 2: Tiếp xúc bóng treo cố định; Bài 3: Tung và phát bóng vào tường cự ly 4m.',
      aiDigital: 'AI nhận diện độ cao tung bóng ổn định qua camera và đo góc mở cánh tay khi phát lực vung.',
      safetyNote: 'Khởi động kỹ khớp cổ tay và bả vai; học sinh thừa cân đứng chùng gối vừa phải để giữ thăng bằng.',
      assessmentCriteria: 'Tung bóng ổn định 5 lần liên tiếp cùng một độ cao và vung tay chạm đúng tâm cườm tay.',
      images: [
        {
          id: 'img-bc-t5-1',
          title: 'Kỹ thuật Phát bóng thấp tay nghiêng mình',
          caption: 'Minh họa góc đứng nghiêng mình với lưới, biên độ vung tay sau ra trước và quỹ đạo bóng bay bổng qua mép lưới.',
          type: 'technique',
          svgType: 'volleyball-serve-low'
        }
      ]
    },
    {
      id: 'bc-t6',
      title: 'Luyện tập phát bóng thấp tay nghiêng mình qua lưới (cự ly 6m - 9m)',
      classRef: 'Khối 12 - Tuần 3, Tiết 6',
      sgkRef: 'KNTT 12, Tr. 30 - 32',
      grade: '12',
      sportKey: 'bong-chuyen',
      periodNumber: 6,
      durationMinutes: 45,
      week: 3,
      objective: 'Phát bóng qua lưới sang sân đối phương chuẩn xác từ cự ly 6m và sau vạch phát bóng 9m; khắc phục lỗi đánh bóng rúc lưới.',
      newKnowledge: 'Tăng lực đạp chân sau và xoay hông khi chuyển cự ly từ 6m ra 9m; hướng bay của bóng hơi chếch lên trên 45°.',
      practice: 'Phát bóng qua lưới cự ly 6m (10 quả); Phát bóng sau vạch phát bóng 9m (10 quả); Thi đấu phát bóng trúng ô tính điểm.',
      aiDigital: 'Ứng dụng đo vận tốc bóng bay và tỷ lệ bóng rơi đúng vào sân đối phương tự động.',
      safetyNote: 'Quan sát khoảng cách giữa các học sinh trên vạch phát bóng để tránh va quẹt tay nhau.',
      assessmentCriteria: 'Thực hiện 5 lần phát bóng sau vạch 9m, ít nhất 3 lần bóng bay qua lưới vào sân hợp lệ.',
      images: [
        {
          id: 'img-bc-t6-1',
          title: 'Sơ đồ quỹ đạo bóng qua lưới và vạch phát bóng',
          caption: 'Quỹ đạo bóng qua lưới ở độ cao 2.24m - 2.43m, điểm rơi phân bố đều ở nửa sân đối diện.',
          type: 'technique',
          svgType: 'volleyball-serve-low'
        }
      ]
    }
  ],
  'bong-ro': [
    {
      id: 'br-t1',
      title: 'Kĩ thuật di chuyển & Kế hoạch tập luyện môn Bóng rổ',
      classRef: 'Khối 12 - Tuần 1, Tiết 1',
      sgkRef: 'KNTT 12, Tr. 11 - 15',
      grade: '12',
      sportKey: 'bong-ro',
      periodNumber: 1,
      durationMinutes: 45,
      week: 1,
      objective: 'Nắm vững tác dụng phát triển chiều cao của bóng rổ; thành thạo các bước chạy đổi hướng dẫn bóng; lập kế hoạch tập luyện tuần.',
      newKnowledge: 'Tác dụng của bóng rổ kích thích các đầu xương dài; các tư thế bảo vệ bóng trước đối phương.',
      practice: 'Chạy zíc zắc qua 5 cọc tiêu; nhồi bóng tại chỗ tay thuận và tay không thuận; thảo luận thời gian biểu.',
      aiDigital: 'Sử dụng app đếm số lần nhồi bóng liên tục trong 30 giây không mất kiểm soát.',
      safetyNote: 'Mặt sân xi măng: Giảm tốc độ ở khúc ngoặt gấp tránh trẹo cổ chân.',
      assessmentCriteria: 'Dẫn bóng qua 5 cọc tiêu đổi hướng không mất bóng trong 20 giây.',
      images: [
        {
          id: 'img-br-t1-1',
          title: 'Sơ đồ cọc tiêu zíc zắc và đội hình luyện tập bóng rổ',
          caption: 'Phân luồng 2 hàng học sinh luân phiên dẫn bóng qua cọc tiêu, cự ly cọc cách nhau 2.5m.',
          type: 'formation',
          svgType: 'court-formation'
        }
      ]
    },
    {
      id: 'br-t2',
      title: 'Kĩ thuật chuyền bóng hai tay trước ngực và chuyền bóng qua đầu',
      classRef: 'Khối 11 - Tuần 1, Tiết 2',
      sgkRef: 'KNTT 11, Tr. 18 - 22',
      grade: '11',
      sportKey: 'bong-ro',
      periodNumber: 2,
      durationMinutes: 45,
      week: 1,
      objective: 'Chuyền bóng căng phẳng đến ngực bạn học ở cự ly 3-4m; đón bóng hoãn xung êm ái bằng hai tay mở hình phễu.',
      newKnowledge: 'Lực miết của hai ngón tay cái và ngón trỏ đẩy bóng xoay ngược; tư thế chân bước tới phát lực.',
      practice: 'Chuyền bóng vào tường 15 lần; Chuyền bóng cặp đôi tại chỗ; Trò chơi chuyền bóng tiếp sức hình số 8.',
      aiDigital: 'AI Tracking đo độ căng phẳng của đường chuyền (góc hạ độ cao dưới 10cm trên quãng đường 4m).',
      safetyNote: 'Đón bóng bằng các ngón tay và lòng bàn tay khum, không duỗi thẳng các ngón đón bóng trực diện.',
      assessmentCriteria: 'Chuyền bóng chính xác vào ngực bạn 4/5 lần ở cự ly 4m.',
      images: [
        {
          id: 'img-br-t2-1',
          title: 'Kỹ thuật ném rổ Parabol và chuyền bóng',
          caption: 'Động tác phát lực: gập cổ tay, miết ngón tay đẩy bóng theo đường parabol chuẩn xác vào rổ.',
          type: 'technique',
          svgType: 'basketball-shoot'
        }
      ]
    },
    {
      id: 'br-t3',
      title: 'Kĩ thuật nhảy ném rổ một tay trên vai & Đường bay Parabol',
      classRef: 'Khối 11, 12 - Tuần 2, Tiết 3',
      sgkRef: 'KNTT 11, Tr. 31 - 35',
      grade: '11',
      sportKey: 'bong-ro',
      periodNumber: 3,
      durationMinutes: 45,
      week: 2,
      objective: 'Bật nhảy ném rổ đưa bóng vào rổ theo đường parabol vòng cung tối ưu; tiếp đất bằng hai chân an toàn.',
      newKnowledge: 'Thời điểm giải phóng bóng tại đỉnh cao nhất của bước nhảy; góc phóng lý thuyết 48° - 52°.',
      practice: 'Ném bóng cự ly 2m trước bảng rổ; Ném phạt cự ly 4.6m; Nhóm thừa cân tập ném tại chỗ không nhảy.',
      aiDigital: 'Phần mềm AI vẽ quỹ đạo đường parabol của quả bóng rổ đối chiếu với góc phóng tối ưu.',
      safetyNote: 'Học sinh tiếp đất gập sâu gối hoãn xung; nhóm thừa cân/đau gối tuyệt đối không nhảy cao liên tục.',
      assessmentCriteria: 'Bóng bay vào rổ hoặc chạm thành rổ đúng góc ít nhất 2/5 quả ở cự ly ném phạt.',
      images: [
        {
          id: 'img-br-t3-1',
          title: 'Quỹ đạo Parabol góc phóng 48° - 52° vào vành rổ 3.05m',
          caption: 'Biểu đồ quỹ đạo ném rổ tối ưu: Cánh tay tạo góc chữ L, cổ tay gập mềm mại hướng vành rổ.',
          type: 'biomechanics',
          svgType: 'basketball-shoot'
        }
      ]
    },
    {
      id: 'br-t4',
      title: 'Kĩ thuật lên rổ hai bước một tay trên vai (Layup cận rổ)',
      classRef: 'Khối 12 - Tuần 3, Tiết 5',
      sgkRef: 'KNTT 12, Tr. 22 - 26',
      grade: '12',
      sportKey: 'bong-ro',
      periodNumber: 5,
      durationMinutes: 45,
      week: 3,
      objective: 'Thực hiện chuẩn xác nhịp chân 1-2 bật nhảy đưa bóng chạm bảng vào rổ; tiếp đất bằng hai chân an toàn.',
      newKnowledge: 'Nhịp bước: Bước 1 dài đón bóng, bước 2 ngắn bật cao thẳng đứng; bóng chạm góc vuông ô vuông nhỏ trên bảng rổ.',
      practice: 'Tập nhịp bước 1-2 không bóng; Dẫn bóng 2 bước lên rổ góc 45 độ bên phải; Lên rổ bên trái; Nhóm thừa cân tập ném cận rổ không nhảy.',
      aiDigital: 'Camera AI ghi hình phân tích góc tiếp đất và nhịp giảm chấn của khớp gối.',
      safetyNote: 'Tiếp đất hoãn xung gập gối trên sân xi măng, tránh lao người vào trụ rổ.',
      assessmentCriteria: 'Thực hiện đúng nhịp chân và bóng chạm bảng vào rổ 3/5 lần.',
      images: [
        {
          id: 'img-br-t4-1',
          title: 'Kỹ thuật lên rổ 2 bước và ném bảng',
          caption: 'Quỹ đạo bật nhảy tiếp cận bảng rổ, điểm bóng chạm ô vuông bảng phụ bật vào vành.',
          type: 'technique',
          svgType: 'basketball-shoot'
        }
      ]
    },
    {
      id: 'br-t5',
      title: 'Kĩ thuật dẫn bóng đổi hướng trước mặt (Crossover) luồn cọc zíc zắc',
      classRef: 'Khối 10, 11 - Tuần 4, Tiết 7',
      sgkRef: 'KNTT 11, Tr. 28 - 32',
      grade: '11',
      sportKey: 'bong-ro',
      periodNumber: 7,
      durationMinutes: 45,
      week: 4,
      objective: 'Thành thạo kỹ thuật dẫn bóng hạ thấp trọng tâm, đổi tay qua người nhanh gọn; bảo vệ bóng bằng thân người.',
      newKnowledge: 'Hạ thấp trọng tâm xuống dưới đầu gối đối phương; đẩy bóng bật đất chữ V sang tay đối diện dứt khoát.',
      practice: 'Dẫn bóng tại chỗ chữ V; Dẫn bóng luồn qua 6 cọc tiêu zíc zắc cự ly 2m; Tập 1 kèm 1 có cản phá thụ động.',
      aiDigital: 'Đo tốc độ đổi hướng chuyển động và góc nghiêng thân người khi qua cọc tiêu.',
      safetyNote: 'Tránh vấp chân vào cọc tiêu trên sân bê tông; kiểm soát khoảng cách an toàn.',
      assessmentCriteria: 'Dẫn bóng qua 6 cọc đổi hướng trong 15 giây không mất bóng.',
      images: [
        {
          id: 'img-br-t5-1',
          title: 'Sơ đồ cọc tiêu zíc zắc và đội hình luyện tập bóng rổ',
          caption: 'Phân luồng 2 hàng học sinh dẫn bóng chữ V qua cọc tiêu zíc zắc.',
          type: 'formation',
          svgType: 'court-formation'
        }
      ]
    },
    {
      id: 'br-t6',
      title: 'Chiến thuật phòng thủ cá nhân 1-1 và phối hợp phản công nhanh',
      classRef: 'Khối 12 - Tuần 7, Tiết 13',
      sgkRef: 'KNTT 12, Tr. 45 - 49',
      grade: '12',
      sportKey: 'bong-ro',
      periodNumber: 13,
      durationMinutes: 45,
      week: 7,
      objective: 'Nắm vững tư thế phòng thủ trượt ngang; cản phá đường chuyền; phối hợp chuyền bóng phản công 2 đánh 1.',
      newKnowledge: 'Nguyên tắc phòng thủ: Luôn đứng giữa đối phương và rổ; giơ 1 tay che đường ném, 1 tay cản đường chuyền.',
      practice: 'Tập bước trượt phòng thủ theo khẩu lệnh; Bài tập 2 đánh 1 phản công nhanh; Thi đấu tập nửa sân 3x3.',
      aiDigital: 'Ứng dụng đo nhịp tim vận động gắng sức sau chuỗi bài tập phản công.',
      safetyNote: 'Không dùng cùi chỏ hoặc đẩy người từ phía sau, tuân thủ luật bóng rổ FIBA.',
      assessmentCriteria: 'Di chuyển giữ cự ly phòng thủ tốt, thực hiện phản công đúng nhịp 2/3 lần.',
      images: [
        {
          id: 'img-br-t6-1',
          title: 'Sơ đồ tổ chức đội hình luyện tập và thi đấu tập bóng rổ',
          caption: 'Bố trí nửa sân bóng rổ, khu vực 3 điểm và vị trí trọng tài học sinh.',
          type: 'formation',
          svgType: 'court-formation'
        }
      ]
    }
  ],
  'cau-long': [
    {
      id: 'cl-t1',
      title: 'Kĩ thuật di chuyển tiến chéo và lùi chéo bao quát 4 góc sân',
      classRef: 'Khối 11 - Tuần 1, Tiết 1',
      sgkRef: 'KNTT 11, Tr. 18 - 21',
      grade: '11',
      sportKey: 'cau-long',
      periodNumber: 1,
      durationMinutes: 45,
      week: 1,
      objective: 'Thành thạo bộ bước trượt và bước chéo di chuyển đến 4 góc sân cầu lông; phục hồi nhanh về TTCB trung tâm.',
      newKnowledge: 'Nguyên tắc di chuyển: Bước cuối cùng gót chạm đất trước rồi miết mũi chân; giữ thăng bằng trọng tâm khi vung vợt.',
      practice: 'Di chuyển theo khẩu lệnh chỉ huy của GV; Di chuyển nhặt cầu đặt tại 4 góc sân tiêu chuẩn trong 30 giây.',
      aiDigital: 'Camera AI ghi nhận thời gian bao quát 4 góc sân (Court Coverage) và đo tốc độ trở về vị trí trung tâm.',
      safetyNote: 'Mặt sân bê tông cần khô ráo; học sinh mang giày đế kếp/đế cao su có độ ma sát cao.',
      assessmentCriteria: 'Di chuyển đến 4 góc sân đúng bộ bước, không ngã người ra sau trong 25 giây.',
      images: [
        {
          id: 'img-cl-t1-1',
          title: 'Sơ đồ bộ bước di chuyển 4 góc sân cầu lông',
          caption: 'Minh họa vị trí TTCB trung tâm và 4 hướng bước di chuyển: tiến phải, tiến trái, lùi bật nhảy phải, lùi trái.',
          type: 'court',
          svgType: 'badminton-court'
        }
      ]
    },
    {
      id: 'cl-t2',
      title: 'Kĩ thuật bỏ nhỏ trái tay sát mép lưới',
      classRef: 'Khối 11 - Tuần 1, Tiết 2',
      sgkRef: 'KNTT 11, Tr. 39 - 42',
      grade: '11',
      sportKey: 'cau-long',
      periodNumber: 2,
      durationMinutes: 45,
      week: 1,
      objective: 'Thực hiện chính xác cách cầm vợt trái tay; ve vuốt nhẹ nhàng đưa cầu bay lướt mép trên của lưới rơi khu vực 1.98m.',
      newKnowledge: 'Ngón tay cái tì lên cạnh rộng của cán vợt; mặt vợt hơi nghiêng hoãn xung lực của quả cầu đối phương.',
      practice: 'Tập ve cầu treo cố định trước mặt; Đứng sát lưới đón và bỏ nhỏ cầu do bạn tung bổng qua lưới.',
      aiDigital: 'Dùng camera AI ghi lại điểm rơi của cầu vào ô mục tiêu 1.98m để tự động chấm điểm độ chuẩn xác.',
      safetyNote: 'Động tác dùng lực cổ tay và ngón tay mềm mại, tránh gồng cứng bắp tay.',
      assessmentCriteria: 'Đưa cầu rơi sát mép lưới trong vùng 1.98m ít nhất 3/5 lần tung cầu.',
      images: [
        {
          id: 'img-cl-t2-1',
          title: 'Sân cầu lông & Vạch giao cầu ngắn 1.98m',
          caption: 'Điểm rơi mục tiêu kỹ thuật bỏ nhỏ trái tay: Quả cầu bay lướt sát mép lưới và rơi trước vạch 1.98m.',
          type: 'court',
          svgType: 'badminton-court'
        }
      ]
    }
  ],
  'bong-da': [
    {
      id: 'bd-t1',
      title: 'Kĩ thuật đá bóng bằng lòng bàn chân cự ly ngắn (Chuyền ngắn)',
      classRef: 'Khối 10, 11 - Tuần 1, Tiết 1',
      sgkRef: 'SGK GDTC 2018',
      grade: '10',
      sportKey: 'bong-da',
      periodNumber: 1,
      durationMinutes: 45,
      week: 1,
      objective: 'Đặt chân trụ chuẩn xác cách bóng 15-20cm; mở lòng bàn chân tiếp xúc tâm bóng đưa bóng đi chìm và thẳng.',
      newKnowledge: 'Mũi chân trụ hướng theo hướng chuyền; khớp gối chân trụ hơi khuỵu để hạ thấp trọng tâm.',
      practice: 'Chuyền bóng vào tường cự ly 4m (15 lần); Chuyền bóng cặp đôi đối diện cách nhau 6m; Trò chơi chuyền bóng qua cổng hẹp.',
      aiDigital: 'AI nhận diện góc mở 90° của lòng bàn chân so với hướng bóng lăn.',
      safetyNote: 'Khởi động kỹ cổ chân và cơ khép đùi; không sút bóng bằng mũi giày để tránh chấn thương ngón chân.',
      assessmentCriteria: 'Chuyền bóng trúng mục tiêu kích thước 1m ở cự ly 6m ít nhất 4/5 lần.',
      images: [
        {
          id: 'img-bd-t1-1',
          title: 'Sơ đồ đội hình tập chuyền bóng cặp đôi và trạm giảm tải',
          caption: 'Bố trí các cặp đôi chuyền bóng theo 2 hàng dọc cự ly 6m; trạm hồi tĩnh và bù nước dừa ở góc sân.',
          type: 'formation',
          svgType: 'court-formation'
        }
      ]
    }
  ],
  'da-cau': [
    {
      id: 'dc-t1',
      title: 'Kĩ thuật tâng cầu bằng mu bàn chân & Phát cầu thấp chân chính diện',
      classRef: 'Khối 10, 11 - Tuần 1, Tiết 1',
      sgkRef: 'SGK GDTC 2018',
      grade: '10',
      sportKey: 'da-cau',
      periodNumber: 1,
      durationMinutes: 45,
      week: 1,
      objective: 'Khống chế quả cầu ổn định bằng mu bàn chân; phát cầu bổng qua lưới vào ô quy định của đối phương.',
      newKnowledge: 'Nâng đùi vuông góc với thân người; cổ tay và thân người giữ thăng bằng tự nhiên khi tiếp xúc cầu.',
      practice: 'Tâng cầu cá nhân liên tục; Tâng cầu đôi qua lại; Phát cầu qua lưới cự ly 4m.',
      aiDigital: 'Ứng dụng AI tự động đếm số lần tâng cầu liên tục không chạm đất qua camera điện thoại.',
      safetyNote: 'Tập trên mặt phẳng khô ráo, tránh trượt trẹo cổ chân khi giật lùi đón cầu.',
      assessmentCriteria: 'Tâng cầu bằng mu bàn chân đạt tối thiểu 10 lần liên tục không rơi đất.',
      images: [
        {
          id: 'img-dc-t1-1',
          title: 'Sơ đồ tổ chức luyện tập tâng cầu theo tổ',
          caption: 'Tổ chức lớp học thành 4 vòng tròn luyện tập tâng cầu tiếp sức, cự ly an toàn 3m giữa các học sinh.',
          type: 'formation',
          svgType: 'court-formation'
        }
      ]
    }
  ]
};

// Khung PPCT 70 Tiết chuẩn Bộ Giáo Dục & Đào Tạo (GDPT 2018) cho môn Giáo dục Thể chất THPT
export const FULL_PPCT_70_PERIODS: PPCTRow[] = [
  // HỌC KỲ I: 36 TIẾT (TUẦN 1 - 18)
  { period: 1, week: 1, semester: 'HK1', theme: 'Lý thuyết chung', lessonTitle: 'Sử dụng các yếu tố tự nhiên và dinh dưỡng trong tập luyện thể thao', sgkPages: 'Tr. 4 - 10', notes: 'Thời lượng: 45 phút • Giáo án số hóa', sportKey: 'bong-chuyen', grade: '12' },
  { period: 2, week: 1, semester: 'HK1', theme: 'Lý thuyết chung', lessonTitle: 'Lập kế hoạch tập luyện cá nhân & Ứng dụng công nghệ số', sgkPages: 'Tr. 11 - 15', notes: 'Thời lượng: 45 phút • Tự đánh giá BMI', sportKey: 'bong-chuyen', grade: '12' },
  { period: 3, week: 2, semester: 'HK1', theme: 'Kỹ thuật cơ bản', lessonTitle: 'Tư thế chuẩn bị và kỹ thuật di chuyển cơ bản (bước lướt, bước chéo)', sgkPages: 'Tr. 18 - 21', notes: 'Thời lượng: 45 phút • Phân tích camera 60fps', sportKey: 'bong-chuyen', grade: '12' },
  { period: 4, week: 2, semester: 'HK1', theme: 'Kỹ thuật cơ bản', lessonTitle: 'Luyện tập phối hợp di chuyển và đón bắt bóng tại chỗ', sgkPages: 'Tr. 22 - 25', notes: 'Thời lượng: 45 phút • Giảm chấn sụn gối', sportKey: 'bong-chuyen', grade: '12' },
  { period: 5, week: 3, semester: 'HK1', theme: 'Chuyền bóng', lessonTitle: 'Kĩ thuật chuyền bóng cao tay bằng hai tay (Hình phễu trước trán)', sgkPages: 'Tr. 26 - 29', notes: 'Thời lượng: 45 phút • AI đo góc khuỷu 110°', sportKey: 'bong-chuyen', grade: '12' },
  { period: 6, week: 3, semester: 'HK1', theme: 'Chuyền bóng', lessonTitle: 'Luyện tập chuyền bóng cao tay cặp đôi cự ly 3m - 4m', sgkPages: 'Tr. 30 - 32', notes: 'Thời lượng: 45 phút • Đánh giá đồng đẳng', sportKey: 'bong-chuyen', grade: '12' },
  { period: 7, week: 4, semester: 'HK1', theme: 'Đệm bóng', lessonTitle: 'Kĩ thuật đệm bóng (chuyền bóng thấp tay) bằng hai tay', sgkPages: 'Tr. 33 - 36', notes: 'Thời lượng: 45 phút • Khóa cổ tay hoãn xung', sportKey: 'bong-chuyen', grade: '12' },
  { period: 8, week: 4, semester: 'HK1', theme: 'Đệm bóng', lessonTitle: 'Luyện tập đệm bóng sau khi di chuyển bước lướt ngắn', sgkPages: 'Tr. 37 - 39', notes: 'Thời lượng: 45 phút • Trạm phân hóa thể trạng', sportKey: 'bong-chuyen', grade: '12' },
  { period: 9, week: 5, semester: 'HK1', theme: 'Phát bóng', lessonTitle: 'Kĩ thuật phát bóng thấp tay nghiêng mình (Tung bóng & vung tay)', sgkPages: 'Tr. 40 - 43', notes: 'Thời lượng: 45 phút • Tiếp xúc cườm tay', sportKey: 'bong-chuyen', grade: '12' },
  { period: 10, week: 5, semester: 'HK1', theme: 'Phát bóng', lessonTitle: 'Luyện tập phát bóng thấp tay nghiêng mình qua lưới cự ly 6m - 9m', sgkPages: 'Tr. 44 - 46', notes: 'Thời lượng: 45 phút • Quỹ đạo qua lưới', sportKey: 'bong-chuyen', grade: '12' },
  { period: 11, week: 6, semester: 'HK1', theme: 'Đỡ phát bóng', lessonTitle: 'Phối hợp di chuyển đỡ phát bóng và chuyền bóng bước 1', sgkPages: 'Tr. 47 - 50', notes: 'Thời lượng: 45 phút • Chiến thuật cơ bản', sportKey: 'bong-chuyen', grade: '12' },
  { period: 12, week: 6, semester: 'HK1', theme: 'Đỡ phát bóng', lessonTitle: 'Luyện tập chuyền bóng bước 1 cho chuyền hai', sgkPages: 'Tr. 51 - 53', notes: 'Thời lượng: 45 phút • Kiểm tra nhịp tim', sportKey: 'bong-chuyen', grade: '12' },
  { period: 13, week: 7, semester: 'HK1', theme: 'Chiến thuật', lessonTitle: 'Đội hình thi đấu cơ bản (Sơ đồ vị trí 1 đến 6 trên sân)', sgkPages: 'Tr. 54 - 58', notes: 'Thời lượng: 45 phút • Luật thi đấu bóng chuyền', sportKey: 'bong-chuyen', grade: '12' },
  { period: 14, week: 7, semester: 'HK1', theme: 'Chiến thuật', lessonTitle: 'Luyện tập luân chuyển vị trí theo chiều kim đồng hồ', sgkPages: 'Tr. 59 - 61', notes: 'Thời lượng: 45 phút • Phối hợp đồng đội', sportKey: 'bong-chuyen', grade: '12' },
  { period: 15, week: 8, semester: 'HK1', theme: 'Thể lực', lessonTitle: 'Rèn luyện sức bền tốc độ và sự khéo léo (Chạy biến tốc)', sgkPages: 'Tr. 62 - 64', notes: 'Thời lượng: 45 phút • Nhóm thừa cân giảm cự ly', sportKey: 'bong-chuyen', grade: '12' },
  { period: 16, week: 8, semester: 'HK1', theme: 'Thể lực', lessonTitle: 'Kiểm tra đánh giá thể lực định kỳ đợt 1', sgkPages: 'Tr. 65', notes: 'Thời lượng: 45 phút • Đánh giá thường xuyên TT22', sportKey: 'bong-chuyen', grade: '12' },
  { period: 17, week: 9, semester: 'HK1', theme: 'Ôn tập ĐGK1', lessonTitle: 'Ôn tập kỹ thuật Chuyền bóng cao tay và Phát bóng thấp tay', sgkPages: 'Tr. 66 - 68', notes: 'Thời lượng: 45 phút • Sửa sai cá nhân', sportKey: 'bong-chuyen', grade: '12' },
  { period: 18, week: 9, semester: 'HK1', theme: 'Kiểm tra ĐGK1', lessonTitle: 'KIỂM TRA ĐÁNH GIÁ GIỮA KỲ I (Kỹ thuật thực hành)', sgkPages: 'Văn bản ĐG', notes: 'Thời lượng: 45 phút • Chấm điểm theo Thông tư 22', sportKey: 'bong-chuyen', grade: '12' },
  { period: 19, week: 10, semester: 'HK1', theme: 'Phát bóng cao', lessonTitle: 'Kĩ thuật phát bóng cao tay trước mặt (Lý thuyết & Mô phỏng)', sgkPages: 'Tr. 69 - 72', notes: 'Thời lượng: 45 phút • Điểm chạm bóng trên cao', sportKey: 'bong-chuyen', grade: '12' },
  { period: 20, week: 10, semester: 'HK1', theme: 'Phát bóng cao', lessonTitle: 'Luyện tập phát bóng cao tay vào tường và qua lưới 6m', sgkPages: 'Tr. 73 - 75', notes: 'Thời lượng: 45 phút • Video slow-motion', sportKey: 'bong-chuyen', grade: '12' },
  { period: 21, week: 11, semester: 'HK1', theme: 'Phát bóng cao', lessonTitle: 'Hoàn thiện kỹ thuật phát bóng cao tay sau vạch 9m', sgkPages: 'Tr. 76 - 78', notes: 'Thời lượng: 45 phút • Đánh giá lực tay', sportKey: 'bong-chuyen', grade: '12' },
  { period: 22, week: 11, semester: 'HK1', theme: 'Cứu bóng', lessonTitle: 'Kĩ thuật nhoài người đỡ bóng bằng một tay (Cứu bóng nguy hiểm)', sgkPages: 'Tr. 79 - 82', notes: 'Thời lượng: 45 phút • Kỹ thuật cuộn vai tiếp đất', sportKey: 'bong-chuyen', grade: '12' },
  { period: 23, week: 12, semester: 'HK1', theme: 'Cứu bóng', lessonTitle: 'Luyện tập nhoài người tiếp đất an toàn trên sân trường', sgkPages: 'Tr. 83 - 85', notes: 'Thời lượng: 45 phút • Bảo vệ khớp gối', sportKey: 'bong-chuyen', grade: '12' },
  { period: 24, week: 12, semester: 'HK1', theme: 'Tấn công', lessonTitle: 'Kĩ thuật bật nhảy đập bóng (Đà 2 bước và bật nhảy)', sgkPages: 'Tr. 86 - 89', notes: 'Thời lượng: 45 phút • Nhóm thừa cân tập tại chỗ', sportKey: 'bong-chuyen', grade: '12' },
  { period: 25, week: 13, semester: 'HK1', theme: 'Tấn công', lessonTitle: 'Luyện tập gập thân đập bóng treo cố định', sgkPages: 'Tr. 90 - 92', notes: 'Thời lượng: 45 phút • Điểm tiếp xúc trán', sportKey: 'bong-chuyen', grade: '12' },
  { period: 26, week: 13, semester: 'HK1', theme: 'Chắn bóng', lessonTitle: 'Kĩ thuật chắn bóng cá nhân trên lưới', sgkPages: 'Tr. 93 - 96', notes: 'Thời lượng: 45 phút • Hoãn xung khi tiếp đất', sportKey: 'bong-chuyen', grade: '12' },
  { period: 27, week: 14, semester: 'HK1', theme: 'Phối hợp', lessonTitle: 'Phối hợp phòng thủ: Chắn bóng và cứu bóng bọc lót', sgkPages: 'Tr. 97 - 99', notes: 'Thời lượng: 45 phút • Tinh thần đồng đội', sportKey: 'bong-chuyen', grade: '12' },
  { period: 28, week: 14, semester: 'HK1', theme: 'Thi đấu tập', lessonTitle: 'Thi đấu tập có điều kiện (Giới hạn số lần chạm bóng)', sgkPages: 'Tr. 100', notes: 'Thời lượng: 45 phút • Tự làm trọng tài', sportKey: 'bong-chuyen', grade: '12' },
  { period: 29, week: 15, semester: 'HK1', theme: 'Thi đấu tập', lessonTitle: 'Thi đấu tập kiểm tra nhịp tim gắng sức thời gian thực', sgkPages: 'Tr. 101 - 103', notes: 'Thời lượng: 45 phút • Ứng dụng AI Cardio', sportKey: 'bong-chuyen', grade: '12' },
  { period: 30, week: 15, semester: 'HK1', theme: 'Dinh dưỡng', lessonTitle: 'Chuyên đề: Bù khoáng nước dừa xiêm Bến Tre sau thi đấu', sgkPages: 'Tr. 104 - 106', notes: 'Thời lượng: 45 phút • Dinh dưỡng học đường', sportKey: 'bong-chuyen', grade: '12' },
  { period: 31, week: 16, semester: 'HK1', theme: 'Ôn tập', lessonTitle: 'Ôn tập tổng hợp kỹ thuật chuyền bóng và phát bóng', sgkPages: 'Tr. 107 - 109', notes: 'Thời lượng: 45 phút • Phân nhóm ôn tập', sportKey: 'bong-chuyen', grade: '12' },
  { period: 32, week: 16, semester: 'HK1', theme: 'Ôn tập', lessonTitle: 'Ôn tập phối hợp chiến thuật 3 chạm tấn công', sgkPages: 'Tr. 110 - 112', notes: 'Thời lượng: 45 phút • Đánh giá tiến bộ', sportKey: 'bong-chuyen', grade: '12' },
  { period: 33, week: 17, semester: 'HK1', theme: 'Ôn tập cuối kỳ', lessonTitle: 'Luyện tập kỹ thuật trọng tâm chuẩn bị kiểm tra HK1', sgkPages: 'Tr. 113 - 115', notes: 'Thời lượng: 45 phút • Tự giác rèn luyện', sportKey: 'bong-chuyen', grade: '12' },
  { period: 34, week: 17, semester: 'HK1', theme: 'Thi đấu giao hữu', lessonTitle: 'Thi đấu giao hữu nội bộ lớp và phân tích video AI', sgkPages: 'Tr. 116', notes: 'Thời lượng: 45 phút • Trọng tài số hóa', sportKey: 'bong-chuyen', grade: '12' },
  { period: 35, week: 18, semester: 'HK1', theme: 'Kiểm tra HK1', lessonTitle: 'KIỂM TRA ĐÁNH GIÁ CUỐI HỌC KỲ I (Tiết 1/2)', sgkPages: 'Văn bản ĐG', notes: 'Thời lượng: 45 phút • Theo dõi chỉ số BMI', sportKey: 'bong-chuyen', grade: '12' },
  { period: 36, week: 18, semester: 'HK1', theme: 'Kiểm tra HK1', lessonTitle: 'KIỂM TRA ĐÁNH GIÁ CUỐI HỌC KỲ I (Tiết 2/2) & Tổng kết HK1', sgkPages: 'Văn bản ĐG', notes: 'Thời lượng: 45 phút • Nhận xét sổ theo dõi', sportKey: 'bong-chuyen', grade: '12' },

  // HỌC KỲ II: 34 TIẾT (TUẦN 19 - 35)
  { period: 37, week: 19, semester: 'HK2', theme: 'Khởi động HK2', lessonTitle: 'Đánh giá lại chỉ số thể trạng BMI sau kỳ nghỉ Tết & Kế hoạch HK2', sgkPages: 'Tr. 118 - 120', notes: 'Thời lượng: 45 phút • Khởi động thích ứng', sportKey: 'bong-chuyen', grade: '12' },
  { period: 38, week: 19, semester: 'HK2', theme: 'Kỹ thuật nâng cao', lessonTitle: 'Kĩ thuật chuyền bóng nhảy cao trên không (Jump Set)', sgkPages: 'Tr. 121 - 124', notes: 'Thời lượng: 45 phút • Yêu cầu thể lực cao', sportKey: 'bong-chuyen', grade: '12' },
  { period: 39, week: 20, semester: 'HK2', theme: 'Kỹ thuật nâng cao', lessonTitle: 'Luyện tập chuyền bóng cho mũi tấn công biên số 4', sgkPages: 'Tr. 125 - 127', notes: 'Thời lượng: 45 phút • Nhịp độ trận đấu', sportKey: 'bong-chuyen', grade: '12' },
  { period: 40, week: 20, semester: 'HK2', theme: 'Phát bóng tấn công', lessonTitle: 'Kĩ thuật phát bóng bay (Floating Serve) kiểm soát điểm rơi', sgkPages: 'Tr. 128 - 131', notes: 'Thời lượng: 45 phút • Không xoáy bóng', sportKey: 'bong-chuyen', grade: '12' },
  { period: 50, week: 25, semester: 'HK2', theme: 'Đánh giá giữa kỳ 2', lessonTitle: 'KIỂM TRA ĐÁNH GIÁ GIỮA KỲ II (Thực hành kỹ thuật & Chiến thuật)', sgkPages: 'Văn bản ĐG', notes: 'Thời lượng: 45 phút • Chuẩn Thông tư 22', sportKey: 'bong-chuyen', grade: '12' },
  { period: 60, week: 30, semester: 'HK2', theme: 'Thi đấu giải trường', lessonTitle: 'Tổ chức Giải thi đấu Thể thao cấp trường THPT Huỳnh Tấn Phát', sgkPages: 'Điều lệ trường', notes: 'Thời lượng: 45 phút • Rèn luyện bản lĩnh', sportKey: 'bong-chuyen', grade: '12' },
  { period: 69, week: 35, semester: 'HK2', theme: 'Kiểm tra HK2', lessonTitle: 'KIỂM TRA ĐÁNH GIÁ CUỐI HỌC KỲ II (Tiết 1/2)', sgkPages: 'Văn bản ĐG', notes: 'Thời lượng: 45 phút • Chốt sổ đánh giá TT22', sportKey: 'bong-chuyen', grade: '12' },
  { period: 70, week: 35, semester: 'HK2', theme: 'Tổng kết 70 tiết', lessonTitle: 'KIỂM TRA ĐÁNH GIÁ CUỐI HỌC KỲ II (Tiết 2/2) & Tổng kết năm học GDTC', sgkPages: 'Văn bản ĐG', notes: 'Thời lượng: 45 phút • Xuất báo cáo thể lực học sinh', sportKey: 'bong-chuyen', grade: '12' }
];

export const FULL_PPCT_BASKETBALL_70_PERIODS: PPCTRow[] = [
  // HỌC KỲ I: 36 TIẾT (TUẦN 1 - 18) - PHÂN MÔN BÓNG RỔ (MẶC ĐỊNH)
  { period: 1, week: 1, semester: 'HK1', theme: 'Lý thuyết chung', lessonTitle: 'Sử dụng các yếu tố tự nhiên và dinh dưỡng trong tập luyện môn Bóng rổ', sgkPages: 'Tr. 4 - 10', notes: 'Thời lượng: 45 phút • Tác dụng phát triển chiều cao', sportKey: 'bong-ro', grade: '12' },
  { period: 2, week: 1, semester: 'HK1', theme: 'Lý thuyết chung', lessonTitle: 'Lập kế hoạch tập luyện cá nhân & Ứng dụng công nghệ đo đếm thể lực', sgkPages: 'Tr. 11 - 15', notes: 'Thời lượng: 45 phút • Tự đánh giá chỉ số BMI', sportKey: 'bong-ro', grade: '12' },
  { period: 3, week: 2, semester: 'HK1', theme: 'Kỹ thuật di chuyển', lessonTitle: 'Tư thế chuẩn bị (TTCB) và kỹ thuật di chuyển không bóng (Chạy đổi hướng, dừng 2 bước)', sgkPages: 'Tr. 16 - 19', notes: 'Thời lượng: 45 phút • Giảm chấn sụn khớp gối', sportKey: 'bong-ro', grade: '12' },
  { period: 4, week: 2, semester: 'HK1', theme: 'Kỹ thuật di chuyển', lessonTitle: 'Luyện tập bước trượt ngang và bật dừng bắt bóng trên sân xi măng', sgkPages: 'Tr. 20 - 23', notes: 'Thời lượng: 45 phút • Phân tích góc chân trụ', sportKey: 'bong-ro', grade: '12' },
  { period: 5, week: 3, semester: 'HK1', theme: 'Dẫn bóng cơ bản', lessonTitle: 'Kĩ thuật dẫn bóng tại chỗ tay thuận và tay không thuận (Nhồi bóng kiểm soát)', sgkPages: 'Tr. 24 - 27', notes: 'Thời lượng: 45 phút • Đếm số lần nhồi 30 giây', sportKey: 'bong-ro', grade: '12' },
  { period: 6, week: 3, semester: 'HK1', theme: 'Dẫn bóng cơ bản', lessonTitle: 'Luyện tập dẫn bóng tiến lùi tốc độ thấp và nâng cao đùi', sgkPages: 'Tr. 28 - 30', notes: 'Thời lượng: 45 phút • Mắt nhìn bao quát', sportKey: 'bong-ro', grade: '12' },
  { period: 7, week: 4, semester: 'HK1', theme: 'Dẫn bóng đổi hướng', lessonTitle: 'Kĩ thuật dẫn bóng đổi hướng trước mặt (Crossover) và luồn cọc tiêu', sgkPages: 'Tr. 31 - 34', notes: 'Thời lượng: 45 phút • Hạ thấp trọng tâm bảo vệ bóng', sportKey: 'bong-ro', grade: '12' },
  { period: 8, week: 4, semester: 'HK1', theme: 'Dẫn bóng đổi hướng', lessonTitle: 'Luyện tập dẫn bóng qua hàng 5 cọc tiêu zíc zắc cự ly 2.5m', sgkPages: 'Tr. 35 - 37', notes: 'Thời lượng: 45 phút • Bố trí trạm giảm tải', sportKey: 'bong-ro', grade: '12' },
  { period: 9, week: 5, semester: 'HK1', theme: 'Chuyền bắt bóng', lessonTitle: 'Kĩ thuật chuyền và bắt bóng hai tay trước ngực (Chest Pass)', sgkPages: 'Tr. 38 - 41', notes: 'Thời lượng: 45 phút • Miết ngón tay phát lực căng phẳng', sportKey: 'bong-ro', grade: '12' },
  { period: 10, week: 5, semester: 'HK1', theme: 'Chuyền bắt bóng', lessonTitle: 'Luyện tập chuyền bóng hai tay trước ngực cặp đôi cự ly 3m - 5m', sgkPages: 'Tr. 42 - 44', notes: 'Thời lượng: 45 phút • AI đo độ căng đường chuyền', sportKey: 'bong-ro', grade: '12' },
  { period: 11, week: 6, semester: 'HK1', theme: 'Chuyền bật đất', lessonTitle: 'Kĩ thuật chuyền bóng hai tay bật đất (Bounce Pass)', sgkPages: 'Tr. 45 - 48', notes: 'Thời lượng: 45 phút • Điểm dội đất 2/3 quãng đường', sportKey: 'bong-ro', grade: '12' },
  { period: 12, week: 6, semester: 'HK1', theme: 'Chuyền qua đầu', lessonTitle: 'Kĩ thuật chuyền bóng hai tay trên đầu (Overhead Pass)', sgkPages: 'Tr. 49 - 52', notes: 'Thời lượng: 45 phút • Chuyền bóng vượt tầm với đối thủ', sportKey: 'bong-ro', grade: '12' },
  { period: 13, week: 7, semester: 'HK1', theme: 'Phối hợp chuyền dẫn', lessonTitle: 'Phối hợp dẫn bóng tốc độ và chuyền bóng cho đồng đội di chuyển', sgkPages: 'Tr. 53 - 56', notes: 'Thời lượng: 45 phút • Phối hợp nhóm 2 người', sportKey: 'bong-ro', grade: '12' },
  { period: 14, week: 7, semester: 'HK1', theme: 'Phối hợp chuyền dẫn', lessonTitle: 'Trò chơi vận động tiếp sức: Chuyền bóng số 8 và dẫn bóng đổi tay', sgkPages: 'Tr. 57 - 60', notes: 'Thời lượng: 45 phút • Không khí sôi nổi', sportKey: 'bong-ro', grade: '12' },
  { period: 15, week: 8, semester: 'HK1', theme: 'Thể lực chuyên môn', lessonTitle: 'Rèn luyện sức bền tốc độ và sự linh hoạt cổ chân môn bóng rổ', sgkPages: 'Tr. 61 - 63', notes: 'Thời lượng: 45 phút • Nhóm thừa cân giảm cự ly', sportKey: 'bong-ro', grade: '12' },
  { period: 16, week: 8, semester: 'HK1', theme: 'Thể lực định kỳ', lessonTitle: 'Kiểm tra đánh giá thể lực định kỳ đợt 1 (Đo nhịp tim phục hồi)', sgkPages: 'Tr. 64 - 65', notes: 'Thời lượng: 45 phút • Đánh giá thường xuyên TT22', sportKey: 'bong-ro', grade: '12' },
  { period: 17, week: 9, semester: 'HK1', theme: 'Ôn tập ĐGK1', lessonTitle: 'Ôn tập tổ hợp kỹ thuật Dẫn bóng cọc tiêu và Chuyền bóng hai tay', sgkPages: 'Tr. 66 - 68', notes: 'Thời lượng: 45 phút • Sửa sai động tác miết tay', sportKey: 'bong-ro', grade: '12' },
  { period: 18, week: 9, semester: 'HK1', theme: 'Kiểm tra ĐGK1', lessonTitle: 'KIỂM TRA ĐÁNH GIÁ GIỮA KỲ I (Dẫn bóng zíc zắc & Chuyền bóng tính điểm)', sgkPages: 'Văn bản ĐG', notes: 'Thời lượng: 45 phút • Chuẩn Thông tư 22/2021/BGDĐT', sportKey: 'bong-ro', grade: '12' },
  { period: 19, week: 10, semester: 'HK1', theme: 'Ném rổ tại chỗ', lessonTitle: 'Kĩ thuật ném rổ một tay trên vai tại chỗ (One-hand Set Shot)', sgkPages: 'Tr. 69 - 72', notes: 'Thời lượng: 45 phút • Tay chữ L, đường Parabol 48-52°', sportKey: 'bong-ro', grade: '12' },
  { period: 20, week: 10, semester: 'HK1', theme: 'Ném phạt', lessonTitle: 'Luyện tập ném phạt cự ly 4.6m (Tập trung điểm rơi và gập cổ tay)', sgkPages: 'Tr. 73 - 75', notes: 'Thời lượng: 45 phút • Thừa cân tập không nhảy', sportKey: 'bong-ro', grade: '12' },
  { period: 21, week: 11, semester: 'HK1', theme: 'Nhảy ném rổ', lessonTitle: 'Kĩ thuật nhảy ném rổ một tay trên vai (Jump Shot)', sgkPages: 'Tr. 76 - 79', notes: 'Thời lượng: 45 phút • Giải phóng bóng đỉnh điểm nhảy', sportKey: 'bong-ro', grade: '12' },
  { period: 22, week: 11, semester: 'HK1', theme: 'Nhảy ném rổ', lessonTitle: 'Luyện tập tiếp đất an toàn hoãn xung hai chân sau khi nhảy ném rổ', sgkPages: 'Tr. 80 - 82', notes: 'Thời lượng: 45 phút • Bảo vệ khớp gối sân xi măng', sportKey: 'bong-ro', grade: '12' },
  { period: 23, week: 12, semester: 'HK1', theme: 'Lên rổ 2 bước', lessonTitle: 'Kĩ thuật tại chỗ bắt bóng 2 bước lên rổ tiếp cận bảng (Layup)', sgkPages: 'Tr. 83 - 86', notes: 'Thời lượng: 45 phút • Bước 1 dài đón bóng, bước 2 bật cao', sportKey: 'bong-ro', grade: '12' },
  { period: 24, week: 12, semester: 'HK1', theme: 'Lên rổ 2 bước', lessonTitle: 'Luyện tập dẫn bóng 2 bước lên rổ góc 45 độ bên phải chạm bảng', sgkPages: 'Tr. 87 - 89', notes: 'Thời lượng: 45 phút • Điểm bóng chạm ô vuông', sportKey: 'bong-ro', grade: '12' },
  { period: 25, week: 13, semester: 'HK1', theme: 'Lên rổ 2 bước', lessonTitle: 'Luyện tập lên rổ góc 45 độ bên trái tay không thuận', sgkPages: 'Tr. 90 - 92', notes: 'Thời lượng: 45 phút • Khéo léo nâng bóng', sportKey: 'bong-ro', grade: '12' },
  { period: 26, week: 13, semester: 'HK1', theme: 'Bắt bóng bật bảng', lessonTitle: 'Kĩ thuật bắt bóng bật bảng (Rebound phòng thủ & tấn công)', sgkPages: 'Tr. 93 - 96', notes: 'Thời lượng: 45 phút • Khóa người Box-out', sportKey: 'bong-ro', grade: '12' },
  { period: 27, week: 14, semester: 'HK1', theme: 'Phòng thủ cá nhân', lessonTitle: 'Kĩ thuật phòng thủ kèm người 1 - 1 không bóng và có bóng', sgkPages: 'Tr. 97 - 99', notes: 'Thời lượng: 45 phút • Tay cản đường chuyền, chân trượt', sportKey: 'bong-ro', grade: '12' },
  { period: 28, week: 14, semester: 'HK1', theme: 'Phối hợp nhóm', lessonTitle: 'Phối hợp tấn công 2 đánh 1 (Cho và Nhận - Give and Go)', sgkPages: 'Tr. 100 - 102', notes: 'Thời lượng: 45 phút • Chạy cắt vào rổ đón bóng', sportKey: 'bong-ro', grade: '12' },
  { period: 29, week: 15, semester: 'HK1', theme: 'Dinh dưỡng học đường', lessonTitle: 'Chuyên đề: Bù nước dừa xiêm Bến Tre và bù khoáng điện giải sau vận động bóng rổ', sgkPages: 'Tr. 103 - 105', notes: 'Thời lượng: 45 phút • Phòng tránh chuột rút', sportKey: 'bong-ro', grade: '12' },
  { period: 30, week: 15, semester: 'HK1', theme: 'Thi đấu tập 3x3', lessonTitle: 'Thi đấu tập Bóng rổ 3x3 có điều kiện nửa sân trường Huỳnh Tấn Phát', sgkPages: 'Tr. 106 - 108', notes: 'Thời lượng: 45 phút • Đo nhịp tim gắng sức thời gian thực', sportKey: 'bong-ro', grade: '12' },
  { period: 31, week: 16, semester: 'HK1', theme: 'Ôn tập tổng hợp', lessonTitle: 'Ôn tập liên hoàn kỹ thuật Dẫn bóng - Chuyền bóng - Lên rổ', sgkPages: 'Tr. 109 - 111', notes: 'Thời lượng: 45 phút • Phân nhóm học tập tương trợ', sportKey: 'bong-ro', grade: '12' },
  { period: 32, week: 16, semester: 'HK1', theme: 'Ôn tập tổng hợp', lessonTitle: 'Ôn tập phối hợp chiến thuật tấn công nhanh và ném rổ trung bình', sgkPages: 'Tr. 112 - 114', notes: 'Thời lượng: 45 phút • Ghi video tự đánh giá', sportKey: 'bong-ro', grade: '12' },
  { period: 33, week: 17, semester: 'HK1', theme: 'Luyện tập trọng tâm', lessonTitle: 'Luyện tập kỹ thuật trọng tâm chuẩn bị kiểm tra đánh giá HK1', sgkPages: 'Tr. 115 - 116', notes: 'Thời lượng: 45 phút • Bồi dưỡng học sinh còn yếu', sportKey: 'bong-ro', grade: '12' },
  { period: 34, week: 17, semester: 'HK1', theme: 'Thi đấu giao hữu', lessonTitle: 'Thi đấu giao hữu bóng rổ nội bộ lớp và phân tích số liệu ném rổ AI', sgkPages: 'Tr. 117', notes: 'Thời lượng: 45 phút • Thực hành trọng tài số', sportKey: 'bong-ro', grade: '12' },
  { period: 35, week: 18, semester: 'HK1', theme: 'Kiểm tra HK1', lessonTitle: 'KIỂM TRA ĐÁNH GIÁ CUỐI HỌC KỲ I (Tiết 1/2: Ném phạt & Lên rổ 2 bước)', sgkPages: 'Văn bản ĐG', notes: 'Thời lượng: 45 phút • Theo dõi chỉ số BMI', sportKey: 'bong-ro', grade: '12' },
  { period: 36, week: 18, semester: 'HK1', theme: 'Kiểm tra HK1', lessonTitle: 'KIỂM TRA ĐÁNH GIÁ CUỐI HỌC KỲ I (Tiết 2/2) & Tổng kết xếp loại HK1', sgkPages: 'Văn bản ĐG', notes: 'Thời lượng: 45 phút • Nhận xét sổ theo dõi TT22', sportKey: 'bong-ro', grade: '12' },

  // HỌC KỲ II: 34 TIẾT (TUẦN 19 - 35) - PHÂN MÔN BÓNG RỔ (MẶC ĐỊNH)
  { period: 37, week: 19, semester: 'HK2', theme: 'Khởi động HK2', lessonTitle: 'Đánh giá lại thể trạng BMI sau Tết & Xây dựng kế hoạch tập luyện bóng rổ HK2', sgkPages: 'Tr. 118 - 120', notes: 'Thời lượng: 45 phút • Khởi động thích ứng thể lực', sportKey: 'bong-ro', grade: '12' },
  { period: 38, week: 19, semester: 'HK2', theme: 'Kỹ thuật nâng cao', lessonTitle: 'Kĩ thuật dẫn bóng đổi hướng sau lưng (Behind-the-back Dribble)', sgkPages: 'Tr. 121 - 123', notes: 'Thời lượng: 45 phút • Cảm giác bóng tay không thuận', sportKey: 'bong-ro', grade: '12' },
  { period: 39, week: 20, semester: 'HK2', theme: 'Kỹ thuật nâng cao', lessonTitle: 'Kĩ thuật dẫn bóng xoay người (Spin Move) bảo vệ bóng', sgkPages: 'Tr. 124 - 126', notes: 'Thời lượng: 45 phút • Hạ thấp trọng tâm xoay trục', sportKey: 'bong-ro', grade: '12' },
  { period: 40, week: 20, semester: 'HK2', theme: 'Kỹ thuật nâng cao', lessonTitle: 'Phối hợp dẫn bóng xoay người và ném rổ trung bình', sgkPages: 'Tr. 127 - 129', notes: 'Thời lượng: 45 phút • Nhịp độ thi đấu', sportKey: 'bong-ro', grade: '12' },
  { period: 50, week: 25, semester: 'HK2', theme: 'Đánh giá giữa kỳ 2', lessonTitle: 'KIỂM TRA ĐÁNH GIÁ GIỮA KỲ II (Thực hành tổ hợp kỹ thuật bóng rổ & Chiến thuật)', sgkPages: 'Văn bản ĐG', notes: 'Thời lượng: 45 phút • Chuẩn Thông tư 22/2021/BGDĐT', sportKey: 'bong-ro', grade: '12' },
  { period: 60, week: 30, semester: 'HK2', theme: 'Giải đấu trường', lessonTitle: 'Tổ chức Giải thi đấu Bóng rổ 3x3 cấp trường THPT Huỳnh Tấn Phát', sgkPages: 'Điều lệ trường', notes: 'Thời lượng: 45 phút • Rèn luyện bản lĩnh thi đấu', sportKey: 'bong-ro', grade: '12' },
  { period: 69, week: 35, semester: 'HK2', theme: 'Kiểm tra HK2', lessonTitle: 'KIỂM TRA ĐÁNH GIÁ CUỐI HỌC KỲ II (Tiết 1/2)', sgkPages: 'Văn bản ĐG', notes: 'Thời lượng: 45 phút • Chốt sổ đánh giá TT22', sportKey: 'bong-ro', grade: '12' },
  { period: 70, week: 35, semester: 'HK2', theme: 'Tổng kết 70 tiết', lessonTitle: 'KIỂM TRA ĐÁNH GIÁ CUỐI HỌC KỲ II (Tiết 2/2) & Tổng kết năm học GDTC Bóng rổ', sgkPages: 'Văn bản ĐG', notes: 'Thời lượng: 45 phút • Xuất báo cáo thể lực học sinh', sportKey: 'bong-ro', grade: '12' }
];

export function getPPCTForSport(sportKey: SportKey): PPCTRow[] {
  if (sportKey === 'bong-ro') {
    return FULL_PPCT_BASKETBALL_70_PERIODS;
  }
  return FULL_PPCT_70_PERIODS;
}

