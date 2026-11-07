import { Component } from '@angular/core';

@Component({
  selector: 'app-portal-illustration',
  standalone: true,
  template: `
    <svg
      viewBox="0 0 400 320"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      class="w-full h-auto select-none"
    >
      <!-- Background Shapes -->
      <ellipse cx="200" cy="285" rx="160" ry="20" fill="#e2f5ea" />
      <circle cx="200" cy="150" r="115" fill="#f0fdf4" />
      <circle cx="310" cy="80" r="35" fill="#dcfce7" opacity="0.6" />

      <!-- Smartphone / Mobile Portal Frame -->
      <g transform="translate(130, 30)">
        <rect x="0" y="0" width="140" height="250" rx="22" fill="#0f241a" filter="drop-shadow(0 15px 20px rgba(0,0,0,0.08))" />
        <rect x="4" y="4" width="132" height="242" rx="18" fill="#ffffff" />
        
        <!-- Screen Header -->
        <rect x="4" y="4" width="132" height="48" rx="18" fill="#16a34a" />
        <!-- Speaker / Camera notch -->
        <rect x="45" y="8" width="50" height="4" rx="2" fill="#0f241a" opacity="0.3" />
        <text x="70" y="36" font-size="9" font-weight="bold" fill="#ffffff" text-anchor="middle" font-family="system-ui">Portal del Tutor</text>

        <!-- Tutor Profile Mini -->
        <g transform="translate(14, 60)">
          <!-- Pet Avatar Mini -->
          <circle cx="16" cy="16" r="14" fill="#fef3c7" />
          <ellipse cx="16" cy="17" rx="7" ry="6" fill="#f59e0b" />
          <text x="36" y="14" font-size="8.5" font-weight="bold" fill="#0f241a" font-family="system-ui">Rocky</text>
          <text x="36" y="24" font-size="7" fill="#64748b" font-family="system-ui">Golden Retriever · 2 años</text>

          <!-- Vaccine Status Card -->
          <rect x="0" y="38" width="112" height="62" rx="8" fill="#f0fdf4" stroke="#86efac" />
          <text x="8" y="52" font-size="7" font-weight="bold" fill="#15803d" font-family="system-ui">PRÓXIMA VACUNA</text>
          <text x="8" y="66" font-size="9" font-weight="bold" fill="#0f241a" font-family="system-ui">Rabia Anual</text>
          <rect x="8" y="74" width="70" height="16" rx="4" fill="#dcfce7" />
          <text x="14" y="85" font-size="7" font-weight="bold" fill="#166534" font-family="system-ui">Vence en 15 días</text>

          <!-- History shortcut card -->
          <rect x="0" y="108" width="112" height="34" rx="8" fill="#ffffff" stroke="#e2e8f0" />
          <circle cx="14" cy="125" r="7" fill="#e0e7ff" />
          <text x="28" y="123" font-size="7.5" font-weight="bold" fill="#1e293b" font-family="system-ui">2 Consultas</text>
          <text x="28" y="133" font-size="6.5" fill="#64748b" font-family="system-ui">Historial completo</text>
        </g>
      </g>

      <!-- Floating Syringe / Protection Badge -->
      <g transform="translate(70, 150)">
        <circle cx="28" cy="28" r="26" fill="#ffffff" filter="drop-shadow(0 4px 6px rgba(0,0,0,0.06))" />
        <circle cx="28" cy="28" r="20" fill="#dcfce7" />
        <!-- Syringe vector -->
        <rect x="22" y="16" width="12" height="20" rx="3" fill="#16a34a" />
        <line x1="28" y1="36" x2="28" y2="42" stroke="#15803d" stroke-width="2" stroke-linecap="round" />
        <line x1="24" y1="14" x2="32" y2="14" stroke="#15803d" stroke-width="2" stroke-linecap="round" />
        <rect x="25" y="22" width="6" height="3" fill="#ffffff" />
      </g>
    </svg>
  `,
})
export class PortalIllustrationComponent {}
