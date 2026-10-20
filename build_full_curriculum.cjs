const fs = require('fs');
const path = require('path');

function parseBongRo10() {
  const lines = fs.readFileSync('extracted_phan_phoi_chuong_trinh_2026_khoi10_Giao_duc_the_chat_Bong_ro_0f2be796.pdf.txt', 'utf-8')
    .split('\n').map(l => l.trim()).filter(Boolean);
  
  // Parse periods
  const rows = [];
  // Let's inspect the raw text and extract period by period
  return lines;
}

console.log('Testing parse script');
