import * as getPort from 'get-port';
import got from 'got';
import { Server } from 'http';
import { createApp } from '../app';

describe('/api/package/:name/:version endpoint', () => {
  const expected = [
    {
      'dependencies': [
        {
          'dependencies': [],
          'name': 'js-tokens',
          'version': '1.0.1',
        },
      ],
      'name': 'loose-envify',
      'version': '1.1.0',
    },
    {
      'dependencies': [],
      'name': 'object-assign',
      'version': '4.1.1',
    },
    {
      'dependencies': [
        {
          'dependencies': [
            {
              'dependencies': [],
              'name': 'js-tokens',
              'version': '3.0.0',
            },
          ],
          'name': 'loose-envify',
          'version': '1.3.1',
        },
        {
          'dependencies': [],
          'name': 'object-assign',
          'version': '4.1.1',
        },
      ],
      'name': 'prop-types',
      'version': '15.6.2',
    },
  ];

  let server: Server;
  let port: number;

  beforeAll(async (done) => {
    port = await getPort();
    server = createApp().listen(port, done);
  });

  afterAll((done) => {
    server.close(done);
  });

  it('responds', async () => {
    const packageName = 'react';
    const packageVersion = '16.13.0';

    const res: any = await got(
      `http://localhost:${port}/api/package/${packageName}/${packageVersion}`,
    ).json();

    expect(res.name).toEqual(packageName);
  });

  it('returns dependency tree', async () => {
    const packageName = 'react';
    const packageVersion = '16.13.0';

    const res: any = await got(
      `http://localhost:${port}/api/package/${packageName}/${packageVersion}`,
    ).json();

    expect(res.dependencies).toEqual(expected);
  });
});
