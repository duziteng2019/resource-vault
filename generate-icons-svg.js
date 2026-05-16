const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const imagesDir = path.join(__dirname, 'miniprogram', 'images');

if (!fs.existsSync(imagesDir)) {
  fs.mkdirSync(imagesDir, { recursive: true });
}

// SVG模板生成器
function svgToPng(svgContent, width, height) {
  const fullSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">${svgContent}</svg>`;
  return Buffer.from(fullSvg);
}

async function saveIcon(name, svgContent, size = 81) {
  const buffer = svgToPng(svgContent, size, size);
  await sharp(buffer)
    .resize(size, size)
    .png()
    .toFile(path.join(imagesDir, name));
}

// ==================== TabBar 图标 (81x81) ====================

// 首页 - 房子
const homeSvg = `
<g fill="#999999">
  <path d="M40 15 L12 38 L18 38 L18 65 L32 65 L32 48 L48 48 L48 65 L62 65 L62 38 L68 38 Z" stroke="#999999" stroke-width="2" fill="none"/>
  <rect x="36" y="52" width="10" height="13" fill="#999999"/>
</g>`;

// 分类 - 四宫格
const categorySvg = `
<rect x="16" y="16" width="22" height="22" rx="4" fill="#999999"/>
<rect x="43" y="16" width="22" height="22" rx="4" fill="#999999"/>
<rect x="16" y="43" width="22" height="22" rx="4" fill="#999999"/>
<rect x="43" y="43" width="22" height="22" rx="4" fill="#999999"/>`;

// 签到 - 日历勾选
const signinSvg = `
<rect x="14" y="20" width="53" height="45" rx="6" stroke="#999999" stroke-width="2.5" fill="none"/>
<line x1="24" y1="14" x2="24" y2="26" stroke="#999999" stroke-width="2.5" stroke-linecap="round"/>
<line x1="57" y1="14" x2="57" y2="26" stroke="#999999" stroke-width="2.5" stroke-linecap="round"/>
<line x1="14" y1="33" x2="67" y2="33" stroke="#999999" stroke-width="2"/>
<polyline points="30,44 37,51 54,34" stroke="#999999" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`;

// 我的 - 用户
const mineSvg = `
<circle cx="41" cy="28" r="13" stroke="#999999" stroke-width="2.5" fill="none"/>
<path d="M17 66 C17 50 25 42 41 42 C57 42 65 50 65 66" stroke="#999999" stroke-width="2.5" fill="none" stroke-linecap="round"/>`;

// 选中态 - 绿色版本
function makeActive(svg) {
  return svg.replace(/#999999/g, '#07c160').replace(/#07c160/g, '#07c160');
}

// ==================== 功能图标 ====================

// 默认头像
const defaultAvatarSvg = `
<circle cx="50" cy="35" r="20" fill="#d0d0d0"/>
<ellipse cx="50" cy="78" rx="30" ry="18" fill="#d0d0d0"/>`;

// 箭头
const arrowGraySvg = `
<path d="M8 19 L30 19 M23 11 L31 19 L23 27" stroke="#cccccc" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`;

// 下载计数
const downloadCountSvg = `
<path d="M21 8 L21 29 M14 22 L21 29 L28 22" stroke="#64b869" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M7 32 L7 42 C7 46 10 49 14 49 L28 49 C32 49 35 46 35 42 L35 32" stroke="#64b869" stroke-width="2.5" fill="none" stroke-linecap="round"/>`;

// 搜索
const searchSvg = `
<circle cx="27" cy="27" r="14" stroke="#888888" stroke-width="2.5" fill="none"/>
<line x1="38" y1="38" x2="50" y2="50" stroke="#888888" stroke-width="2.5" stroke-linecap="round"/>`;

// 分享
const shareSvg = `
<circle cx="25" cy="20" r="6" stroke="#07c160" stroke-width="2.5" fill="none"/>
<circle cx="55" cy="40" r="6" stroke="#07c160" stroke-width="2.5" fill="none"/>
<circle cx="25" cy="60" r="6" stroke="#07c160" stroke-width="2.5" fill="none"/>
<line x1="30" y1="24" x2="49" y2="37" stroke="#07c160" stroke-width="2"/>
<line x1="30" y1="56" x2="49" y2="43" stroke="#07c160" stroke-width="2"/>`;

// 星星
const starSvg = `
<path d="M41 14 L47 27 L61 28 L51 38 L54 52 L41 45 L28 52 L31 38 L21 28 L35 27 Z" stroke="#ffaa00" stroke-width="2" fill="none" stroke-linejoin="round"/>`;

// 收藏
const favorSvg = `
<path d="M41 14 C30 14 24 24 24 32 C24 44 41 58 41 58 C41 58 58 44 58 32 C58 24 52 14 41 14Z" stroke="#ff6b6b" stroke-width="2.5" fill="none"/>`;

// 下载云
const downloadIconSvg = `
<path d="M18 38 C10 38 8 32 8 26 C8 18 14 14 20 14 C22 6 32 4 40 10 C46 6 56 10 56 20 C62 22 66 28 64 36 C63 42 57 44 50 44 L18 44Z" stroke="#07c160" stroke-width="2.5" fill="none"/>
<polyline points="32,34 41,45 50,34" stroke="#07c160" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
<line x1="41" y1="20" x2="41" y2="45" stroke="#07c160" stroke-width="2.5" stroke-linecap="round"/>`;

// 箭头右
const arrowRightSvg = `<path d="M16 20 L36 20 M28 12 L36 20 L28 28" stroke="#cccccc" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`;
// 箭头左
const arrowLeftSvg = `<path d="M36 20 L16 20 M24 28 L16 20 L24 12" stroke="#cccccc" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`;
// Chevron右
const chevronRightSvg = `<path d="M18 16 L30 28 L18 40" stroke="#bbbbbb" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`;
// Chevron左
const chevronLeftSvg = `<path d="M30 16 L18 28 L30 40" stroke="#bbbbbb" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`;

// 下载灰色
const downloadGraySvg = `
<path d="M21 12 L21 33 M14 26 L21 33 L28 26" stroke="#aaaaaa" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M8 36 L8 46 C8 50 11 53 15 53 L28 53 C32 53 35 50 35 46 L35 36" stroke="#aaaaaa" stroke-width="2.5" fill="none" stroke-linecap="round"/>`;

// 下载主色
const downloadPrimarySvg = `
<path d="M25 15 L25 38 M17 30 L25 38 L33 30" stroke="#07c160" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M10 42 L10 54 C10 59 14 63 19 63 L32 63 C37 63 41 59 41 54 L41 42" stroke="#07c160" stroke-width="3" fill="none" stroke-linecap="round"/>`;

// 云下载
const cloudDownloadSvg = `
<path d="M16 36 C8 36 6 30 6 24 C6 16 12 12 18 12 C20 4 30 2 38 8 C44 4 54 8 54 18 C60 20 64 26 62 34 C61 40 55 42 48 42L16 42Z" stroke="#07c160" stroke-width="2.5" fill="none"/>
<polyline points="30,32 39,43 48,32" stroke="#07c160" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
<line x1="39" y1="18" x2="39" y2="43" stroke="#07c160" stroke-width="2.5" stroke-linecap="round"/>`;

// 眼睛
const eyeSvg = `
<ellipse cx="41" cy="41" rx="28" ry="18" stroke="#666666" stroke-width="2" fill="none"/>
<circle cx="41" cy="41" r="10" stroke="#666666" stroke-width="2" fill="none"/>
<circle cx="41" cy="41" r="4" fill="#666666"/>`;

// 心形
const heartSvg = `
<path d="M41 62 C41 62 14 42 14 26 C14 16 22 12 30 16 C35 19 38 24 41 28 C44 24 47 19 52 16 C60 12 68 16 68 26 C68 42 41 62 41 62Z" stroke="#ff6b6b" stroke-width="2" fill="none"/>`;

// 设置齿轮
const settingsSvg = `
<circle cx="41" cy="41" r="12" stroke="#666666" stroke-width="2" fill="none"/>
<circle cx="41" cy="41" r="4" fill="#666666"/>
<g stroke="#666666" stroke-width="3" stroke-linecap="round">
  <line x1="41" y1="18" x2="41" y2="24"/><line x1="41" y1="58" x2="41" y2="64"/>
  <line x1="18" y1="41" x2="24" y2="41"/><line x1="58" y1="41" x2="64" y2="41"/>
  <line x1="24" y1="24" x2="28" y2="28"/><line x1="54" y1="54" x2="58" y2="58"/>
  <line x1="58" y1="24" x2="54" y2="28"/><line x1="28" y1="54" x2="24" y2="58"/>
</g>`;

// 关闭X
const closeSvg = `<path d="M20 20 L62 62 M62 20 L20 62" stroke="#999999" stroke-width="2.5" stroke-linecap="round"/>`;

// 勾选
const checkSvg = `<circle cx="41" cy="41" r="28" stroke="#07c160" stroke-width="2.5" fill="none"/><polyline points="26,42 36,52 56,30" stroke="#07c160" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`;

// 更多箭头
const moreArrowSvg = `<path d="M20 28 L32 41 L20 54" stroke="#dddddd" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`;

// 外链
const externalLinkSvg = `<path d="M30 52 L20 52 L20 20 L52 20 L52 30 M38 20 L52 20 L52 34 M42 18 L54 18 L54 30" stroke="#07c160" stroke-width="2.5" fill="none" stroke-linecap="round"/>`;

// 文件文本
const fileTextSvg = `<rect x="20" y="12" width="42" height="56" rx="4" stroke="#666666" stroke-width="2" fill="none"/><line x1="28" y1="28" x2="54" y2="28" stroke="#666666" stroke-width="2"/><line x1="28" y1="38" x2="54" y2="38" stroke="#666666" stroke-width="2"/><line x1="28" y1="48" x2="44" y2="48" stroke="#666666" stroke-width="2"/>`;

// 时钟
const clockSvg = `<circle cx="41" cy="41" r="26" stroke="#888888" stroke-width="2.5" fill="none"/><polyline points="41,22 41,41 55,41" stroke="#888888" stroke-width="2.5" fill="none" stroke-linecap="round"/>`;

// 盾牌
const shieldSvg = `<path d="M41 10 L18 20 L18 38 C18 54 28 64 41 70 C54 64 64 54 64 38 L64 20 Z" stroke="#07c160" stroke-width="2.5" fill="none"/><polyline points="30,42 38,50 54,34" stroke="#07c160" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`;

// 播放
const playSvg = `<polygon points="28,20 28,62 62,41" stroke="#07c160" stroke-width="2" fill="none" stroke-linejoin="round"/>`;

// 奖杯
const trophySvg = `<path d="M18 28 L18 18 C18 14 22 10 28 10 L54 10 C60 10 64 14 64 18 L64 28 C64 38 54 46 41 46 C28 46 18 38 18 28Z" stroke="#ffd700" stroke-width="2.5" fill="none"/><rect x="35" y="46" width="12" height="12" stroke="#ffd700" stroke-width="2" fill="none"/><path d="M28 58 L54 58" stroke="#ffd700" stroke-width="2.5" stroke-linecap="round"/><line x1="18" y1="28" x2="10" y2="28" stroke="#ffd700" stroke-width="2"/><line x1="64" y1="28" x2="72" y2="28" stroke="#ffd700" stroke-width="2"/>`;

// 徽章
const badgeCheckSvg = `<circle cx="41" cy="41" r="30" stroke="#07c160" stroke-width="2" fill="none"/><polyline points="26,42 36,52 56,30" stroke="#07c160" stroke-width="3.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`;

// 圆形勾选
const circleCheckSvg = `<circle cx="41" cy="41" r="28" stroke="#07c160" stroke-width="2.5" fill="#e8f8ec"/><polyline points="26,42 36,52 56,30" stroke="#07c160" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`;

// 圆形美元
const circleDollarSvg = `<circle cx="41" cy="41" r="28" stroke="#ffaa00" stroke-width="2" fill="#fff8e6"/><text x="41" y="49" text-anchor="middle" font-size="28" font-weight="bold" fill="#ffaa00">$</text>`;

// 剪贴板列表
const clipboardListSvg = `<rect x="22" y="14" width="38" height="54" rx="4" stroke="#666666" stroke-width="2" fill="none"/><path d="M32 14 L32 10 C32 8 34 6 36 6 L46 6 C48 6 50 8 50 10 L50 14" stroke="#666666" stroke-width="2" fill="none"/><line x1="30" y1="28" x2="52" y2="28" stroke="#666666" stroke-width="2.5" stroke-linecap="round"/><line x1="30" y1="38" x2="48" y2="38" stroke="#666666" stroke-width="2.5" stroke-linecap="round"/><line x1="30" y1="48" x2="44" y2="48" stroke="#666666" stroke-width="2.5" stroke-linecap="round"/>`;

// 日历勾选
const calendarCheckSvg = `<rect x="14" y="18" width="54" height="50" rx="5" stroke="#07c160" stroke-width="2.5" fill="none"/><line x1="26" y1="12" x2="26" y2="25" stroke="#07c160" stroke-width="2.5" stroke-linecap="round"/><line x1="56" y1="12" x2="56" y2="25" stroke="#07c160" stroke-width="2.5" stroke-linecap="round"/><line x1="14" y1="30" x2="68" y2="30" stroke="#07c160" stroke-width="2"/><polyline points="32,42 40,50 56,34" stroke="#07c160" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`;

// 书签
const bookmarkSvg = `<path d="M24 14 L58 14 L58 70 L41 56 L24 70 Z" stroke="#07c160" stroke-width="2.5" fill="none"/>`;
const bookmarkPlusSvg = `<path d="M24 14 L58 14 L58 70 L41 56 L24 70 Z" stroke="#07c160" stroke-width="2.5" fill="none"/><line x1="34" y1="34" x2="48" y2="34" stroke="#07c160" stroke-width="2.5" stroke-linecap="round"/><line x1="41" y1="27" x2="41" y2="41" stroke="#07c160" stroke-width="2.5" stroke-linecap="round"/>`;

// 向下图标
const downIconSvg = `<path d="M25 30 L41 46 L57 30" stroke="#666666" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`;
// 向上图标  
const upIconSvg = `<path d="M25 52 L41 36 L57 52" stroke="#666666" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`;

// 趋势上升
const trendingUpSvg = `<polyline points="16,56 30,36 40,44 58,20" stroke="#07c160" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/><polyline points="48,20 58,20 58,30" stroke="#07c160" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`;
// 趋势下降
const trendingDownSvg = `<polyline points="16,20 30,40 40,32 58,56" stroke="#ff6b6b" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/><polyline points="48,56 58,56 58,46" stroke="#ff6b6b" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`;

// 闪电
const zapIconSvg = `<polygon points="36,8 22,38 36,38 32,72 58,32 42,32" fill="#ffaa00" stroke="#ffaa00" stroke-width="1" stroke-linejoin="round"/>`;

// 礼物
const giftSvg = `<rect x="18" y="26" width="46" height="36" rx="3" stroke="#ff6b6b" stroke-width="2.5" fill="none"/><rect x="12" y="20" width="58" height="12" rx="3" stroke="#ff6b6b" stroke-width="2.5" fill="none"/><line x1="41" y1="20" x2="41" y2="62" stroke="#ff6b6b" stroke-width="2.5"/><path d="M12 26 Q28 16 38 26" stroke="#ff6b6b" stroke-width="2" fill="none"/><path d="M70 26 Q54 16 44 26" stroke="#ff6b6b" stroke-width="2" fill="none"/>`;
const giftIconSvg = giftSvg;

// 广告图标
const adIconSvg = `<rect x="14" y="20" width="54" height="40" rx="4" stroke="#ff9500" stroke-width="2" fill="none"/><line x1="24" y1="12" x2="58" y2="12" stroke="#ff9500" stroke-width="2" stroke-linecap="round"/><line x1="41" y1="12" x2="41" y2="20" stroke="#ff9500" stroke-width="2"/><text x="41" y="46" text-anchor="middle" font-size="14" font-weight="bold" fill="#ff9500">AD</text>`;

// 奖励相关
const rewardIconSvg = `<circle cx="41" cy="32" r="16" stroke="#ffaa00" stroke-width="2.5" fill="none"/><text x="41" y="38" text-anchor="middle" font-size="18" font-weight="bold" fill="#ffaa00">奖</text><path d="M28 52 C28 48 34 44 41 44 C48 44 54 48 54 52 L54 62 C54 66 48 68 41 68 C34 68 28 66 28 62Z" stroke="#ffaa00" stroke-width="2" fill="none"/>`;
const rewardCheckSvg = `<circle cx="41" cy="32" r="16" stroke="#ffaa00" stroke-width="2.5" fill="#fff8e6"/><polyline points="34,33 39,38 48,27" stroke="#ffaa00" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/><path d="M28 52 C28 48 34 44 41 44 C48 44 54 48 54 52 L54 62 C54 66 48 68 41 68 C34 68 28 66 28 62Z" stroke="#ffaa00" stroke-width="2" fill="none"/>`;

// 金币
const coinIconSvg = `<circle cx="41" cy="41" r="28" stroke="#ffd700" stroke-width="2.5" fill="#fffbea"/><text x="41" y="49" text-anchor="middle" font-size="24" font-weight="bold" fill="#cc9900">币</text>`;

// 信息
const infoIconSvg = `<circle cx="41" cy="41" r="26" stroke="#07c160" stroke-width="2.5" fill="none"/><text x="41" y="50" text-anchor="middle" font-size="30" font-weight="bold" fill="#07c160">i</text>`;
const infoSvg = `<circle cx="41" cy="41" r="26" stroke="#888888" stroke-width="2.5" fill="none"/><line x1="41" y1="28" x2="41" y2="32" stroke="#888888" stroke-width="3" stroke-linecap="round"/><line x1="41" y1="38" x2="41" y2="52" stroke="#888888" stroke-width="3" stroke-linecap="round"/>`;

// 手机
const smartphoneSvg = `<rect x="24" y="8" width="34" height="66" rx="5" stroke="#666666" stroke-width="2" fill="none"/><line x1="32" y1="66" x2="50" y2="66" stroke="#666666" stroke-width="2" stroke-linecap="round"/>`;

// 链接
const linkIconSvg = `<path d="M28 36 C22 36 18 40 18 46 C18 52 22 56 28 56 L34 56" stroke="#07c160" stroke-width="2.5" fill="none" stroke-linecap="round"/><path d="M54 46 C60 46 64 42 64 36 C64 30 60 26 54 26 L48 26" stroke="#07c160" stroke-width="2.5" fill="none" stroke-linecap="round"/><line x1="30" y1="26" x2="52" y2="56" stroke="#07c160" stroke-width="2.5" stroke-linecap="round"/>`;

// 时间图标
const timeIconSvg = `<circle cx="41" cy="41" r="26" stroke="#888888" stroke-width="2.5" fill="none"/><polyline points="41,24 41,41 54,48" stroke="#888888" stroke-width="2.5" fill="none" stroke-linecap="round"/>`;

// 文档
const docIconSvg = `<rect x="20" y="10" width="40" height="60" rx="4" stroke="#666666" stroke-width="2" fill="none"/><polyline points="40,10 40,24 54,24" stroke="#666666" stroke-width="2" fill="none"/><line x1="28" y1="36" x2="54" y2="36" stroke="#cccccc" stroke-width="1.5"/><line x1="28" y1="44" x2="54" y2="44" stroke="#cccccc" stroke-width="1.5"/><line x1="28" y1="52" x2="44" y2="52" stroke="#cccccc" stroke-width="1.5"/>`;

// 文件夹
const folderIconSvg = `<path d="M12 24 L12 62 C12 66 15 69 19 69 L63 69 C67 69 70 66 70 62 L70 28 C70 24 67 21 63 21 L42 21 L36 15 L19 15 C15 15 12 18 12 22Z" stroke="#ffaa00" stroke-width="2.5" fill="none"/>`;
const folderSvg = folderIconSvg;

// 列表图标
const listIconSvg = `<line x1="16" y1="20" x2="66" y2="20" stroke="#666666" stroke-width="2.5" stroke-linecap="round"/><line x1="16" y1="32" x2="66" y2="32" stroke="#cccccc" stroke-width="2" stroke-linecap="round"/><line x1="16" y1="44" x2="66" y2="44" stroke="#cccccc" stroke-width="2" stroke-linecap="round"/><line x1="16" y1="56" x2="66" y2="56" stroke="#cccccc" stroke-width="2" stroke-linecap="round"/><line x1="16" y1="68" x2="48" y2="68" stroke="#cccccc" stroke-width="2" stroke-linecap="round"/>`;

// 布局网格
const layoutGridSvg = `<rect x="14" y="14" width="26" height="26" rx="3" stroke="#666666" stroke-width="2" fill="none"/><rect x="42" y="14" width="26" height="26" rx="3" stroke="#cccccc" stroke-width="2" fill="none"/><rect x="14" y="42" width="26" height="26" rx="3" stroke="#cccccc" stroke-width="2" fill="none"/><rect x="42" y="42" width="26" height="26" rx="3" stroke="#cccccc" stroke-width="2" fill="none"/>`;

// 房子
const houseSvg = `<path d="M12 42 L12 64 L30 64 L30 50 L52 50 L52 64 L70 64 L70 42 L41 18 Z" stroke="#07c160" stroke-width="2.5" fill="none" stroke-linejoin="round"/>`;
// 用户
const userSvg = `<circle cx="41" cy="26" r="14" stroke="#666666" stroke-width="2.5" fill="none"/><path d="M16 68 C16 52 26 44 41 44 C56 44 66 52 66 68" stroke="#666666" stroke-width="2.5" fill="none" stroke-linecap="round"/>`;

// X关闭
const xSvg = `<path d="M22 22 L60 60 M60 22 L22 60" stroke="#999999" stroke-width="2.5" stroke-linecap="round"/>`;

// 闪光
const sparkleSvg = `<path d="M41 8 L44 28 L64 31 L44 34 L41 54 L38 34 L18 31 L38 28Z" stroke="#ffaa00" stroke-width="2" fill="none" stroke-linejoin="round"/>`;
const sparkleIconSvg = sparkleSvg;

// 下载
const downloadSvg = `<circle cx="41" cy="41" r="30" stroke="#07c160" stroke-width="2" fill="none"/><polyline points="28,38 41,52 54,38" stroke="#07c160" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round"/><line x1="41" y1="22" x2="41" y2="52" stroke="#07c160" stroke-width="3" stroke-linecap="round"/>`;

// 观看/浏览
const viewSvg = eyeSvg;

// 奖章
const awardSvg = `<circle cx="41" cy="30" r="22" stroke="#ffd700" stroke-width="2.5" fill="none"/><text x="41" y="38" text-anchor="middle" font-size="22" font-weight="bold" fill="#ffd700">★</text><path d="M28 54 L24 72 L41 62 L58 72 L54 54" stroke="#ffd700" stroke-width="2" fill="none"/>`;

// 返回白色
const backWhiteSvg = `<path d="M36 20 L18 38 L36 56" stroke="#ffffff" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round"/><line x1="18" y1="38" x2="60" y2="38" stroke="#ffffff" stroke-width="3" stroke-linecap="round"/>`;

// 分享白色
const shareWhiteSvg = shareSvg.replace(/#07c160/g, '#ffffff');

// ==================== 分类图标 ====================

// 办公 - 公文包
const iconBangongSvg = `
<rect x="16" y="30" width="50" height="34" rx="4" stroke="#4a90d9" stroke-width="2.5" fill="none"/>
<rect x="30" y="22" width="22" height="10" rx="2" stroke="#4a90d9" stroke-width="2.5" fill="none"/>
<line x1="41" y1="30" x2="41" y2="38" stroke="#4a90d9" stroke-width="2"/>
<rect x="35" y="54" width="12" height="6" rx="1" stroke="#4a90d9" stroke-width="2" fill="none"/>`;

// 设计 - 调色盘
const iconShejiSvg = `
<ellipse cx="41" cy="45" rx="28" ry="20" stroke="#e080a0" stroke-width="2.5" fill="none"/>
<circle cx="28" cy="38" r="7" fill="#ff6b6b"/>
<circle cx="54" cy="38" r="7" fill="#6bb6ff"/>
<circle cx="41" cy="52" r="7" fill="#69db7c"/>
<path d="M28 38 Q41 30 54 38 Q54 52 41 52 Q28 52 28 38Z" stroke="#e080a0" stroke-width="1.5" fill="none" opacity="0.3"/>`;

// 开发 - 代码括号
const iconKaifaSvg = `
<rect x="14" y="14" width="54" height="54" rx="6" stroke="#6c5ce7" stroke-width="2" fill="#f8f7ff"/>
<text x="41" y="50" text-anchor="middle" font-size="28" font-weight="bold" fill="#6c5ce7">&lt;/&gt;</text>`;

// 影音 - 播放按钮
const iconYingyinSvg = `
<rect x="14" y="20" width="54" height="42" rx="6" stroke="#e74c3c" stroke-width="2.5" fill="none"/>
<circle cx="41" cy="41" r="12" stroke="#e74c3c" stroke-width="2" fill="none"/>
<polygon points="38,34 38,48 50,41" fill="#e74c3c"/>`;

// 系统 - 设置齿轮
const iconXitongSvg = `
<circle cx="41" cy="41" r="16" stroke="#95a5a6" stroke-width="2.5" fill="none"/>
<circle cx="41" cy="41" r="6" fill="#95a5a6"/>
<g stroke="#95a5a6" stroke-width="3" stroke-linecap="round">
  <line x1="41" y1="16" x2="41" y2="23"/><line x1="41" y1="59" x2="41" y2="66"/>
  <line x1="16" y1="41" x2="23" y2="41"/><line x1="59" y1="41" x2="66" y2="41"/>
  <line x1="23" y1="23" x2="28" y2="28"/><line x1="54" y1="54" x2="59" y2="59"/>
  <line x1="59" y1="23" x2="54" y2="28"/><line x1="28" y1="54" x2="23" y2="59"/>
</g>`;

// 工具 - 扳手
const iconGongjuSvg = `
<path d="M56 20 C62 20 66 26 64 32 L30 66 C26 70 20 70 16 66 C12 62 12 56 16 52 L50 18 C52 16 54 16 56 18Z" stroke="#f39c12" stroke-width="2.5" fill="none" transform="rotate(45 41 41)"/>
<circle cx="30" cy="30" r="8" stroke="#f39c12" stroke-width="2.5" fill="none" transform="rotate(45 41 41)"/>`;

// 音乐
const iconYinyueSvg = `
<path d="M54 18 L54 44 C54 50 49 54 43 54 C37 54 32 50 32 44 C32 38 37 34 43 34 L48 34 L48 22 L30 26 L30 52 C30 58 25 62 19 62 C13 62 8 58 8 52 C8 46 13 42 19 42 L24 42 L24 18Z" stroke="#9b59b6" stroke-width="2.5" fill="none" transform="translate(10,2)"/>`;

// 教程 - 书本
const iconJiaochengSvg = `
<path d="M16 20 L16 64 C16 66 18 68 20 68 L40 62 L40 18 L20 24 C18 24 16 22 16 20Z" stroke="#e67e22" stroke-width="2.5" fill="none"/>
<path d="M40 18 L40 62 L60 68 C62 68 64 66 64 64 L64 20 C64 18 62 16 60 16 L40 22Z" stroke="#e67e22" stroke-width="2.5" fill="none"/>
<line x1="24" y1="34" x2="34" y2="30" stroke="#e67e22" stroke-width="2"/>
<line x1="24" y1="42" x2="34" y2="38" stroke="#e67e22" stroke-width="2"/>
<line x1="24" y1="50" x2="34" y2="46" stroke="#e67e22" stroke-width="2"/>
<line x1="46" y1="30" x2="56" y2="34" stroke="#e67e22" stroke-width="2"/>
<line x1="46" y1="38" x2="56" y2="42" stroke="#e67e22" stroke-width="2"/>
<line x1="46" y1="46" x2="56" y2="50" stroke="#e67e22" stroke-width="2"/>`;

// 其他
const iconQitaSvg = `
<circle cx="30" cy="30" r="5" fill="#aaa"/>
<circle cx="52" cy="30" r="5" fill="#ccc"/>
<circle cx="30" cy="52" r="5" fill="#ddd"/>
<circle cx="52" cy="52" r="5" fill="#eee"/>`;

// ==================== 资源类型图标 ====================

// PS
const psSvg = `
<rect x="10" y="10" width="62" height="62" rx="12" fill="#31a8ff"/>
<text x="41" y="52" text-anchor="middle" font-size="32" font-weight="bold" fill="#001e36" font-family="Arial, sans-serif">Ps</text>`;

// Office
const officeSvg = `
<rect x="10" y="10" width="62" height="62" rx="12" fill="#d83b01"/>
<text x="41" y="52" text-anchor="middle" font-size="28" font-weight="bold" fill="#ffffff" font-family="Arial, sans-serif">O</text>`;

// VSCode
const vscodeSvg = `
<rect x="10" y="10" width="62" height="62" rx="12" fill="#007acc"/>
<polygon points="26,24 26,58 36,41" fill="#ffffff" opacity="0.9"/>
<polygon points="56,24 56,58 46,41" fill="#ffffff" opacity="0.9"/>
<polygon points="36,32 46,50 52,46 40,28" fill="#ffffff" opacity="0.7"/>`;

// 剪映
const jianyingSvg = `
<rect x="10" y="10" width="62" height="62" rx="12" fill="#121212"/>
<text x="41" y="50" text-anchor="middle" font-size="24" font-weight="bold" fill="#ffffff" font-family="Arial, sans-serif">剪映</text>`;

// PR
const prSvg = `
<rect x="10" y="10" width="62" height="62" rx="12" fill="#9933ff"/>
<text x="41" y="52" text-anchor="middle" font-size="26" font-weight="bold" fill="#ffffff" font-family="Arial, sans-serif">Pr</text>`;

// Figma
const figmaSvg = `
<rect x="10" y="10" width="62" height="62" rx="12" fill="#1e1e1e"/>
<circle cx="32" cy="32" r="8" fill="#f24e1e"/>
<circle cx="50" cy="32" r="8" fill="#a259ff"/>
<circle cx="32" cy="50" r="8" fill="#1abcfe"/>
<circle cx="50" cy="50" r="8" fill="#0acf83"/>`;

// ==================== 主函数 ====================

async function main() {
  console.log('开始生成高质量SVG图标...');
  
  // TabBar
  await saveIcon('home.png', homeSvg);
  await saveIcon('home-active.png', makeActive(homeSvg));
  await saveIcon('category.png', categorySvg);
  await saveIcon('category-active.png', makeActive(categorySvg));
  await saveIcon('signin.png', signinSvg);
  await saveIcon('signin-active.png', makeActive(signinSvg.replace(/#999999/g, '#ff9500')));
  await saveIcon('mine.png', mineSvg);
  await saveIcon('mine-active.png', makeActive(mineSvg));

  // UI图标
  await saveIcon('default-avatar.png', defaultAvatarSvg, 100);
  await saveIcon('arrow-gray.png', arrowGraySvg, 40);
  await saveIcon('download-count.png', downloadCountSvg, 60);
  await saveIcon('search.png', searchSvg);
  await saveIcon('share-icon.png', shareSvg, 100);
  await saveIcon('star.png', starSvg);
  await saveIcon('favor.png', favorSvg);
  await saveIcon('download-icon.png', downloadIconSvg);
  await saveIcon('arrow-right.png', arrowRightSvg, 40);
  await saveIcon('arrow-left.png', arrowLeftSvg, 40);
  await saveIcon('chevron-right.png', chevronRightSvg, 40);
  await saveIcon('chevron-left.png', chevronLeftSvg, 40);
  await saveIcon('download-gray.png', downloadGraySvg, 60);
  await saveIcon('download-primary.png', downloadPrimarySvg, 60);
  await saveIcon('cloud-download.png', cloudDownloadSvg, 60);
  await saveIcon('eye.png', eyeSvg);
  await saveIcon('heart.png', heartSvg);
  await saveIcon('settings.png', settingsSvg);
  await saveIcon('close.png', closeSvg);
  await saveIcon('check.png', checkSvg);
  await saveIcon('more-arrow.png', moreArrowSvg, 40);
  await saveIcon('external-link.png', externalLinkSvg);
  await saveIcon('file-text.png', fileTextSvg);
  await saveIcon('clock.png', clockSvg);
  await saveIcon('shield.png', shieldSvg);
  await saveIcon('play.png', playSvg);
  await saveIcon('trophy.png', trophySvg);
  await saveIcon('badge-check.png', badgeCheckSvg);
  await saveIcon('circle-check.png', circleCheckSvg);
  await saveIcon('circle-dollar-sign.png', circleDollarSvg);
  await saveIcon('clipboard-list.png', clipboardListSvg);
  await saveIcon('calendar-check.png', calendarCheckSvg);
  await saveIcon('bookmark.png', bookmarkSvg);
  await saveIcon('bookmark-plus.png', bookmarkPlusSvg);
  await saveIcon('down-icon.png', downIconSvg, 40);
  await saveIcon('up-icon.png', upIconSvg, 40);
  await saveIcon('trending-up.png', trendingUpSvg);
  await saveIcon('trending-down.png', trendingDownSvg);
  await saveIcon('zap-icon.png', zapIconSvg);
  await saveIcon('gift.png', giftSvg);
  await saveIcon('gift-icon.png', giftIconSvg);
  await saveIcon('ad-icon.png', adIconSvg);
  await saveIcon('reward-icon.png', rewardIconSvg);
  await saveIcon('reward-check.png', rewardCheckSvg);
  await saveIcon('coin-icon.png', coinIconSvg);
  await saveIcon('info.png', infoSvg);
  await saveIcon('info-icon.png', infoIconSvg || infoSvg);
  await saveIcon('smartphone.png', smartphoneSvg);
  await saveIcon('link-icon.png', linkIconSvg);
  await saveIcon('time-icon.png', timeIconSvg);
  await saveIcon('doc-icon.png', docIconSvg);
  await saveIcon('folder.png', folderSvg);
  await saveIcon('folder-icon.png', folderIconSvg);
  await saveIcon('list-icon.png', listIconSvg);
  await saveIcon('layout-grid.png', layoutGridSvg);
  await saveIcon('house.png', houseSvg);
  await saveIcon('user.png', userSvg);
  await saveIcon('x.png', xSvg);
  await saveIcon('sparkle.png', sparkleSvg);
  await saveIcon('sparkle-icon.png', sparkleIconSvg);
  await saveIcon('download.png', downloadSvg);
  await saveIcon('view.png', viewSvg);
  await saveIcon('award.png', awardSvg);
  await saveIcon('back-white.png', backWhiteSvg);
  await saveIcon('share-white.png', shareWhiteSvg);

  // 分类图标
  await saveIcon('icon-bangong.png', iconBangongSvg);
  await saveIcon('icon-sheji.png', iconShejiSvg);
  await saveIcon('icon-kaifa.png', iconKaifaSvg);
  await saveIcon('icon-yingyin.png', iconYingyinSvg);
  await saveIcon('icon-xitong.png', iconXitongSvg);
  await saveIcon('icon-gongju.png', iconGongjuSvg);
  await saveIcon('icon-yinyue.png', iconYinyueSvg);
  await saveIcon('icon-jiaocheng.png', iconJiaochengSvg);
  await saveIcon('icon-qita.png', iconQitaSvg);

  // 资源类型
  await saveIcon('ps.png', psSvg);
  await saveIcon('office.png', officeSvg);
  await saveIcon('vscode.png', vscodeSvg);
  await saveIcon('jianying.png', jianyingSvg);
  await saveIcon('pr.png', prSvg);
  await saveIcon('figma.png', figmaSvg);

  // 大尺寸图标
  // Logo
  const logoBuffer = svgToPng(`
    <rect width="140" height="140" rx="20" fill="#07c160"/>
    <text x="70" y="85" text-anchor="middle" font-size="48" font-weight="bold" fill="#ffffff" font-family="Arial, sans-serif">资源宝库</text>
  `, 140, 140);
  await sharp(logoBuffer).png().toFile(path.join(imagesDir, 'logo.png'));

  // 空状态搜索
  const emptySearchBuffer = svgToPng(`
    <circle cx="100" cy="85" r="50" fill="#f5f5f5"/>
    <circle cx="85" cy="75" r="22" stroke="#ddd" stroke-width="3" fill="none"/>
    <line x1="102" y1="92" x2="120" y2="110" stroke="#ddd" stroke-width="3" stroke-linecap="round"/>
    <text x="100" y="155" text-anchor="middle" font-size="14" fill="#bbb">暂无搜索结果</text>
  `, 200, 200);
  await sharp(emptySearchBuffer).png().toFile(path.join(imagesDir, 'empty-search.png'));

  // 空状态下载
  const emptyDownloadBuffer = svgToPng(`
    <circle cx="100" cy="80" r="50" fill="#f5f5f5"/>
    <path d="M82 65 L82 88 M74 80 L82 88 L90 80" stroke="#ccc" stroke-width="3" fill="none" stroke-linecap="round"/>
    <path d="M70 92 L70 104 C70 108 74 112 79 112 L102 112 C107 112 111 108 111 104 L111 92" stroke="#ccc" stroke-width="3" fill="none" stroke-linecap="round"/>
    <text x="100" y="150" text-anchor="middle" font-size="14" fill="#bbb">暂无下载记录</text>
  `, 200, 200);
  await sharp(emptyDownloadBuffer).png().toFile(path.join(imagesDir, 'empty-download.png'));

  // 功能特点图标
  const featureIcons = [
    { name: 'feature-download', color: '#e8f8ec', stroke: '#07c160', icon: '<polyline points="28,28 42,44 56,28" stroke="#07c160" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round"/><path d="M22 48 L22 60 C22 65 26 69 32 69 L52 69 C58 69 62 65 62 60 L62 48" stroke="#07c160" stroke-width="3" fill="none" stroke-linecap="round"/>' },
    { name: 'feature-security', color: '#fff5e6', stroke: '#ff9500', icon: '<path d="M40 15 L20 24 L20 42 C20 56 28 66 40 72 C52 66 60 56 60 42 L60 24 Z" stroke="#ff9500" stroke-width="3" fill="none"/>' },
    { name: 'feature-free', color: '#ffeef0', stroke: '#ff6b6b', icon: '<text x="40" y="50" text-anchor="middle" font-size="28" font-weight="bold" fill="#ff6b6b">免</text>' },
    { name: 'feature-update', color: '#e8f0ff', stroke: '#4a90d9', icon: '<polyline points="24,50 36,34 46,42 62,18" stroke="#4a90d9" stroke-width="3" fill="none" stroke-linecap="round"/><polyline points="50,18 62,18 62,30" stroke="#4a90d9" stroke-width="3" fill="none" stroke-linecap="round"/>' }
  ];

  for (const f of featureIcons) {
    const buf = svgToPng(`<rect width="80" height="80" rx="16" fill="${f.color}"/>${f.icon}`, 80, 80);
    await sharp(buf).png().toFile(path.join(imagesDir, f.name + '.png'));
  }

  console.log(`✅ 完成! 生成了 ${fs.readdirSync(imagesDir).filter(f => f.endsWith('.png')).length} 个图标`);
}

main().catch(console.error);
