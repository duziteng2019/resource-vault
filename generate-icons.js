// generate-icons.js - 生成小程序图标（完整版）
const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

const imagesDir = path.join(__dirname, 'miniprogram', 'images');

// 确保目录存在
if (!fs.existsSync(imagesDir)) {
  fs.mkdirSync(imagesDir, { recursive: true });
}

// 创建简单的PNG
function createPNG(width, height, drawFn) {
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  
  // IHDR
  const ihdrData = Buffer.alloc(13);
  ihdrData.writeUInt32BE(width, 0);
  ihdrData.writeUInt32BE(height, 4);
  ihdrData[8] = 8; ihdrData[9] = 6; // RGBA
  ihdrData[10] = 0; ihdrData[11] = 0; ihdrData[12] = 0;
  
  const rawData = [];
  for (let y = 0; y < height; y++) {
    rawData.push(0);
    for (let x = 0; x < width; x++) {
      const pixel = drawFn(x, y, width, height);
      rawData.push(pixel.r, pixel.g, pixel.b, pixel.a || 255);
    }
  }
  
  const compressed = zlib.deflateSync(Buffer.from(rawData));
  
  return Buffer.concat([
    signature,
    createChunk('IHDR', ihdrData),
    createChunk('IDAT', compressed),
    createChunk('IEND', Buffer.alloc(0))
  ]);
}

function createChunk(type, data) {
  const len = Buffer.alloc(4); len.writeUInt32BE(data.length, 0);
  const typeB = Buffer.from(type);
  const crc = crc32(Buffer.concat([typeB, data]));
  const crcB = Buffer.alloc(4); crcB.writeUInt32BE(crc >>> 0, 0);
  return Buffer.concat([len, typeB, data, crcB]);
}

function crc32(buf) {
  let crc = 0xffffffff;
  const t = new Uint32Array(256);
  for (let n = 0; n < 256; n++) { let c = n; for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1; t[n] = c; }
  for (let i = 0; i < buf.length; i++) crc = t[(crc ^ buf[i]) & 0xff] ^ (crc >>> 8);
  return (crc ^ 0xffffffff) >>> 0;
}

const size = 81;

// ============ tabBar图标 ============

// tabBar图标 - 首页 (房子图标)
fs.writeFileSync(path.join(imagesDir, 'home.png'), createPNG(size, size, (x, y, w, h) => {
  const cx = w/2, cy = h/2;
  // 屋顶 - 三角形
  const roof = y > cy - 22 && y < cy - 5 && x > cx - (y - (cy - 22)) * 1.2 - 5 && x < cx + (y - (cy - 22)) * 1.2 + 5;
  // 屋顶边框线
  const roofLeft = Math.abs((x - cx + 20) - (y - (cy - 22)) * 1.2) < 3 && y > cy - 22 && y < cy - 5;
  const roofRight = Math.abs((x - cx - 20) + (y - (cy - 22)) * 1.2) < 3 && y > cy - 22 && y < cy - 5;
  // 房屋主体
  const body = y >= cy - 5 && y < cy + 22 && x > cx - 22 && x < cx + 22;
  // 门
  const door = y > cy + 5 && y < cy + 22 && x > cx - 8 && x < cx + 8;
  // 烟囱
  const chimney = x > cx + 12 && x < cx + 20 && y > cy - 18 && y < cy - 8;
  return (roof || roofLeft || roofRight || body || chimney) && !door ? {r:153,g:153,b:153} : {r:0,g:0,b:0,a:0};
}));

// tabBar图标 - 首页选中
fs.writeFileSync(path.join(imagesDir, 'home-active.png'), createPNG(size, size, (x, y, w, h) => {
  const cx = w/2, cy = h/2;
  const roof = y > cy - 22 && y < cy - 5 && x > cx - (y - (cy - 22)) * 1.2 - 5 && x < cx + (y - (cy - 22)) * 1.2 + 5;
  const roofLeft = Math.abs((x - cx + 20) - (y - (cy - 22)) * 1.2) < 3 && y > cy - 22 && y < cy - 5;
  const roofRight = Math.abs((x - cx - 20) + (y - (cy - 22)) * 1.2) < 3 && y > cy - 22 && y < cy - 5;
  const body = y >= cy - 5 && y < cy + 22 && x > cx - 22 && x < cx + 22;
  const door = y > cy + 5 && y < cy + 22 && x > cx - 8 && x < cx + 8;
  const chimney = x > cx + 12 && x < cx + 20 && y > cy - 18 && y < cy - 8;
  return (roof || roofLeft || roofRight || body || chimney) && !door ? {r:7,g:193,b:96} : {r:0,g:0,b:0,a:0};
}));

// tabBar图标 - 分类 (九宫格图标)
fs.writeFileSync(path.join(imagesDir, 'category.png'), createPNG(size, size, (x, y, w, h) => {
  const p = 20, gap = 5, s = (w - p*2 - gap) / 2;
  // 四个方块
  const r1 = x >= p && x < p+s && y >= p && y < p+s;
  const r2 = x >= p+s+gap && x < p+s*2+gap && y >= p && y < p+s;
  const r3 = x >= p && x < p+s && y >= p+s+gap && y < p+s*2+gap;
  const r4 = x >= p+s+gap && x < p+s*2+gap && y >= p+s+gap && y < p+s*2+gap;
  // 边框线
  const hLine1 = Math.abs(y - (p+s+gap/2)) < 2 && x > p-2 && x < w-p+2;
  const vLine1 = Math.abs(x - (p+s+gap/2)) < 2 && y > p-2 && y < w-p+2;
  return (r1 || r2 || r3 || r4 || hLine1 || vLine1) ? {r:153,g:153,b:153} : {r:0,g:0,b:0,a:0};
}));

// tabBar图标 - 分类选中
fs.writeFileSync(path.join(imagesDir, 'category-active.png'), createPNG(size, size, (x, y, w, h) => {
  const p = 20, gap = 5, s = (w - p*2 - gap) / 2;
  const r1 = x >= p && x < p+s && y >= p && y < p+s;
  const r2 = x >= p+s+gap && x < p+s*2+gap && y >= p && y < p+s;
  const r3 = x >= p && x < p+s && y >= p+s+gap && y < p+s*2+gap;
  const r4 = x >= p+s+gap && x < p+s*2+gap && y >= p+s+gap && y < p+s*2+gap;
  const hLine1 = Math.abs(y - (p+s+gap/2)) < 2 && x > p-2 && x < w-p+2;
  const vLine1 = Math.abs(x - (p+s+gap/2)) < 2 && y > p-2 && y < w-p+2;
  return (r1 || r2 || r3 || r4 || hLine1 || vLine1) ? {r:7,g:193,b:96} : {r:0,g:0,b:0,a:0};
}));

// tabBar图标 - 签到 (日历+对勾图标)
fs.writeFileSync(path.join(imagesDir, 'signin.png'), createPNG(size, size, (x, y, w, h) => {
  const cx = w/2, cy = h/2;
  // 日历外框
  const frame = x > 14 && x < 67 && y > 20 && y < 62;
  const inner = x > 18 && x < 63 && y > 24 && y < 58;
  // 日历顶部横条
  const topBar = y > 20 && y < 30 && x > 14 && x < 67;
  // 日历挂钩
  const hook1 = x > 24 && x < 30 && y > 12 && y < 24;
  const hook2 = x > 51 && x < 57 && y > 12 && y < 24;
  // 对勾
  const check1 = x > 28 && x < 38 && y > 38 && Math.abs(y - 38 - (x - 28) * 0.6) < 3;
  const check2 = x > 35 && x < 55 && y > 38 && Math.abs(y - 42 + (x - 35) * 0.8) < 3;
  return (frame && !inner) || topBar || hook1 || hook2 || check1 || check2 ? {r:153,g:153,b:153} : {r:0,g:0,b:0,a:0};
}));

// tabBar图标 - 签到选中
fs.writeFileSync(path.join(imagesDir, 'signin-active.png'), createPNG(size, size, (x, y, w, h) => {
  const cx = w/2, cy = h/2;
  const frame = x > 14 && x < 67 && y > 20 && y < 62;
  const inner = x > 18 && x < 63 && y > 24 && y < 58;
  const topBar = y > 20 && y < 30 && x > 14 && x < 67;
  const hook1 = x > 24 && x < 30 && y > 12 && y < 24;
  const hook2 = x > 51 && x < 57 && y > 12 && y < 24;
  const check1 = x > 28 && x < 38 && y > 38 && Math.abs(y - 38 - (x - 28) * 0.6) < 3;
  const check2 = x > 35 && x < 55 && y > 38 && Math.abs(y - 42 + (x - 35) * 0.8) < 3;
  return (frame && !inner) || topBar || hook1 || hook2 || check1 || check2 ? {r:255,g:149,b:0} : {r:0,g:0,b:0,a:0};
}));

// tabBar图标 - 我的 (用户头像图标)
fs.writeFileSync(path.join(imagesDir, 'mine.png'), createPNG(size, size, (x, y, w, h) => {
  const cx = w/2, cy = h/2;
  // 头部圆形
  const head = Math.hypot(x - cx, y - 30) < 14;
  // 头部轮廓
  const headOutline = Math.abs(Math.hypot(x - cx, y - 30) - 14) < 2;
  // 身体
  const body = y > 40 && y < 65 && x > cx - 20 + (y - 40) * 0.15 && x < cx + 20 - (y - 40) * 0.15;
  // 身体轮廓
  const bodyLeft = Math.abs(x - (cx - 20 + (y - 40) * 0.15)) < 2 && y > 40 && y < 65;
  const bodyRight = Math.abs(x - (cx + 20 - (y - 40) * 0.15)) < 2 && y > 40 && y < 65;
  const bodyBottom = Math.abs(y - 65) < 2 && x > cx - 16 && x < cx + 16;
  return head || headOutline || body || bodyLeft || bodyRight || bodyBottom ? {r:153,g:153,b:153} : {r:0,g:0,b:0,a:0};
}));

// tabBar图标 - 我的选中
fs.writeFileSync(path.join(imagesDir, 'mine-active.png'), createPNG(size, size, (x, y, w, h) => {
  const cx = w/2, cy = h/2;
  const head = Math.hypot(x - cx, y - 30) < 14;
  const headOutline = Math.abs(Math.hypot(x - cx, y - 30) - 14) < 2;
  const body = y > 40 && y < 65 && x > cx - 20 + (y - 40) * 0.15 && x < cx + 20 - (y - 40) * 0.15;
  const bodyLeft = Math.abs(x - (cx - 20 + (y - 40) * 0.15)) < 2 && y > 40 && y < 65;
  const bodyRight = Math.abs(x - (cx + 20 - (y - 40) * 0.15)) < 2 && y > 40 && y < 65;
  const bodyBottom = Math.abs(y - 65) < 2 && x > cx - 16 && x < cx + 16;
  return head || headOutline || body || bodyLeft || bodyRight || bodyBottom ? {r:7,g:193,b:96} : {r:0,g:0,b:0,a:0};
}));

// ============ 其他UI图标 ============

// 默认头像
fs.writeFileSync(path.join(imagesDir, 'default-avatar.png'), createPNG(100, 100, (x, y, w, h) => {
  const cx = w/2, cy = 35, r = 25;
  const inHead = Math.hypot(x - cx, y - cy) < r;
  const inBody = y > cy + r - 5 && y < h - 15 && x > cx - 30 && x < cx + 30;
  return (inHead || inBody) ? {r:180,g:180,b:180} : {r:0,g:0,b:0,a:0};
}));

// 灰色箭头
fs.writeFileSync(path.join(imagesDir, 'arrow-gray.png'), createPNG(40, 40, (x, y, w, h) => {
  const cx = w/2, cy = h/2;
  const arrow = (x > 8 && x < 32 && y > cy - 3 && y < cy + 3) ||
                (x > 20 && Math.abs(y - cy - (x - 20) * 0.7) < 4) ||
                (x > 20 && Math.abs(y - cy + (x - 20) * 0.7) < 4);
  return arrow ? {r:180,g:180,b:180} : {r:0,g:0,b:0,a:0};
}));

// 下载计数图标
fs.writeFileSync(path.join(imagesDir, 'download-count.png'), createPNG(60, 60, (x, y, w, h) => {
  const cx = w/2, cy = h/2;
  const circle = Math.hypot(x - cx, y - cy) < 25;
  const arrow = circle && x > cx - 8 && x < cx + 8 && y > cy - 12 && y < cy + 12;
  return circle ? {r:100,g:180,b:100} : {r:0,g:0,b:0,a:0};
}));

// ============ 分类图标 ============

// 办公 - 公文包图标
fs.writeFileSync(path.join(imagesDir, 'icon-bangong.png'), createPNG(81, 81, (x, y, w, h) => {
  const cx = w/2, cy = h/2;
  const inRect = x > 15 && x < 66 && y > 30 && y < 55;
  const inHandle = x > 30 && x < 51 && y > 22 && y < 32;
  const inFold = x > 35 && x < 46 && y > 50 && y < 56;
  return (inRect || inHandle || inFold) ? {r:26,g:26,b:26} : {r:0,g:0,b:0,a:0};
}));

// 设计 - 调色板图标
fs.writeFileSync(path.join(imagesDir, 'icon-sheji.png'), createPNG(81, 81, (x, y, w, h) => {
  const cx = w/2, cy = h/2, r = 28;
  const inCircle = Math.hypot(x - cx, y - cy) < r;
  const dot1 = Math.hypot(x - (cx-8), y - (cy-8)) < 6;
  const dot2 = Math.hypot(x - (cx+8), y - (cy-8)) < 6;
  const dot3 = Math.hypot(x - cx, y - (cy+10)) < 6;
  return dot1 ? {r:255,g:100,b:100} : dot2 ? {r:100,g:100,b:255} : dot3 ? {r:100,g:255,b:100} : inCircle ? {r:220,g:180,b:140} : {r:0,g:0,b:0,a:0};
}));

// 开发 - 代码图标
fs.writeFileSync(path.join(imagesDir, 'icon-kaifa.png'), createPNG(81, 81, (x, y, w, h) => {
  const cx = w/2, cy = h/2;
  const line1 = y > 25 && y < 31 && x > 20 && x < 55;
  const line2 = y > 35 && y < 41 && x > 25 && x < 50;
  const line3 = y > 45 && y < 51 && x > 30 && x < 60;
  const angle1 = (x > 15 && x < 25 && y > 15 && Math.abs(y - 15 - (x - 15) * 0.8) < 4);
  const angle2 = (x > 55 && x < 65 && y > 55 && Math.abs(y - 55 + (x - 55) * 0.8) < 4);
  return (line1 || line2 || line3 || angle1 || angle2) ? {r:26,g:26,b:26} : {r:0,g:0,b:0,a:0};
}));

// 影音 - 摄像机图标
fs.writeFileSync(path.join(imagesDir, 'icon-yingyin.png'), createPNG(81, 81, (x, y, w, h) => {
  const cx = w/2, cy = h/2;
  const inBody = x > 18 && x < 58 && y > 28 && y < 52;
  const lens = Math.hypot(x - 58, y - cy) < 10;
  const inTape = x > 35 && x < 45 && y > 20 && y < 28;
  return (inBody || lens || inTape) ? {r:26,g:26,b:26} : {r:0,g:0,b:0,a:0};
}));

// 系统 - 设置齿轮图标
fs.writeFileSync(path.join(imagesDir, 'icon-xitong.png'), createPNG(81, 81, (x, y, w, h) => {
  const cx = w/2, cy = h/2;
  const inCircle = Math.hypot(x - cx, y - cy) < 15;
  for (let i = 0; i < 6; i++) {
    const angle = (i * 60 - 90) * Math.PI / 180;
    const tx = cx + Math.cos(angle) * 25;
    const ty = cy + Math.sin(angle) * 25;
    if (Math.hypot(x - tx, y - ty) < 8) return {r:26,g:26,b:26};
  }
  return inCircle ? {r:26,g:26,b:26} : {r:0,g:0,b:0,a:0};
}));

// 工具 - 扳手图标
fs.writeFileSync(path.join(imagesDir, 'icon-gongju.png'), createPNG(81, 81, (x, y, w, h) => {
  const cx = w/2, cy = h/2;
  // 斜向扳手
  const rotated = (x - cx) * 0.7 + (y - cy) * 0.7;
  const inHandle = Math.abs(rotated - 5) < 5 && x > 25 && y < 60;
  const inHead = Math.abs(x - 50) < 12 && y > 18 && y < 35;
  return (inHandle || inHead) ? {r:26,g:26,b:26} : {r:0,g:0,b:0,a:0};
}));

// ============ 资源类型图标 ============

// Photoshop图标
fs.writeFileSync(path.join(imagesDir, 'ps.png'), createPNG(81, 81, (x, y, w, h) => {
  const cx = w/2, cy = h/2;
  const bg = Math.hypot(x - cx, y - cy) < 35;
  const letter = x > 22 && x < 58 && y > 28 && y < 52 && !(x > 35 && x < 45 && y > 38 && y < 45);
  return bg ? {r:49,g:94,b:170} : letter ? {r:255,g:255,b:255} : {r:0,g:0,b:0,a:0};
}));

// Office图标
fs.writeFileSync(path.join(imagesDir, 'office.png'), createPNG(81, 81, (x, y, w, h) => {
  const cx = w/2, cy = h/2;
  const bg = Math.hypot(x - cx, y - cy) < 35;
  const letter = x > 25 && x < 55 && y > 28 && y < 52;
  return bg ? {r:210,g:46,b:46} : letter ? {r:255,g:255,b:255} : {r:0,g:0,b:0,a:0};
}));

// VSCode图标
fs.writeFileSync(path.join(imagesDir, 'vscode.png'), createPNG(81, 81, (x, y, w, h) => {
  const cx = w/2, cy = h/2;
  const bg = Math.hypot(x - cx, y - cy) < 35;
  const v1 = x > 25 && x < 40 && y > 28 && y < 55;
  const v2 = x > 40 && x < 55 && y > 28 && y < 55;
  const s1 = x > 40 && x < 55 && y > 38 && y < 48;
  return bg ? {r:7,g:93,b:188} : (v1 || v2 || s1) ? {r:255,g:255,b:255} : {r:0,g:0,b:0,a:0};
}));

// 剪映图标
fs.writeFileSync(path.join(imagesDir, 'jianying.png'), createPNG(81, 81, (x, y, w, h) => {
  const cx = w/2, cy = h/2;
  const bg = Math.hypot(x - cx, y - cy) < 35;
  const play = x > 32 && x < 52 && y > 32 && y < 50 && !(x > 38 && y < 42);
  return bg ? {r:10,g:10,b:10} : play ? {r:255,g:255,b:255} : {r:0,g:0,b:0,a:0};
}));

// Premiere图标
fs.writeFileSync(path.join(imagesDir, 'pr.png'), createPNG(81, 81, (x, y, w, h) => {
  const cx = w/2, cy = h/2;
  const bg = Math.hypot(x - cx, y - cy) < 35;
  const letter = x > 25 && x < 55 && y > 28 && y < 52;
  return bg ? {r:200,g:150,b:200} : letter ? {r:255,g:255,b:255} : {r:0,g:0,b:0,a:0};
}));

// Figma图标
fs.writeFileSync(path.join(imagesDir, 'figma.png'), createPNG(81, 81, (x, y, w, h) => {
  const cx = w/2, cy = h/2;
  const bg = Math.hypot(x - cx, y - cy) < 35;
  const f1 = x > 22 && x < 32 && y > 25 && y < 55;
  const f2 = x > 35 && x < 58 && y > 25 && y < 40;
  return bg ? {r:10,g:10,b:10} : (f1 || f2) ? {r:255,g:255,b:255} : {r:0,g:0,b:0,a:0};
}));

// ============ 其他资源类型 ============

// 音乐图标
fs.writeFileSync(path.join(imagesDir, 'icon-yinyue.png'), createPNG(81, 81, (x, y, w, h) => {
  const cx = w/2, cy = h/2;
  const note1 = Math.hypot(x - 28, y - 30) < 12;
  const note2 = Math.hypot(x - 50, y - 35) < 12;
  const line1 = x > 28 && x < 50 && y > 18 && y < 23;
  const line2 = x > 50 && x < 55 && y > 23 && y < 35;
  const line3 = x > 28 && x < 33 && y > 18 && y < 30;
  return (note1 || note2) ? {r:26,g:26,b:26} : (line1 || line2 || line3) ? {r:26,g:26,b:26} : {r:0,g:0,b:0,a:0};
}));

// 教程图标
fs.writeFileSync(path.join(imagesDir, 'icon-jiaocheng.png'), createPNG(81, 81, (x, y, w, h) => {
  const cx = w/2, cy = h/2;
  const inBook = x > 18 && x < 63 && y > 25 && y < 56;
  const spine = x > 18 && x < 25 && y > 25 && y < 56;
  const line1 = x > 28 && x < 58 && y > 32 && y < 36;
  const line2 = x > 28 && x < 58 && y > 40 && y < 44;
  const line3 = x > 28 && x < 50 && y > 48 && y < 52;
  return spine ? {r:200,g:150,b:100} : (inBook || line1 || line2 || line3) ? {r:255,g:200,b:150} : {r:0,g:0,b:0,a:0};
}));

// 其他图标
fs.writeFileSync(path.join(imagesDir, 'icon-qita.png'), createPNG(81, 81, (x, y, w, h) => {
  const cx = w/2, cy = h/2;
  const d1 = Math.hypot(x - cx, y - (cy - 15)) < 5;
  const d2 = Math.hypot(x - cx, y - cy) < 5;
  const d3 = Math.hypot(x - cx, y - (cy + 15)) < 5;
  return (d1 || d2 || d3) ? {r:150,g:150,b:150} : {r:0,g:0,b:0,a:0};
}));

// ============ 其他UI图标 ============

// Logo
fs.writeFileSync(path.join(imagesDir, 'logo.png'), createPNG(140, 140, (x, y, w, h) => {
  const cx = w/2, cy = h/2, r = 60;
  const inCircle = Math.hypot(x - cx, y - cy) < r;
  const inRect = x > cx - 25 && x < cx + 25 && y > cy - 30 && y < cy + 30;
  return (inCircle && !inRect) ? {r:7,g:193,b:96} : inRect ? {r:7,g:193,b:96} : {r:240,g:240,b:240};
}));

// 空状态 - 搜索
fs.writeFileSync(path.join(imagesDir, 'empty-search.png'), createPNG(200, 200, (x, y, w, h) => {
  const cx = w/2, cy = h/2, r = 70;
  const inCircle = Math.hypot(x - cx, y - cy) < r;
  return inCircle ? {r:245,g:245,b:245} : {r:0,g:0,b:0,a:0};
}));

// 空状态 - 下载
fs.writeFileSync(path.join(imagesDir, 'empty-download.png'), createPNG(200, 200, (x, y, w, h) => {
  const cx = w/2, cy = h/2, r = 70;
  const inCircle = Math.hypot(x - cx, y - cy) < r;
  return inCircle ? {r:245,g:245,b:245} : {r:0,g:0,b:0,a:0};
}));

// 分享图标
fs.writeFileSync(path.join(imagesDir, 'share-icon.png'), createPNG(100, 100, (x, y, w, h) => {
  const cx = w/2, cy = h/2;
  const inCircle = Math.hypot(x - cx, y - cy) < 40;
  return inCircle ? {r:7,g:193,b:96} : {r:0,g:0,b:0,a:0};
}));

// 功能特点图标
['feature-download.png', 'feature-security.png', 'feature-free.png', 'feature-update.png'].forEach(f => {
  fs.writeFileSync(path.join(imagesDir, f), createPNG(80, 80, (x, y, w, h) => {
    const cx = w/2, cy = h/2, r = 36;
    const inCircle = Math.hypot(x - cx, y - cy) < r;
    return inCircle ? {r:232,g:248,b:237} : {r:0,g:0,b:0,a:0};
  }));
});

console.log('所有图标生成完成!');
console.log('生成的文件列表:');
console.log(fs.readdirSync(imagesDir).filter(f => f.endsWith('.png')));
