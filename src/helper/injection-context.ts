import {Injector, runInInjectionContext} from '@angular/core';

export async function runAsyncInInjectionContext<T>(injector: Injector, fn: () => Promise<T>): Promise<T> {
  return await runInInjectionContext(injector, () => {
    return new Promise((resolve, reject) => {
      fn().then(resolve).catch(reject);
    });
  });
}
