const fs = require('fs');
const path = require('path');
const { Address } = require('@ton/core'); // from package.json

async function run() {
  console.log("🛠️ Adresler EQ formatına çevrilip 'Miktar' ve 'Mesaj' ile birleştiriliyor...");

  // Olası klasör yolları (Projende veya Masaüstünde)
  let dirPath = path.join(process.cwd(), 'airdrop_lists');
  let onedrivePath = path.join(process.env.USERPROFILE || '', 'OneDrive', 'Desktop', 'taste_dagitim');
  let desktopPath = path.join(process.env.USERPROFILE || '', 'Desktop', 'taste_dagitim');

  let targetDir = "";

  if (fs.existsSync(dirPath)) targetDir = dirPath;
  else if (fs.existsSync(onedrivePath)) targetDir = onedrivePath;
  else if (fs.existsSync(desktopPath)) targetDir = desktopPath;
  else {
    console.log("❌ Hata: Airdrop dosyalarının olduğu klasör bulunamadı!");
    return;
  }

  const files = fs.readdirSync(targetDir).filter(f => f.endsWith('.txt'));
  let totalConverted = 0;

  for (const file of files) {
    const filePath = path.join(targetDir, file);
    const content = fs.readFileSync(filePath, 'utf8');
    const baddrs = content.split('\n').filter(l => l.trim().length > 0);
    
    const converted = baddrs.map(rawAddr => {
      // Satırda zaten virgül veya boşluk varsa (daha önce dönüştürülmüşse) sadece adresi al
      let pureAddr = rawAddr.split(/[,\s]+/)[0].trim();
      let eqAddr = pureAddr;

      try {
        const addr = Address.parse(pureAddr);
        // EQ... formatı için bounceable: true
        eqAddr = addr.toString({ bounceable: true, testOnly: false });
      } catch (err) {
        // Parse edemezse olduğu gibi bırak (belki zaten UQ/EQ formatındadır)
      }

      // Format: CüzdanAdresi Miktar Mesaj (BOŞLUKLU)
      return `${eqAddr} 2 🎁 TASTE AIRDROP`;
    });

    // Dosyayı yepyeni özel Airdrop formatıyla üstüne yazıyoruz
    fs.writeFileSync(filePath, converted.join('\n'));
    totalConverted += converted.length;
  }

  console.log(`\n✅ GÖREV TAMAMLANDI!`);
  console.log(`Tüm ${files.length} dosyadaki ${totalConverted} adet cüzdan adresi şu şekilde güncellendi:`);
  console.log(`Örnek: EQbT...Abcd 2 🎁 TASTE AIRDROP`);
  console.log(`\nArtık dApp bu listeyi (boşluk ayracıyla) saniyesinde hatasız tanıyıp gönderecek!`);
}

run();
