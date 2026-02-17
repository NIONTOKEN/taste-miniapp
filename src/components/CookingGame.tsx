import React, { useState, useEffect, useRef } from 'react';
import { useUser } from '../context/UserContext';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, CheckCircle, Clock } from 'lucide-react';

interface CookingGameProps {
    level: number;
    onBack: () => void;
}

interface Ingredient {
    id: string;
    name: string;
    icon: string;
    needsCooking?: boolean;
}

interface Station {
    id: string;
    cookingItem: Ingredient | null;
    progress: number;
    isDone: boolean;
}

interface Order {
    id: string;
    dishName: string;
    requiredIngredients: string[];
    patience: number; // 0 to 100
}

const INGREDIENTS: Record<string, Ingredient> = {
    'bun': { id: 'bun', name: 'Bun', icon: '🍞' },
    'patty': { id: 'patty', name: 'Meat', icon: '🥩', needsCooking: true },
    'lettuce': { id: 'lettuce', name: 'Lettuce', icon: '🥬' },
    'tomato': { id: 'tomato', name: 'Tomato', icon: '🍅' },
    'cheese': { id: 'cheese', name: 'Cheese', icon: '🧀' },
    'potato': { id: 'potato', name: 'Potato', icon: '🥔', needsCooking: true },
};

const DISHES = [
    { name: 'Burger', ingredients: ['bun', 'patty', 'lettuce'] },
    { name: 'Cheese Burger', ingredients: ['bun', 'patty', 'cheese', 'lettuce'] },
    { name: 'Double TASTE', ingredients: ['bun', 'patty', 'patty', 'cheese', 'tomato'] },
    { name: 'Healthy Wrap', ingredients: ['lettuce', 'tomato', 'cheese'] },
];

export function CookingGame({ level, onBack }: CookingGameProps) {
    const { completeLevel } = useUser();

    // Game State
    const [score, setScore] = useState(0);
    const [targetScore] = useState(3 + Math.floor(level / 5)); // 3 to 13 customers
    const [isGameOver, setIsGameOver] = useState(false);
    const [isWon, setIsWon] = useState(false);

    // Player's Current Work
    const [assembledIngredients, setAssembledIngredients] = useState<string[]>([]);

    // Stations (Grills/Fryers)
    const [stations, setStations] = useState<Station[]>([
        { id: 'grill1', cookingItem: null, progress: 0, isDone: false },
        { id: 'grill2', cookingItem: null, progress: 0, isDone: false },
    ]);

    // Customers/Orders
    const [orders, setOrders] = useState<Order[]>([]);
    const orderIdRef = useRef(0);

    // Initial Start
    useEffect(() => {
        spawnOrder();
        const customerInterval = setInterval(() => {
            if (!isGameOver) spawnOrder();
        }, 8000 - Math.min(level * 100, 4000)); // Faster spawns on higher levels

        return () => clearInterval(customerInterval);
    }, [isGameOver, level]);

    // Tick Logic (Patience decrease & Cooking progress)
    useEffect(() => {
        const tick = setInterval(() => {
            if (isGameOver) return;

            // Update Orders Patience - MUÇH SLOWER FOR EARLY LEVELS
            const patienceDecrease = level < 3 ? 0.3 : 0.8;

            setOrders(prev => {
                const updated = prev.map(o => ({ ...o, patience: o.patience - patienceDecrease }))
                    .filter(o => o.patience > 0);
                if (updated.length < prev.length) {
                    // Kanka, müşteri kaçarsa can gider gibi düşünürüz ama şimdilik sadece skoru düşürelim
                    setScore(s => Math.max(0, s - 1));
                }
                return updated;
            });

            // Update Cooking Progress - FASTER COOKING
            setStations(prev => prev.map(s => {
                if (s.cookingItem && s.progress < 100) {
                    const newProgress = s.progress + 10; // Cook in 5 seconds
                    return { ...s, progress: newProgress, isDone: newProgress >= 100 };
                }
                return s;
            }));
        }, 500);

        return () => clearInterval(tick);
    }, [isGameOver, level]);

    const spawnOrder = () => {
        if (orders.length >= 3) return; // Max 3 customers at once
        const randomDish = DISHES[Math.floor(Math.random() * Math.min(DISHES.length, 1 + Math.floor(level / 2)))];
        const newOrder: Order = {
            id: `order-${orderIdRef.current++}`,
            dishName: randomDish.name,
            requiredIngredients: randomDish.ingredients,
            patience: 100
        };
        setOrders(prev => [...prev, newOrder]);
    };

    const handleIngredientTap = (ingId: string) => {
        const ing = INGREDIENTS[ingId];
        if (ing.needsCooking) {
            // Find empty station
            const emptyIdx = stations.findIndex(s => s.cookingItem === null);
            if (emptyIdx !== -1) {
                const newStations = [...stations];
                newStations[emptyIdx] = { ...newStations[emptyIdx], cookingItem: ing, progress: 0, isDone: false };
                setStations(newStations);
            }
        } else {
            // Add directly to assembly
            setAssembledIngredients(prev => [...prev, ingId]);
        }
    };

    const handleStationTap = (idx: number) => {
        const s = stations[idx];
        if (s.isDone && s.cookingItem) {
            setAssembledIngredients(prev => [...prev, s.cookingItem!.id]);
            const newStations = [...stations];
            newStations[idx] = { ...newStations[idx], cookingItem: null, progress: 0, isDone: false };
            setStations(newStations);
        }
    };

    const serveOrder = (orderId: string) => {
        const order = orders.find(o => o.id === orderId);
        if (!order) return;

        // Check if assembled ingredients match (order doesn't matter for now, just quantity)
        const currentCounts: Record<string, number> = {};
        assembledIngredients.forEach(i => currentCounts[i] = (currentCounts[i] || 0) + 1);

        const requiredCounts: Record<string, number> = {};
        order.requiredIngredients.forEach(i => requiredCounts[i] = (requiredCounts[i] || 0) + 1);

        const isMatch = Object.keys(requiredCounts).every(key =>
            currentCounts[key] >= requiredCounts[key]
        );

        if (isMatch) {
            setScore(prev => {
                const newScore = prev + 1;
                if (newScore >= targetScore) {
                    handleWin();
                }
                return newScore;
            });
            setOrders(prev => prev.filter(o => o.id !== orderId));
            setAssembledIngredients([]);
        } else {
            // Missed! Shake or feedback
        }
    };

    const handleWin = () => {
        setIsWon(true);
        setIsGameOver(true);
        completeLevel(level);
    };

    const resetAssembly = () => setAssembledIngredients([]);



    return (
        <div className="glass-panel" style={{ padding: '15px', minHeight: '600px', display: 'flex', flexDirection: 'column', gap: '15px', position: 'relative', overflow: 'hidden' }}>
            {/* 1. Header (Quit & Score) */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 10 }}>
                <button onClick={onBack} className="text-muted" style={{ background: 'none', border: 'none', display: 'flex', alignItems: 'center', gap: '5px', cursor: 'pointer' }}>
                    <ChevronLeft size={16} /> Quit
                </button>
                <div style={{ background: 'var(--bg-card)', padding: '5px 15px', borderRadius: '20px', border: '1px solid var(--primary)', fontWeight: 'bold' }}>
                    Score: {score} / {targetScore}
                </div>
            </div>

            {/* 2. Customers/Orders Section (Top) */}
            <div style={{ height: '110px', display: 'flex', gap: '8px', justifyContent: 'center', zIndex: 5 }}>
                <AnimatePresence>
                    {orders.map(o => (
                        <motion.div
                            key={o.id}
                            initial={{ scale: 0.8, opacity: 0, y: -20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ x: -100, opacity: 0 }}
                            style={{
                                width: '100px',
                                background: 'rgba(255,255,255,0.05)',
                                padding: '10px',
                                borderRadius: '15px',
                                border: '1px solid rgba(255,255,255,0.1)',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                position: 'relative'
                            }}
                        >
                            <div style={{ fontSize: '24px' }}>👨‍🍳</div>
                            <div style={{ fontSize: '9px', textAlign: 'center', fontWeight: 'bold', margin: '4px 0' }}>{o.dishName}</div>
                            <div style={{ display: 'flex', gap: '2px', flexWrap: 'wrap', justifyContent: 'center' }}>
                                {o.requiredIngredients.map((ing, i) => (
                                    <span key={i} style={{ fontSize: '12px' }}>{INGREDIENTS[ing].icon}</span>
                                ))}
                            </div>

                            {/* Patience Bar */}
                            <div style={{ width: '100%', height: '4px', background: '#333', borderRadius: '2px', marginTop: 'auto', overflow: 'hidden' }}>
                                <motion.div
                                    animate={{ width: `${o.patience}%`, background: o.patience > 50 ? '#10b981' : o.patience > 25 ? '#f59f0b' : '#ef4444' }}
                                    style={{ height: '100%' }}
                                />
                            </div>

                            <button
                                onClick={() => serveOrder(o.id)}
                                style={{ marginTop: '5px', width: '100%', padding: '3px 0', fontSize: '9px', borderRadius: '5px', background: 'var(--primary)', color: '#000', border: 'none', fontWeight: 'bold', cursor: 'pointer' }}
                            >
                                SERVE
                            </button>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            {/* 3. Central Preparation Counter (The Plate) */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{
                    width: '180px',
                    height: '180px',
                    background: 'radial-gradient(circle, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.02) 70%)',
                    borderRadius: '50%',
                    border: '3px solid rgba(255,255,255,0.1)',
                    display: 'flex',
                    flexDirection: 'column-reverse',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative',
                    boxShadow: '0 10px 40px rgba(0,0,0,0.5)'
                }}>
                    <AnimatePresence>
                        {assembledIngredients.length === 0 ? (
                            <div style={{ color: 'var(--text-muted)', fontSize: '12px', textAlign: 'center', opacity: 0.5 }}>
                                <div style={{ fontSize: '24px', marginBottom: '5px' }}>🍽️</div>
                                PLATE EMPTY
                            </div>
                        ) : (
                            assembledIngredients.map((i, idx) => (
                                <motion.span
                                    initial={{ y: -60, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    key={idx}
                                    style={{
                                        fontSize: '44px',
                                        lineHeight: '12px',
                                        zIndex: idx + 20,
                                        marginTop: idx === 0 ? 0 : '-20px'
                                    }}
                                >
                                    {INGREDIENTS[i].icon}
                                </motion.span>
                            ))
                        )}
                    </AnimatePresence>

                    {assembledIngredients.length > 0 && (
                        <button
                            onClick={resetAssembly}
                            style={{
                                position: 'absolute',
                                top: '-5px',
                                right: '-5px',
                                background: '#dc2626',
                                borderRadius: '50%',
                                width: '28px',
                                height: '28px',
                                border: '2px solid white',
                                color: 'white',
                                cursor: 'pointer',
                                fontSize: '14px',
                                fontWeight: 'bold',
                                display: 'grid',
                                placeItems: 'center',
                                zIndex: 50
                            }}
                        >
                            ×
                        </button>
                    )}
                </div>
                <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '10px', fontWeight: 'bold', letterSpacing: '1px' }}>ASSEMBLY BOARD</div>
            </div>

            {/* 4. Cooking Stations (The Stoves/Hobs) */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginBottom: '10px' }}>
                {stations.map((s, idx) => (
                    <div
                        key={s.id}
                        onClick={() => handleStationTap(idx)}
                        style={{
                            width: '90px',
                            height: '90px',
                            background: '#020617',
                            borderRadius: '50%',
                            border: `3px solid ${s.isDone ? 'var(--primary)' : 'rgba(255,255,255,0.05)'}`,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            position: 'relative',
                            cursor: s.isDone ? 'pointer' : 'default',
                            boxShadow: s.isDone ? '0 0 25px var(--primary-glow)' : 'none',
                            transition: 'all 0.3s'
                        }}
                    >
                        <div style={{ position: 'absolute', width: '75%', height: '75%', borderRadius: '50%', border: '1px dashed rgba(255,255,255,0.05)' }} />

                        {!s.cookingItem ? (
                            <div style={{ opacity: 0.2, textAlign: 'center' }}>
                                <div style={{ fontSize: '24px' }}>🍳</div>
                                <div style={{ fontSize: '8px', color: 'var(--text-muted)' }}>STOVE {idx + 1}</div>
                            </div>
                        ) : (
                            <>
                                <motion.span
                                    animate={!s.isDone ? { scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] } : {}}
                                    transition={{ repeat: Infinity, duration: 1 }}
                                    style={{ fontSize: '40px', zIndex: 2 }}
                                >
                                    {s.cookingItem.icon}
                                </motion.span>
                                {s.isDone ? (
                                    <div style={{ position: 'absolute', bottom: '-8px', background: 'var(--primary)', color: '#000', fontSize: '10px', padding: '2px 8px', borderRadius: '5px', fontWeight: 'bold', zIndex: 10, boxShadow: '0 2px 5px rgba(0,0,0,0.5)' }}>READY!</div>
                                ) : (
                                    <div style={{ width: '60%', height: '4px', background: '#333', borderRadius: '2px', marginTop: '8px', overflow: 'hidden', zIndex: 5 }}>
                                        <motion.div initial={{ width: 0 }} animate={{ width: `${s.progress}%`, background: 'var(--gradient-gold)' }} style={{ height: '100%' }} />
                                    </div>
                                )}
                                {!s.isDone && <motion.div animate={{ y: [-10, -40], opacity: [0, 0.7, 0] }} transition={{ repeat: Infinity, duration: 1.2 }} style={{ position: 'absolute', top: -5, fontSize: '16px' }}>💨</motion.div>}
                            </>
                        )}
                    </div>
                ))}
            </div>

            {/* 5. Ingredients Supply Shelf (The Options) */}
            <div style={{
                background: 'rgba(255,255,255,0.03)',
                padding: '12px',
                borderRadius: '20px',
                border: '1px solid rgba(255,255,255,0.05)',
                display: 'grid',
                gridTemplateColumns: 'repeat(6, 1fr)',
                gap: '8px',
                zIndex: 10
            }}>
                {Object.values(INGREDIENTS).map(i => (
                    <motion.button
                        key={i.id}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleIngredientTap(i.id)}
                        style={{
                            background: 'rgba(15, 23, 42, 0.8)',
                            border: `1px solid ${i.needsCooking ? 'var(--primary)' : 'rgba(255,255,255,0.08)'}`,
                            borderRadius: '12px',
                            padding: '10px 2px',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                            boxShadow: i.needsCooking ? '0 0 10px rgba(245, 159, 11, 0.1)' : 'none'
                        }}
                    >
                        <span style={{ fontSize: '26px' }}>{i.icon}</span>
                        <span style={{ fontSize: '7px', fontWeight: 'bold', marginTop: '4px', color: i.needsCooking ? 'var(--primary)' : 'var(--text-muted)' }}>{i.needsCooking ? 'GRILL' : i.name.toUpperCase()}</span>
                    </motion.button>
                ))}
            </div>

            {/* Overlays */}
            <AnimatePresence>
                {isGameOver && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        style={{
                            position: 'absolute',
                            top: 0, left: 0, right: 0, bottom: 0,
                            background: 'rgba(15, 23, 42, 0.98)',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            zIndex: 1000,
                            textAlign: 'center',
                            padding: '30px'
                        }}
                    >
                        {isWon ? (
                            <>
                                <div style={{ background: 'rgba(16, 185, 129, 0.1)', padding: '25px', borderRadius: '50%', marginBottom: '25px' }}>
                                    <CheckCircle size={80} color="#10b981" />
                                </div>
                                <h1 style={{ fontSize: '2.5rem', fontWeight: '900', color: 'var(--primary)', marginBottom: '10px' }}>MASTER CHEF!</h1>
                                <p style={{ color: 'var(--text-muted)', marginBottom: '30px', fontSize: '1.1rem' }}>Your culinary skills are unmatched! 👨‍🍳✨</p>
                                <div style={{
                                    background: 'rgba(245, 159, 11, 0.1)',
                                    padding: '25px',
                                    borderRadius: '20px',
                                    border: '2px solid var(--primary)',
                                    marginBottom: '40px',
                                    width: '100%'
                                }}>
                                    <div style={{ fontSize: '12px', textTransform: 'uppercase', fontWeight: 'bold', color: 'rgba(255,255,255,0.5)' }}>EARNED TOTAL</div>
                                    <div style={{ fontSize: '2.2rem', fontWeight: '900' }}>+{level === 50 ? '25.0' : '0.5'} TASTE</div>
                                </div>
                                <button onClick={onBack} className="glass-button" style={{ width: '100%', padding: '20px', fontSize: '1.2rem', background: 'var(--gradient-gold)', color: '#000', border: 'none' }}>NEXT LEVEL</button>
                            </>
                        ) : (
                            <>
                                <div style={{ fontSize: '80px', marginBottom: '25px' }}>🏚️🍴</div>
                                <h1 style={{ fontSize: '2.5rem', fontWeight: '900', color: '#ef4444', marginBottom: '10px' }}>KITCHEN FAILED!</h1>
                                <p style={{ color: 'var(--text-muted)', marginBottom: '40px', fontSize: '1.1rem' }}>The customers left hungry. Don't give up!</p>
                                <button onClick={() => window.location.reload()} className="glass-button" style={{ width: '100%', padding: '20px', fontSize: '1.2rem', background: 'var(--gradient-gold)', color: '#000', border: 'none', fontWeight: 'bold' }}>RETRY</button>
                            </>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
