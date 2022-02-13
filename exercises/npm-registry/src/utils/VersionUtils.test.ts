import { VersionUtils } from './VersionUtils';

describe('VersionUtils', () => {
  describe('normaliseVersion', () => {
    it('normalises basic version', () => {
      expect(VersionUtils.normaliseVersion('1.0.0')).toEqual('1.0.0');
    });

    it('normalises basic version, non zero', () => {
      expect(VersionUtils.normaliseVersion('2.6.42')).toEqual('2.6.42');
    });

    it('normalises with ~', () => {
      expect(VersionUtils.normaliseVersion('~1.0.0')).toEqual('1.0.0');
    });

    it('normalises with ^', () => {
      expect(VersionUtils.normaliseVersion('^1.0.0')).toEqual('1.0.0');
    });

    it('normalises with -rc.1 beta version', () => {
      expect(VersionUtils.normaliseVersion('1.0.0-rc.1')).toEqual('1.0.0-rc.1');
    });

    it('normalises with x wildcard minor version', () => {
      expect(VersionUtils.normaliseVersion('1.x')).toEqual('1.0.0');
    });

    it('normalises with x wildcard minor version', () => {
      expect(VersionUtils.normaliseVersion('1.*')).toEqual('1.0.0');
    });

    it('normalises with x wildcard patch version', () => {
      expect(VersionUtils.normaliseVersion('1.0.x')).toEqual('1.0.0');
    });

    it('normalises with x wildcard patch version', () => {
      expect(VersionUtils.normaliseVersion('1.0.*')).toEqual('1.0.0');
    });
  });
});
