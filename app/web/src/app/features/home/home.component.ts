import { Component, signal, inject, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import {
  lucideCalendar,
  lucideCheckCircle2,
  lucideShieldCheck,
  lucideHeart,
  lucideActivity,
  lucideUser,
  lucideArrowRight,
  lucideClock,
  lucideSparkles,
  lucideFileText,
  lucidePhone,
  lucideMapPin,
  lucideAlertCircle,
  lucideRefreshCw,
  lucideCheck,
} from '@ng-icons/lucide';
import { HlmButtonDirective } from '../../shared/ui/button/button.directive';
import {
  HlmCardDirective,
  HlmCardHeaderDirective,
  HlmCardTitleDirective,
  HlmCardDescriptionDirective,
  HlmCardContentDirective,
  HlmCardFooterDirective,
} from '../../shared/ui/card/card.directive';
import { HlmBadgeDirective } from '../../shared/ui/badge/badge.directive';

interface HealthResponse {
  status: string;
  service: string;
  db: string;
  uptime: string;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    FormsModule,
    NgIconComponent,
    HlmButtonDirective,
    HlmCardDirective,
    HlmCardHeaderDirective,
    HlmCardTitleDirective,
    HlmCardDescriptionDirective,
    HlmCardFooterDirective,
    HlmBadgeDirective,
  ],
  providers: [
    provideIcons({
      lucideCalendar,
      lucideCheckCircle2,
      lucideShieldCheck,
      lucideHeart,
      lucideActivity,
      lucideUser,
      lucideArrowRight,
      lucideClock,
      lucideSparkles,
      lucideFileText,
      lucidePhone,
      lucideMapPin,
      lucideAlertCircle,
      lucideRefreshCw,
      lucideCheck,
    }),
  ],
  templateUrl: './home.component.html',
})
export class HomeComponent implements OnInit {
  private readonly http = inject(HttpClient);

  // Live API Connection state to validate backend
  apiStatus = signal<'checking' | 'connected' | 'disconnected'>('checking');
  apiDetails = signal<HealthResponse | null>(null);
  apiEndpoint = 'http://localhost:3000/health';

  // Booking quick demo form state
  bookingForm = {
    tutorName: '',
    petName: '',
    species: 'dog',
    reason: 'Consulta general y chequeo',
    preferredDate: '',
  };
  bookingSubmitted = signal<boolean>(false);

  ngOnInit(): void {
    this.checkApiStatus();
  }

  checkApiStatus(): void {
    this.apiStatus.set('checking');
    this.http.get<HealthResponse>(this.apiEndpoint).subscribe({
      next: (res) => {
        this.apiDetails.set(res);
        this.apiStatus.set('connected');
      },
      error: () => {
        this.apiStatus.set('disconnected');
        this.apiDetails.set(null);
      },
    });
  }

  submitBooking(): void {
    if (!this.bookingForm.petName || !this.bookingForm.tutorName) return;
    this.bookingSubmitted.set(true);
  }

  resetBooking(): void {
    this.bookingSubmitted.set(false);
    this.bookingForm.tutorName = '';
    this.bookingForm.petName = '';
    this.bookingForm.preferredDate = '';
  }
}
