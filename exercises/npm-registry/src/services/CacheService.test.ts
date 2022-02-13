import { CacheService } from './CacheService';

interface CacheObj {
  val: number;
}

describe('CacheService', () => {
  it('test update/get', () => {
    const xd = { val: 11 };
    const key = 'test1';
    CacheService.update(key, xd);
    expect(CacheService.get<CacheObj>(key)?.val).toEqual(xd.val);
  });

  it('test null when removed', () => {
    const xd = { val: 11 };
    const key = 'test1';
    CacheService.update('test1', xd);
    CacheService.remove('test1');
    expect(CacheService.get<CacheObj>(key)).toBeNull();
  });

  // TODO: Test cache timeout and removal
});
