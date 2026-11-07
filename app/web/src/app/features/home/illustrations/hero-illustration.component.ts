import { Component } from '@angular/core';

@Component({
  selector: 'app-hero-illustration',
  standalone: true,
  template: `
    <svg
      viewBox="0 0 600 500"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      class="w-full h-auto drop-shadow-xl select-none"
    >
      <!-- Background Shapes (StorySet Amico/Pana Style) -->
      <ellipse cx="300" cy="450" rx="250" ry="25" fill="#e2f5ea" />
      <circle cx="300" cy="240" r="190" fill="#f0fdf4" />
      <path
        d="M120 180 C80 120, 100 60, 160 50 C220 40, 240 100, 210 160 Z"
        fill="#dcfce7"
        opacity="0.7"
      />
      <circle cx="480" cy="120" r="45" fill="#bbf7d0" opacity="0.6" />
      <circle cx="100" cy="350" r="28" fill="#dcfce7" />
      
      <!-- Floating Medical & Pet Icons -->
      <!-- Floating Cross 1 -->
      <g transform="translate(140, 90) scale(0.9)">
        <rect x="18" y="5" width="14" height="40" rx="7" fill="#16a34a" />
        <rect x="5" y="18" width="40" height="14" rx="7" fill="#16a34a" />
      </g>
      <!-- Floating Heart -->
      <g transform="translate(460, 210) scale(0.8)">
        <path
          d="M25 39.7 21.35 36.4C8.4 24.65 0 17.05 0 7.7 0 3.4 3.4 0 7.7 0c4.35 0 8.5 2.05 11.3 5.3C21.8 2.05 25.95 0 30.3 0 34.6 0 38 3.4 38 7.7c0 9.35-8.4 16.95-21.35 28.7L25 39.7z"
          fill="#10b981"
          opacity="0.85"
        />
      </g>
      <!-- Floating Paw Print -->
      <g transform="translate(450, 70) scale(0.7)">
        <ellipse cx="25" cy="30" rx="15" ry="12" fill="#16a34a" opacity="0.4" />
        <ellipse cx="12" cy="12" rx="5" ry="7" fill="#16a34a" opacity="0.4" />
        <ellipse cx="23" cy="8" rx="5" ry="7" fill="#16a34a" opacity="0.4" />
        <ellipse cx="34" cy="10" rx="5" ry="7" fill="#16a34a" opacity="0.4" />
      </g>

      <!-- Examination Table -->
      <rect x="170" y="340" width="260" height="15" rx="7.5" fill="#15803d" />
      <rect x="190" y="355" width="16" height="95" rx="8" fill="#86efac" />
      <rect x="394" y="355" width="16" height="95" rx="8" fill="#86efac" />
      <rect x="230" y="440" width="140" height="10" rx="5" fill="#4ade80" />

      <!-- Dog on Table (Happy Patient) -->
      <g transform="translate(320, 220)">
        <!-- Dog Body -->
        <ellipse cx="60" cy="95" rx="42" ry="32" fill="#f59e0b" />
        <!-- Dog Legs -->
        <rect x="35" y="105" width="12" height="25" rx="6" fill="#d97706" />
        <rect x="75" y="105" width="12" height="25" rx="6" fill="#d97706" />
        <!-- Dog Tail (Wagging) -->
        <path d="M100 85 Q125 70 120 50 Q110 65 95 80 Z" fill="#d97706" />
        <!-- Dog Chest Patch -->
        <path d="M40 90 Q55 105 50 120 Q35 110 35 95 Z" fill="#fef3c7" />
        <!-- Dog Head -->
        <circle cx="35" cy="55" r="28" fill="#f59e0b" />
        <!-- Dog Snout -->
        <ellipse cx="20" cy="65" rx="14" ry="11" fill="#fef3c7" />
        <circle cx="12" cy="60" r="5" fill="#1e293b" />
        <ellipse cx="24" cy="50" rx="3.5" ry="4.5" fill="#1e293b" />
        <!-- Dog Ears -->
        <path d="M48 35 C55 45, 58 70, 52 75 C48 70, 45 45, 48 35 Z" fill="#d97706" />
        <!-- Dog Collar (Green VetCare) -->
        <rect x="32" y="78" width="22" height="6" rx="3" fill="#16a34a" />
        <circle cx="43" cy="88" r="4" fill="#fbbf24" />
      </g>

      <!-- Cat on Table (Playful) -->
      <g transform="translate(180, 260)">
        <!-- Cat Body -->
        <ellipse cx="40" cy="60" rx="26" ry="20" fill="#94a3b8" />
        <!-- Cat Tail -->
        <path d="M15 62 Q-5 50 0 35 Q5 45 20 58 Z" fill="#64748b" />
        <!-- Cat Head -->
        <circle cx="58" cy="45" r="18" fill="#94a3b8" />
        <!-- Cat Ears -->
        <polygon points="48,32 54,20 60,30" fill="#64748b" />
        <polygon points="62,30 68,20 74,32" fill="#64748b" />
        <ellipse cx="64" cy="44" rx="2.5" ry="3.5" fill="#0f172a" />
        <polygon points="69,49 73,49 71,52" fill="#f43f5e" />
      </g>

      <!-- Veterinarian (Character StorySet Style) -->
      <g transform="translate(160, 80)">
        <!-- Legs & Shoes -->
        <rect x="95" y="300" width="18" height="80" rx="9" fill="#0f241a" />
        <rect x="125" y="300" width="18" height="80" rx="9" fill="#0f241a" />
        <ellipse cx="100" cy="380" rx="14" ry="7" fill="#1e293b" />
        <ellipse cx="138" cy="380" rx="14" ry="7" fill="#1e293b" />

        <!-- Vet White & Green Coat (Torso) -->
        <path d="M75 140 L160 140 L170 310 L70 310 Z" fill="#ffffff" stroke="#e2e8f0" stroke-width="2" />
        <!-- Coat Green Lapels / Scrub Accent -->
        <polygon points="95,140 120,200 120,140" fill="#16a34a" />
        <polygon points="140,140 120,200 120,140" fill="#15803d" />
        <rect x="80" y="220" width="22" height="24" rx="3" fill="#f0fdf4" stroke="#86efac" />
        <!-- Stethoscope -->
        <path d="M102 170 Q118 240 135 170" fill="none" stroke="#047857" stroke-width="4.5" stroke-linecap="round" />
        <circle cx="118" cy="235" r="7" fill="#10b981" />

        <!-- Vet Left Arm (Gently holding pet) -->
        <path d="M78 145 Q50 190 85 240 Q115 260 145 250" fill="none" stroke="#ffffff" stroke-width="22" stroke-linecap="round" />
        <circle cx="150" cy="250" r="11" fill="#fcd34d" />

        <!-- Vet Right Arm -->
        <path d="M158 145 Q185 190 175 230" fill="none" stroke="#ffffff" stroke-width="20" stroke-linecap="round" />
        <circle cx="173" cy="235" r="10" fill="#fcd34d" />

        <!-- Vet Head & Face -->
        <!-- Neck -->
        <rect x="108" y="115" width="20" height="25" fill="#fcd34d" />
        <!-- Face -->
        <circle cx="118" cy="85" r="30" fill="#fde68a" />
        <!-- Hair (Friendly Dark Teal/Charcoal) -->
        <path d="M88 78 C90 40, 145 40, 148 75 C140 65, 130 65, 120 68 C110 70, 95 68, 88 78 Z" fill="#1e293b" />
        <!-- Eyes & Smile -->
        <circle cx="108" cy="82" r="3" fill="#0f172a" />
        <circle cx="126" cy="82" r="3" fill="#0f172a" />
        <path d="M112 94 Q118 102 124 94" fill="none" stroke="#b45309" stroke-width="2.5" stroke-linecap="round" />
        <!-- Glasses (Modern Vet look) -->
        <rect x="100" y="75" width="16" height="14" rx="4" fill="none" stroke="#16a34a" stroke-width="2.5" />
        <rect x="120" y="75" width="16" height="14" rx="4" fill="none" stroke="#16a34a" stroke-width="2.5" />
        <line x1="116" y1="82" x2="120" y2="82" stroke="#16a34a" stroke-width="2.5" />
      </g>

      <!-- Certified Trust Badge Floating (Top Right) -->
      <g transform="translate(430, 290)">
        <rect x="0" y="0" width="130" height="60" rx="16" fill="#ffffff" filter="drop-shadow(0 4px 6px rgba(0,0,0,0.06))" />
        <circle cx="30" cy="30" r="16" fill="#dcfce7" />
        <path d="M24 30 L28 34 L37 25" fill="none" stroke="#16a34a" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" />
        <text x="54" y="27" font-size="11" font-weight="bold" fill="#0f241a" font-family="system-ui">100% Digital</text>
        <text x="54" y="42" font-size="9.5" fill="#16a34a" font-weight="600" font-family="system-ui">Sin papeles</text>
      </g>
    </svg>
  `,
})
export class HeroIllustrationComponent {}
