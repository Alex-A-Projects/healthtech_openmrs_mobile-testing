/**
 * WDIO type augmentations.
 *
 * WebdriverIO v9 typings don't expose `.first()` on `ChainablePromiseElement`
 * (the result of `$(...)`) even though it's a common pattern that works at
 * runtime. We augment the interface so the rest of the codebase can use it
 * without `as any` everywhere.
 */
import '@wdio/globals';

declare module 'webdriverio' {
  interface ChainablePromiseElement {
    /**
     * Returns the first element matched by the parent's selector chain.
     * Equivalent to `$$(selector)[0]` but chainable like a single element.
     *
     * Provided here as a typing-only augmentation — the implementation lives
     * in the underlying webdriverio runtime.
     */
    first(): ChainablePromiseElement;
  }
}

export {};
