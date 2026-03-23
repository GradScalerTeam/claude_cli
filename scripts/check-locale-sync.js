#!/usr/bin/env node

/**
 * 本地化完整性检查脚本
 * 
 * 功能：
 * 1. 比对 en.json 和 zh.json 的结构一致性
 * 2. 检测缺失的翻译键
 * 3. 检测冗余的未使用键
 * 4. 验证数据类型一致性
 * 
 * 使用：
 *   node scripts/check-locale-sync.js
 * 
 * 在 CI 中使用：
 *   - 发现问题时返回非零退出码
 *   - 阻止代码合并
 */

const fs = require('fs');
const path = require('path');

const LOCALES_DIR = path.join(__dirname, '..', 'locales');
const EN_FILE = path.join(LOCALES_DIR, 'en.json');
const ZH_FILE = path.join(LOCALES_DIR, 'zh.json');

// 颜色输出
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m'
};

function log(color, message) {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

/**
 * 递归检查对象键
 */
function checkKeys(en, zh, path = '') {
  const enKeys = Object.keys(en);
  const zhKeys = Object.keys(zh);
  
  const missing = enKeys.filter(k => !zhKeys.includes(k));
  const extra = zhKeys.filter(k => !enKeys.includes(k));
  
  const issues = [];
  
  if (missing.length > 0) {
    issues.push({
      type: 'missing',
      path: path,
      keys: missing
    });
  }
  
  if (extra.length > 0) {
    issues.push({
      type: 'extra',
      path: path,
      keys: extra
    });
  }
  
  // 递归检查嵌套对象
  enKeys.forEach(k => {
    if (typeof en[k] === 'object' && en[k] !== null) {
      const nestedIssues = checkKeys(en[k], zh[k] || {}, `${path}${k}.`);
      issues.push(...nestedIssues);
    }
  });
  
  return issues;
}

/**
 * 检查数据类型一致性
 */
function checkTypes(en, zh, path = '') {
  const issues = [];
  
  Object.keys(en).forEach(k => {
    const enValue = en[k];
    const zhValue = zh[k];
    
    if (zhValue === undefined) return;
    
    if (typeof enValue !== typeof zhValue) {
      issues.push({
        type: 'type_mismatch',
        path: `${path}${k}`,
        enType: typeof enValue,
        zhType: typeof zhValue
      });
    }
    
    if (typeof enValue === 'object' && enValue !== null) {
      const nestedIssues = checkTypes(enValue, zhValue, `${path}${k}.`);
      issues.push(...nestedIssues);
    }
  });
  
  return issues;
}

/**
 * 主检查函数
 */
function main() {
  log('blue', '🔍 本地化完整性检查开始...\n');
  
  // 读取文件
  let en, zh;
  try {
    en = JSON.parse(fs.readFileSync(EN_FILE, 'utf8'));
    zh = JSON.parse(fs.readFileSync(ZH_FILE, 'utf8'));
  } catch (error) {
    log('red', `❌ 读取文件失败: ${error.message}`);
    process.exit(1);
  }
  
  // 检查键一致性
  const keyIssues = checkKeys(en, zh);
  
  // 检查类型一致性
  const typeIssues = checkTypes(en, zh);
  
  // 输出结果
  if (keyIssues.length === 0 && typeIssues.length === 0) {
    log('green', '✅ 本地化文件同步完成');
    log('green', `   - 英文键: ${Object.keys(en).length} 个`);
    log('green', `   - 中文键: ${Object.keys(zh).length} 个`);
    process.exit(0);
  }
  
  // 输出错误
  log('red', '❌ 发现本地化问题:\n');
  
  keyIssues.forEach(issue => {
    if (issue.type === 'missing') {
      log('yellow', `   缺失翻译 (${issue.path}):`);
      issue.keys.forEach(k => log('red', `     - ${k}`));
    } else if (issue.type === 'extra') {
      log('yellow', `   冗余键 (${issue.path}):`);
      issue.keys.forEach(k => log('yellow', `     - ${k}`));
    }
  });
  
  typeIssues.forEach(issue => {
    log('yellow', `   类型不匹配 (${issue.path}):`);
    log('yellow', `     期望: ${issue.enType}, 实际: ${issue.zhType}`);
  });
  
  log('red', '\n💡 提示: 请同步更新 locales/en.json 和 locales/zh.json');
  
  process.exit(1);
}

// 执行检查
main();
