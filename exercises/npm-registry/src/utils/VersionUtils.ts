export class VersionUtils {
    public static normaliseVersion(version: string) {
        // first extract the beta as it may contain a '.'
        const versionWithBeta = version.split('-');
        const beta = versionWithBeta[1] ? `-${versionWithBeta[1]}` : '';

        // split the version into parts removing all non-numeric chars
        const versionParts = versionWithBeta[0]
            .split('.')
            .map((part) => part.replace(/\D/g,''));

        // extract semver parts, if missing (i.e. it's a wildcard) set to the lowest possible version, i.e 0
        const major = versionParts[0];
        const minor = versionParts[1] || '0';
        const patch = versionParts[2] || '0';

        return `${major}.${minor}.${patch}${beta}`;
    }
}
