export interface ReducedNpmPackage {
  name: string;
  version: string;
  dependencies?: Array<ReducedNpmPackage>;
}
