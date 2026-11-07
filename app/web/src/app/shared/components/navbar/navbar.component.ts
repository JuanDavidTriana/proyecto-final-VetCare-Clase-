import { Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import {
  lucidePhone,
  lucideCalendar,
  lucideUser,
  lucideMenu,
  lucideX,
  lucideHeart,
  lucideShieldCheck,
  lucideClock,
  lucideArrowRight,
} from '@ng-icons/lucide';
import { HlmButtonDirective } from '../../ui/button/button.directive';
import { HlmBadgeDirective } from '../../ui/badge/badge.directive';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, NgIconComponent, HlmButtonDirective, HlmBadgeDirective],
  providers: [
    provideIcons({
      lucidePhone,
      lucideCalendar,
      lucideUser,
      lucideMenu,
      lucideX,
      lucideHeart,
      lucideShieldCheck,
      lucideClock,
      lucideArrowRight,
    }),
  ],
  template: `
    <!-- Top info bar with Green/White branding -->
    <div class="bg-emerald-950 text-emerald-100 text-xs py-2 px-4 sm:px-6 border-b border-emerald-900/60 select-none">
      <div class="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-2">
        <div class="flex items-center gap-6">
          <span class="flex items-center gap-1.5">
            <ng-icon name="lucideClock" class="text-emerald-400 text-sm" />
            <span>Lunes a Sábado: 8:00 AM - 7:00 PM</span>
          </span>
          <span class="hidden md:flex items-center gap-1.5">
            <ng-icon name="lucidePhone" class="text-emerald-400 text-sm" />
            <span>Urgencias 24h: (601) 789-0123</span>
          </span>
        </div>
        <div class="flex items-center gap-4">
          <span class="inline-flex items-center gap-1 text-emerald-300 font-medium">
            <ng-icon name="lucideShieldCheck" class="text-emerald-400" />
            Clínica Veterinaria Certificada
          </span>
        </div>
      </div>
    </div>

    <!-- Main Navigation Header -->
    <header class="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-emerald-100 shadow-xs transition-all">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        <!-- Logo VetCare -->
        <a routerLink="/" class="flex items-center gap-3 group">
          <div class="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center text-white shadow-md shadow-emerald-600/20 group-hover:scale-105 transition-transform">
            <svg viewBox="0 0 32 32" fill="none" class="w-7 h-7" xmlns="http://www.w3.org/2000/svg">
              <!-- Cross + Paw icon -->
              <rect x="13" y="4" width="6" height="24" rx="3" fill="#ffffff" />
              <rect x="4" y="13" width="24" height="6" rx="3" fill="#ffffff" />
              <circle cx="9" cy="9" r="2.5" fill="#dcfce7" />
              <circle cx="23" cy="9" r="2.5" fill="#dcfce7" />
              <circle cx="16" cy="16" r="3" fill="#15803d" />
            </svg>
          </div>
          <div>
            <div class="flex items-center gap-1.5">
              <span class="text-2xl font-black tracking-tight text-slate-900">Vet<span class="text-emerald-600">Care</span></span>
              <span hlmBadge variant="subtle" class="hidden sm:inline-flex text-[10px] py-0 px-2 font-bold tracking-wide">
                CLÍNICA
              </span>
            </div>
            <p class="text-xs text-slate-500 -mt-0.5 font-medium">Cuidado Integral & Salud Animal</p>
          </div>
        </a>

        <!-- Desktop Navigation Links -->
        <nav class="hidden md:flex items-center gap-1 lg:gap-2">
          <a
            href="#servicios"
            class="px-3.5 py-2 text-sm font-semibold text-slate-600 hover:text-emerald-600 hover:bg-emerald-50/70 rounded-xl transition-colors"
          >
            Servicios
          </a>
          <a
            href="#historia-clinica"
            class="px-3.5 py-2 text-sm font-semibold text-slate-600 hover:text-emerald-600 hover:bg-emerald-50/70 rounded-xl transition-colors"
          >
            Historia Clínica
          </a>
          <a
            href="#vacunas"
            class="px-3.5 py-2 text-sm font-semibold text-slate-600 hover:text-emerald-600 hover:bg-emerald-50/70 rounded-xl transition-colors"
          >
            Vacunación
          </a>
          <a
            href="#portal-tutores"
            class="px-3.5 py-2 text-sm font-semibold text-slate-600 hover:text-emerald-600 hover:bg-emerald-50/70 rounded-xl transition-colors"
          >
            Portal Tutores
          </a>
          <a
            href="#contacto"
            class="px-3.5 py-2 text-sm font-semibold text-slate-600 hover:text-emerald-600 hover:bg-emerald-50/70 rounded-xl transition-colors"
          >
            Contacto
          </a>
        </nav>

        <!-- Action Buttons (Spartan UI hlmBtn) -->
        <div class="hidden sm:flex items-center gap-3">
          <a
            href="#portal-tutores"
            hlmBtn
            variant="outline"
            size="sm"
            class="gap-1.5 font-semibold text-emerald-800"
          >
            <ng-icon name="lucideUser" class="text-base text-emerald-600" />
            <span>Portal Clínico</span>
          </a>
          <a
            href="#agendar"
            hlmBtn
            variant="default"
            size="sm"
            class="gap-1.5 shadow-md shadow-emerald-600/25"
          >
            <ng-icon name="lucideCalendar" class="text-base" />
            <span>Agendar Cita</span>
          </a>
        </div>

        <!-- Mobile Menu Trigger -->
        <button
          type="button"
          (click)="toggleMobileMenu()"
          class="md:hidden p-2 rounded-xl text-slate-700 hover:bg-emerald-50 focus:outline-none"
          aria-label="Abrir menú"
        >
          <ng-icon [name]="mobileMenuOpen() ? 'lucideX' : 'lucideMenu'" class="text-2xl" />
        </button>
      </div>

      <!-- Mobile dropdown menu -->
      @if (mobileMenuOpen()) {
        <div class="md:hidden border-t border-emerald-100 bg-white/95 px-4 pt-3 pb-6 space-y-2 animate-in fade-in slide-in-from-top-2">
          <a
            (click)="closeMobileMenu()"
            href="#servicios"
            class="block px-3 py-2.5 rounded-lg text-base font-medium text-slate-700 hover:bg-emerald-50 hover:text-emerald-700"
          >
            Servicios
          </a>
          <a
            (click)="closeMobileMenu()"
            href="#historia-clinica"
            class="block px-3 py-2.5 rounded-lg text-base font-medium text-slate-700 hover:bg-emerald-50 hover:text-emerald-700"
          >
            Historia Clínica
          </a>
          <a
            (click)="closeMobileMenu()"
            href="#vacunas"
            class="block px-3 py-2.5 rounded-lg text-base font-medium text-slate-700 hover:bg-emerald-50 hover:text-emerald-700"
          >
            Vacunación
          </a>
          <a
            (click)="closeMobileMenu()"
            href="#portal-tutores"
            class="block px-3 py-2.5 rounded-lg text-base font-medium text-slate-700 hover:bg-emerald-50 hover:text-emerald-700"
          >
            Portal Tutores
          </a>
          <div class="pt-4 flex flex-col gap-2">
            <a
              (click)="closeMobileMenu()"
              href="#portal-tutores"
              hlmBtn
              variant="outline"
              class="w-full justify-center"
            >
              <ng-icon name="lucideUser" class="text-base text-emerald-600 mr-2" />
              Portal Clínico
            </a>
            <a
              (click)="closeMobileMenu()"
              href="#agendar"
              hlmBtn
              variant="default"
              class="w-full justify-center"
            >
              <ng-icon name="lucideCalendar" class="text-base mr-2" />
              Agendar Cita
            </a>
          </div>
        </div>
      }
    </header>
  `,
})
export class NavbarComponent {
  mobileMenuOpen = signal<boolean>(false);

  toggleMobileMenu(): void {
    this.mobileMenuOpen.update((v) => !v);
  }

  closeMobileMenu(): void {
    this.mobileMenuOpen.set(false);
  }
}
