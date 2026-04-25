import { Handler } from '@netlify/functions';

const WEB_APP_URL = 'https://tasteminiapp.netlify.app/';
const SUPABASE_URL = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || '';
const SUPABASE_KEY = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || '';

// ─── Basit in-memory rate limiter ───────────────────────────────
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
function isRateLimited(ip: string, maxReq = 20, windowMs = 60_000): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + windowMs });
    return false;
  }
  entry.count++;
  return entry.count > maxReq;
}

async function saveUser(chatId: number, username: string, firstName: string, languageCode: string) {
  if (!SUPABASE_URL || !SUPABASE_KEY) return;
  
  try {
    await fetch(`${SUPABASE_URL}/rest/v1/telegram_users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`,
        'Prefer': 'resolution=merge-duplicates'
      },
      body: JSON.stringify({
        chat_id: chatId,
        username: username || null,
        first_name: firstName || 'Kullanıcı',
        language_code: languageCode || 'en',
        last_seen: new Date().toISOString(),
        notifications_enabled: true
      })
    });
  } catch (e) {
    console.error('Kullanıcı kaydedilemedi:', e);
  }
}

export const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  // Rate limiting
  const clientIp = event.headers['x-forwarded-for']?.split(',')[0]?.trim() || 'unknown';
  if (isRateLimited(clientIp)) {
    return { statusCode: 429, body: 'Too Many Requests' };
  }

  try {
    const update = JSON.parse(event.body || '{}');
    const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;

    if (!BOT_TOKEN) {
      console.error('TELEGRAM_BOT_TOKEN is not set');
      return { statusCode: 500, body: 'Server Error' };
    }

    // ─── Custom API Endpoint: OTC Order Notification (Admin) ───
    if (update.type === 'otc_order') {
      const { admin_id, order } = update;
      if (!admin_id || !order) return { statusCode: 400, body: 'Invalid payload' };

      const msg = `🚨 *YENİ TASTE SİPARİŞİ GELDİ!* 🚨\n\n` +
                  `👤 *Müşteri (TG ID):* \`${order.userId}\`\n` +
                  `💸 *Gönderilen Tutar:* *${order.amount} TL*\n` +
                  `💎 *Verilecek TASTE:* *${order.taste}*\n\n` +
                  `💳 *Alıcı Cüzdan (Buraya Gönder):*\n\`${order.wallet}\`\n\n` +
                  `🧾 *Bankadaki Açıklama Kodu:* \`${order.code}\`\n\n` +
                  `⚠️ *Ne Yapmalısın?*\n` +
                  `1. Banka hesabına (${order.amount} TL) gelmiş mi kontrol et.\n` +
                  `2. Açıklamada \`${order.code}\` yazıyor mu bak.\n` +
                  `3. Geldiyse Tonkeeper'ı aç ve yukarıdaki cüzdana ${order.taste} TASTE yolla kanka! 🚀`;

      await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: admin_id, text: msg, parse_mode: 'Markdown' })
      });

      return { statusCode: 200, body: 'Admin notified' };
    }

    // ─── Custom API Endpoint: User Notification (Approve/Reject) ───
    if (update.type === 'admin_notify') {
      const { chat_id, message } = update;
      if (!chat_id || !message) return { statusCode: 400, body: 'Invalid payload' };

      await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: String(chat_id),
          text: message,
          parse_mode: 'HTML',
          reply_markup: {
            inline_keyboard: [[
              { text: '📲 Uygulamayı Aç', web_app: { url: WEB_APP_URL } }
            ]]
          }
        })
      });

      return { statusCode: 200, body: 'User notified' };
    }
    // ───────────────────────────────────────────────────

    if (update.message && update.message.text) {
      const text = update.message.text;
      const chatId = update.message.chat.id;
      const from = update.message.from || {};
      const lang = from.language_code || 'en';

      // Kullanıcıyı Supabase'e kaydet (her mesajda güncelle)
      await saveUser(
        chatId,
        from.username || '',
        from.first_name || '',
        lang
      );

      if (text.startsWith('/start')) {
        let replyText = '';
        let buttonText = '';

        switch (lang.slice(0, 2)) {
          case 'tr':
            replyText = `Merhaba${from.first_name ? ' ' + from.first_name : ''}! 👋\n\nTASTE Mini App'e hoş geldin!\n🎡 Günlük çarkını çevir, token kazan!\n\n👇 Uygulamayı açmak için aşağıdaki butona tıkla:`;
            buttonText = 'Uygulamayı Aç 🚀';
            break;
          case 'ru':
            replyText = `Привет${from.first_name ? ', ' + from.first_name : ''}! 👋\n\nДобро пожаловать в TASTE Mini App!\n🎡 Крути колесо каждый день и выигрывай токены!\n\n👇 Нажми кнопку чтобы открыть:`;
            buttonText = 'Открыть приложение 🚀';
            break;
          default:
            replyText = `Hello${from.first_name ? ', ' + from.first_name : ''}! 👋\n\nWelcome to TASTE Mini App!\n🎡 Spin the wheel daily and earn tokens!\n\n👇 Tap the button below to open the app:`;
            buttonText = 'Open App 🚀';
        }

        await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: chatId,
            text: replyText,
            parse_mode: 'HTML',
            reply_markup: {
              inline_keyboard: [[
                { text: buttonText, web_app: { url: WEB_APP_URL } }
              ]]
            }
          })
        });
      }
    }

    return { statusCode: 200, body: 'OK' };
  } catch (error) {
    console.error('Bot Error:', error);
    return { statusCode: 500, body: 'Server Error' };
  }
};
