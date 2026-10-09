const PRODUCT_NAME = "acme-package";

const SITE_NAME = `${PRODUCT_NAME} docs`;

const SITE_WORDMARK = "acme/package";

const SITE_DESCRIPTION = `Documentation for ${PRODUCT_NAME}: the template for library monorepos. Fork it, rename one scope, and publish.`;

const SITE_ORIGIN = "https://docs.acme-package.dev";

const REPOSITORY_URL = "https://github.com/pedroapfilho/acme-package";

const GITHUB_DOCS_BASE = `${REPOSITORY_URL}/blob/main/apps/docs/content/docs`;

const docsSourceUrl = (pagePath: string) => `${GITHUB_DOCS_BASE}/${pagePath}`;

const siteUrl = (path: string) => `${SITE_ORIGIN}${path}`;

export {
  docsSourceUrl,
  REPOSITORY_URL,
  SITE_DESCRIPTION,
  SITE_NAME,
  SITE_ORIGIN,
  SITE_WORDMARK,
  siteUrl,
};
