import React from 'react';
import { useUser } from '../context/UserContext';
import { Lock, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

interface LevelMapProps {
    onSelectLevel: (level: number) => void;
}

export function LevelMap({ onSelectLevel }: LevelMapProps) {
    const { unlockedLevels, completedLevels } = useUser();

    return (
        <div className="glass-panel" style={{ padding: '20px', marginBottom: '20px' }}>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '20px', textAlign: 'center' }}>
                👨‍🍳 Kitchen Career
            </h2>
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(5, 1fr)',
                gap: '10px'
            }}>
                {Array.from({ length: 50 }, (_, i) => i + 1).map((level) => {
                    const isUnlocked = level <= unlockedLevels;
                    const isCompleted = completedLevels.includes(level);

                    return (
                        <motion.button
                            key={level}
                            whileHover={isUnlocked ? { scale: 1.05 } : {}}
                            whileTap={isUnlocked ? { scale: 0.95 } : {}}
                            onClick={() => isUnlocked && onSelectLevel(level)}
                            disabled={!isUnlocked}
                            style={{
                                aspectRatio: '1/1',
                                width: '100%',
                                borderRadius: '12px',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                position: 'relative',
                                transition: 'all 0.2s',
                                border: isCompleted
                                    ? '1px solid rgba(16, 185, 129, 0.4)'
                                    : isUnlocked
                                        ? '1px solid var(--primary)'
                                        : '1px solid rgba(255,255,255,0.05)',
                                background: isCompleted
                                    ? 'rgba(16, 185, 129, 0.1)'
                                    : isUnlocked
                                        ? 'rgba(245, 159, 11, 0.1)'
                                        : 'rgba(255,255,255,0.02)',
                                color: isUnlocked ? '#fff' : 'rgba(255,255,255,0.2)',
                                cursor: isUnlocked ? 'pointer' : 'not-allowed',
                                padding: '0'
                            }}
                        >
                            <span style={{ fontWeight: 'bold', fontSize: '14px' }}>{level}</span>

                            <div style={{ position: 'absolute', top: '-5px', right: '-5px' }}>
                                {isCompleted ? (
                                    <CheckCircle2 size={14} color="#10b981" />
                                ) : !isUnlocked ? (
                                    <Lock size={12} color="rgba(255,255,255,0.2)" />
                                ) : null}
                            </div>

                            {isUnlocked && !isCompleted && level === unlockedLevels && (
                                <div style={{
                                    position: 'absolute',
                                    bottom: '-2px',
                                    width: '100%',
                                    display: 'flex',
                                    justifyContent: 'center'
                                }}>
                                    <span style={{
                                        background: 'var(--primary)',
                                        fontSize: '8px',
                                        color: '#000',
                                        padding: '1px 4px',
                                        borderRadius: '4px',
                                        fontWeight: 'bold'
                                    }}>
                                        NEXT
                                    </span>
                                </div>
                            )}
                        </motion.button>
                    );
                })}
            </div>
            <p style={{
                textAlign: 'center',
                fontSize: '11px',
                color: 'var(--text-muted)',
                marginTop: '20px'
            }}>
                Complete levels to earn TASTE tokens! 🍳💎
            </p>
        </div>
    );
}
