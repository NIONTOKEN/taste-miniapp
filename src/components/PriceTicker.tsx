import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { apiService } from '../services/api'

export function PriceTicker() {
  const { t, i18n } = useTranslation()
  const [price, setPrice] = useState<string>('0.00135')
  const [tryPrice, setTryPrice] = useState<string>('0.0466')
  const [tonPrice, setTonPrice] = useState<string>('0.00025')
  const [change, setChange] = useState<number>(0)

  useEffect(() => {
    const fetchLivePrice = async () => {
      try {
        const [priceData, rateData, tonLivePrice] = await Promise.all([
          apiService.getTastePrice(),
          apiService.getExchangeRate(),
          apiService.getTonPrice()
        ])
        if (priceData.price > 0) {
          setPrice(priceData.price.toFixed(5))
          setChange(priceData.change)
          setTryPrice((priceData.price * rateData.usdToTry).toFixed(4))
          if (tonLivePrice > 0) {
            setTonPrice((priceData.price / tonLivePrice).toFixed(6))
          }
        }
      } catch (e) {
        console.warn('[PriceTicker] API fetch failed, keeping current values')
      }
    }

    fetchLivePrice()
    const interval = setInterval(fetchLivePrice, 60000)
    return () => clearInterval(interval)
  }, [])

  const changeColor = change >= 0 ? 'price-up' : 'price-down'
  const changeSign = change >= 0 ? '+' : ''

  return (
    <div className="ticker-wrap">
      <div className="ticker">
        <span className="ticker-item">💎 TASTE/USD: ${price} <span className={changeColor}>({changeSign}{change.toFixed(1)}%)</span></span>
        <span className="ticker-item">🇹🇷 TASTE/TRY: ₺{tryPrice}</span>
        <span className="ticker-item">⚡ 1 TON ≈ {parseFloat(tonPrice) > 0 ? Math.round(1 / parseFloat(tonPrice)).toLocaleString() : '...'} TASTE</span>
        <span className="ticker-item">🔥 {t('app.units.supply')}: 25,000,000</span>
        <span className="ticker-item">🌍 {i18n.language?.startsWith('tr') ? 'TOPLULUK ODAKLI' : 'COMMUNITY DRIVEN'}</span>
        <span className="ticker-item">💎 TASTE/USD: ${price} <span className={changeColor}>({changeSign}{change.toFixed(1)}%)</span></span>
      </div>
    </div>
  )
}
