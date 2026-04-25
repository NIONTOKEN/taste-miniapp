require('dotenv').config();
const { Telegraf, Markup } = require('telegraf');
const { TwitterApi } = require('twitter-api-v2');

// 1. Twitter Brain (Yeni Ajan Kodlu)
const rwClient = new TwitterApi({
  appKey: process.env.TWITTER_CONSUMER_KEY?.trim(),
  appSecret: process.env.TWITTER_CONSUMER_SECRET?.trim(),
  accessToken: process.env.TWITTER_ACCESS_TOKEN?.trim(),
  accessSecret: process.env.TWITTER_ACCESS_TOKEN_SECRET?.trim(),
}).readWrite;

// 2. Telegram Bot Setup
const bot = new Telegraf(process.env.TELEGRAM_ADMIN_BOT_TOKEN);

bot.start((ctx) => {
  ctx.reply('Hoş geldin Patron! 👑\nTASTE Sosyal Medya Kontrolü Aktif.',
    Markup.inlineKeyboard([
      [Markup.button.callback('📢 Yeni Tweet At', 'action_tweet')],
      [Markup.button.callback('🚀 Durumu Kontrol Et', 'action_status')]
    ])
  );
});

bot.action('action_status', async (ctx) => {
  try {
    const user = await rwClient.v2.me();
    ctx.reply(`✅ Sistem Aktif! @${user.data.username}`);
  } catch (error) {
    ctx.reply(`❌ Twitter Bağlantı Hatası! Detayı siyah ekranda.`);
    console.error('❌ DURUM KONTROLÜ HATASI:', error);
  }
});

let waitingForTweet = false;
bot.action('action_tweet', (ctx) => {
  waitingForTweet = true;
  ctx.reply('Lütfen Tweet mesajını yaz:');
});

bot.on('text', async (ctx) => {
  if (waitingForTweet) {
    const text = ctx.message.text;
    waitingForTweet = false;
    ctx.reply(`Şunu paylaşıyorum:\n\n"${text}"\n\nOnaylıyor musun?`,
      Markup.inlineKeyboard([
        [Markup.button.callback('✅ PAYLAŞ', 'confirm_tweet'), Markup.button.callback('❌ İPTAL', 'cancel_tweet')]
      ]));
    bot.context.lastTweet = text;
  }
});

bot.action('confirm_tweet', async (ctx) => {
  const text = bot.context.lastTweet;
  try {
    console.log(`🚀 Tweet denemesi yapılıyor...`);
    const result = await rwClient.v2.tweet(text);
    ctx.reply(`✅ Başarılı! Link: https://x.com/user/status/${result.data.id}`);
  } catch (error) {
    // BURASI ASIL OLAY:
    console.log('----------------------------------------------------');
    console.log('🔴 KRİTİK TWITTER HATASI YAKALANDI!');
    console.log('Kod:', error.code || 'Bilinmiyor');
    console.log('Mesaj:', error.message);
    if (error.data) {
      console.log('Detay:', JSON.stringify(error.data, null, 2));
    }
    console.log('----------------------------------------------------');
    ctx.reply(`❌ Tweet gönderilemedi: ${error.message}`);
  }
});

bot.action('cancel_tweet', (ctx) => ctx.reply('İptal edildi.'));

console.log('--- TEST BOTU AKTİF ---');
bot.launch().then(() => console.log('✅ MESAJ BEKLENİYOR...'));
