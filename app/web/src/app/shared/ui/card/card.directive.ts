import { Directive, Input, computed, signal } from '@angular/core';
import { hlm } from '../../../core/utils/hlm';

@Directive({
  selector: '[hlmCard]',
  standalone: true,
  host: {
    '[class]': '_computedClass()',
  },
})
export class HlmCardDirective {
  private readonly _userCls = signal<string>('');

  @Input()
  set class(value: string | undefined | null) {
    this._userCls.set(value ?? '');
  }

  protected readonly _computedClass = computed(() =>
    hlm(
      'rounded-2xl border border-emerald-100 bg-white text-slate-900 shadow-sm transition-all duration-300 hover:shadow-md hover:border-emerald-200/80',
      this._userCls()
    )
  );
}

@Directive({
  selector: '[hlmCardHeader]',
  standalone: true,
  host: {
    '[class]': '_computedClass()',
  },
})
export class HlmCardHeaderDirective {
  private readonly _userCls = signal<string>('');

  @Input()
  set class(value: string | undefined | null) {
    this._userCls.set(value ?? '');
  }

  protected readonly _computedClass = computed(() =>
    hlm('flex flex-col space-y-2 p-6', this._userCls())
  );
}

@Directive({
  selector: '[hlmCardTitle]',
  standalone: true,
  host: {
    '[class]': '_computedClass()',
  },
})
export class HlmCardTitleDirective {
  private readonly _userCls = signal<string>('');

  @Input()
  set class(value: string | undefined | null) {
    this._userCls.set(value ?? '');
  }

  protected readonly _computedClass = computed(() =>
    hlm('text-xl font-bold tracking-tight text-slate-900', this._userCls())
  );
}

@Directive({
  selector: '[hlmCardDescription]',
  standalone: true,
  host: {
    '[class]': '_computedClass()',
  },
})
export class HlmCardDescriptionDirective {
  private readonly _userCls = signal<string>('');

  @Input()
  set class(value: string | undefined | null) {
    this._userCls.set(value ?? '');
  }

  protected readonly _computedClass = computed(() =>
    hlm('text-sm text-slate-500 leading-relaxed', this._userCls())
  );
}

@Directive({
  selector: '[hlmCardContent]',
  standalone: true,
  host: {
    '[class]': '_computedClass()',
  },
})
export class HlmCardContentDirective {
  private readonly _userCls = signal<string>('');

  @Input()
  set class(value: string | undefined | null) {
    this._userCls.set(value ?? '');
  }

  protected readonly _computedClass = computed(() =>
    hlm('p-6 pt-0 text-slate-600', this._userCls())
  );
}

@Directive({
  selector: '[hlmCardFooter]',
  standalone: true,
  host: {
    '[class]': '_computedClass()',
  },
})
export class HlmCardFooterDirective {
  private readonly _userCls = signal<string>('');

  @Input()
  set class(value: string | undefined | null) {
    this._userCls.set(value ?? '');
  }

  protected readonly _computedClass = computed(() =>
    hlm('flex items-center p-6 pt-0', this._userCls())
  );
}
