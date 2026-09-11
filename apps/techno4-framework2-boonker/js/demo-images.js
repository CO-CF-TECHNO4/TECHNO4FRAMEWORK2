/**
 * Techno4 Framework 2 - Electronic Components Demo Images Library
 * Supported and distributed by CO «CF TECHNO4»
 * Licensed under GNU LGPL-3.0-or-later. Original components under MIT License.
 *
 * Generates offline, self-contained base64 SVG Data URLs of high-tech
 * electronic components (Microchips, PCBs, Synthesizers, Sensors, Resistors).
 */

(function (global) {
  'use strict';

  function encodeBase64(str) {
    if (typeof Buffer !== 'undefined') {
      return Buffer.from(str, 'utf8').toString('base64');
    }
    if (typeof btoa !== 'undefined') {
      return btoa(unescape(encodeURIComponent(str)));
    }
    return '';
  }

  function toDataUrl(svgStr) {
    return 'data:image/svg+xml;base64,' + encodeBase64(svgStr);
  }

  // --- SVG Templates Generator ---

  const PALETTES = [
    { bg: '#0b1120', accent: '#38bdf8', secondary: '#0284c7', copper: '#d97706', chip: '#1e293b', text: '#f8fafc' },
    { bg: '#022c22', accent: '#34d399', secondary: '#059669', copper: '#f59e0b', chip: '#064e3b', text: '#ecfdf5' },
    { bg: '#18181b', accent: '#f43f5e', secondary: '#e11d48', copper: '#fbbf24', chip: '#27272a', text: '#fff1f2' },
    { bg: '#172554', accent: '#818cf8', secondary: '#4f46e5', copper: '#f59e0b', chip: '#1e1b4b', text: '#eef2ff' },
    { bg: '#2e1065', accent: '#c084fc', secondary: '#9333ea', copper: '#fbbf24', chip: '#3b0764', text: '#faf5ff' },
    { bg: '#042f2e', accent: '#2dd4bf', secondary: '#0d9488', copper: '#d97706', chip: '#134e4a', text: '#f0fdfa' },
  ];

  function getPalette(id) {
    const num = Math.abs(typeof id === 'number' ? id : String(id).split('').reduce((acc, c) => acc + c.charCodeAt(0), 0));
    return PALETTES[num % PALETTES.length];
  }

  // 1. Microchip IC (QFP / BGA package)
  function renderMicrochip(w, h, p, label) {
    label = label || 'T4-DSP';
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}">
  <defs>
    <linearGradient id="g_chip" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${p.chip}"/>
      <stop offset="100%" stop-color="#020617"/>
    </linearGradient>
    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="3" result="blur"/>
      <feComposite in="SourceGraphic" in2="blur" operator="over"/>
    </filter>
  </defs>
  <rect width="${w}" height="${h}" fill="${p.bg}"/>
  <g opacity="0.3" stroke="${p.copper}" stroke-width="1">
    <path d="M 0,${h * 0.25} H ${w * 0.2} L ${w * 0.3},${h * 0.35} H ${w * 0.4}"/>
    <path d="M ${w},${h * 0.25} H ${w * 0.8} L ${w * 0.7},${h * 0.35} H ${w * 0.6}"/>
    <path d="M 0,${h * 0.75} H ${w * 0.2} L ${w * 0.3},${h * 0.65} H ${w * 0.4}"/>
    <path d="M ${w},${h * 0.75} H ${w * 0.8} L ${w * 0.7},${h * 0.65} H ${w * 0.6}"/>
    <path d="M ${w * 0.25},0 V ${h * 0.2} L ${w * 0.35},${h * 0.3} V ${h * 0.4}"/>
    <path d="M ${w * 0.75},${h} V ${h * 0.8} L ${w * 0.65},${h * 0.7} V ${h * 0.6}"/>
  </g>
  <!-- Pins -->
  <g fill="#94a3b8" stroke="#475569" stroke-width="0.5">
    ${[0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8].map(ratio => `
      <rect x="${w * ratio - 2}" y="${h * 0.2 - 6}" width="4" height="8" rx="1"/>
      <rect x="${w * ratio - 2}" y="${h * 0.8 - 2}" width="4" height="8" rx="1"/>
      <rect x="${w * 0.2 - 6}" y="${h * ratio - 2}" width="8" height="4" rx="1"/>
      <rect x="${w * 0.8 - 2}" y="${h * ratio - 2}" width="8" height="4" rx="1"/>
    `).join('')}
  </g>
  <!-- Chip Package -->
  <rect x="${w * 0.2}" y="${h * 0.2}" width="${w * 0.6}" height="${h * 0.6}" rx="${w * 0.04}" fill="url(#g_chip)" stroke="${p.accent}" stroke-width="1.5"/>
  <!-- Pin 1 Dot -->
  <circle cx="${w * 0.28}" cy="${h * 0.28}" r="${w * 0.025}" fill="${p.copper}"/>
  <!-- Silicon Logo & Text -->
  <rect x="${w * 0.4}" y="${h * 0.38}" width="${w * 0.2}" height="${w * 0.2}" rx="4" fill="none" stroke="${p.accent}" stroke-width="1.5" filter="url(#glow)"/>
  <path d="M ${w * 0.45},${h * 0.48} L ${w * 0.5},${h * 0.42} L ${w * 0.55},${h * 0.48} L ${w * 0.5},${h * 0.54} Z" fill="${p.accent}"/>
  <text x="${w * 0.5}" y="${h * 0.68}" fill="${p.text}" font-family="monospace, sans-serif" font-size="${Math.max(10, Math.floor(w * 0.055))}" font-weight="bold" text-anchor="middle" letter-spacing="1.5">${label}</text>
  <text x="${w * 0.5}" y="${h * 0.74}" fill="${p.accent}" font-family="monospace, sans-serif" font-size="${Math.max(8, Math.floor(w * 0.035))}" text-anchor="middle" opacity="0.8">CO «CF TECHNO4»</text>
</svg>`;
  }

  // 2. Printed Circuit Board (PCB Motherboard)
  function renderPcb(w, h, p, label) {
    label = label || 'TECHNO4 PCB';
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}">
  <defs>
    <pattern id="pcb_grid" width="20" height="20" patternUnits="userSpaceOnUse">
      <circle cx="10" cy="10" r="1" fill="${p.copper}" opacity="0.15"/>
    </pattern>
  </defs>
  <rect width="${w}" height="${h}" fill="${p.bg}"/>
  <rect width="${w}" height="${h}" fill="url(#pcb_grid)"/>
  <!-- Bus traces -->
  <g stroke="${p.copper}" stroke-width="1.5" fill="none" opacity="0.6">
    <path d="M 20,20 L 80,80 H ${w - 100} L ${w - 40},20"/>
    <path d="M 20,40 L 90,110 H ${w - 120} L ${w - 20},${h - 40}"/>
    <path d="M 40,${h - 20} L 120,${h - 100} H ${w - 80} L ${w - 20},${h - 40}"/>
    <path d="M ${w * 0.5},20 V ${h - 20}"/>
  </g>
  <!-- Vias -->
  <g fill="${p.bg}" stroke="${p.copper}" stroke-width="1.5">
    <circle cx="80" cy="80" r="3"/>
    <circle cx="${w - 100}" cy="80" r="3"/>
    <circle cx="90" cy="110" r="3"/>
    <circle cx="${w * 0.5}" cy="${h * 0.3}" r="4"/>
    <circle cx="${w * 0.5}" cy="${h * 0.7}" r="4"/>
  </g>
  <!-- SMD Components -->
  <g fill="#475569" stroke="#94a3b8" stroke-width="0.5">
    <rect x="${w * 0.3}" y="${h * 0.4}" width="16" height="8" rx="1"/>
    <rect x="${w * 0.3 + 24}" y="${h * 0.4}" width="16" height="8" rx="1"/>
    <rect x="${w * 0.65}" y="${h * 0.5}" width="20" height="10" rx="1" fill="#b45309"/>
    <rect x="${w * 0.65}" y="${h * 0.5 + 16}" width="20" height="10" rx="1" fill="#b45309"/>
  </g>
  <!-- Central Module -->
  <rect x="${w * 0.35}" y="${h * 0.3}" width="${w * 0.3}" height="${h * 0.4}" rx="8" fill="${p.chip}" stroke="${p.accent}" stroke-width="2"/>
  <circle cx="${w * 0.5}" cy="${h * 0.46}" r="${w * 0.05}" fill="none" stroke="${p.accent}" stroke-width="2"/>
  <circle cx="${w * 0.5}" cy="${h * 0.46}" r="3" fill="${p.accent}"/>
  <text x="${w * 0.5}" y="${h * 0.62}" fill="${p.text}" font-family="monospace, sans-serif" font-size="${Math.max(10, Math.floor(w * 0.045))}" font-weight="bold" text-anchor="middle">${label}</text>
</svg>`;
  }

  // 3. Synthesizer / Audio DSP Circuit
  function renderSynth(w, h, p, label) {
    label = label || 'AUDIO DSP SYNTH';
    const midY = h * 0.5;
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}">
  <defs>
    <linearGradient id="wave_grad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="${p.accent}"/>
      <stop offset="50%" stop-color="${p.copper}"/>
      <stop offset="100%" stop-color="${p.accent}"/>
    </linearGradient>
  </defs>
  <rect width="${w}" height="${h}" fill="${p.bg}"/>
  <!-- Oscilloscope Grid -->
  <g stroke="${p.accent}" stroke-width="0.5" opacity="0.15">
    ${[0.2, 0.35, 0.5, 0.65, 0.8].map(r => `<line x1="0" y1="${h * r}" x2="${w}" y2="${h * r}"/>`).join('')}
    ${[0.1, 0.25, 0.4, 0.55, 0.7, 0.85].map(r => `<line x1="${w * r}" y1="0" x2="${w * r}" y2="${h}"/>`).join('')}
  </g>
  <!-- Audio Jacks -->
  <g fill="#1e293b" stroke="#cbd5e1" stroke-width="2">
    <circle cx="${w * 0.15}" cy="${h * 0.25}" r="${w * 0.04}"/>
    <circle cx="${w * 0.15}" cy="${h * 0.25}" r="${w * 0.02}" fill="#0f172a"/>
    <circle cx="${w * 0.85}" cy="${h * 0.25}" r="${w * 0.04}"/>
    <circle cx="${w * 0.85}" cy="${h * 0.25}" r="${w * 0.02}" fill="#0f172a"/>
  </g>
  <!-- Audio Waveform -->
  <path d="M 0,${midY} Q ${w * 0.125},${midY - h * 0.25} ${w * 0.25},${midY} T ${w * 0.5},${midY} T ${w * 0.75},${midY} T ${w},${midY}" fill="none" stroke="url(#wave_grad)" stroke-width="3"/>
  <path d="M 0,${midY} Q ${w * 0.125},${midY + h * 0.15} ${w * 0.25},${midY} T ${w * 0.5},${midY} T ${w * 0.75},${midY} T ${w},${midY}" fill="none" stroke="${p.secondary}" stroke-width="1" opacity="0.5"/>
  <!-- Potentiometer Knobs -->
  <g fill="#334155" stroke="${p.accent}" stroke-width="1.5">
    <circle cx="${w * 0.35}" cy="${h * 0.8}" r="${w * 0.05}"/>
    <line x1="${w * 0.35}" y1="${h * 0.8}" x2="${w * 0.35 + w * 0.035}" y2="${h * 0.8 - h * 0.035}" stroke="${p.text}" stroke-width="2"/>
    <circle cx="${w * 0.65}" cy="${h * 0.8}" r="${w * 0.05}"/>
    <line x1="${w * 0.65}" y1="${h * 0.8}" x2="${w * 0.65 - w * 0.035}" y2="${h * 0.8 - h * 0.035}" stroke="${p.text}" stroke-width="2"/>
  </g>
  <text x="${w * 0.5}" y="${h * 0.15}" fill="${p.text}" font-family="monospace, sans-serif" font-size="${Math.max(10, Math.floor(w * 0.045))}" font-weight="bold" text-anchor="middle">${label}</text>
  <text x="${w * 0.5}" y="${h * 0.82}" fill="${p.accent}" font-family="monospace, sans-serif" font-size="${Math.max(8, Math.floor(w * 0.03))}" text-anchor="middle">48kHz 24-bit DSP</text>
</svg>`;
  }

  // 4. Sensor & IoT Wireless Module
  function renderSensor(w, h, p, label) {
    label = label || 'IOT WIRELESS NODE';
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}">
  <rect width="${w}" height="${h}" fill="${p.bg}"/>
  <!-- Ceramic Antenna -->
  <rect x="${w * 0.1}" y="${h * 0.15}" width="${w * 0.2}" height="${h * 0.15}" rx="2" fill="#1e293b" stroke="${p.copper}" stroke-width="1.5"/>
  <path d="M ${w * 0.12},${h * 0.2} H ${w * 0.28} M ${w * 0.12},${h * 0.23} H ${w * 0.28} M ${w * 0.12},${h * 0.26} H ${w * 0.28}" stroke="${p.copper}" stroke-width="1"/>
  <!-- RF Waves -->
  <g fill="none" stroke="${p.accent}" stroke-width="1.5" opacity="0.6">
    <path d="M ${w * 0.35},${h * 0.18} A ${w * 0.06},${h * 0.06} 0 0,1 ${w * 0.35},${h * 0.26}"/>
    <path d="M ${w * 0.39},${h * 0.15} A ${w * 0.1},${h * 0.1} 0 0,1 ${w * 0.39},${h * 0.29}"/>
    <path d="M ${w * 0.43},${h * 0.12} A ${w * 0.14},${h * 0.14} 0 0,1 ${w * 0.43},${h * 0.32}"/>
  </g>
  <!-- Sensor Metallic Package -->
  <rect x="${w * 0.25}" y="${h * 0.45}" width="${w * 0.5}" height="${h * 0.4}" rx="6" fill="#0f172a" stroke="#cbd5e1" stroke-width="2"/>
  <circle cx="${w * 0.38}" cy="${h * 0.58}" r="${w * 0.035}" fill="${p.copper}"/>
  <text x="${w * 0.5}" y="${h * 0.75}" fill="${p.text}" font-family="monospace, sans-serif" font-size="${Math.max(10, Math.floor(w * 0.045))}" font-weight="bold" text-anchor="middle">${label}</text>
  <text x="${w * 0.5}" y="${h * 0.81}" fill="${p.accent}" font-family="monospace, sans-serif" font-size="${Math.max(8, Math.floor(w * 0.03))}" text-anchor="middle">BLE / Wi-Fi / Serial</text>
</svg>`;
  }

  // Master Generator
  function generateSvg(type, width, height, id, label) {
    const w = width || 400;
    const h = height || 400;
    const p = getPalette(id != null ? id : 1);

    switch (type) {
      case 'pcb':
        return renderPcb(w, h, p, label);
      case 'synth':
        return renderSynth(w, h, p, label);
      case 'sensor':
        return renderSensor(w, h, p, label);
      case 'microchip':
      default:
        return renderMicrochip(w, h, p, label);
    }
  }

  // Public API
  const DemoImages = {
    /**
     * Get SVG string of electronic component.
     */
    svg(type, width, height, id, label) {
      return generateSvg(type, width, height, id, label);
    },

    /**
     * Get base64 Data URL for electronic component.
     */
    get(type, width, height, id, label) {
      return toDataUrl(generateSvg(type, width, height, id, label));
    },

    /**
     * Avatar image generator for user items, chips, lists.
     */
    avatar(index = 1, size = 120) {
      const types = ['microchip', 'pcb', 'synth', 'sensor'];
      const type = types[(index - 1) % types.length];
      const labels = ['MCU', 'PCB', 'DSP', 'RF', 'FPGA', 'DAC', 'ADC', 'ARM', 'RISC-V', 'OPAMP'];
      const label = labels[(index - 1) % labels.length];
      return toDataUrl(generateSvg(type, size, size, index, label));
    },

    /**
     * Wide landscape card image generator for Cards, Swiper, Photo Browser.
     */
    landscape(index = 1, width = 1000, height = 700) {
      const types = ['pcb', 'synth', 'microchip', 'sensor'];
      const type = types[(index - 1) % types.length];
      const titles = [
        'Multi-Layer High Speed PCB',
        'Eurorack Audio Synth Module',
        'RISC-V Microcontroller Core',
        'Wireless Telemetry IoT Node',
        'Low-Latency DSP Audio Engine',
        'Serial COM Hardware Bridge',
        'FPGA Logic Array Circuit',
        'Precision Analog Front-End',
      ];
      const title = titles[(index - 1) % titles.length];
      return toDataUrl(generateSvg(type, width, height, index, title));
    },

    /**
     * Deterministically maps any legacy placeholder URL to an electronic component Data URL.
     */
    match(url) {
      if (!url || typeof url !== 'string') return this.landscape(1);

      // Extract number from url if exists (e.g. people-100x100-3.jpg -> 3)
      const numMatch = url.match(/-(\d+)\./) || url.match(/\/(\d+)\/?$/);
      const id = numMatch ? parseInt(numMatch[1], 10) : 1;

      if (url.includes('people') || url.includes('avatar') || url.includes('fashion') || url.includes('80/80') || url.includes('68x68') || url.includes('100x100')) {
        return this.avatar(id);
      }

      return this.landscape(id);
    },
  };

  // Export
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = DemoImages;
  }
  if (typeof window !== 'undefined') {
    window.DemoImages = DemoImages;
  }
  if (typeof globalThis !== 'undefined') {
    globalThis.DemoImages = DemoImages;
  }
})(typeof globalThis !== 'undefined' ? globalThis : this);

export const avatar = (index, size) => globalThis.DemoImages.avatar(index, size);
export const landscape = (index, width, height) => globalThis.DemoImages.landscape(index, width, height);
export const match = (url) => globalThis.DemoImages.match(url);
export const svg = (type, width, height, id, label) => globalThis.DemoImages.svg(type, width, height, id, label);
export const get = (type, width, height, id, label) => globalThis.DemoImages.get(type, width, height, id, label);
export default globalThis.DemoImages;
