import { Component } from '@angular/core';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import {
  lucidePhone,
  lucideMail,
  lucideMapPin,
  lucideHeart,
  lucideClock,
  lucideShieldCheck,
} from '@ng-icons/lucide';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [NgIconComponent],
  providers: [
    provideIcons({
      lucidePhone,
      lucideMail,
      lucideMapPin,
      lucideHeart,
      lucideClock,
      lucideShieldCheck,
    }),
  ],
  template: `
    <footer class="bg-slate-900 text-slate-300 pt-16 pb-12 border-t border-emerald-950 select-none">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          
          <!-- Col 1: Brand & Bio -->
          <div class="space-y-4">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center text-white shadow-md">
                <svg viewBox="0 0 32 32" fill="none" class="w-6 h-6" xmlns="http://www.w3.org/2000/svg">
                  <rect x="13" y="4" width="6" height="24" rx="3" fill="#ffffff" />
                  <rect x="4" y="13" width="24" height="6" rx="3" fill="#ffffff" />
                </svg>
              </div>
              <span class="text-2xl font-black tracking-tight text-white">Vet<span class="text-emerald-400">Care</span></span>
            </div>
            <p class="text-sm text-slate-400 leading-relaxed">
              Transformando la atención veterinaria con historias clínicas digitales, citas sin esperas y acceso transparente para cada tutor.
            </p>
            <div class="flex items-center gap-2 text-xs text-emerald-400 font-semibold bg-emerald-950/80 px-3 py-1.5 rounded-lg border border-emerald-800/50 w-fit">
              <ng-icon name="lucideShieldCheck" class="text-base" />
              <span>Veterinaria 100% Sin Papeles</span>
            </div>
          </div>

          <!-- Col 2: Enlaces Rápidos -->
          <div>
            <h4 class="text-white font-bold text-base mb-4 tracking-wide">Plataforma</h4>
            <ul class="space-y-2.5 text-sm">
              <li>
                <a href="#servicios" class="hover:text-emerald-400 transition-colors">Consultas y Diagnósticos</a>
              </li>
              <li>
                <a href="#historia-clinica" class="hover:text-emerald-400 transition-colors">Historia Clínica Digital</a>
              </li>
              <li>
                <a href="#agendar" class="hover:text-emerald-400 transition-colors">Agenda Veterinaria</a>
              </li>
              <li>
                <a href="#vacunas" class="hover:text-emerald-400 transition-colors">Control de Vacunación</a>
              </li>
              <li>
                <a href="#portal-tutores" class="hover:text-emerald-400 transition-colors">Portal de Pacientes</a>
              </li>
            </ul>
          </div>

          <!-- Col 3: Horarios & Atención -->
          <div>
            <h4 class="text-white font-bold text-base mb-4 tracking-wide">Horarios de Atención</h4>
            <ul class="space-y-3 text-sm text-slate-400">
              <li class="flex items-start gap-2.5">
                <ng-icon name="lucideClock" class="text-emerald-400 mt-0.5" />
                <div>
                  <span class="text-white block font-medium">Lunes a Viernes</span>
                  <span>8:00 AM - 7:00 PM</span>
                </div>
              </li>
              <li class="flex items-start gap-2.5">
                <ng-icon name="lucideClock" class="text-emerald-400 mt-0.5" />
                <div>
                  <span class="text-white block font-medium">Sábados</span>
                  <span>8:00 AM - 4:00 PM</span>
                </div>
              </li>
              <li class="flex items-start gap-2.5">
                <ng-icon name="lucideHeart" class="text-emerald-400 mt-0.5" />
                <div>
                  <span class="text-emerald-400 block font-medium">Urgencias</span>
                  <span>Disponibilidad 24 horas</span>
                </div>
              </li>
            </ul>
          </div>

          <!-- Col 4: Contacto e Instalaciones -->
          <div id="contacto">
            <h4 class="text-white font-bold text-base mb-4 tracking-wide">Ubicación & Contacto</h4>
            <ul class="space-y-3 text-sm text-slate-400">
              <li class="flex items-start gap-2.5">
                <ng-icon name="lucideMapPin" class="text-emerald-400 mt-0.5 text-base shrink-0" />
                <span>Calle 123 # 45-67, Bogotá, Colombia</span>
              </li>
              <li class="flex items-center gap-2.5">
                <ng-icon name="lucidePhone" class="text-emerald-400 text-base shrink-0" />
                <span>+57 (601) 789-0123</span>
              </li>
              <li class="flex items-center gap-2.5">
                <ng-icon name="lucideMail" class="text-emerald-400 text-base shrink-0" />
                <span>contacto&#64;vetcare.dev</span>
              </li>
            </ul>
          </div>
        </div>

        <div class="pt-8 mt-8 border-t border-slate-800 text-center text-xs text-slate-500 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p>© 2026 VetCare Clínica Veterinaria. Ilustraciones por <a href="https://undraw.co" target="_blank" rel="noopener" class="text-emerald-400 hover:underline">unDraw</a>.</p>
          <div class="flex items-center gap-1 text-slate-400">
            <span>Hecho con</span>
            <ng-icon name="lucideHeart" class="text-emerald-500 text-sm" />
            <span>para el bienestar de tus mascotas</span>
          </div>
        </div>
      </div>
    </footer>
  `,
})
export class FooterComponent {}
