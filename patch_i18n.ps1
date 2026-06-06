$file = "src\i18n.ts"
$content = Get-Content $file -Raw -Encoding UTF8

# Check if hard_cap already exists
if ($content.Contains('"hard_cap_title"')) {
    Write-Host "hard_cap keys already exist. Skipping."
} else {
    # EN: add hard_cap keys after dao_steps block
    $searchEN = '"lock_reason_title": "' + [char]0x1F512 + ' Why Was So Much Token Locked?"'
    $replaceEN = '"hard_cap_title": "Hard Cap Commitment",' + "`r`n" +
        '                    "hard_cap_desc": "TASTE is a finite digital asset. The total supply is permanently capped at 25,000,000. This is a core promise to all holders:",' + "`r`n" +
        '                    "hard_cap_points": [' + "`r`n" +
        '                        "25,000,000 TASTE hard cap - immutable and final",' + "`r`n" +
        '                        "No new tokens will ever be minted. Zero. Never.",' + "`r`n" +
        '                        "88.4% is locked in JVault - circulating supply is extremely limited",' + "`r`n" +
        '                        "Scarcity is baked into the design, not just a promise"' + "`r`n" +
        '                    ],' + "`r`n" +
        '                    "lock_reason_title": "' + [char]0x1F512 + ' Why Was So Much Token Locked?"'
    
    if ($content.Contains($searchEN)) {
        $content = $content.Replace($searchEN, $replaceEN)
        Write-Host "EN hard_cap keys added successfully."
    } else {
        Write-Host "EN search string not found!"
    }
}

# Check TR hard_cap
if ($content.Contains('"hard_cap_title": "Hard Cap')) {
    Write-Host "TR hard_cap keys check - EN found. Checking TR..."
} 

$searchTR = '"lock_reason_title": "' + [char]0x1F512 + ' Neden Bu Kadar'
if ($content.Contains($searchTR)) {
    $replaceTR = '"hard_cap_title": "Hard Cap Taahhüdü",' + "`r`n" +
        '                    "hard_cap_desc": "TASTE sonlu bir dijital varliктir. Toplam arz sonsuza dek 25.000.000 TASTE ile sinirlidir. Tüm sahiplerimize verilen temel taahhütlerimiz:",' + "`r`n" +
        '                    "hard_cap_points": [' + "`r`n" +
        '                        "25.000.000 TASTE hard cap - degistirilemez ve kalicidir",' + "`r`n" +
        '                        "Hicbir zaman yeni token üretilmeyecektir. Sifir. Asla.",' + "`r`n" +
        '                        "%88.4i JVault kilitli - dolasimda arz son derece sinirli",' + "`r`n" +
        '                        "Kitlik tasarima islenmistir, sadece bir söz degil"' + "`r`n" +
        '                    ],' + "`r`n" +
        '                    "lock_reason_title": "' + [char]0x1F512 + ' Neden Bu Kadar'
    $content = $content.Replace($searchTR, $replaceTR)
    Write-Host "TR hard_cap keys added successfully."
} else {
    Write-Host "TR search string not found!"
}

Set-Content $file -Value $content -Encoding UTF8 -NoNewline
Write-Host "File saved."
