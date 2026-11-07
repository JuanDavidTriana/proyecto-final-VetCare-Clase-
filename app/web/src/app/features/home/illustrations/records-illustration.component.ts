import { Component } from '@angular/core';

@Component({
  selector: 'app-records-illustration',
  standalone: true,
  template: `
    <svg
      viewBox="0 0 400 320"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      class="w-full h-auto select-none"
    >
      <!-- Background Circles -->
      <ellipse cx="200" cy="285" rx="160" ry="20" fill="#e2f5ea" />
      <circle cx="200" cy="150" r="115" fill="#f0fdf4" />
      <circle cx="80" cy="90" r="30" fill="#dcfce7" opacity="0.6" />

      <!-- Digital Tablet / Clipboard -->
      <g transform="translate(110, 40)">
        <!-- Tablet Frame -->
        <rect x="0" y="0" width="180" height="230" rx="18" fill="#ffffff" stroke="#cbd5e1" stroke-width="2.5" filter="drop-shadow(0 10px 15px rgba(0,0,0,0.05))" />
        <rect x="10" y="10" width="160" height="210" rx="12" fill="#f8fafc" />
        
        <!-- Header Banner -->
        <rect x="10" y="10" width="160" height="42" rx="12" fill="#16a34a" />
        <circle cx="34" cy="31" r="12" fill="#ffffff" />
        <!-- Mini Paw in Header -->
        <ellipse cx="34" cy="32" rx="5" ry="4" fill="#16a34a" />
        <circle cx="30" cy="27" r="1.5" fill="#16a34a" />
        <circle cx="34" cy="25" r="1.5" fill="#16a34a" />
        <circle cx="38" cy="27" r="1.5" fill="#16a34a" />
        <text x="54" y="27" font-size="10" font-weight="bold" fill="#ffffff" font-family="system-ui">Historia Clínica</text>
        <text x="54" y="38" font-size="8" fill="#dcfce7" font-family="system-ui">Paciente: Max (Canino)</text>

        <!-- Records Lines / Vitals Cards -->
        <g transform="translate(20, 64)">
          <!-- Vital Card 1 -->
          <rect x="0" y="0" width="65" height="34" rx="6" fill="#ffffff" stroke="#e2e8f0" />
          <text x="8" y="14" font-size="7.5" fill="#64748b" font-family="system-ui">Peso</text>
          <text x="8" y="27" font-size="11" font-weight="bold" fill="#15803d" font-family="system-ui">14.2 kg</text>

          <!-- Vital Card 2 -->
          <rect x="75" y="0" width="65" height="34" rx="6" fill="#ffffff" stroke="#e2e8f0" />
          <text x="83" y="14" font-size="7.5" fill="#64748b" font-family="system-ui">Temp</text>
          <text x="83" y="27" font-size="11" font-weight="bold" fill="#15803d" font-family="system-ui">38.5 °C</text>
        </g>

        <!-- Diagnosis Section -->
        <rect x="20" y="110" width="140" height="48" rx="6" fill="#ffffff" stroke="#e2e8f0" />
        <rect x="28" y="118" width="50" height="5" rx="2.5" fill="#16a34a" />
        <rect x="28" y="128" width="124" height="4" rx="2" fill="#cbd5e1" />
        <rect x="28" y="136" width="105" height="4" rx="2" fill="#e2e8f0" />
        <rect x="28" y="144" width="80" height="4" rx="2" fill="#e2e8f0" />

        <!-- Treatment / Signature Verified Stamp -->
        <g transform="translate(20, 168)">
          <rect x="0" y="0" width="140" height="38" rx="8" fill="#ecfdf5" stroke="#a7f3d0" />
          <circle cx="20" cy="19" r="10" fill="#10b981" />
          <path d="M16 19 L19 22 L25 16" fill="none" stroke="#ffffff" stroke-width="2" stroke-linecap="round" />
          <text x="36" y="16" font-size="8.5" font-weight="bold" fill="#065f46" font-family="system-ui">Consulta Firmada</text>
          <text x="36" y="27" font-size="7.5" fill="#047857" font-family="system-ui">Dr. Ricardo Ruiz (Vet)</text>
        </g>
      </g>

      <!-- Floating Stethoscope Badge -->
      <g transform="translate(60, 160)">
        <circle cx="25" cy="25" r="24" fill="#ffffff" filter="drop-shadow(0 4px 6px rgba(0,0,0,0.06))" />
        <circle cx="25" cy="25" r="18" fill="#dcfce7" />
        <path d="M19 20 Q25 28 31 20" fill="none" stroke="#16a34a" stroke-width="2.5" stroke-linecap="round" />
        <circle cx="25" cy="27" r="3" fill="#15803d" />
      </g>
    </svg>
  `,
})
export class RecordsIllustrationComponent {}
