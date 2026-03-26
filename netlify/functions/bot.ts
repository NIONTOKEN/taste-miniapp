import { Handler } from '@netlify/functions';

const WEB_APP_URL = 'https://incandescent-gelato-cc11a4.netlify.app/';

export const handler: Handler = async (event) => {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const update = JSON.parse(event.body || '{}');
    const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;

    if (!BOT_TOKEN) {
      console.error('TELEGRAM_BOT_TOKEN is not set');
      return { statusCode: 500, body: 'Server Error' };
    }

    // Process only text messages
    if (update.message && update.message.text) {
      const text = update.message.text;
      const chatId = update.message.chat.id;
      const lang = update.message.from?.language_code || 'en';

      // Check if the user sent /start
      if (text.startsWith('/start')) {
        let replyText = '';
        let buttonText = '';

        // Set response based on language
        switch (lang.slice(0, 2)) {
          case 'tr':
            replyText = "Tadını çıkarmaya hazır mısın? TASTE Mini App'e hoş geldin! 👇";
            buttonText = 'Uygulamayı Aç 🚀';
            break;
          case 'ru':
            replyText = 'Готовы насладиться? Добро пожаловать в TASTE Mini App! 👇';
            buttonText = 'Открыть приложение 🚀';
            break;
          case 'hi':
            replyText = 'क्या आप स्वाद लेने के लिए तैयार हैं? TASTE Mini App में आपका स्वागत है! 👇';
            buttonText = 'ऐप खोलें 🚀';
            break;
          default:
            replyText = 'Are you ready to enjoy? Welcome to TASTE Mini App! 👇';
            buttonText = 'Open App 🚀';
            break;
        }

        const payload = {
          chat_id: chatId,
          text: replyText,
          reply_markup: {
            inline_keyboard: [
              [
                {
                  text: buttonText,
                  web_app: { url: WEB_APP_URL },
                },
              ],
            ],
          },
        };

        // Send the reply back to Telegram
        await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      }
    }

    return { statusCode: 200, body: 'OK' };
  } catch (error) {
    console.error('Bot Error:', error);
    return { statusCode: 500, body: 'Server Error' };
  }
};
