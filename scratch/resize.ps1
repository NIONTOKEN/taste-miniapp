Add-Type -AssemblyName System.Drawing

# Dynamically resolve home directory to avoid encoding issues with Turkish username
$homePath = [System.Environment]::GetFolderPath('UserProfile')
$srcPath = Join-Path $homePath ".gemini\antigravity\brain\3cff9e15-6f21-4bf9-974e-fa7b0c2e83ef\media__1781177135530.jpg"

Write-Host "Source Path: $srcPath"
if (!(Test-Path $srcPath)) {
    Write-Error "Source file not found at $srcPath"
    exit 1
}

$srcImage = [System.Drawing.Image]::FromFile($srcPath)

function Resize-Image {
    param (
        $image,
        $width,
        $height,
        $destPath
    )
    $destBitmap = New-Object System.Drawing.Bitmap($width, $height)
    $destGraphics = [System.Drawing.Graphics]::FromImage($destBitmap)
    
    $destGraphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $destGraphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
    $destGraphics.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
    $destGraphics.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality
    
    $destGraphics.DrawImage($image, 0, 0, $width, $height)
    
    # Save as PNG
    $destBitmap.Save($destPath, [System.Drawing.Imaging.ImageFormat]::Png)
    
    $destGraphics.Dispose()
    $destBitmap.Dispose()
}

# Generate PWA Icons using relative paths (avoiding path encoding issues)
Resize-Image $srcImage 192 192 ".\public\icons\icon-192x192.png"
Resize-Image $srcImage 512 512 ".\public\icons\icon-512x512.png"

# Save as logo.jpg using relative path
$srcImage.Save(".\public\logo.jpg", [System.Drawing.Imaging.ImageFormat]::Jpeg)

$srcImage.Dispose()
Write-Host "Icons and logo generated successfully!"
