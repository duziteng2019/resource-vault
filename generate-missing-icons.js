const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const imagesDir = path.join(__dirname, 'miniprogram', 'images');

function svgToPng(svgContent, size) {
  const fullSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">${svgContent}</svg>`;
  return Buffer.from(fullSvg);
}

async function saveIcon(name, svgContent, size = 81) {
  const buffer = svgToPng(svgContent, size);
  await sharp(buffer)
    .resize(size, size)
    .png()
    .toFile(path.join(imagesDir, name));
  console.log(`✓ ${name}`);
}

async function main() {
  console.log('生成缺失的图标...');

  // 刷新
  await saveIcon('refresh.png', `
    <path d="M40 10 A30 30 0 1 1 10 40" stroke="#999999" stroke-width="3" fill="none" stroke-linecap="round"/>
    <polyline points="40,10 40,30 55,40" stroke="#999999" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
  `);

  // 广告相关
  await saveIcon('ad-small.png', `
    <rect x="8" y="12" width="36" height="28" rx="4" stroke="#ff9500" stroke-width="2" fill="none"/>
    <line x1="16" y1="8" x2="36" y2="8" stroke="#ff9500" stroke-width="2" stroke-linecap="round"/>
    <text x="26" y="30" text-anchor="middle" font-size="10" font-weight="bold" fill="#ff9500">AD</text>
  `, 52);

  await saveIcon('ad-white.png', `
    <rect x="12" y="18" width="48" height="36" rx="4" stroke="#ffffff" stroke-width="2" fill="none"/>
    <line x1="20" y1="12" x2="52" y2="12" stroke="#ffffff" stroke-width="2" stroke-linecap="round"/>
    <text x="36" y="40" text-anchor="middle" font-size="14" font-weight="bold" fill="#ffffff">AD</text>
  `, 72);

  // 勾选相关
  await saveIcon('check-big.png', `
    <circle cx="41" cy="41" r="32" stroke="#07c160" stroke-width="3" fill="#e8f8ec"/>
    <polyline points="26,42 36,52 56,30" stroke="#07c160" stroke-width="4" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
  `);

  await saveIcon('check-small.png', `
    <circle cx="20" cy="20" r="15" stroke="#07c160" stroke-width="2" fill="#e8f8ec"/>
    <polyline points="12,20 17,25 28,14" stroke="#07c160" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
  `, 40);

  await saveIcon('check-white.png', `
    <circle cx="41" cy="41" r="32" stroke="#ffffff" stroke-width="3" fill="none"/>
    <polyline points="26,42 36,52 56,30" stroke="#ffffff" stroke-width="4" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
  `);

  // 签到相关
  await saveIcon('signin-btn.png', `
    <rect x="8" y="12" width="66" height="58" rx="8" fill="#ff9500"/>
    <text x="41" y="50" text-anchor="middle" font-size="24" font-weight="bold" fill="#ffffff">签到</text>
  `, 82);

  await saveIcon('calendar.png', `
    <rect x="14" y="18" width="54" height="50" rx="5" stroke="#666666" stroke-width="2.5" fill="none"/>
    <line x1="26" y1="12" x2="26" y2="26" stroke="#666666" stroke-width="2.5" stroke-linecap="round"/>
    <line x1="56" y1="12" x2="56" y2="26" stroke="#666666" stroke-width="2.5" stroke-linecap="round"/>
    <line x1="14" y1="32" x2="68" y2="32" stroke="#666666" stroke-width="2"/>
    <line x1="28" y1="42" x2="38" y2="42" stroke="#cccccc" stroke-width="2" stroke-linecap="round"/>
    <line x1="46" y1="42" x2="56" y2="42" stroke="#cccccc" stroke-width="2" stroke-linecap="round"/>
    <line x1="28" y1="54" x2="38" y2="54" stroke="#cccccc" stroke-width="2" stroke-linecap="round"/>
    <line x1="46" y1="54" x2="56" y2="54" stroke="#cccccc" stroke-width="2" stroke-linecap="round"/>
  `);

  await saveIcon('signin-icon.png', `
    <rect x="14" y="18" width="54" height="50" rx="5" stroke="#ff9500" stroke-width="2.5" fill="none"/>
    <line x1="26" y1="10" x2="26" y2="24" stroke="#ff9500" stroke-width="2.5" stroke-linecap="round"/>
    <line x1="56" y1="10" x2="56" y2="24" stroke="#ff9500" stroke-width="2.5" stroke-linecap="round"/>
    <line x1="14" y1="32" x2="68" y2="32" stroke="#ff9500" stroke-width="2"/>
    <polyline points="30,44 38,52 54,36" stroke="#ff9500" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
  `);

  await saveIcon('signin-success.png', `
    <circle cx="41" cy="41" r="34" fill="#ff9500"/>
    <polyline points="26,42 36,52 56,30" stroke="#ffffff" stroke-width="4" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
  `);

  // 金币空状态
  await saveIcon('coin-empty.png', `
    <circle cx="41" cy="41" r="28" stroke="#ffd700" stroke-width="2" fill="#fffbea" stroke-dasharray="4 4"/>
    <text x="41" y="49" text-anchor="middle" font-size="24" font-weight="bold" fill="#cc9900">$</text>
  `);

  // 通用空状态
  await saveIcon('empty.png', `
    <rect x="24" y="16" width="34" height="50" rx="4" stroke="#dddddd" stroke-width="2" fill="none"/>
    <polyline points="42,16 42,28 52,28" stroke="#dddddd" stroke-width="2" fill="none"/>
    <line x1="30" y1="32" x2="52" y2="32" stroke="#eeeeee" stroke-width="1.5"/>
    <line x1="30" y1="40" x2="46" y2="40" stroke="#eeeeee" stroke-width="1.5"/>
    <line x1="30" y1="48" x2="42" y2="48" stroke="#eeeeee" stroke-width="1.5"/>
  `);

  // 下载白色
  await saveIcon('download-white.png', `
    <path d="M21 12 L21 33 M14 26 L21 33 L28 26" stroke="#ffffff" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M8 36 L8 46 C8 50 11 53 15 53 L28 53 C32 53 35 50 35 36" stroke="#ffffff" stroke-width="2.5" fill="none" stroke-linecap="round"/>
  `, 43);

  // 分享
  await saveIcon('share.png', `
    <circle cx="25" cy="20" r="6" stroke="#07c160" stroke-width="2.5" fill="none"/>
    <circle cx="55" cy="40" r="6" stroke="#07c160" stroke-width="2.5" fill="none"/>
    <circle cx="25" cy="60" r="6" stroke="#07c160" stroke-width="2.5" fill="none"/>
    <line x1="30" y1="24" x2="49" y2="37" stroke="#07c160" stroke-width="2"/>
    <line x1="30" y1="56" x2="49" y2="43" stroke="#07c160" stroke-width="2"/>
  `);

  console.log('\n✅ 所有缺失图标生成完成！');
}

main().catch(console.error);
