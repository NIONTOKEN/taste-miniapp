/**
 * QAI Listing Service — Gelişmiş Risk Analiz Motoru
 * Dexscreener & GoPlus API Entegrasyonu için Hazır Yapı
 */

import axios from 'axios';

const DEX_API = 'https://api.dexscreener.com/latest/dex/tokens/';
const GOPLUS_API = 'https://api.gopluslabs.io/api/v1/token_security/';

/**
 * Token Risk Skoru Hesapla
 * @param {string} contract - Token Kontrat Adresi
 * @param {string} chainId - Ağ ID (eth, bsc vb.)
 */
export const calculateRiskScore = async (contract, chainId) => {
    let score = 0;
    const details = {
        liquidity: 0,
        fdv: 0,
        holders: 0,
        honeypot: false,
        verified: false,
        riskFactors: []
    };

    try {
        // 1. Dexscreener Verisi (Gerçek API Sorgusu)
        const dexRes = await axios.get(`${DEX_API}${contract}`);
        if (dexRes.data && dexRes.data.pairs && dexRes.data.pairs.length > 0) {
            const pair = dexRes.data.pairs[0];
            details.liquidity = pair.liquidity?.usd || 0;
            details.fdv = pair.fdv || 0;
            
            // Likidite Puanı (+50 max)
            if (details.liquidity > 100000) score += 50;
            else if (details.liquidity > 50000) score += 40;
            else if (details.liquidity > 10000) score += 20;
            else if (details.liquidity > 1000) score += 10;
            else details.riskFactors.push('Çok Düşük Likidite');

            // Hacim Puanı (+20 max)
            if (pair.volume?.h24 > 10000) score += 20;
            else if (pair.volume?.h24 > 1000) score += 10;

        } else {
            details.riskFactors.push('Havuz bulunamadı (DEX listelenmemiş)');
        }

        // 2. Güvenlik Simülasyonu (GoPlus entegrasyonu için placeholder)
        // Not: Gerçek API key ve ağ parametresi gerekir. 
        const isSafe = true; // Simülasyon

        if (isSafe) {
            score += 30;
        } else {
            score -= 100;
            details.honeypot = true;
            details.riskFactors.push('Honeypot Riski Tespit Edildi!');
        }

        details.score = Math.max(0, Math.min(100, score));
        return details;

    } catch (err) {
        console.error('Risk Score calc error:', err);
        return { score: 0, error: 'Veri çekilemedi', riskFactors: ['API Hatası'] };
    }
};

/**
 * Bekleyen Başvuruları Kaydet (LocalStorage Prototype)
 */
export const saveListingRequest = (requestData) => {
    const list = JSON.parse(localStorage.getItem('listing_requests') || '[]');
    list.push({
        ...requestData,
        status: 'pending',
        timestamp: new Date().toISOString()
    });
    localStorage.setItem('listing_requests', JSON.stringify(list));
};

/**
 * Onaylanmış Tokenları Al
 */
export const getVerifiedTokens = () => {
    return JSON.parse(localStorage.getItem('verified_tokens') || '[]');
};
