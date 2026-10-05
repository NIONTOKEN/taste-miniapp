import sys
sys.stdout.reconfigure(encoding='utf-8')

with open('src/i18n.ts', encoding='utf-8') as f:
    content = f.read()

replacements = [
    # EN
    ('"staking_card_title": "TASTE & TON Staking Coming Soon!"',
     '"staking_card_title": "TASTE AI Staking is Live! 🎉"'),
    ('"staking_card_desc": "Lock your crypto assets, earn passive TAI returns."',
     '"staking_card_desc": "Lock TAI (14/30/90/120 days) and earn multiplied TAI rewards."'),
    ('"staking_badge": "COMING SOON • 42% APY"',
     '"staking_badge": "LIVE • 4 Periods"'),
    ('"more": "Learn More"',
     '"more": "Learn More",\n                "stake_now": "Stake Now"'),
    # TR
    ('"staking_card_title": "TASTE ile TON Staking Yakında!"',
     '"staking_card_title": "TASTE AI Staking Başladı! 🎉"'),
    ('"staking_card_desc": "Kripto varlıklarınızı kilitleyin, pasif TAI getirisi kazanın."',
     '"staking_card_desc": "TAI kilitle (14/30/90/120 gün), çarpan ödülü kazan."'),
    ('"staking_badge": "ÇOK YAKINDA • %42 APY"',
     '"staking_badge": "CANLI • 4 Dönem"'),
    ('"more": "Daha Fazla"',
     '"more": "Daha Fazla",\n                "stake_now": "Hemen Stake Et"'),
    # RU
    ('"staking_card_title": "Стейкинг TASTE и TON скоро!"',
     '"staking_card_title": "Стейкинг TASTE AI запущен! 🎉"'),
    ('"staking_card_desc": "Блокируйте криптоактивы и получайте пассивный доход в TAI."',
     '"staking_card_desc": "Блокируйте TAI (14/30/90/120 дней), получайте умноженные награды TAI."'),
    ('"staking_badge": "СКОРО • 42% APY"',
     '"staking_badge": "В ЭФИРЕ • 4 периода"'),
    ('"more": "Подробнее"',
     '"more": "Подробнее",\n                "stake_now": "Стейкать сейчас"'),
    # AR
    ('"staking_card_title": "ستاكينغ TASTE و TON قريباً!"',
     '"staking_card_title": "تم إطلاق TASTE AI للستاكينغ! 🎉"'),
    ('"staking_card_desc": "قم بقفل أصولك الرقمية واحصل على عوائد TAI السلبية."',
     '"staking_card_desc": "اقفل TAI (14/30/90/120 يوم) واحصل على مكافآت مضاعفة."'),
    ('"staking_badge": "قريباً • 42% APY"',
     '"staking_badge": "مباشر • 4 فترات"'),
    ('"more": "المزيد"',
     '"more": "المزيد",\n                "stake_now": "ابدأ الستاكينغ"'),
    # ZH
    ('"staking_card_title": "TASTE 与 TON 质押即将上线！"',
     '"staking_card_title": "TASTE AI 质押正式上线！🎉"'),
    ('"staking_card_desc": "锁仓加密资产，尊享 42% APY 被动 TAI 收益回报。"',
     '"staking_card_desc": "锁仓 TAI（14/30/90/120天），赚取成倍 TAI 奖励。"'),
    ('"staking_badge": "即将开启 • 42% APY"',
     '"staking_badge": "已上线 • 4档期"'),
    ('"more": "查看详情"',
     '"more": "查看详情",\n                "stake_now": "立即质押"'),
]

count = 0
for old, new in replacements:
    if old in content:
        content = content.replace(old, new, 1)
        count += 1
        print(f'✅ Replaced: {old[:60]}')
    else:
        print(f'❌ NOT FOUND: {old[:60]}')

with open('src/i18n.ts', 'w', encoding='utf-8') as f:
    f.write(content)

print(f'\nDone! {count}/{len(replacements)} replacements made.')
