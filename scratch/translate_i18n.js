const fs = require('fs');
const path = require('path');

const i18nPath = 'c:/Users/DMC BİLGİSAYAR/OneDrive/Desktop/taste projesi tamamı/taste-miniapp/src/i18n.ts';

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function translateText(text, targetLang) {
  if (!text || typeof text !== 'string') return text;
  if (/^[0-9\s\p{Emoji}]+$/u.test(text)) return text;
  
  const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`;
  try {
    const res = await fetch(url);
    const json = await res.json();
    if (json && json[0]) {
      const translated = json[0].map(item => item[0]).join('');
      return translated;
    }
  } catch (err) {
    console.error(`Error translating "${text}" to ${targetLang}:`, err);
  }
  return text;
}

async function translateObj(sourceObj, targetObj, targetLang) {
  const result = { ...targetObj };
  for (const key in sourceObj) {
    const val = sourceObj[key];
    if (typeof val === 'object' && val !== null) {
      if (Array.isArray(val)) {
        const targetArray = Array.isArray(targetObj[key]) ? targetObj[key] : [];
        const newArray = [];
        for (let i = 0; i < val.length; i++) {
          const item = val[i];
          if (typeof item === 'object' && item !== null) {
            // Recursively translate object inside array
            const targetItem = targetArray[i] || {};
            const transItem = await translateObj(item, targetItem, targetLang);
            newArray.push(transItem);
          } else if (targetArray[i] && targetArray[i] !== val[i] && targetArray[i] !== '') {
            newArray.push(targetArray[i]);
          } else {
            console.log(`[${targetLang}] Translating array item: "${val[i]}"`);
            const trans = await translateText(val[i], targetLang);
            newArray.push(trans);
            await delay(100);
          }
        }
        result[key] = newArray;
      } else {
        result[key] = await translateObj(val, targetObj[key] || {}, targetLang);
      }
    } else if (typeof val === 'string') {
      if (targetObj[key] !== undefined && targetObj[key] !== val && targetObj[key] !== '') {
        result[key] = targetObj[key];
      } else {
        console.log(`[${targetLang}] Translating "${key}": "${val.substring(0, 30)}..."`);
        const trans = await translateText(val, targetLang);
        result[key] = trans;
        await delay(100);
      }
    }
  }
  return result;
}

async function run() {
  console.log(`Reading i18n file from: ${i18nPath}`);
  const fileContent = fs.readFileSync(i18nPath, 'utf8');
  
  const startIdx = fileContent.indexOf('const resources =');
  const endIdx = fileContent.indexOf('const savedLang =');
  
  if (startIdx === -1 || endIdx === -1) {
    throw new Error("Could not find start or end markers in i18n.ts");
  }
  
  let resourcesStr = fileContent.substring(startIdx + 'const resources ='.length, endIdx).trim();
  if (resourcesStr.endsWith(';')) {
    resourcesStr = resourcesStr.slice(0, -1);
  }
  
  const resources = eval(`(${resourcesStr})`);
  const enTranslation = resources.en.translation;
  
  console.log("Translating to Russian (ru)...");
  resources.ru.translation = await translateObj(enTranslation, resources.ru.translation || {}, 'ru');
  
  console.log("Translating to Arabic (ar)...");
  resources.ar.translation = await translateObj(enTranslation, resources.ar.translation || {}, 'ar');
  
  console.log("Translating to Chinese (zh)...");
  resources.zh.translation = await translateObj(enTranslation, resources.zh.translation || {}, 'zh-CN');
  
  const newResourcesStr = `const resources = ${JSON.stringify(resources, null, 4)};`;
  
  const beforeStr = fileContent.substring(0, startIdx);
  const afterStr = fileContent.substring(endIdx);
  
  const updatedContent = beforeStr + 'const resources = ' + newResourcesStr + ';\r\n\r\n' + afterStr;
  
  fs.writeFileSync(i18nPath, updatedContent, 'utf8');
  console.log("i18n.ts has been successfully updated with full translations!");
}

run().catch(console.error);
