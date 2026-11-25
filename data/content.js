/* ==========================================================================
   content.js — Dữ liệu có cấu trúc của hồ sơ (nguồn: PROFILE.md + Master CV).
   Bản v2 dùng trực tiếp `cv` và `toeic`. Các mục còn lại là schema tham chiếu
   (render bằng JS, nội dung VI nằm sẵn trong HTML để không có trang trống).
   Quy tắc: không thêm thành tích/kỹ năng chưa được chủ hồ sơ xác nhận.
   ========================================================================== */
window.NQV_CONTENT = {
  portfolio: { url: 'https://vinhbizpsu.github.io/', updated: '2026-11-26' },
  person: {
    name: { vi: 'Nguyễn Quốc Vinh', en: 'Nguyen Quoc Vinh' },
    // Đã đồng ý công khai; cân nhắc lại quyền riêng tư trước khi phát hành (bước 8–9).
    email: 'quocvinh91138@gmail.com',
    phone: '0708551006'
  },

  // Hai phiên bản CV luôn hiện độc lập với ngôn ngữ giao diện.
  cv: { vi: 'assets/cv/CV_VI_Nguyen-Quoc-Vinh.pdf', en: 'assets/cv/CV_EN_Nguyen-Quoc-Vinh.pdf' },

  // Cập nhật TOEIC tại đây; tổng điểm được tính từ hai kỹ năng.
  toeic: { listening: 360, reading: 270, testDate: '2026-03-09', validUntil: '2028-03-09', image: 'assets/img/toeic-public.webp' },

  publication: {
    url: 'https://nghiencuu.tapchikinhtetaichinh.vn/tac-dong-cua-nhan-thuc-tay-xanh-den-hanh-vi-tieu-dung-thuc-pham-va-do-uong-xanh-cua-sinh-vien-tren-dia-ban-tp-da-nang-162535.html',
    date: '2026-07-23',
    venue: 'Chuyên trang Nghiên cứu Kinh tế-Tài chính',
    role: { vi: 'Đồng tác giả', en: 'Co-author' }
  },

  awards: [
    { id: 'school-first',
      title: { vi: 'Giải Nhất NCKH cấp Trường Đào tạo Quốc tế',
               en: 'First Prize – Student Scientific Research Conference 2026, DTU International School' } },
    { id: 'university-encouragement',
      title: { vi: 'Giải Khuyến khích NCKH cấp Đại học Duy Tân',
               en: 'Encouragement Prize – Duy Tan University Scientific Research Competition' } }
  ],

  certifications: [
    { id: 'google-prepare', issuer: 'Google', date: '2025-11', name: 'Prepare Data for Exploration' },
    { id: 'google-process', issuer: 'Google', date: '2025-11', name: 'Process Data from Dirty to Clean' },
    { id: 'google-capstone', issuer: 'Google', date: '2025-11', name: 'Google Data Analytics Capstone: Complete a Case Study' },
    { id: 'mos-word', issuer: 'Microsoft Office Specialist', name: 'Word' },
    { id: 'mos-excel', issuer: 'Microsoft Office Specialist', name: 'Excel' },
    { id: 'mos-powerpoint', issuer: 'Microsoft Office Specialist', name: 'PowerPoint' }
    // Thêm `image: 'assets/img/…'` khi có ảnh; không có ảnh thì không hiện nút xem.
  ],

  education: {
    school: { vi: 'Đại học Duy Tân', en: 'Duy Tan University' },
    program: { vi: 'Quản trị kinh doanh – Chương trình PSU', en: 'Business Administration – PSU Program' },
    years: '2023–2027',
    gpa: '3.5/4.0'
  },

  // Dự án: để trống thì mục Dự án tự ẩn. Mỗi phần tử gợi ý:
  //   { id, title:{vi,en}, summary:{vi,en}, tags:[], url?: '' }
  projects: []
};
