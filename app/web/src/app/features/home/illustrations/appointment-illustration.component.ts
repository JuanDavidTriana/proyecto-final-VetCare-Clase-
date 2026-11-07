import { Component } from '@angular/core';

@Component({
  selector: 'app-appointment-illustration',
  standalone: true,
  template: `
    <svg
      viewBox="0 0 400 320"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      class="w-full h-auto select-none"
    >
      <!-- Ground Shadow -->
      <ellipse cx="200" cy="285" rx="160" ry="20" fill="#e2f5ea" />
      <circle cx="200" cy="150" r="115" fill="#f0fdf4" />

      <!-- Calendar Graphic -->
      <g transform="translate(100, 45)">
        <rect x="0" y="0" width="200" height="210" rx="20" fill="#ffffff" stroke="#cbd5e1" stroke-width="2.5" filter="drop-shadow(0 10px 15px rgba(0,0,0,0.05))" />
        
        <!-- Calendar Header -->
        <path d="M0 20 C0 9 9 0 20 0 L180 0 C191 0 200 9 200 20 L200 55 L0 55 Z" fill="#16a34a" />
        <!-- Calendar Rings -->
        <rect x="35" y="-8" width="10" height="20" rx="5" fill="#15803d" />
        <rect x="155" y="-8" width="10" height="20" rx="5" fill="#15803d" />
        <text x="100" y="34" font-size="14" font-weight="bold" fill="#ffffff" text-anchor="middle" font-family="system-ui">Agenda del Día</text>

        <!-- Calendar Grid Mini -->
        <g transform="translate(20, 70)">
          <!-- Scheduled Appointment Card 1 -->
          <rect x="0" y="0" width="160" height="38" rx="8" fill="#f0fdf4" stroke="#bbf7d0" />
          <circle cx="18" cy="19" r="6" fill="#16a34a" />
          <text x="32" y="17" font-size="9" font-weight="bold" fill="#0f241a" font-family="system-ui">09:00 AM · Toby (Vacunación)</text>
          <text x="32" y="28" font-size="8" fill="#15803d" font-family="system-ui">Dr. Ricardo Ruiz · Atendido</text>

          <!-- Scheduled Appointment Card 2 -->
          <rect x="0" y="46" width="160" height="38" rx="8" fill="#ffffff" stroke="#e2e8f0" />
          <circle cx="18" cy="65" r="6" fill="#f59e0b" />
          <text x="32" y="63" font-size="9" font-weight="bold" fill="#0f241a" font-family="system-ui">10:30 AM · Luna (Control)</text>
          <text x="32" y="74" font-size="8" fill="#64748b" font-family="system-ui">Dra. Camila Mora · En espera</text>

          <!-- Next Appointment Card 3 -->
          <rect x="0" y="92" width="160" height="34" rx="8" fill="#ffffff" stroke="#e2e8f0" />
          <circle cx="18" cy="109" r="6" fill="#94a3b8" />
          <text x="32" y="108" font-size="9" font-weight="bold" fill="#475569" font-family="system-ui">11:45 AM · Milo (Chequeo)</text>
        </g>
      </g>

      <!-- Floating Reminder Clock / Badge -->
      <g transform="translate(60, 180)">
        <circle cx="28" cy="28" r="26" fill="#ffffff" filter="drop-shadow(0 4px 6px rgba(0,0,0,0.08))" />
        <circle cx="28" cy="28" r="20" fill="#dcfce7" />
        <circle cx="28" cy="28" r="2" fill="#16a34a" />
        <line x1="28" y1="28" x2="28" y2="18" stroke="#16a34a" stroke-width="2.5" stroke-linecap="round" />
        <line x1="28" y1="28" x2="36" y2="28" stroke="#16a34a" stroke-width="2.5" stroke-linecap="round" />
      </g>
    </svg>
  `,
})
export class AppointmentIllustrationComponent {}
