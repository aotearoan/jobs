// TODO: switch to inversify to inject this as a dependency, therefore remove "static" modifier methods

import { CacheModel } from '../model/CacheModel';

export class CacheService {
  // TODO: refactor this to a properties file so it can be updated
  private static readonly CACHE_TIME_MS = 1000 * 60 * 60 * 4; // 4 hrs

  private static _cache: Record<string, CacheModel<any>> = {};

  /**
   * @param key - cache key
   * @returns package or null if not found
   */
  public static get<T>(key: string): T | null {
    const result = CacheService._cache[key] || null;

    // check still valid
    if (result && result.updated + CacheService.CACHE_TIME_MS > +new Date()) {
      return result.model;
    } else {
      delete CacheService._cache[key];
    }

    return null;
  }

  public static update<T>(key: string, model: T): void {
    CacheService._cache[key] = { model, updated: +new Date() };
  }

  public static remove(key: string): void {
    delete CacheService._cache[key];
  }
}
