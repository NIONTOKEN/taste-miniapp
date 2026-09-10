import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles, ChefHat, Plus, X, Flame, AlertTriangle, Clock,
  CheckCircle2, Share2, Copy, Bookmark, BookmarkCheck, ArrowRight,
  RotateCcw, Utensils, Award
} from 'lucide-react';
import { useTranslation } from 'react-i18next';

// ─── Preset Ingredient Categories ──────────────────────────────────────────
interface PresetCategory {
  id: string;
  nameTr: string;
  nameEn: string;
  emoji: string;
  items: { id: string; nameTr: string; nameEn: string }[];
}

const INGREDIENT_CATEGORIES: PresetCategory[] = [
  {
    id: 'protein',
    nameTr: 'Et & Protein',
    nameEn: 'Meat & Protein',
    emoji: '🥩',
    items: [
      { id: 'chicken', nameTr: 'Tavuk Göğsü', nameEn: 'Chicken Breast' },
      { id: 'mince', nameTr: 'Kıyma', nameEn: 'Ground Beef' },
      { id: 'egg', nameTr: 'Yumurta', nameEn: 'Egg' },
      { id: 'salmon', nameTr: 'Somon / Balık', nameEn: 'Salmon / Fish' },
      { id: 'tuna', nameTr: 'Ton Balığı', nameEn: 'Tuna' },
      { id: 'tofu', nameTr: 'Tofu', nameEn: 'Tofu' }
    ]
  },
  {
    id: 'veggie',
    nameTr: 'Sebzeler',
    nameEn: 'Vegetables',
    emoji: '🥦',
    items: [
      { id: 'tomato', nameTr: 'Domates', nameEn: 'Tomato' },
      { id: 'onion', nameTr: 'Soğan', nameEn: 'Onion' },
      { id: 'garlic', nameTr: 'Sarımsak', nameEn: 'Garlic' },
      { id: 'mushroom', nameTr: 'Mantar', nameEn: 'Mushroom' },
      { id: 'pepper', nameTr: 'Biber', nameEn: 'Bell Pepper' },
      { id: 'spinach', nameTr: 'Ispanak', nameEn: 'Spinach' },
      { id: 'potato', nameTr: 'Patates', nameEn: 'Potato' },
      { id: 'zucchini', nameTr: 'Kabak', nameEn: 'Zucchini' }
    ]
  },
  {
    id: 'dairy',
    nameTr: 'Süt & Peynir',
    nameEn: 'Dairy & Cheese',
    emoji: '🧀',
    items: [
      { id: 'milk', nameTr: 'Süt', nameEn: 'Milk' },
      { id: 'cheese', nameTr: 'Kaşar / Peynir', nameEn: 'Cheese' },
      { id: 'cream', nameTr: 'Krema', nameEn: 'Heavy Cream' },
      { id: 'butter', nameTr: 'Tereyağı', nameEn: 'Butter' },
      { id: 'yogurt', nameTr: 'Yoğurt', nameEn: 'Yogurt' },
      { id: 'parmesan', nameTr: 'Parmesan', nameEn: 'Parmesan' }
    ]
  },
  {
    id: 'grains',
    nameTr: 'Tahıl & Bakliyat',
    nameEn: 'Grains & Pasta',
    emoji: '🌾',
    items: [
      { id: 'pasta', nameTr: 'Makarna', nameEn: 'Pasta' },
      { id: 'rice', nameTr: 'Pirinç', nameEn: 'Rice' },
      { id: 'bread', nameTr: 'Ekmek', nameEn: 'Bread' },
      { id: 'oats', nameTr: 'Yulaf', nameEn: 'Oats' },
      { id: 'lentils', nameTr: 'Mercimek', nameEn: 'Lentils' },
      { id: 'chickpeas', nameTr: 'Nohut', nameEn: 'Chickpeas' }
    ]
  },
  {
    id: 'sauces',
    nameTr: 'Sos & Baharat',
    nameEn: 'Sauces & Spices',
    emoji: '🧄',
    items: [
      { id: 'olive_oil', nameTr: 'Zeytinyağı', nameEn: 'Olive Oil' },
      { id: 'tomato_paste', nameTr: 'Salça', nameEn: 'Tomato Paste' },
      { id: 'soy_sauce', nameTr: 'Soya Sosu', nameEn: 'Soy Sauce' },
      { id: 'thyme', nameTr: 'Kekik', nameEn: 'Thyme' },
      { id: 'basil', nameTr: 'Fesleğen', nameEn: 'Basil' },
      { id: 'black_pepper', nameTr: 'Karabiber', nameEn: 'Black Pepper' }
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
  taiReward: number;
}

export function TasteAIChef() {
  const { t, i18n } = useTranslation();
  const isTr = i18n.language?.startsWith('tr');

  // State
  const [selectedIngredients, setSelectedIngredients] = useState<string[]>([
    isTr ? 'Tavuk Göğsü' : 'Chicken Breast',
    isTr ? 'Mantar' : 'Mushroom',
    isTr ? 'Sarımsak' : 'Garlic'
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
    const cuisineLabel = cuisine === 'mediterranean' ? 'Akdeniz / Mediterranean' : cuisine === 'turkish' ? 'Türk Mutfağı' : cuisine === 'italian' ? 'İtalyan / Italian' : cuisine === 'asian' ? 'Asya / Asian' : 'Dünya Mutfağı';

    const prompt = `
You are TASTE AI — an elite Michelin-star gourmet Web3 Chef.
Create an exceptional, delicious recipe using these available ingredients: ${selectedIngredients.join(', ')}.
Preferences:
- Time limit: ${timeLabel}
- Diet style: ${dietLabel}
- Cuisine: ${cuisineLabel}
- Language: ${isTr ? 'Turkish' : 'English'}

CRITICAL: Return ONLY a valid, raw JSON object (without markdown backticks, without preamble) matching this schema:
{
  "title": "Gourmet recipe title",
  "description": "Appetizing 1-2 sentence description",
  "cookingTime": "${timeLabel}",
  "difficulty": "Kolay / Easy / Orta / Medium",
  "cuisine": "${cuisineLabel}",
  "diet": "${dietLabel}",
  "calories": 420,
  "protein": 38,
  "carbs": 18,
  "fat": 12,
  "allergens": ["Gluten", "Laktoz / Dairy"],
  "ingredients": [
    "300g Chicken breast (cubed)",
    "200g Mushrooms (sliced)",
    "2 cloves Garlic (minced)",
    "Salt, pepper, olive oil"
  ],
  "instructions": [
    "Step 1...",
    "Step 2...",
    "Step 3...",
    "Step 4..."
  ],
  "chefTip": "Pro-level secret to enhance flavor",
  "taiReward": 25
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
    } catch (e) {
      console.warn('[TasteAIChef] API request fallback triggered:', e);
    }

    // Smart Gastronomy Fallback Generator
    setTimeout(() => {
      const primary = selectedIngredients[0] || (isTr ? 'Tavuk' : 'Chicken');
      const secondary = selectedIngredients[1] || (isTr ? 'Sebze' : 'Vegetable');
      
      const fallbackRecipe: GeneratedRecipe = {
        title: isTr 
          ? `Kekikli & Sarımsaklı Gurme ${primary}` 
          : `Gourmet Herb & Garlic ${primary}`,
        description: isTr
          ? `${primary} ve taze ${secondary} aromalarının zeytinyağı ile mükemmel birleştiği, yüksek proteinli ve hafif bir şef tabağı.`
          : `A tender, pan-seared ${primary} dish infused with aromatic herbs, ${secondary}, and rich savory notes.`,
        cookingTime: timeLabel,
        difficulty: isTr ? 'Orta Düzey' : 'Medium',
        cuisine: cuisineLabel,
        diet: dietLabel,
        calories: 385,
        protein: 36,
        carbs: 14,
        fat: 11,
        allergens: isTr ? ['Laktoz (Eser Miktarda)'] : ['Dairy (Trace)'],
        ingredients: [
          ...selectedIngredients.map(i => `• ${i} (Porsiyona göre ayarlanmış)`),
          isTr ? '• 2 yemek kaşığı sızma zeytinyağı' : '• 2 tbsp extra virgin olive oil',
          isTr ? '• Taze çekilmiş deniz tuzu & karabiber' : '• Sea salt & freshly cracked black pepper',
          isTr ? '• 1 tatlı kaşığı dağ kekiği' : '• 1 tsp dried mountain thyme'
        ],
        instructions: isTr ? [
          '1. Tavayı orta-yüksek ateşte 2 dakika ısıtın ve zeytinyağını ekleyin.',
          `2. ${primary} parçalarını altın sarısı renk alana kadar 5-6 dakika soteleyin.`,
          `3. Ardından ${secondary} ve sarımsakları ekleyip kokusu çıkana kadar 3 dakika çevirin.`,
          '4. Baharatları ilave edip kısık ateşte kapağı kapalı 4 dakika dinlendirerek lezzetlerin özleşmesini sağlayın.',
          '5. Sıcak olarak tabağa alın, üzerine taze kekik serpiştirerek servis edin.'
        ] : [
          '1. Heat a skillet over medium-high heat with extra virgin olive oil.',
          `2. Sear the ${primary} until golden brown, about 5-6 minutes.`,
          `3. Toss in ${secondary} and minced garlic, sautéing for 3 minutes until fragrant.`,
          '4. Season with sea salt, black pepper and mountain thyme, cover and simmer for 4 minutes.',
          '5. Plate immediately and garnish with fresh herbs. Bon appétit!'
        ],
        chefTip: isTr
          ? 'Eti pişirdikten sonra hemen kesmeyin; 3 dakika dinlendirirseniz suları içinde kalarak pamuk gibi yumuşak kalır.'
          : 'Let your meat rest for 3 minutes before slicing to lock in all the natural savory juices.',
        taiReward: 25
      };

      setRecipe(fallbackRecipe);
      setIsGenerating(false);
    }, 1200);
  };

  const copyRecipe = () => {
    if (!recipe) return;
    const text = `🍳 ${recipe.title}\n⏱️ ${recipe.cookingTime} | 🔥 ${recipe.calories} kcal (P: ${recipe.protein}g, K: ${recipe.carbs}g, Y: ${recipe.fat}g)\n\n🛒 Malzemeler:\n${recipe.ingredients.join('\n')}\n\n👨‍🍳 Hazırlanışı:\n${recipe.instructions.join('\n')}\n\n💡 Şef İpucu: ${recipe.chefTip}\n\n💎 TASTE AI Chef ile üretildi: https://taste-miniapp-xy8k.vercel.app`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareTelegram = () => {
    if (!recipe) return;
    const shareText = encodeURIComponent(`🍳 TASTE AI Chef bana buzdolabımdaki malzemelerden harika bir gurme tarif çıkardı: "${recipe.title}" (${recipe.calories} kcal)! Sen de dene:`);
    const shareUrl = encodeURIComponent('https://taste-miniapp-xy8k.vercel.app');
    const tgUrl = `https://t.me/share/url?url=${shareUrl}&text=${shareText}`;
    if (window.Telegram?.WebApp) {
      window.Telegram.WebApp.openTelegramLink(tgUrl);
    } else {
      window.open(tgUrl, '_blank');
    }
  };

  return (
    <div style={{ padding: '4px 0 24px' }}>
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
            boxShadow: '0 0 16px rgba(245, 158, 11, 0.4)'
          }}>
            <ChefHat size={26} color="#000" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <h2 style={{ fontSize: 16, fontWeight: 900, color: '#fff', margin: 0 }}>
                TASTE AI Chef
              </h2>
              <span style={{ fontSize: 9, background: '#10b981', color: '#fff', padding: '1px 6px', borderRadius: 6, fontWeight: 900 }}>
                PRO
              </span>
            </div>
            <p style={{ fontSize: 11, color: '#fbbf24', margin: '3px 0 0' }}>
              {isTr ? 'Buzdolabındaki malzemeleri seç, gurme tarif & kalori çıkar!' : 'Pick your ingredients, get gourmet recipe & macro calories!'}
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
            <span>🧊 {isTr ? 'Buzdolabım & Seçilenler' : 'My Fridge & Selected'}</span>
            <span style={{ fontSize: 10, background: 'rgba(255,255,255,0.08)', padding: '2px 6px', borderRadius: 8, color: '#94a3b8' }}>
              {selectedIngredients.length}
            </span>
          </div>
          {selectedIngredients.length > 0 && (
            <button
              onClick={() => setSelectedIngredients([])}
              style={{ background: 'none', border: 'none', color: '#ef4444', fontSize: 11, fontWeight: 700, cursor: 'pointer' }}
            >
              {isTr ? 'Temizle' : 'Clear'}
            </button>
          )}
        </div>

        {/* Selected chips */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, minHeight: 34 }}>
          {selectedIngredients.length === 0 ? (
            <div style={{ fontSize: 11, color: '#64748b', fontStyle: 'italic', padding: '6px 0' }}>
              {isTr ? 'Henüz malzeme seçmediniz. Aşağıdaki listelerden ekleyin veya yazın.' : 'No ingredients selected. Pick from below or type custom ones.'}
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
            placeholder={isTr ? '+ Farklı bir malzeme yaz (örn: Avokado, Somon)...' : '+ Type custom ingredient (e.g. Avocado, Salmon)...'}
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
            {isTr ? 'Ekle' : 'Add'}
          </button>
        </form>
      </div>

      {/* Categories Tabs & Quick Pick */}
      <div style={{ marginBottom: 16 }}>
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
              <span>{isTr ? cat.nameTr : cat.nameEn}</span>
            </button>
          ))}
        </div>

        {/* Category Items */}
        <div style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--bg-card-border)',
          borderRadius: 16,
          padding: '12px',
          display: 'flex',
          flexWrap: 'wrap',
          gap: 6
        }}>
          {INGREDIENT_CATEGORIES.find(c => c.id === activeCategory)?.items.map((item) => {
            const name = isTr ? item.nameTr : item.nameEn;
            const isSelected = selectedIngredients.includes(name);
            return (
              <button
                key={item.id}
                onClick={() => toggleIngredient(name)}
                style={{
                  background: isSelected ? '#f59e0b' : 'rgba(255,255,255,0.04)',
                  border: isSelected ? '1px solid #f59e0b' : '1px solid rgba(255,255,255,0.08)',
                  color: isSelected ? '#000' : '#e2e8f0',
                  padding: '6px 10px',
                  borderRadius: 10,
                  fontSize: 11,
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4,
                  transition: 'all 0.15s ease'
                }}
              >
                {isSelected ? <CheckCircle2 size={12} /> : <Plus size={12} />}
                <span>{name}</span>
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
        padding: '14px',
        marginBottom: 16
      }}>
        <div style={{ fontSize: 12, fontWeight: 800, color: '#fff', marginBottom: 10 }}>
          ⚙️ {isTr ? 'Şef Tercihleri' : 'Chef Preferences'}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          {/* Cooking Time */}
          <div>
            <div style={{ fontSize: 10, color: '#94a3b8', fontWeight: 700, marginBottom: 4 }}>
              ⏱️ {isTr ? 'Hazırlık Süresi' : 'Prep Time'}
            </div>
            <select
              value={cookingTime}
              onChange={(e: any) => setCookingTime(e.target.value)}
              style={{
                width: '100%',
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.08)',
                color: '#fff',
                borderRadius: 10,
                padding: '6px 8px',
                fontSize: 11,
                fontWeight: 700
              }}
            >
              <option value="quick">{isTr ? '⚡ 15-20 Dk (Hızlı)' : '⚡ 15-20 Min (Quick)'}</option>
              <option value="medium">{isTr ? '🍲 30 Dk (Pratik)' : '🍲 30 Min (Medium)'}</option>
              <option value="gourmet">{isTr ? '👑 45+ Dk (Gurme)' : '👑 45+ Min (Gourmet)'}</option>
            </select>
          </div>

          {/* Diet Type */}
          <div>
            <div style={{ fontSize: 10, color: '#94a3b8', fontWeight: 700, marginBottom: 4 }}>
              🥗 {isTr ? 'Diyet / Tarz' : 'Diet Style'}
            </div>
            <select
              value={dietType}
              onChange={(e: any) => setDietType(e.target.value)}
              style={{
                width: '100%',
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.08)',
                color: '#fff',
                borderRadius: 10,
                padding: '6px 8px',
                fontSize: 11,
                fontWeight: 700
              }}
            >
              <option value="high_protein">{isTr ? '💪 Yüksek Protein' : '💪 High Protein'}</option>
              <option value="low_calorie">{isTr ? '🌿 Düşük Kalori / Fit' : '🌿 Low Calorie'}</option>
              <option value="all">{isTr ? '🍽️ Standart Lezzet' : '🍽️ Standard'}</option>
              <option value="keto">{isTr ? '🥑 Ketojenik' : '🥑 Keto'}</option>
              <option value="vegan">{isTr ? '🌱 Vegan / Vejetaryen' : '🌱 Vegan / Veg'}</option>
            </select>
          </div>
        </div>
      </div>

      {/* Generate Button */}
      <motion.button
        whileTap={{ scale: 0.97 }}
        disabled={isGenerating || selectedIngredients.length === 0}
        onClick={handleGenerateRecipe}
        style={{
          width: '100%',
          padding: '16px',
          borderRadius: 18,
          border: 'none',
          background: selectedIngredients.length === 0
            ? 'rgba(255,255,255,0.05)'
            : 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
          color: selectedIngredients.length === 0 ? '#64748b' : '#000',
          fontSize: 14,
          fontWeight: 900,
          cursor: selectedIngredients.length === 0 ? 'not-allowed' : 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 8,
          boxShadow: selectedIngredients.length > 0 ? '0 6px 20px rgba(245, 158, 11, 0.4)' : 'none',
          marginBottom: 20
        }}
      >
        {isGenerating ? (
          <>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
            >
              <Sparkles size={18} />
            </motion.div>
            <span>{isTr ? 'Şef Tarifi & Kalorileri Hazırlıyor...' : 'Chef is crafting recipe & calories...'}</span>
          </>
        ) : (
          <>
            <Sparkles size={18} />
            <span>{isTr ? 'Şef Gurme Tarifini Üret' : 'Generate Gourmet Recipe'}</span>
          </>
        )}
      </motion.button>

      {/* Generated Recipe Card */}
      <AnimatePresence>
        {recipe && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20 }}
            style={{
              background: 'linear-gradient(180deg, rgba(30, 41, 59, 0.9) 0%, rgba(15, 23, 42, 0.95) 100%)',
              border: '1px solid rgba(245, 158, 11, 0.3)',
              borderRadius: 24,
              padding: '20px',
              boxShadow: '0 12px 32px rgba(0,0,0,0.6)'
            }}
          >
            {/* Title & Badges */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
              <div>
                <span style={{
                  fontSize: 10,
                  background: 'rgba(245, 158, 11, 0.15)',
                  color: '#fbbf24',
                  border: '1px solid rgba(245, 158, 11, 0.3)',
                  padding: '2px 8px',
                  borderRadius: 10,
                  fontWeight: 900
                }}>
                  {recipe.cuisine} • {recipe.diet}
                </span>
                <h3 style={{ fontSize: 18, fontWeight: 900, color: '#fff', margin: '8px 0 4px' }}>
                  {recipe.title}
                </h3>
                <p style={{ fontSize: 12, color: '#94a3b8', margin: 0, lineHeight: 1.5 }}>
                  {recipe.description}
                </p>
              </div>

              <div style={{
                background: 'rgba(16, 185, 129, 0.15)',
                border: '1px solid rgba(16, 185, 129, 0.3)',
                padding: '4px 8px',
                borderRadius: 10,
                color: '#10b981',
                fontSize: 11,
                fontWeight: 900,
                display: 'flex',
                alignItems: 'center',
                gap: 4
              }}>
                <Award size={13} />
                <span>+{recipe.taiReward} TAI</span>
              </div>
            </div>

            {/* Macro & Calories Dashboard */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: 6,
              background: 'rgba(0,0,0,0.3)',
              padding: '12px 8px',
              borderRadius: 16,
              border: '1px solid rgba(255,255,255,0.05)',
              marginBottom: 16,
              textAlign: 'center'
            }}>
              <div>
                <div style={{ fontSize: 9, color: '#f59e0b', fontWeight: 800 }}>KALORİ</div>
                <div style={{ fontSize: 15, fontWeight: 900, color: '#fff', marginTop: 2 }}>{recipe.calories}</div>
                <div style={{ fontSize: 8, color: '#64748b' }}>kcal</div>
              </div>
              <div>
                <div style={{ fontSize: 9, color: '#38bdf8', fontWeight: 800 }}>PROTEİN</div>
                <div style={{ fontSize: 15, fontWeight: 900, color: '#fff', marginTop: 2 }}>{recipe.protein}g</div>
                <div style={{ fontSize: 8, color: '#64748b' }}>makro</div>
              </div>
              <div>
                <div style={{ fontSize: 9, color: '#a78bfa', fontWeight: 800 }}>KARB</div>
                <div style={{ fontSize: 15, fontWeight: 900, color: '#fff', marginTop: 2 }}>{recipe.carbs}g</div>
                <div style={{ fontSize: 8, color: '#64748b' }}>makro</div>
              </div>
              <div>
                <div style={{ fontSize: 9, color: '#f43f5e', fontWeight: 800 }}>YAĞ</div>
                <div style={{ fontSize: 15, fontWeight: 900, color: '#fff', marginTop: 2 }}>{recipe.fat}g</div>
                <div style={{ fontSize: 8, color: '#64748b' }}>makro</div>
              </div>
            </div>

            {/* Allergens Warning Bar */}
            {recipe.allergens && recipe.allergens.length > 0 && (
              <div style={{
                background: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid rgba(239, 68, 68, 0.25)',
                borderRadius: 12,
                padding: '8px 12px',
                marginBottom: 16,
                display: 'flex',
                alignItems: 'center',
                gap: 8
              }}>
                <AlertTriangle size={15} color="#ef4444" />
                <div style={{ fontSize: 11, color: '#fca5a5' }}>
                  <strong style={{ color: '#ef4444' }}>{isTr ? 'Alerjen Uyarısı: ' : 'Allergen Alert: '}</strong>
                  {recipe.allergens.join(', ')}
                </div>
              </div>
            )}

            {/* Ingredients Section */}
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 12, fontWeight: 800, color: '#fbbf24', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
                <Utensils size={14} />
                <span>{isTr ? 'Gerekli Malzemeler & Ölçüler' : 'Ingredients & Measurements'}</span>
              </div>
              <div style={{
                background: 'rgba(255,255,255,0.02)',
                borderRadius: 14,
                padding: '10px 14px',
                fontSize: 12,
                color: '#cbd5e1',
                lineHeight: 1.7
              }}>
                {recipe.ingredients.map((ing, idx) => (
                  <div key={idx}>{ing}</div>
                ))}
              </div>
            </div>

            {/* Step-by-Step Instructions */}
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 12, fontWeight: 800, color: '#10b981', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
                <ChefHat size={14} />
                <span>{isTr ? 'Şefin Adım Adım Hazırlanış Rehberi' : 'Step-by-Step Preparation Guide'}</span>
              </div>
              <div style={{
                background: 'rgba(255,255,255,0.02)',
                borderRadius: 14,
                padding: '10px 14px',
                fontSize: 12,
                color: '#cbd5e1',
                lineHeight: 1.7
              }}>
                {recipe.instructions.map((step, idx) => (
                  <div key={idx} style={{ marginBottom: 6 }}>{step}</div>
                ))}
              </div>
            </div>

            {/* Chef Tip */}
            {recipe.chefTip && (
              <div style={{
                background: 'rgba(245, 158, 11, 0.08)',
                border: '1px solid rgba(245, 158, 11, 0.2)',
                borderRadius: 14,
                padding: '10px 14px',
                marginBottom: 16,
                fontSize: 11,
                color: '#fef08a'
              }}>
                <strong>💡 {isTr ? 'Şefin Püf Noktası: ' : 'Chef Pro Tip: '}</strong>
                {recipe.chefTip}
              </div>
            )}

            {/* Actions Bar */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              <button
                onClick={copyRecipe}
                style={{
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  padding: '10px',
                  borderRadius: 12,
                  color: '#fff',
                  fontSize: 12,
                  fontWeight: 800,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 6
                }}
              >
                {copied ? <CheckCircle2 size={14} color="#10b981" /> : <Copy size={14} />}
                <span>{copied ? (isTr ? 'Kopyalandı!' : 'Copied!') : (isTr ? 'Tarifi Kopyala' : 'Copy Recipe')}</span>
              </button>

              <button
                onClick={shareTelegram}
                style={{
                  background: '#229ED9',
                  border: 'none',
                  padding: '10px',
                  borderRadius: 12,
                  color: '#fff',
                  fontSize: 12,
                  fontWeight: 800,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 6
                }}
              >
                <Share2 size={14} />
                <span>{isTr ? "Telegram'da Paylaş" : 'Share on Telegram'}</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
