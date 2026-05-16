// generate-missing-icons-2.js - 生成缺失的图标
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const imagesDir = path.join(__dirname, 'images');

// 确保目录存在
if (!fs.existsSync(imagesDir)) {
  fs.mkdirSync(imagesDir, { recursive: true });
}

// SVG图标定义
const iconTemplates = {
  // 菜单图标
  'history': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" fill="none">
    <rect width="48" height="48" rx="12" fill="#f5f5f5"/>
    <circle cx="24" cy="26" r="12" stroke="#666666" stroke-width="3" fill="none"/>
    <path d="M24 20v6l4 2" stroke="#666666" stroke-width="3" stroke-linecap="round"/>
    <path d="M20 10h8" stroke="#666666" stroke-width="3" stroke-linecap="round"/>
  </svg>`,
  
  'help': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" fill="none">
    <rect width="48" height="48" rx="12" fill="#f5f5f5"/>
    <circle cx="24" cy="24" r="14" stroke="#666666" stroke-width="3" fill="none"/>
    <path d="M18 18c0-3.3 2.7-6 6-6s6 2.7 6 6c0 4-6 4-6 8" stroke="#666666" stroke-width="3" stroke-linecap="round"/>
    <circle cx="24" cy="34" r="2" fill="#666666"/>
  </svg>`,
  
  'feedback': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" fill="none">
    <rect width="48" height="48" rx="12" fill="#f5f5f5"/>
    <path d="M12 12h24v20c0 4-4 6-6 6H18l-6 6v-6H12V12z" stroke="#666666" stroke-width="3" fill="none"/>
    <path d="M16 20h16M16 28h10" stroke="#666666" stroke-width="3" stroke-linecap="round"/>
  </svg>`,
  
  'info': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" fill="none">
    <rect width="48" height="48" rx="12" fill="#f5f5f5"/>
    <circle cx="24" cy="24" r="14" stroke="#666666" stroke-width="3" fill="none"/>
    <path d="M24 20v12M24 16v2" stroke="#666666" stroke-width="3" stroke-linecap="round"/>
  </svg>`,
  
  // 资源封面
  'vscode': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 80" fill="none">
    <defs>
      <linearGradient id="vscode-bg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#007ACC"/>
        <stop offset="100%" stop-color="#005FCC"/>
      </linearGradient>
    </defs>
    <rect width="120" height="80" rx="8" fill="url(#vscode-bg)"/>
    <text x="60" y="45" text-anchor="middle" fill="white" font-size="18" font-weight="bold" font-family="Arial">VS Code</text>
    <text x="60" y="60" text-anchor="middle" fill="rgba(255,255,255,0.8)" font-size="10" font-family="Arial">代码编辑器</text>
  </svg>`,
  
  'ps': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 80" fill="none">
    <defs>
      <linearGradient id="ps-bg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#31A8FF"/>
        <stop offset="100%" stop-color="#001E36"/>
      </linearGradient>
    </defs>
    <rect width="120" height="80" rx="8" fill="url(#ps-bg)"/>
    <text x="60" y="45" text-anchor="middle" fill="white" font-size="18" font-weight="bold" font-family="Arial">Photoshop</text>
    <text x="60" y="60" text-anchor="middle" fill="rgba(255,255,255,0.8)" font-size="10" font-family="Arial">图像处理</text>
  </svg>`,
  
  'office': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 80" fill="none">
    <defs>
      <linearGradient id="office-bg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#D83B01"/>
        <stop offset="100%" stop-color="#B7472A"/>
      </linearGradient>
    </defs>
    <rect width="120" height="80" rx="8" fill="url(#office-bg)"/>
    <text x="60" y="45" text-anchor="middle" fill="white" font-size="16" font-weight="bold" font-family="Arial">Office</text>
    <text x="60" y="60" text-anchor="middle" fill="rgba(255,255,255,0.8)" font-size="10" font-family="Arial">办公套件</text>
  </svg>`,
  
  'pr': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 80" fill="none">
    <defs>
      <linearGradient id="pr-bg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#9999FF"/>
        <stop offset="100%" stop-color="#9999FF"/>
      </linearGradient>
    </defs>
    <rect width="120" height="80" rx="8" fill="#00005B"/>
    <text x="60" y="45" text-anchor="middle" fill="white" font-size="18" font-weight="bold" font-family="Arial">Premiere</text>
    <text x="60" y="60" text-anchor="middle" fill="rgba(255,255,255,0.8)" font-size="10" font-family="Arial">视频编辑</text>
  </svg>`,
  
  'jianying': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 80" fill="none">
    <defs>
      <linearGradient id="jianying-bg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#00C4CC"/>
        <stop offset="100%" stop-color="#7856FF"/>
      </linearGradient>
    </defs>
    <rect width="120" height="80" rx="8" fill="url(#jianying-bg)"/>
    <text x="60" y="45" text-anchor="middle" fill="white" font-size="14" font-weight="bold" font-family="Arial">剪映专业版</text>
    <text x="60" y="60" text-anchor="middle" fill="rgba(255,255,255,0.8)" font-size="10" font-family="Arial">视频剪辑</text>
  </svg>`,
  
  'figma': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 80" fill="none">
    <defs>
      <linearGradient id="figma-bg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#F24E1E"/>
        <stop offset="50%" stop-color="#A259FF"/>
        <stop offset="100%" stop-color="#1ABCFE"/>
      </linearGradient>
    </defs>
    <rect width="120" height="80" rx="8" fill="#1E1E1E"/>
    <text x="60" y="45" text-anchor="middle" fill="white" font-size="18" font-weight="bold" font-family="Arial">Figma</text>
    <text x="60" y="60" text-anchor="middle" fill="rgba(255,255,255,0.8)" font-size="10" font-family="Arial">设计工具</text>
  </svg>`,
  
  'notion': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 80" fill="none">
    <defs>
      <linearGradient id="notion-bg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#ffffff"/>
        <stop offset="100%" stop-color="#E8E8E8"/>
      </linearGradient>
    </defs>
    <rect width="120" height="80" rx="8" fill="#191919"/>
    <text x="60" y="45" text-anchor="middle" fill="white" font-size="16" font-weight="bold" font-family="Arial">Notion</text>
    <text x="60" y="60" text-anchor="middle" fill="rgba(255,255,255,0.8)" font-size="10" font-family="Arial">笔记工具</text>
  </svg>`,
  
  'meeting': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 80" fill="none">
    <defs>
      <linearGradient id="meeting-bg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#45C255"/>
        <stop offset="100%" stop-color="#33A531"/>
      </linearGradient>
    </defs>
    <rect width="120" height="80" rx="8" fill="url(#meeting-bg)"/>
    <text x="60" y="45" text-anchor="middle" fill="white" font-size="14" font-weight="bold" font-family="Arial">会议软件</text>
    <text x="60" y="60" text-anchor="middle" fill="rgba(255,255,255,0.8)" font-size="10" font-family="Arial">在线会议</text>
  </svg>`,
  
  'docker': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 80" fill="none">
    <defs>
      <linearGradient id="docker-bg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#2496ED"/>
        <stop offset="100%" stop-color="#1B73AB"/>
      </linearGradient>
    </defs>
    <rect width="120" height="80" rx="8" fill="url(#docker-bg)"/>
    <text x="60" y="45" text-anchor="middle" fill="white" font-size="16" font-weight="bold" font-family="Arial">Docker</text>
    <text x="60" y="60" text-anchor="middle" fill="rgba(255,255,255,0.8)" font-size="10" font-family="Arial">容器引擎</text>
  </svg>`,
  
  'clean': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 80" fill="none">
    <defs>
      <linearGradient id="clean-bg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#40C4FF"/>
        <stop offset="100%" stop-color="#0097A7"/>
      </linearGradient>
    </defs>
    <rect width="120" height="80" rx="8" fill="url(#clean-bg)"/>
    <text x="60" y="45" text-anchor="middle" fill="white" font-size="14" font-weight="bold" font-family="Arial">清理工具</text>
    <text x="60" y="60" text-anchor="middle" fill="rgba(255,255,255,0.8)" font-size="10" font-family="Arial">系统优化</text>
  </svg>`
};

// 图标尺寸配置
const iconSizes = {
  // 菜单图标 - 48x48
  '48': ['history', 'help', 'feedback', 'info'],
  // 资源封面 - 120x80
  '120x80': ['vscode', 'ps', 'office', 'pr', 'jianying', 'figma', 'notion', 'meeting', 'docker', 'clean']
};

async function generateIcon(name, svg, width, height) {
  const filename = path.join(imagesDir, `${name}.png`);
  try {
    await sharp(Buffer.from(svg))
      .resize(width, height)
      .png()
      .toFile(filename);
    console.log(`✓ Generated: ${name}.png (${width}x${height})`);
  } catch (err) {
    console.error(`✗ Failed to generate ${name}.png:`, err.message);
  }
}

async function main() {
  console.log('🚀 Generating missing icons...\n');
  
  for (const [name, svg] of Object.entries(iconTemplates)) {
    if (['history', 'help', 'feedback', 'info'].includes(name)) {
      await generateIcon(name, svg, 48, 48);
    } else {
      await generateIcon(name, svg, 120, 80);
    }
  }
  
  console.log('\n✅ Done!');
}

main().catch(console.error);
