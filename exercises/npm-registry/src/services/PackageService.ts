import { RequestHandler } from 'express';
import got from 'got';
import { NPMPackage } from '../model/NPMPackage';
import { ReducedNpmPackage } from '../model/ReducedNpmPackage';
import { CacheService } from './CacheService';
import { VersionUtils } from '../utils/VersionUtils';

// TODO: refactor to a service interface and impl class
/**
 * Attempts to retrieve package data from the npm registry and return it
 */
export const getPackage: RequestHandler = async function (req, res, next) {
  const { name, version } = req.params;

  try {
    const npmPackage: ReducedNpmPackage | null = await getPackageWithDependencies(name, version);

    if (npmPackage) {
        return res.status(200).json(npmPackage);
    } else {
        res.status(404).send(`${name} v${version} Not Found`);
    }
  } catch (error) {
    return next(error);
  }
};

/**
 * Attempts to retrieve package data from the npm registry and return it
 */
export async function getPackageWithDependencies(name: string, version: string): Promise<ReducedNpmPackage | null> {
    // normalise the version to the lowest supported
    const normalisedVersion = VersionUtils.normaliseVersion(version);
    // look in cache or request new
    const npmPackage: ReducedNpmPackage | null = CacheService.get<ReducedNpmPackage>(`${name}.${normalisedVersion}`) || await requestNpmPackage(name, normalisedVersion);

    // recurse through dependencies
    if (npmPackage?.dependencies) {
        const deps: Array<ReducedNpmPackage> = [];
        // TODO: handle circular dependencies
        // have to use a traditional for loop to also use await
        for (let i=0;i<npmPackage?.dependencies.length;i++) {
            const dep = npmPackage?.dependencies[i];
            const pkg = await getPackageWithDependencies(dep.name, dep.version);
            if (pkg) {
                deps.push(pkg);
            }
        }
        npmPackage.dependencies = deps;
    }

    return npmPackage;
}

/**
 * Attempts to retrieve package data from the npm registry and return it
 */
async function requestNpmPackage(name: string, version: string): Promise<ReducedNpmPackage | null> {
    const npmPackage: NPMPackage = await got(`https://registry.npmjs.org/${name}`).json();

    if (npmPackage.versions[version]) {
        const dependencies = npmPackage.versions[version].dependencies || {};

        const pkg: ReducedNpmPackage = {
            name,
            version,
            // map to local recursive data structure, add updated time
            dependencies: Object.keys(dependencies)
                .map((key: string) => ({
                    name: key,
                    version: dependencies[key],
                })),
        };

        CacheService.update<ReducedNpmPackage>(`${name}.${version}`, pkg);
        return pkg;
    }

    return null;
}
