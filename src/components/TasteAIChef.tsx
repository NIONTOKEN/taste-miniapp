import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles, ChefHat, Plus, X, Flame, AlertTriangle, Clock,
  CheckCircle2, Share2, Copy, Bookmark, BookmarkCheck, ArrowRight,
  RotateCcw, Utensils, Globe
} from 'lucide-react';
import { useTranslation } from 'react-i18next';

// ─── Preset Ingredient Categories (TR, EN, RU, AR, ZH) ──────────────────────
interface IngredientItem {
  id: string;
  names: Record<string, string>;
}

interface PresetCategory {
  id: string;
  emoji: string;
  names: Record<string, string>;
  items: IngredientItem[];
}

const INGREDIENT_CATEGORIES: PresetCategory[] = [
  {
    id: 'protein',
    emoji: '🥩',
    names: {
      tr: 'Et & Protein',
      en: 'Meat & Protein',
      ru: 'Мясо и белок',
      ar: 'لحوم وبروتين',
      zh: '肉类与蛋白质'
    },
    items: [
      { id: 'chicken', names: { tr: 'Tavuk Göğsü', en: 'Chicken Breast', ru: 'Куриная грудка', ar: 'صدر دجاج', zh: '鸡胸肉' } },
      { id: 'mince', names: { tr: 'Kıyma', en: 'Ground Beef', ru: 'Говяжий фарш', ar: 'لحم مفروم', zh: '牛肉碎' } },
      { id: 'egg', names: { tr: 'Yumurta', en: 'Egg', ru: 'Яйцо', ar: 'بيض', zh: '鸡蛋' } },
      { id: 'salmon', names: { tr: 'Somon / Balık', en: 'Salmon / Fish', ru: 'Лосось / Рыба', ar: 'سلمون / سمك', zh: '三文鱼 / 鱼类' } },
      { id: 'tuna', names: { tr: 'Ton Balığı', en: 'Tuna', ru: 'Тунец', ar: 'تونة', zh: '金枪鱼' } },
      { id: 'tofu', names: { tr: 'Tofu', en: 'Tofu', ru: 'Тофу', ar: 'توفو', zh: '豆腐' } }
    ]
  },
  {
    id: 'veggie',
    emoji: '🥦',
    names: {
      tr: 'Sebzeler',
      en: 'Vegetables',
      ru: 'Овощи',
      ar: 'خضروات',
      zh: '新鲜蔬菜'
    },
    items: [
      { id: 'tomato', names: { tr: 'Domates', en: 'Tomato', ru: 'Помидор', ar: 'طماطم', zh: '番茄' } },
      { id: 'onion', names: { tr: 'Soğan', en: 'Onion', ru: 'Лук', ar: 'بصل', zh: '洋葱' } },
      { id: 'garlic', names: { tr: 'Sarımsak', en: 'Garlic', ru: 'Чеснок', ar: 'ثوم', zh: '大蒜' } },
      { id: 'mushroom', names: { tr: 'Mantar', en: 'Mushroom', ru: 'Грибы', ar: 'فطر', zh: '蘑菇' } },
      { id: 'pepper', names: { tr: 'Biber', en: 'Bell Pepper', ru: 'Болгарский перец', ar: 'فلفل رومي', zh: '彩椒' } },
      { id: 'spinach', names: { tr: 'Ispanak', en: 'Spinach', ru: 'Шпинат', ar: 'سبانخ', zh: '菠菜' } },
      { id: 'potato', names: { tr: 'Patates', en: 'Potato', ru: 'Картофель', ar: 'بطاطس', zh: '土豆' } },
      { id: 'zucchini', names: { tr: 'Kabak', en: 'Zucchini', ru: 'Кабачок', ar: 'كوسة', zh: '西葫芦' } }
    ]
  },
  {
    id: 'dairy',
    emoji: '🧀',
    names: {
      tr: 'Süt & Peynir',
      en: 'Dairy & Cheese',
      ru: 'Молочные продукты',
      ar: 'ألبان وأجبان',
      zh: '乳品与奶酪'
    },
    items: [
      { id: 'milk', names: { tr: 'Süt', en: 'Milk', ru: 'Молоко', ar: 'حليب', zh: '牛奶' } },
      { id: 'cheese', names: { tr: 'Kaşar / Peynir', en: 'Cheese', ru: 'Сыр', ar: 'جبن', zh: '干酪' } },
      { id: 'cream', names: { tr: 'Krema', en: 'Heavy Cream', ru: 'Сливки', ar: 'قشطة', zh: '淡奶油' } },
      { id: 'butter', names: { tr: 'Tereyağı', en: 'Butter', ru: 'Сливочное масло', ar: 'زبدة', zh: '黄油' } },
      { id: 'yogurt', names: { tr: 'Yoğurt', en: 'Yogurt', ru: 'Йогурт', ar: 'زبادي', zh: '酸奶' } },
      { id: 'parmesan', names: { tr: 'Parmesan', en: 'Parmesan', ru: 'Пармезан', ar: 'بارميزان', zh: '帕玛森' } }
    ]
  },
  {
    id: 'grains',
    emoji: '🌾',
    names: {
      tr: 'Tahıl & Bakliyat',
      en: 'Grains & Pasta',
      ru: 'Злаки и бобовые',
      ar: 'حبوب وبقوليات',
      zh: '主食与谷物'
    },
    items: [
      { id: 'pasta', names: { tr: 'Makarna', en: 'Pasta', ru: 'Паста (макароны)', ar: 'معكرونة', zh: '意面' } },
      { id: 'rice', names: { tr: 'Pirinç', en: 'Rice', ru: 'Рис', ar: 'أرز', zh: '大米' } },
      { id: 'bread', names: { tr: 'Ekmek', en: 'Bread', ru: 'Хлеб', ar: 'خبز', zh: '面包' } },
      { id: 'oats', names: { tr: 'Yulaf', en: 'Oats', ru: 'Овсянка', ar: 'شوفان', zh: '燕麦' } },
      { id: 'lentils', names: { tr: 'Mercimek', en: 'Lentils', ru: 'Чечевица', ar: 'عدس', zh: '扁豆' } },
      { id: 'chickpeas', names: { tr: 'Nohut', en: 'Chickpeas', ru: 'Нут', ar: 'حمص', zh: '鹰嘴豆' } }
    ]
  },
  {
    id: 'sauces',
    emoji: '🧄',
    names: {
      tr: 'Sos & Baharat',
      en: 'Sauces & Spices',
      ru: 'Соусы и специи',
      ar: 'صلصات وتوابل',
      zh: '酱汁与香料'
    },
    items: [
      { id: 'olive_oil', names: { tr: 'Zeytinyağı', en: 'Olive Oil', ru: 'Оливковое масло', ar: 'زيت زيتون', zh: '橄榄油' } },
      { id: 'tomato_paste', names: { tr: 'Salça', en: 'Tomato Paste', ru: 'Томатная паста', ar: 'معجون طماطم', zh: '番茄膏' } },
      { id: 'soy_sauce', names: { tr: 'Soya Sosu', en: 'Soy Sauce', ru: 'Соевый соус', ar: 'صلصة صويا', zh: '酱油' } },
      { id: 'thyme', names: { tr: 'Kekik', en: 'Thyme', ru: 'Тимьян', ar: 'زعتر', zh: '百里香' } },
      { id: 'basil', names: { tr: 'Fesleğen', en: 'Basil', ru: 'Базилик', ar: 'ريحان', zh: '罗勒' } },
      { id: 'black_pepper', names: { tr: 'Karabiber', en: 'Black Pepper', ru: 'Черный перец', ar: 'فلفل أسود', zh: '黑胡椒' } }
    ]
  }
];

export interface GeneratedRecipe {
  title: string;
  description: string;
  cookingTime: string;
  difficulty: string;
  cuisine: string;
  diet: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  allergens: string[];
  ingredients: string[];
  instructions: string[];
  chefTip: string;
}

export function TasteAIChef() {
  const { t, i18n } = useTranslation();
  const lang = (i18n.language?.split('-')[0] || 'tr') as 'tr' | 'en' | 'ru' | 'ar' | 'zh';

  const languagesList = [
    { code: 'tr', label: 'TR', flag: '🇹🇷' },
    { code: 'en', label: 'EN', flag: '🇬🇧' },
    { code: 'ru', label: 'RU', flag: '🇷🇺' },
    { code: 'zh', label: 'ZH', flag: '🇨🇳' },
    { code: 'ar', label: 'AR', flag: '🇸🇦' }
  ];

  const handleSwitchLanguage = (code: string) => {
    i18n.changeLanguage(code);
    localStorage.setItem('i18nextLng', code);
  };

  const getLocalizedText = (names: Record<string, string>) => {
    return names[lang] || names['en'] || names['tr'] || Object.values(names)[0];
  };

  // State
  const [selectedIngredients, setSelectedIngredients] = useState<string[]>([
    lang === 'tr' ? 'Tavuk Göğsü' : lang === 'ru' ? 'Куриная грудка' : lang === 'zh' ? '鸡胸肉' : lang === 'ar' ? 'صدر دجاج' : 'Chicken Breast',
    lang === 'tr' ? 'Mantar' : lang === 'ru' ? 'Грибы' : lang === 'zh' ? '蘑菇' : lang === 'ar' ? 'فطر' : 'Mushroom',
    lang === 'tr' ? 'Sarımsak' : lang === 'ru' ? 'Чеснок' : lang === 'zh' ? '大蒜' : lang === 'ar' ? 'ثوم' : 'Garlic'
  ]);
  const [customInput, setCustomInput] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('protein');
  
  // Cooking preferences
  const [cookingTime, setCookingTime] = useState<'quick' | 'medium' | 'gourmet'>('quick');
  const [dietType, setDietType] = useState<'all' | 'high_protein' | 'low_calorie' | 'keto' | 'vegan'>('high_protein');
  const [cuisine, setCuisine] = useState<'mediterranean' | 'turkish' | 'italian' | 'asian' | 'world'>('mediterranean');

  // Generation status
  const [isGenerating, setIsGenerating] = useState(false);
  const [recipe, setRecipe] = useState<GeneratedRecipe | null>(null);
  const [copied, setCopied] = useState(false);

  // Add / remove ingredients
  const toggleIngredient = (name: string) => {
    if (selectedIngredients.includes(name)) {
      setSelectedIngredients(selectedIngredients.filter(i => i !== name));
    } else {
      setSelectedIngredients([...selectedIngredients, name]);
    }
  };

  const addCustomIngredient = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const clean = customInput.trim();
    if (clean && !selectedIngredients.includes(clean)) {
      setSelectedIngredients([...selectedIngredients, clean]);
      setCustomInput('');
    }
  };

  const removeIngredient = (name: string) => {
    setSelectedIngredients(selectedIngredients.filter(i => i !== name));
  };

  // Generate recipe via Groq AI (/api/chat) or smart fallback
  const handleGenerateRecipe = async () => {
    if (selectedIngredients.length === 0) return;
    setIsGenerating(true);
    setRecipe(null);

    const timeLabel = cookingTime === 'quick' ? '15-20 Min' : cookingTime === 'medium' ? '30 Min' : '45+ Min Gourmet';
    const dietLabel = dietType === 'high_protein' ? 'High Protein' : dietType === 'low_calorie' ? 'Low Calorie / Fit' : dietType === 'keto' ? 'Keto' : dietType === 'vegan' ? 'Vegan' : 'Standard';
    const cuisineLabel = cuisine === 'mediterranean' ? 'Mediterranean' : cuisine === 'turkish' ? 'Turkish Cuisine' : cuisine === 'italian' ? 'Italian' : cuisine === 'asian' ? 'Asian' : 'World Cuisine';

    const langFullNames: Record<string, string> = {
      tr: 'Turkish (Türkçe)',
      en: 'English',
      ru: 'Russian (Русский)',
      zh: 'Chinese Simplified (简体中文)',
      ar: 'Arabic (العربية)'
    };
    const targetLanguageName = langFullNames[lang] || 'English';

    const prompt = `
You are TASTE AI — an elite Michelin-star gourmet Web3 Chef.
Create an exceptional, delicious recipe using these available ingredients: ${selectedIngredients.join(', ')}.
Preferences:
- Time limit: ${timeLabel}
- Diet style: ${dietLabel}
- Cuisine: ${cuisineLabel}
- Target Output Language: ${targetLanguageName} (CRITICAL: All generated recipe text, title, description, ingredients, step-by-step instructions, and chefTip MUST be written in ${targetLanguageName})

CRITICAL: Return ONLY a valid, raw JSON object (without markdown backticks, without preamble) matching this schema:
{
  "title": "Gourmet recipe title in ${targetLanguageName}",
  "description": "Appetizing 1-2 sentence description in ${targetLanguageName}",
  "cookingTime": "${timeLabel}",
  "difficulty": "Easy / Medium / Chef",
  "cuisine": "${cuisineLabel}",
  "diet": "${dietLabel}",
  "calories": 420,
  "protein": 38,
  "carbs": 18,
  "fat": 12,
  "allergens": ["Gluten", "Dairy"],
  "ingredients": [
    "Quantity and ingredient 1",
    "Quantity and ingredient 2"
  ],
  "instructions": [
    "Step 1...",
    "Step 2...",
    "Step 3...",
    "Step 4..."
  ],
  "chefTip": "Pro-level secret to enhance flavor in ${targetLanguageName}"
}
`;

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [{ role: 'user', content: prompt }]
        })
      });

      if (res.ok) {
        const data = await res.json();
        const rawContent = data?.choices?.[0]?.message?.content || '';
        const jsonMatch = rawContent.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0]);
          setRecipe(parsed);
          setIsGenerating(false);
          return;
        }
      }
      throw new Error('Fallback needed');
    } catch (e) {
      console.warn('[TasteAIChef] API request fallback triggered:', e);
      // Smart localized fallback
      const fallbackRecipe: GeneratedRecipe = {
        title: lang === 'tr'
          ? `Gurme ${selectedIngredients.slice(0, 2).join(' & ')} Tavlama`
          : lang === 'ru'
          ? `Гурме ${selectedIngredients.slice(0, 2).join(' и ')} по-шефски`
          : lang === 'zh'
          ? `米其林主厨风味：${selectedIngredients.slice(0, 2).join('配')}`
          : lang === 'ar'
          ? `طبق الذواقة المميز: ${selectedIngredients.slice(0, 2).join(' مع ')}`
          : `Gourmet Seared ${selectedIngredients.slice(0, 2).join(' & ')} Medley`,
        description: lang === 'tr'
          ? 'Taze malzemelerin yüksek ateşte karamelize edilerek zengin baharatlar ve sızma zeytinyağı ile buluştuğu yüksek proteinli bir lezzet şöleni.'
          : lang === 'ru'
          ? 'Сочное блюдо с аппетитной карамелизацией, свежими травами и оливковым маслом первого отжима.'
          : lang === 'zh'
          ? '甄选优质新鲜食材，配合极速温火锁汁技艺与初榨橄榄油，呈现极致层次与营养。'
          : lang === 'ar'
          ? 'وجبة غنية بالبروتين ومحضرة بمكونات طازجة مع زيت زيتون وتوابل عطرية تعطي نكهة استثنائية.'
          : 'A vibrant pan-seared delicacy infused with aromatic herbs, extra virgin olive oil, and tender textures designed for optimal energy.',
        cookingTime: timeLabel,
        difficulty: lang === 'tr' ? 'Orta Düzey' : lang === 'ru' ? 'Средний' : lang === 'zh' ? '中等' : lang === 'ar' ? 'متوسط' : 'Medium',
        cuisine: cuisineLabel,
        diet: dietLabel,
        calories: 435,
        protein: 41,
        carbs: 16,
        fat: 13,
        allergens: [lang === 'tr' ? 'Sarımsak' : 'Garlic', lang === 'tr' ? 'Baharat' : 'Spices'],
        ingredients: [
          ...selectedIngredients.map(item => `• 150g - 250g ${item}`),
          lang === 'tr' ? '• 2 yemek kaşığı sızma zeytinyağı' : lang === 'ru' ? '• 2 ст. л. оливкового масла' : lang === 'zh' ? '• 2勺特级初榨橄榄油' : lang === 'ar' ? '• 2 ملعقة كبيرة زيت زيتون' : '• 2 tbsp extra virgin olive oil',
          lang === 'tr' ? '• Taze çekilmiş deniz tuzu & karabiber' : lang === 'ru' ? '• Морская соль и свежемолотый перец' : lang === 'zh' ? '• 现磨海盐与黑胡椒' : lang === 'ar' ? '• ملح بحري وفلفل أسود' : '• Sea salt & freshly cracked black pepper',
          lang === 'tr' ? '• 1 tatlı kaşığı dağ kekiği' : lang === 'ru' ? '• 1 ч. л. тимьяна' : lang === 'zh' ? '• 1茶匙百里香碎' : lang === 'ar' ? '• ملعقة زعتر بري' : '• 1 tsp dried mountain thyme'
        ],
        instructions: lang === 'tr' ? [
          'Tüm taze malzemeleri yıkayıp eşit boyutlarda doğrayın.',
          'Geniş bir tavayı orta-yüksek ateşte ısıtın ve sızma zeytinyağını ilave edin.',
          'Öncelikle proteinleri ekleyip altın rengi mühür alana kadar 4-5 dakika soteleyin.',
          'Ardından sebzeleri ve aromatik baharatları ekleyip kısık ateşte 6-8 dakika lezzetlerin bütünleşmesini sağlayın.',
          'Ateşten alıp 2 dakika dinlendirdikten sonra sıcak olarak servis edin.'
        ] : lang === 'ru' ? [
          'Промойте все ингредиенты и нарежьте их аккуратными кусочками.',
          'Разогрейте сковороду с оливковым маслом на среднем огне.',
          'Обжарьте протеиновые продукты 4-5 минут до золотистой корочки.',
          'Добавьте овощи, чеснок и специи, готовьте еще 6-8 минут.',
          'Дайте блюду отдохнуть 2 минуты перед подачей.'
        ] : lang === 'zh' ? [
          '将选好的所有食材清洗干净，均匀切块备用。',
          '锅中倒入特级初榨橄榄油，中高火均匀热锅。',
          '先下入肉类/高蛋白食材，翻炒4-5分钟锁住肉汁至表面金黄。',
          '加入蔬菜和调味香料，转中小火慢煨6-8分钟，让风味充分交融。',
          '出锅前静置2分钟沉淀鲜香，装盘即可享用。'
        ] : lang === 'ar' ? [
          'اغسل جميع المكونات وقطعها إلى أجزاء متساوية.',
          'سخن مقلاة عميقة مع زيت الزيتون على نار متوسطة.',
          'أضف البروتين أولاً وقلبه لمدة 4-5 دقائق حتى يأخذ لوناً ذهبياً.',
          'أضف الخضار والتوابل واتركها على نار هادئة لمدة 6-8 دقائق.',
          'اترك الطبق يرتاح دقيقتين ثم قدمه ساخناً بالهناء والشفاء.'
        ] : [
          'Rinse all fresh ingredients thoroughly and cut into even bite-sized portions.',
          'Heat extra virgin olive oil in a skillet over medium-high heat.',
          'Add your proteins first, searing for 4-5 minutes until golden brown.',
          'Toss in vegetables and aromatic seasonings, simmering on gentle heat for 6-8 minutes.',
          'Rest for 2 minutes before plating to allow all savory juices to settle.'
        ],
        chefTip: lang === 'tr'
          ? 'Eti veya sebzeleri pişirdikten sonra hemen kesmeyin; 2-3 dakika dinlendirirseniz suları içinde kalarak pamuk gibi yumuşak kalır.'
          : lang === 'ru'
          ? 'Дайте блюду отдохнуть пару минут перед подачей, чтобы сохранить максимум сочности.'
          : lang === 'zh'
          ? '烹饪完成后切忌立即切割或装盘，稍等2-3分钟静置回汁，口感将更为细嫩多汁。'
          : lang === 'ar'
          ? 'اترك اللحم أو الخضار يرتاح لدقيقتين بعد الطهي للحفاظ على العصارة والنكهة اللذيذة.'
          : 'Let your dish rest for 2-3 minutes before serving to lock in all natural savory juices.'
      };

      setRecipe(fallbackRecipe);
      setIsGenerating(false);
    }
  };

  const handleCopyRecipe = () => {
    if (!recipe) return;
    const text = `🍳 ${recipe.title} (TASTE AI Chef)

${recipe.description}

⏱️ ${recipe.cookingTime} | 🥗 ${recipe.diet} | 🔥 ${recipe.calories} kcal
🥩 Protein: ${recipe.protein}g | 🍞 Carbs: ${recipe.carbs}g | 🥑 Fat: ${recipe.fat}g

🛒 ${t('chef_app.ingredients_title', 'Malzemeler')}:
${recipe.ingredients.join('\n')}

👨‍🍳 ${t('chef_app.instructions_title', 'Adımlar')}:
${recipe.instructions.join('\n')}

💡 ${t('chef_app.chef_tip_title', 'Şef Sırrı')}: ${recipe.chefTip}

✨ TASTE AI — The New Face of Web3 Food Ecosystem`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div style={{ maxWidth: 680, margin: '0 auto', paddingBottom: 40 }}>
      {/* ── Top Language Selector Bar ── */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: 'rgba(255, 255, 255, 0.03)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: 16,
        padding: '6px 12px',
        marginBottom: 12
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, fontWeight: 800, color: '#94a3b8' }}>
          <Globe size={13} color="#f59e0b" />
          <span>{t('settings.language', 'Dil / Language')}:</span>
        </div>
        <div style={{ display: 'flex', gap: 4 }}>
          {languagesList.map((l) => (
            <button
              key={l.code}
              onClick={() => handleSwitchLanguage(l.code)}
              style={{
                background: lang === l.code ? 'linear-gradient(135deg, #f59e0b, #d97706)' : 'rgba(255, 255, 255, 0.05)',
                border: lang === l.code ? '1px solid #f59e0b' : '1px solid rgba(255, 255, 255, 0.08)',
                color: lang === l.code ? '#000' : '#cbd5e1',
                fontWeight: lang === l.code ? 900 : 600,
                fontSize: 10,
                padding: '3px 7px',
                borderRadius: 10,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 3,
                transition: 'all 0.15s ease'
              }}
            >
              <span>{l.flag}</span>
              <span>{l.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Header Banner */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.15) 0%, rgba(30, 27, 75, 0.4) 100%)',
        border: '1px solid rgba(245, 158, 11, 0.3)',
        borderRadius: 20,
        padding: '16px 18px',
        marginBottom: 16,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            width: 46,
            height: 46,
            borderRadius: 14,
            background: 'linear-gradient(135deg, #f59e0b, #d97706)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 16px rgba(245, 158, 11, 0.4)',
            flexShrink: 0
          }}>
            <ChefHat size={26} color="#000" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <h2 style={{ fontSize: 16, fontWeight: 900, color: '#fff', margin: 0 }}>
                {t('chef_banner.title', 'TASTE AI Chef')}
              </h2>
              <span style={{ fontSize: 9, background: '#10b981', color: '#fff', padding: '1px 6px', borderRadius: 6, fontWeight: 900 }}>
                {t('chef_banner.new_badge', 'PRO')}
              </span>
            </div>
            <p style={{ fontSize: 11, color: '#fbbf24', margin: '3px 0 0', fontWeight: 600 }}>
              {t('chef_banner.desc', 'Buzdolabındaki malzemeleri seç, gurme tarif & kalori çıkar!')}
            </p>
          </div>
        </div>
      </div>

      {/* Selected Ingredients Bar */}
      <div style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--bg-card-border)',
        borderRadius: 18,
        padding: '14px',
        marginBottom: 16
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
          <div style={{ fontSize: 12, fontWeight: 800, color: '#fff', display: 'flex', alignItems: 'center', gap: 6 }}>
            <span>🧊 {t('chef_app.fridge_title', 'Buzdolabım & Seçilenler')}</span>
            <span style={{ fontSize: 10, background: 'rgba(255,255,255,0.08)', padding: '2px 6px', borderRadius: 8, color: '#94a3b8' }}>
              {selectedIngredients.length}
            </span>
          </div>
          {selectedIngredients.length > 0 && (
            <button
              onClick={() => setSelectedIngredients([])}
              style={{ background: 'none', border: 'none', color: '#ef4444', fontSize: 11, fontWeight: 700, cursor: 'pointer' }}
            >
              {t('chef_app.clear', 'Temizle')}
            </button>
          )}
        </div>

        {/* Selected chips */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, minHeight: 34 }}>
          {selectedIngredients.length === 0 ? (
            <div style={{ fontSize: 11, color: '#64748b', fontStyle: 'italic', padding: '6px 0' }}>
              {t('chef_app.empty_hint', 'Henüz malzeme seçmediniz. Aşağıdaki listelerden ekleyin veya yazın.')}
            </div>
          ) : (
            selectedIngredients.map((item) => (
              <motion.span
                key={item}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                style={{
                  background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.2), rgba(217, 119, 6, 0.2))',
                  border: '1px solid rgba(245, 158, 11, 0.4)',
                  color: '#fbbf24',
                  fontSize: 11,
                  fontWeight: 800,
                  padding: '4px 8px',
                  borderRadius: 12,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 4
                }}
              >
                <span>{item}</span>
                <X size={12} style={{ cursor: 'pointer' }} onClick={() => removeIngredient(item)} />
              </motion.span>
            ))
          )}
        </div>

        {/* Custom Input */}
        <form onSubmit={addCustomIngredient} style={{ display: 'flex', gap: 6, marginTop: 12 }}>
          <input
            type="text"
            value={customInput}
            onChange={(e) => setCustomInput(e.target.value)}
            placeholder={t('chef_app.custom_placeholder', '+ Farklı bir malzeme yaz (örn: Avokado, Somon)...')}
            style={{
              flex: 1,
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 12,
              padding: '8px 12px',
              color: '#fff',
              fontSize: 12,
              outline: 'none'
            }}
          />
          <button
            type="submit"
            style={{
              background: '#f59e0b',
              border: 'none',
              borderRadius: 12,
              padding: '0 14px',
              color: '#000',
              fontWeight: 900,
              fontSize: 12,
              cursor: 'pointer'
            }}
          >
            {t('chef_app.add', 'Ekle')}
          </button>
        </form>
      </div>

      {/* Categories Tabs & Quick Pick */}
      <div style={{ marginBottom: 16 }}>
        <div style={{ fontSize: 11, fontWeight: 800, color: '#94a3b8', marginBottom: 8 }}>
          {t('chef_app.quick_presets', 'Hızlı Malzeme Seçimi')}
        </div>
        <div style={{ display: 'flex', gap: 6, overflowX: 'auto', paddingBottom: 6, scrollbarWidth: 'none' }}>
          {INGREDIENT_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              style={{
                background: activeCategory === cat.id ? 'rgba(245, 158, 11, 0.2)' : 'rgba(255,255,255,0.03)',
                border: activeCategory === cat.id ? '1px solid #f59e0b' : '1px solid rgba(255,255,255,0.06)',
                borderRadius: 12,
                padding: '6px 12px',
                color: activeCategory === cat.id ? '#fbbf24' : '#94a3b8',
                fontSize: 11,
                fontWeight: 800,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                display: 'flex',
                alignItems: 'center',
                gap: 5
              }}
            >
              <span>{cat.emoji}</span>
              <span>{getLocalizedText(cat.names)}</span>
            </button>
          ))}
        </div>

        {/* Category items pills */}
        <div style={{
          background: 'rgba(255,255,255,0.02)',
          border: '1px solid rgba(255,255,255,0.05)',
          borderRadius: 16,
          padding: 12,
          display: 'flex',
          flexWrap: 'wrap',
          gap: 6,
          marginTop: 6
        }}>
          {INGREDIENT_CATEGORIES.find(c => c.id === activeCategory)?.items.map((item) => {
            const itemName = getLocalizedText(item.names);
            const isSelected = selectedIngredients.includes(itemName);
            return (
              <button
                key={item.id}
                onClick={() => toggleIngredient(itemName)}
                style={{
                  background: isSelected ? '#f59e0b' : 'rgba(255,255,255,0.05)',
                  border: isSelected ? '1px solid #f59e0b' : '1px solid rgba(255,255,255,0.08)',
                  color: isSelected ? '#000' : '#e2e8f0',
                  fontSize: 11,
                  fontWeight: isSelected ? 900 : 600,
                  padding: '6px 10px',
                  borderRadius: 10,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4,
                  transition: 'all 0.15s ease'
                }}
              >
                {isSelected ? <CheckCircle2 size={12} /> : <Plus size={12} />}
                <span>{itemName}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Preferences (Time, Diet, Cuisine) */}
      <div style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--bg-card-border)',
        borderRadius: 18,
        padding: 14,
        marginBottom: 16
      }}>
        <div style={{ fontSize: 12, fontWeight: 800, color: '#fff', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
          <span>⚙️ {t('chef_app.chef_preferences', 'Şef Tercihleri')}</span>
        </div>

        {/* Time */}
        <div style={{ marginBottom: 12 }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: '#94a3b8', marginBottom: 6, display: 'flex', alignItems: 'center', gap: 4 }}>
            <Clock size={11} />
            <span>{t('chef_app.cooking_time', 'Pişirme Süresi')}</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 6 }}>
            {[
              { id: 'quick', label: t('chef_app.time_quick', '15-20 Dk (Hızlı)') },
              { id: 'medium', label: t('chef_app.time_medium', '30 Dk (Orta)') },
              { id: 'gourmet', label: t('chef_app.time_gourmet', '45+ Dk (Gurme)') }
            ].map((tOption) => (
              <button
                key={tOption.id}
                onClick={() => setCookingTime(tOption.id as any)}
                style={{
                  background: cookingTime === tOption.id ? 'rgba(245, 158, 11, 0.2)' : 'rgba(255,255,255,0.03)',
                  border: cookingTime === tOption.id ? '1px solid #f59e0b' : '1px solid rgba(255,255,255,0.06)',
                  color: cookingTime === tOption.id ? '#fbbf24' : '#94a3b8',
                  padding: '7px 4px',
                  borderRadius: 10,
                  fontSize: 10,
                  fontWeight: 800,
                  cursor: 'pointer'
                }}
              >
                {tOption.label}
              </button>
            ))}
          </div>
        </div>

        {/* Diet */}
        <div style={{ marginBottom: 12 }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: '#94a3b8', marginBottom: 6, display: 'flex', alignItems: 'center', gap: 4 }}>
            <Flame size={11} />
            <span>{t('chef_app.diet_type', 'Diyet & Beslenme')}</span>
          </div>
          <div style={{ display: 'flex', gap: 6, overflowX: 'auto', paddingBottom: 4, scrollbarWidth: 'none' }}>
            {[
              { id: 'all', label: t('chef_app.diet_all', 'Tümü') },
              { id: 'high_protein', label: t('chef_app.diet_high_protein', 'Yüksek Protein') },
              { id: 'low_calorie', label: t('chef_app.diet_low_calorie', 'Düşük Kalori / Fit') },
              { id: 'keto', label: t('chef_app.diet_keto', 'Keto') },
              { id: 'vegan', label: t('chef_app.diet_vegan', 'Vegan') }
            ].map((dOption) => (
              <button
                key={dOption.id}
                onClick={() => setDietType(dOption.id as any)}
                style={{
                  background: dietType === dOption.id ? 'rgba(16, 185, 129, 0.2)' : 'rgba(255,255,255,0.03)',
                  border: dietType === dOption.id ? '1px solid #10b981' : '1px solid rgba(255,255,255,0.06)',
                  color: dietType === dOption.id ? '#10b981' : '#94a3b8',
                  padding: '6px 10px',
                  borderRadius: 10,
                  fontSize: 10,
                  fontWeight: 800,
                  whiteSpace: 'nowrap',
                  cursor: 'pointer'
                }}
              >
                {dOption.label}
              </button>
            ))}
          </div>
        </div>

        {/* Cuisine */}
        <div>
          <div style={{ fontSize: 10, fontWeight: 700, color: '#94a3b8', marginBottom: 6, display: 'flex', alignItems: 'center', gap: 4 }}>
            <Utensils size={11} />
            <span>{t('chef_app.cuisine', 'Mutfak Stili')}</span>
          </div>
          <div style={{ display: 'flex', gap: 6, overflowX: 'auto', paddingBottom: 4, scrollbarWidth: 'none' }}>
            {[
              { id: 'mediterranean', label: t('chef_app.cuisine_mediterranean', 'Akdeniz') },
              { id: 'turkish', label: t('chef_app.cuisine_turkish', 'Türk Mutfağı') },
              { id: 'italian', label: t('chef_app.cuisine_italian', 'İtalyan') },
              { id: 'asian', label: t('chef_app.cuisine_asian', 'Asya') },
              { id: 'world', label: t('chef_app.cuisine_world', 'Dünya') }
            ].map((cOption) => (
              <button
                key={cOption.id}
                onClick={() => setCuisine(cOption.id as any)}
                style={{
                  background: cuisine === cOption.id ? 'rgba(59, 130, 246, 0.2)' : 'rgba(255,255,255,0.03)',
                  border: cuisine === cOption.id ? '1px solid #3b82f6' : '1px solid rgba(255,255,255,0.06)',
                  color: cuisine === cOption.id ? '#60a5fa' : '#94a3b8',
                  padding: '6px 10px',
                  borderRadius: 10,
                  fontSize: 10,
                  fontWeight: 800,
                  whiteSpace: 'nowrap',
                  cursor: 'pointer'
                }}
              >
                {cOption.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Action: Generate Recipe Button */}
      <motion.button
        whileHover={{ scale: selectedIngredients.length > 0 && !isGenerating ? 1.02 : 1 }}
        whileTap={{ scale: selectedIngredients.length > 0 && !isGenerating ? 0.98 : 1 }}
        disabled={selectedIngredients.length === 0 || isGenerating}
        onClick={handleGenerateRecipe}
        style={{
          width: '100%',
          background: selectedIngredients.length === 0 || isGenerating
            ? 'rgba(255,255,255,0.08)'
            : 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
          border: 'none',
          borderRadius: 16,
          padding: '14px',
          color: selectedIngredients.length === 0 || isGenerating ? '#64748b' : '#000',
          fontWeight: 900,
          fontSize: 14,
          cursor: selectedIngredients.length === 0 || isGenerating ? 'not-allowed' : 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 8,
          boxShadow: selectedIngredients.length > 0 && !isGenerating ? '0 4px 20px rgba(245, 158, 11, 0.35)' : 'none',
          marginBottom: 20
        }}
      >
        {isGenerating ? (
          <>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
              style={{ width: 16, height: 16, border: '2px solid rgba(0,0,0,0.2)', borderTopColor: '#000', borderRadius: '50%' }}
            />
            <span>{t('chef_app.generating', '👨‍🍳 Şef Malzemeleri Değerlendiriyor...')}</span>
          </>
        ) : (
          <>
            <Sparkles size={16} />
            <span>{t('chef_app.create_recipe_btn', '✨ Özel Gurme Tarif & Kalori Çıkar')}</span>
          </>
        )}
      </motion.button>

      {/* ── Generated Recipe Display ── */}
      <AnimatePresence>
        {recipe && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            style={{
              background: 'linear-gradient(180deg, rgba(20, 24, 45, 0.95) 0%, rgba(15, 23, 42, 0.98) 100%)',
              border: '1px solid rgba(245, 158, 11, 0.4)',
              borderRadius: 22,
              padding: '18px',
              boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
            }}
          >
            {/* Header / Title */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
              <div>
                <div style={{ display: 'flex', gap: 6, marginBottom: 6, flexWrap: 'wrap' }}>
                  <span style={{ fontSize: 9, background: 'rgba(245, 158, 11, 0.2)', color: '#fbbf24', padding: '2px 8px', borderRadius: 8, fontWeight: 900 }}>
                    {recipe.cuisine}
                  </span>
                  <span style={{ fontSize: 9, background: 'rgba(16, 185, 129, 0.2)', color: '#10b981', padding: '2px 8px', borderRadius: 8, fontWeight: 900 }}>
                    {recipe.diet}
                  </span>
                  <span style={{ fontSize: 9, background: 'rgba(59, 130, 246, 0.2)', color: '#60a5fa', padding: '2px 8px', borderRadius: 8, fontWeight: 900 }}>
                    ⏱️ {recipe.cookingTime}
                  </span>
                </div>
                <h3 style={{ fontSize: 18, fontWeight: 900, color: '#fff', margin: '0 0 6px' }}>
                  {recipe.title}
                </h3>
                <p style={{ fontSize: 12, color: '#cbd5e1', margin: 0, lineHeight: 1.4 }}>
                  {recipe.description}
                </p>
              </div>
            </div>

            {/* Macro & Calories Dashboard */}
            <div style={{
              background: 'rgba(0,0,0,0.35)',
              border: '1px solid rgba(255,255,255,0.06)',
              borderRadius: 16,
              padding: '12px',
              marginBottom: 16
            }}>
              <div style={{ fontSize: 10, fontWeight: 800, color: '#94a3b8', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                {t('chef_app.macro_dashboard', 'Makro & Kalori Değerleri (Porsiyon Başına)')}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8, textAlign: 'center' }}>
                <div style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', borderRadius: 12, padding: '8px 4px' }}>
                  <div style={{ fontSize: 10, color: '#f87171', fontWeight: 700 }}>{t('chef_app.calories', 'Kalori')}</div>
                  <div style={{ fontSize: 16, fontWeight: 900, color: '#fff', marginTop: 2 }}>{recipe.calories}</div>
                  <div style={{ fontSize: 9, color: '#94a3b8' }}>kcal</div>
                </div>

                <div style={{ background: 'rgba(59, 130, 246, 0.1)', border: '1px solid rgba(59, 130, 246, 0.2)', borderRadius: 12, padding: '8px 4px' }}>
                  <div style={{ fontSize: 10, color: '#60a5fa', fontWeight: 700 }}>{t('chef_app.protein', 'Protein')}</div>
                  <div style={{ fontSize: 16, fontWeight: 900, color: '#fff', marginTop: 2 }}>{recipe.protein}g</div>
                  <div style={{ fontSize: 9, color: '#94a3b8' }}>kas yapıcı</div>
                </div>

                <div style={{ background: 'rgba(245, 158, 11, 0.1)', border: '1px solid rgba(245, 158, 11, 0.2)', borderRadius: 12, padding: '8px 4px' }}>
                  <div style={{ fontSize: 10, color: '#fbbf24', fontWeight: 700 }}>{t('chef_app.carbs', 'Karb')}</div>
                  <div style={{ fontSize: 16, fontWeight: 900, color: '#fff', marginTop: 2 }}>{recipe.carbs}g</div>
                  <div style={{ fontSize: 9, color: '#94a3b8' }}>enerji</div>
                </div>

                <div style={{ background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.2)', borderRadius: 12, padding: '8px 4px' }}>
                  <div style={{ fontSize: 10, color: '#34d399', fontWeight: 700 }}>{t('chef_app.fat', 'Sağlıklı Yağ')}</div>
                  <div style={{ fontSize: 16, fontWeight: 900, color: '#fff', marginTop: 2 }}>{recipe.fat}g</div>
                  <div style={{ fontSize: 9, color: '#94a3b8' }}>besleyici</div>
                </div>
              </div>

              {/* Allergens */}
              {recipe.allergens && recipe.allergens.length > 0 && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 10, fontSize: 10, color: '#fbbf24' }}>
                  <AlertTriangle size={12} />
                  <span>{t('chef_app.allergens', 'Alerjenler')}: {recipe.allergens.join(', ')}</span>
                </div>
              )}
            </div>

            {/* Ingredients */}
            <div style={{ marginBottom: 16 }}>
              <h4 style={{ fontSize: 13, fontWeight: 900, color: '#fff', margin: '0 0 8px', display: 'flex', alignItems: 'center', gap: 6 }}>
                <span>🛒</span>
                <span>{t('chef_app.ingredients_title', 'Gerekli Malzemeler & Ölçüler')}</span>
              </h4>
              <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: 14, padding: '10px 14px' }}>
                {recipe.ingredients.map((ing, idx) => (
                  <div key={idx} style={{ fontSize: 12, color: '#e2e8f0', padding: '4px 0', borderBottom: idx !== recipe.ingredients.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none' }}>
                    {ing}
                  </div>
                ))}
              </div>
            </div>

            {/* Instructions */}
            <div style={{ marginBottom: 16 }}>
              <h4 style={{ fontSize: 13, fontWeight: 900, color: '#fff', margin: '0 0 8px', display: 'flex', alignItems: 'center', gap: 6 }}>
                <span>👨‍🍳</span>
                <span>{t('chef_app.instructions_title', 'Adım Adım Hazırlanışı')}</span>
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {recipe.instructions.map((step, idx) => (
                  <div key={idx} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', background: 'rgba(255,255,255,0.02)', borderRadius: 12, padding: '8px 12px' }}>
                    <span style={{ width: 20, height: 20, borderRadius: '50%', background: 'linear-gradient(135deg, #f59e0b, #d97706)', color: '#000', fontSize: 11, fontWeight: 900, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      {idx + 1}
                    </span>
                    <span style={{ fontSize: 12, color: '#e2e8f0', lineHeight: 1.4, marginTop: 1 }}>
                      {step}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Chef Tip */}
            {recipe.chefTip && (
              <div style={{
                background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.15), rgba(217, 119, 6, 0.08))',
                border: '1px dashed rgba(245, 158, 11, 0.4)',
                borderRadius: 14,
                padding: '12px 14px',
                marginBottom: 16
              }}>
                <div style={{ fontSize: 11, fontWeight: 900, color: '#fbbf24', marginBottom: 4, display: 'flex', alignItems: 'center', gap: 4 }}>
                  <span>💡</span>
                  <span>{t('chef_app.chef_tip_title', '👨‍🍳 Şefin Altın Sırrı (Pro Tip)')}</span>
                </div>
                <div style={{ fontSize: 11, color: '#cbd5e1', lineHeight: 1.4 }}>
                  {recipe.chefTip}
                </div>
              </div>
            )}

            {/* Actions: Copy & Reset */}
            <div style={{ display: 'flex', gap: 8 }}>
              <button
                onClick={handleCopyRecipe}
                style={{
                  flex: 1,
                  background: copied ? 'rgba(16, 185, 129, 0.2)' : 'rgba(255,255,255,0.06)',
                  border: copied ? '1px solid #10b981' : '1px solid rgba(255,255,255,0.1)',
                  borderRadius: 14,
                  padding: '10px',
                  color: copied ? '#10b981' : '#fff',
                  fontSize: 12,
                  fontWeight: 800,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 6
                }}
              >
                {copied ? <CheckCircle2 size={14} /> : <Copy size={14} />}
                <span>{copied ? t('chef_app.copied', 'Kopyalandı!') : t('chef_app.share_copy', 'Tarifi Kopyala')}</span>
              </button>

              <button
                onClick={() => setRecipe(null)}
                style={{
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: 14,
                  padding: '10px 14px',
                  color: '#94a3b8',
                  fontSize: 12,
                  fontWeight: 800,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6
                }}
              >
                <RotateCcw size={14} />
                <span>{t('chef_app.new_recipe_btn', 'Yeni Tarif')}</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
