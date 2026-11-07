import { Directive, Input, computed, signal } from '@angular/core';
import { cva, type VariantProps } from 'class-variance-authority';
import { hlm } from '../../../core/utils/hlm';

export const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98] select-none cursor-pointer',
  {
    variants: {
      variant: {
        default:
          'bg-emerald-600 text-white shadow-sm hover:bg-emerald-700 hover:shadow hover:shadow-emerald-600/20',
        destructive:
          'bg-red-600 text-white shadow-sm hover:bg-red-700 hover:shadow',
        outline:
          'border-2 border-emerald-600/20 bg-white text-emerald-900 shadow-sm hover:bg-emerald-50 hover:border-emerald-600/40',
        secondary:
          'bg-emerald-50 text-emerald-800 hover:bg-emerald-100/80 border border-emerald-200/60',
        ghost:
          'text-emerald-900 hover:bg-emerald-50 hover:text-emerald-700',
        link:
          'text-emerald-600 underline-offset-4 hover:underline font-medium',
      },
      size: {
        default: 'h-11 px-5 py-2.5',
        sm: 'h-9 px-3.5 text-xs rounded-lg',
        lg: 'h-13 px-8 text-base rounded-2xl',
        icon: 'h-10 w-10 p-0',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export type ButtonVariants = VariantProps<typeof buttonVariants>;

@Directive({
  selector: '[hlmBtn]',
  standalone: true,
  host: {
    '[class]': '_computedClass()',
  },
})
export class HlmButtonDirective {
  private readonly _userCls = signal<string>('');
  private readonly _variant = signal<ButtonVariants['variant']>('default');
  private readonly _size = signal<ButtonVariants['size']>('default');

  @Input()
  set class(value: string | undefined | null) {
    this._userCls.set(value ?? '');
  }

  @Input()
  set variant(value: ButtonVariants['variant']) {
    this._variant.set(value);
  }

  @Input()
  set size(value: ButtonVariants['size']) {
    this._size.set(value);
  }

  protected readonly _computedClass = computed(() =>
    hlm(
      buttonVariants({
        variant: this._variant(),
        size: this._size(),
      }),
      this._userCls()
    )
  );
}
