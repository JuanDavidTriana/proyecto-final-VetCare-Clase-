import { Directive, Input, computed, signal } from '@angular/core';
import { cva, type VariantProps } from 'class-variance-authority';
import { hlm } from '../../../core/utils/hlm';

export const badgeVariants = cva(
  'inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2',
  {
    variants: {
      variant: {
        default:
          'border-transparent bg-emerald-600 text-white shadow hover:bg-emerald-700',
        secondary:
          'border-transparent bg-emerald-100 text-emerald-800 hover:bg-emerald-200',
        outline:
          'text-emerald-800 border border-emerald-300 bg-emerald-50/50',
        subtle:
          'bg-emerald-50 text-emerald-700 border border-emerald-200/50',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

export type BadgeVariants = VariantProps<typeof badgeVariants>;

@Directive({
  selector: '[hlmBadge]',
  standalone: true,
  host: {
    '[class]': '_computedClass()',
  },
})
export class HlmBadgeDirective {
  private readonly _userCls = signal<string>('');
  private readonly _variant = signal<BadgeVariants['variant']>('default');

  @Input()
  set class(value: string | undefined | null) {
    this._userCls.set(value ?? '');
  }

  @Input()
  set variant(value: BadgeVariants['variant']) {
    this._variant.set(value);
  }

  protected readonly _computedClass = computed(() =>
    hlm(
      badgeVariants({
        variant: this._variant(),
      }),
      this._userCls()
    )
  );
}
