# Solution outline
The objestive is to recursively obtain dependency information and build up the dependency tree, then present this to the end user. Ideally we want to minimise the number of calls to the NPM REST endpoint by caching dependency information and only refreshing after a configurable amount of time.

To make the code more maintainable implement the following:
- split code into directories for models, services, views
- move API calls under /api (e.g. /api/package) to separate the API endpoints from the web application. This will make the codebase more maintainable and allow for easier separation with respect to deployment and security.
- For external/storage services - create service interfaces and implementation classes and use inversify dependency injection to bind these at runtime. This makes testing easier by mocking interfaces and stubs with local test data can also be created.
- prefer native fetch with "whatwg-fetch" (https://www.npmjs.com/package/whatwg-fetch) polyfill over "got" dependency. This will save ~190k in the resulting package size - https://packagephobia.com/result?p=got vs https://packagephobia.com/result?p=whatwg-fetch
- in the interest of providing a solution quickly cache dependency graph in memory. TODO: refactor this to an alternative solution (probably server side) for better scalability - reduced client->server network requests and shared server->NPM API requests.
- To provide a prototype use EJS templates to generate the tree web page. In future, implement the web application using VueJS to make the front end code more maintainable and testable.
