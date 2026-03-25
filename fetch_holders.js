const https = require('https');
const fs = require('fs');
const path = require('path');

const jettonAddress = "EQCN2dkvaosVjpa9XozzN0wm1MBcI2GTN71CWvRzIsSH7IRH";
const BATCH_SIZE = 250;
const API_LIMIT = 1000;
let totalAddresses = [];

async function fetchFromApi(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        if (res.statusCode === 429) {
          resolve({ rateLimited: true });
        } else if (res.statusCode >= 400) {
          reject(new Error(`API Error: ${res.statusCode}`));
        } else {
          resolve(JSON.parse(data));
        }
      });
    }).on('error', err => reject(err));
  });
}

async function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function fetchAllHolders() {
  console.log("TonAPI üzerinden cüzdan adresleri çekiliyor... Lütfen bekleyin.");
  let offset = 0;
  let hasMore = true;

  while(hasMore) {
    try {
      const url = `https://tonapi.io/v2/jettons/${jettonAddress}/holders?limit=${API_LIMIT}&offset=${offset}`;
      console.log(`Bağlanıyor... Çekilen miktar: ${offset}`);
      
      const data = await fetchFromApi(url);
      
      if (data.rateLimited) {
        console.log("TonAPI hız sınırı! 3 saniye bekleniyor...");
        await delay(3000);
        continue;
      }
      
      const addresses = data.addresses;
      
      if (!addresses || addresses.length === 0) {
        hasMore = false;
        break;
      }

      for (let holder of addresses) {
        totalAddresses.push(holder.owner.address);
      }
      
      offset += API_LIMIT;
      
      // To bypass severe rate limit of free public API
      await delay(1000);
      
    } catch (err) {
      console.error("Hata oluştu, çekim durduruluyor:", err);
      hasMore = false;
    }
  }

  console.log(`\nBaşarılı! Toplam ${totalAddresses.length} adres çekildi.`);
  
  if(totalAddresses.length === 0) {
      console.log("Hiç adres bulunamadı. Lütfen jeton adresini kontrol edin.");
      return;
  }
  
  const outputDir = path.join(process.cwd(), 'airdrop_lists');
  if (!fs.existsSync(outputDir)){
    fs.mkdirSync(outputDir);
  }

  // Format: "USDT_ADDRESS, AMOUNT" -> TonRaffles format. We will just supply the address.
  let chunkIndex = 1;
  for (let i = 0; i < totalAddresses.length; i += BATCH_SIZE) {
    const chunk = totalAddresses.slice(i, i + BATCH_SIZE);
    
    // We add ', 1' mostly so TonRaffles reads it automatically as amount "1". User can edit later.
    const fileContent = chunk.map(addr => `${addr}`).join('\n');
    
    const fileName = `grup_${chunkIndex}.txt`;
    fs.writeFileSync(path.join(outputDir, fileName), fileContent);
    chunkIndex++;
  }

  console.log(`\nAdresler ${chunkIndex - 1} adet txt dosyasına (Her biri 250 adres olacak şekilde) başarıyla bölünmüştür!`);
  console.log(`Dosyalar 'airdrop_lists' klasöründedir.`);
}

fetchAllHolders();
