import React from 'react';

// Real token logos sourced directly from STON.fi official asset CDN with reliable SVG fallbacks
const GRAM_IMG = "https://asset.ston.fi/img/EQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAM9c/796cf938df13b28b78bf55110e051c5eb02028684784405364b4bc3c760ec207";
const USDT_IMG = "https://asset.ston.fi/img/EQCxE6mUtQJKFnGfaROTKOt1lZbDiiX1kCixRv7Nw2Id_sDs/1a87edfee9a28b05578853952e5effb8cc30af1e0fb90043aa2ce19dce490849";
const DOGS_IMG = "https://asset.ston.fi/img/EQCvxJy4eG8hyHBFsZ7eePxrRsUQSFE_jpptRAYBmcG_DOGS/b84413017d2b6a57d31daf1281245cb39a59e189a8a107047db39470a08c0c9e";
const UTYA_IMG = "https://asset.ston.fi/img/EQBaCgUwOoc6gHCNln_oJzb0mVs79YG7wYoavh-o1ItaneLA/727e6cc971afdfa8ed9c698d0909eee9de344a0b6766ff5e4ddcc3323449d6f6";
const NOT_IMG  = "https://asset.ston.fi/img/EQAvlWFDxGF2lXm67y4yzC17wYKD9A0guwPkMs1gOsM__NOT/c0dcf1d0e16604a22040bed2a5ec97765479fdba99538fa0bb5c243bb6220c5e";

interface LogoProps {
  size?: number;
}

export function LogoGRAM({ size = 34 }: LogoProps) {
  return (
    <img
      src={GRAM_IMG}
      alt="GRAM (TON)"
      width={size}
      height={size}
      style={{ borderRadius: '50%', objectFit: 'cover', flexShrink: 0, background: '#0088cc' }}
      onError={(e) => {
        // Fallback to beautiful inline SVG if network fails
        e.currentTarget.style.display = 'none';
        const svg = document.createElement('div');
        svg.innerHTML = `<svg width="${size}" height="${size}" viewBox="0 0 64 64" fill="none" style="border-radius:50%;flex-shrink:0"><rect width="64" height="64" rx="32" fill="#0088CC"/><path d="M32 14L48 28L32 50L16 28L32 14Z" fill="white"/></svg>`;
        e.currentTarget.parentNode?.appendChild(svg.firstChild as Node);
      }}
    />
  );
}

export function LogoTON({ size = 34 }: LogoProps) {
  return <LogoGRAM size={size} />;
}

export function LogoUSDT({ size = 34 }: LogoProps) {
  return (
    <img
      src={USDT_IMG}
      alt="USD₮"
      width={size}
      height={size}
      style={{ borderRadius: '50%', objectFit: 'cover', flexShrink: 0, background: '#26A17B' }}
      onError={(e) => {
        e.currentTarget.style.display = 'none';
        const svg = document.createElement('div');
        svg.innerHTML = `<svg width="${size}" height="${size}" viewBox="0 0 64 64" fill="none" style="border-radius:50%;flex-shrink:0"><rect width="64" height="64" rx="32" fill="#26A17B"/><path d="M22 24H42V29H35V44H29V29H22V24Z" fill="white"/></svg>`;
        e.currentTarget.parentNode?.appendChild(svg.firstChild as Node);
      }}
    />
  );
}

export function LogoDOGS({ size = 34 }: LogoProps) {
  return (
    <img
      src={DOGS_IMG}
      alt="DOGS"
      width={size}
      height={size}
      style={{ borderRadius: '50%', objectFit: 'cover', flexShrink: 0, background: '#111827' }}
      onError={(e) => {
        e.currentTarget.style.display = 'none';
        const svg = document.createElement('div');
        svg.innerHTML = `<svg width="${size}" height="${size}" viewBox="0 0 64 64" fill="none" style="border-radius:50%;flex-shrink:0"><rect width="64" height="64" rx="32" fill="#18181b"/><text x="32" y="40" font-size="26" text-anchor="middle" fill="white">🐕</text></svg>`;
        e.currentTarget.parentNode?.appendChild(svg.firstChild as Node);
      }}
    />
  );
}

export function LogoUTYA({ size = 34 }: LogoProps) {
  return (
    <img
      src={UTYA_IMG}
      alt="UTYA"
      width={size}
      height={size}
      style={{ borderRadius: '50%', objectFit: 'cover', flexShrink: 0, background: '#f59e0b' }}
      onError={(e) => {
        e.currentTarget.style.display = 'none';
        const svg = document.createElement('div');
        svg.innerHTML = `<svg width="${size}" height="${size}" viewBox="0 0 64 64" fill="none" style="border-radius:50%;flex-shrink:0"><rect width="64" height="64" rx="32" fill="#eab308"/><text x="32" y="40" font-size="26" text-anchor="middle" fill="white">🦆</text></svg>`;
        e.currentTarget.parentNode?.appendChild(svg.firstChild as Node);
      }}
    />
  );
}

export function LogoNOT({ size = 34 }: LogoProps) {
  return (
    <img
      src={NOT_IMG}
      alt="NOT"
      width={size}
      height={size}
      style={{ borderRadius: '50%', objectFit: 'cover', flexShrink: 0, background: '#000' }}
      onError={(e) => {
        e.currentTarget.style.display = 'none';
        const svg = document.createElement('div');
        svg.innerHTML = `<svg width="${size}" height="${size}" viewBox="0 0 64 64" fill="none" style="border-radius:50%;flex-shrink:0"><rect width="64" height="64" rx="32" fill="#000"/><circle cx="32" cy="32" r="16" stroke="white" stroke-width="4"/></svg>`;
        e.currentTarget.parentNode?.appendChild(svg.firstChild as Node);
      }}
    />
  );
}

export function LogoTAI({ size = 34 }: LogoProps) {
  return (
    <img
      src="/logo.jpg"
      alt="TAI"
      width={size}
      height={size}
      style={{ borderRadius: '50%', objectFit: 'cover', flexShrink: 0, border: '1px solid rgba(245,158,11,0.4)' }}
      onError={(e) => {
        e.currentTarget.src = "https://asset.ston.fi/img/EQB0beTxStmdhVri4s-cYlwYJaG_ZiR5lpLufCNC2VWUxZc-/1904ae8237c8a915cfdad69b50cceae6f5262824ca79ce842bb63cdc4352bdc8";
      }}
    />
  );
}
