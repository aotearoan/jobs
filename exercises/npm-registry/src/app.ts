import * as express from 'express';
import { getPackage, getPackageWithDependencies } from './services/PackageService';

const API_PREFIX = '/api';

/**
 * Bootstrap the application framework
 */
export function createApp() {
  const app = express();

  app.set('view engine', 'ejs');
  app.use(express.json());

  // API
  app.get(`${API_PREFIX}/package/:name/:version`, getPackage);

  // Application
  app.get(`/package/:name/:version`, (req, res) => {
    const { name, version } = req.params;
    getPackageWithDependencies(name, version).then((npmPackage) => {
      res.render('pages/package', { name, version, npmPackage });
    });
  });

  return app;
}
