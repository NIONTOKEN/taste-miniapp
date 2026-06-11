import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Sprout, CookingPot, Store, TrendingUp, Clock } from 'lucide-react';

type FarmItem = {
    id: string;
    nameTr: string;
    nameEn: string;
    emoji: string;
    points: number;
    color: string;
};

type RecipeItem = {
    id: string;
    nameTr: string;
    nameEn: string;
    emoji: string;
    points: number;
    color: string;
    requirements: { [key: string]: number };
};

type UpgradeItem = {
    id: string;
    nameTr: string;
    nameEn: string;
    emoji: string;
    baseCost: number;
    profitPerHr: number;
    color: string;
};

const FARM_ITEMS: FarmItem[] = [
    { id: 'tomato', nameTr: 'Domates', nameEn: 'Tomato', emoji: '🍅', points: 10, color: '#ef4444' },
    { id: 'strawberry', nameTr: 'Çilek', nameEn: 'Strawberry', emoji: '🍓', points: 15, color: '#f43f5e' },
    { id: 'lemon', nameTr: 'Limon', nameEn: 'Lemon', emoji: '🍋', points: 20, color: '#eab308' },
    { id: 'wheat', nameTr: 'Buğday', nameEn: 'Wheat', emoji: '🌾', points: 5, color: '#f59e0b' },
    { id: 'olive', nameTr: 'Zeytin', nameEn: 'Olive', emoji: '🫒', points: 25, color: '#84cc16' }
];

const RECIPES: RecipeItem[] = [
    { 
        id: 'tomato_soup', nameTr: 'Domates Çorbası', nameEn: 'Tomato Soup', emoji: '🥣', points: 100, color: '#ef4444', 
        requirements: { 'tomato': 3 } 
    },
    { 
        id: 'fruit_salad', nameTr: 'Meyve Salatası', nameEn: 'Fruit Salad', emoji: '🥗', points: 150, color: '#22c55e', 
        requirements: { 'strawberry': 2, 'lemon': 2 } 
    },
    { 
        id: 'bread', nameTr: 'Taze Ekmek', nameEn: 'Fresh Bread', emoji: '🍞', points: 50, color: '#f59e0b', 
        requirements: { 'wheat': 3 } 
    },
    { 
        id: 'pizza', nameTr: 'Akdeniz Pizzası', nameEn: 'Mediterranean Pizza', emoji: '🍕', points: 350, color: '#f97316', 
        requirements: { 'tomato': 2, 'wheat': 2, 'olive': 2 } 
    }
];

const UPGRADES: UpgradeItem[] = [
    { id: 'stand', nameTr: 'Küçük Tezgah', nameEn: 'Small Stand', emoji: '🏪', baseCost: 500, profitPerHr: 100, color: '#94a3b8' },
    { id: 'truck', nameTr: 'Yemek Kamyonu', nameEn: 'Food Truck', emoji: '🚚', baseCost: 2500, profitPerHr: 600, color: '#3b82f6' },
    { id: 'cafe', nameTr: 'Taste Kafe', nameEn: 'Taste Cafe', emoji: '☕️', baseCost: 10000, profitPerHr: 2500, color: '#f59e0b' },
    { id: 'restaurant', nameTr: 'Lüks Restoran', nameEn: 'Luxury Restaurant', emoji: '🏛️', baseCost: 50000, profitPerHr: 15000, color: '#ef4444' },
    { id: 'academy', nameTr: 'Gastronomi Akademisi', nameEn: 'Gastronomy Academy', emoji: '🎓', baseCost: 250000, profitPerHr: 85000, color: '#a855f7' }
];

export function TasteGame() {
    const { t, i18n } = useTranslation();
    const isTr = i18n.language?.startsWith('tr');
    
    // Game State
    const [tastePoints, setTastePoints] = useState<number>(() => {
        const saved = localStorage.getItem('taste_game_points');
        return saved ? parseFloat(saved) : 0;
    });
    
    const [inventory, setInventory] = useState<{ [key: string]: number }>(() => {
        const saved = localStorage.getItem('taste_game_inventory');
        return saved ? JSON.parse(saved) : {};
    });

    const [upgrades, setUpgrades] = useState<{ [key: string]: number }>(() => {
        const saved = localStorage.getItem('taste_game_upgrades');
        return saved ? JSON.parse(saved) : {};
    });

    const [energy, setEnergy] = useState<number>(100);
    const [maxEnergy] = useState<number>(100);
    const [floatingTexts, setFloatingTexts] = useState<{ id: number, x: number, y: number, text: string, color: string }[]>([]);
    const [activeTab, setActiveTab] = useState<'farm' | 'kitchen' | 'restaurant'>('farm');
    
    // Passive Income Calculation
    const profitPerHour = UPGRADES.reduce((total, upgrade) => {
        const level = upgrades[upgrade.id] || 0;
        return total + (level * upgrade.profitPerHr);
    }, 0);

    const profitPerSec = profitPerHour / 3600;

    useEffect(() => {
        const interval = setInterval(() => {
            if (profitPerSec > 0) {
                setTastePoints(prev => prev + profitPerSec);
            }
        }, 1000);
        return () => clearInterval(interval);
    }, [profitPerSec]);

    useEffect(() => {
        localStorage.setItem('taste_game_points', tastePoints.toString());
        localStorage.setItem('taste_game_inventory', JSON.stringify(inventory));
        localStorage.setItem('taste_game_upgrades', JSON.stringify(upgrades));
    }, [tastePoints, inventory, upgrades]);

    useEffect(() => {
        const interval = setInterval(() => {
            setEnergy(prev => (prev < maxEnergy ? prev + 1 : prev));
        }, 2000);
        return () => clearInterval(interval);
    }, [maxEnergy]);

    const handleHarvest = (e: React.MouseEvent<HTMLButtonElement>, item: FarmItem) => {
        if (energy < 1) return;

        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const newText = {
            id: Date.now() + Math.random(),
            x,
            y,
            text: `+1 ${item.emoji}`,
            color: item.color
        };

        setFloatingTexts(prev => [...prev, newText]);
        setTastePoints(prev => prev + item.points);
        setInventory(prev => ({ ...prev, [item.id]: (prev[item.id] || 0) + 1 }));
        setEnergy(prev => prev - 1);

        setTimeout(() => {
            setFloatingTexts(prev => prev.filter(t => t.id !== newText.id));
        }, 1000);
    };

    const handleCook = (recipe: RecipeItem) => {
        const canCook = Object.entries(recipe.requirements).every(([reqId, reqCount]) => (inventory[reqId] || 0) >= reqCount);

        if (!canCook) {
            alert(isTr ? 'Yeterli malzeme yok!' : 'Not enough ingredients!');
            return;
        }

        const newInventory = { ...inventory };
        Object.entries(recipe.requirements).forEach(([reqId, reqCount]) => {
            newInventory[reqId] -= reqCount;
        });

        setInventory(newInventory);
        setTastePoints(prev => prev + recipe.points);
        alert(isTr ? `${recipe.nameTr} pişti! +${recipe.points} TP` : `${recipe.nameEn} cooked! +${recipe.points} TP`);
    };

    const handleUpgrade = (upgrade: UpgradeItem) => {
        const level = upgrades[upgrade.id] || 0;
        const cost = Math.floor(upgrade.baseCost * Math.pow(1.5, level));

        if (tastePoints < cost) {
            alert(isTr ? 'Yeterli TP yok!' : 'Not enough TP!');
            return;
        }

        setTastePoints(prev => prev - cost);
        setUpgrades(prev => ({ ...prev, [upgrade.id]: level + 1 }));
    };

    return (
        <div style={{ padding: '10px 0', minHeight: '80vh', display: 'flex', flexDirection: 'column' }}>
            {/* Stats Header */}
            <div className="glass-panel" style={{ padding: '20px', borderRadius: '24px', marginBottom: '20px', background: 'linear-gradient(135deg, rgba(20,30,48,0.9), rgba(36,59,85,0.9))', border: '1px solid var(--primary-glow)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px' }}>
                            {isTr ? 'TOPLAM TAT PUANI' : 'TOTAL TASTE POINTS'}
                        </div>
                        <motion.div 
                            key={Math.floor(tastePoints)}
                            style={{ fontSize: '32px', fontWeight: 900, color: 'var(--primary)', textShadow: '0 0 20px var(--primary-glow)' }}
                        >
                            {Math.floor(tastePoints).toLocaleString()}
                        </motion.div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '11px', color: '#10b981', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '4px' }}>
                            <TrendingUp size={14} /> {isTr ? 'SAATLİK KAZANÇ' : 'PROFIT PER HOUR'}
                        </div>
                        <div style={{ fontSize: '18px', fontWeight: 900, color: '#fff' }}>
                            +{profitPerHour.toLocaleString()} TP
                        </div>
                    </div>
                </div>
            </div>

            {/* Energy & Tabs */}
            <div style={{ marginBottom: '20px', padding: '0 10px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '12px', fontWeight: 800 }}>
                    <span style={{ color: '#3b82f6' }}>⚡ {isTr ? 'Enerji' : 'Energy'} ({energy}/100)</span>
                    <span style={{ color: 'var(--text-muted)' }}>{isTr ? 'Her 2sn +1' : '+1 every 2s'}</span>
                </div>
                <div style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '10px', overflow: 'hidden' }}>
                    <div style={{ width: `${(energy / maxEnergy) * 100}%`, height: '100%', background: 'linear-gradient(90deg, #3b82f6, #60a5fa)', transition: 'width 0.3s' }} />
                </div>
            </div>

            <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', padding: '0 5px' }}>
                {[
                    { id: 'farm', label: isTr ? 'Çiftlik' : 'Farm', icon: Sprout },
                    { id: 'kitchen', label: isTr ? 'Mutfak' : 'Kitchen', icon: CookingPot },
                    { id: 'restaurant', label: isTr ? 'İşletme' : 'Business', icon: Store }
                ].map(tab => (
                    <button 
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as any)}
                        style={{ 
                            flex: 1, padding: '12px 5px', borderRadius: '16px', border: 'none', 
                            background: activeTab === tab.id ? 'var(--primary)' : 'rgba(255,255,255,0.05)', 
                            color: activeTab === tab.id ? '#000' : 'var(--text-muted)', 
                            fontWeight: 900, cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', fontSize: '11px', transition: 'all 0.2s' 
                        }}
                    >
                        <tab.icon size={18} />
                        {tab.label}
                    </button>
                ))}
            </div>

            <div style={{ flex: 1, background: 'rgba(0,0,0,0.2)', borderRadius: '28px', padding: '20px', border: '1px solid rgba(255,255,255,0.05)', position: 'relative' }}>
                
                {activeTab === 'farm' && (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
                        {FARM_ITEMS.map((item) => (
                            <motion.button
                                key={item.id}
                                whileTap={{ scale: 0.95 }}
                                onClick={(e) => handleHarvest(e, item)}
                                style={{
                                    position: 'relative', background: `linear-gradient(145deg, ${item.color}15, ${item.color}05)`,
                                    border: `1px solid ${item.color}33`, borderRadius: '24px', padding: '20px 10px',
                                    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px',
                                    cursor: energy > 0 ? 'pointer' : 'not-allowed', overflow: 'hidden'
                                }}
                            >
                                <span style={{ fontSize: '44px' }}>{item.emoji}</span>
                                <div style={{ textAlign: 'center' }}>
                                    <div style={{ fontWeight: 800, fontSize: '13px', color: '#fff' }}>{isTr ? item.nameTr : item.nameEn}</div>
                                    <div style={{ fontSize: '11px', color: item.color, fontWeight: 900 }}>Stok: {inventory[item.id] || 0}</div>
                                </div>
                                <AnimatePresence>
                                    {floatingTexts.map(ft => (
                                        <motion.div key={ft.id} initial={{ opacity: 1, y: ft.y, x: ft.x }} animate={{ opacity: 0, y: ft.y - 100 }}
                                            style={{ position: 'absolute', color: ft.color, fontWeight: 900, fontSize: '20px', pointerEvents: 'none' }}>{ft.text}</motion.div>
                                    ))}
                                </AnimatePresence>
                            </motion.button>
                        ))}
                    </div>
                )}

                {activeTab === 'kitchen' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {RECIPES.map(recipe => {
                            const canCook = Object.entries(recipe.requirements).every(([reqId, reqCount]) => (inventory[reqId] || 0) >= reqCount);
                            return (
                                <div key={recipe.id} style={{ background: 'rgba(255,255,255,0.03)', border: `1px solid ${recipe.color}33`, borderRadius: '20px', padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                                        <div style={{ fontSize: '36px' }}>{recipe.emoji}</div>
                                        <div>
                                            <div style={{ fontWeight: 800, fontSize: '14px' }}>{isTr ? recipe.nameTr : recipe.nameEn}</div>
                                            <div style={{ display: 'flex', gap: '6px', marginTop: '6px' }}>
                                                {Object.entries(recipe.requirements).map(([reqId, reqCount]) => (
                                                    <span key={reqId} style={{ fontSize: '10px', color: (inventory[reqId] || 0) >= reqCount ? '#22c55e' : '#ef4444' }}>
                                                        {FARM_ITEMS.find(f => f.id === reqId)?.emoji} {inventory[reqId] || 0}/{reqCount}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                    <button onClick={() => handleCook(recipe)} disabled={!canCook}
                                        style={{ background: canCook ? recipe.color : 'rgba(255,255,255,0.05)', color: canCook ? '#fff' : '#64748b', border: 'none', padding: '10px 16px', borderRadius: '12px', fontWeight: 900, cursor: canCook ? 'pointer' : 'not-allowed' }}>
                                        {isTr ? 'PİŞİR' : 'COOK'}
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                )}

                {activeTab === 'restaurant' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <div style={{ background: 'rgba(16, 185, 129, 0.1)', padding: '12px', borderRadius: '16px', border: '1px solid rgba(16, 185, 129, 0.2)', marginBottom: '10px' }}>
                            <p style={{ margin: 0, fontSize: '12px', color: '#10b981', textAlign: 'center', fontWeight: 700 }}>
                                {isTr ? 'İşletmeni büyüt, sen uyurken TP biriksin!' : 'Grow your business, earn TP while you sleep!'}
                            </p>
                        </div>
                        {UPGRADES.map(upgrade => {
                            const level = upgrades[upgrade.id] || 0;
                            const cost = Math.floor(upgrade.baseCost * Math.pow(1.5, level));
                            const canAfford = tastePoints >= cost;
                            return (
                                <div key={upgrade.id} style={{ background: 'rgba(255,255,255,0.03)', border: `1px solid ${upgrade.color}33`, borderRadius: '20px', padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                                        <div style={{ fontSize: '36px' }}>{upgrade.emoji}</div>
                                        <div>
                                            <div style={{ fontWeight: 800, fontSize: '14px' }}>{isTr ? upgrade.nameTr : upgrade.nameEn} (Lv.{level})</div>
                                            <div style={{ fontSize: '11px', color: '#10b981', fontWeight: 700 }}>+{upgrade.profitPerHr.toLocaleString()}/sa</div>
                                        </div>
                                    </div>
                                    <button onClick={() => handleUpgrade(upgrade)} disabled={!canAfford}
                                        style={{ background: canAfford ? 'var(--primary)' : 'rgba(255,255,255,0.05)', color: canAfford ? '#000' : '#64748b', border: 'none', padding: '10px 16px', borderRadius: '12px', fontWeight: 900, cursor: canAfford ? 'pointer' : 'not-allowed' }}>
                                        {cost.toLocaleString()} TP
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
            
            <div style={{ textAlign: 'center', marginTop: '15px' }}>
                <p style={{ fontSize: '11px', color: 'var(--text-muted)', margin: 0 }}>
                    {isTr ? 'Daha fazla aşama ve ödül yakında!' : 'More stages and rewards coming soon!'}
                </p>
            </div>
        </div>
    );
}
