const PRODUCT_NAME = "acme-package";

const SITE_NAME = `${PRODUCT_NAME} docs`;

const SITE_WORDMARK = "acme/package";

const SITE_DESCRIPTION = `Documentation for ${PRODUCT_NAME}: the template for library monorepos. Fork it, rename one scope, and publish.`;

const SITE_ORIGIN = "https://docs.acme-package.dev";

const REPOSITORY_URL = "https://github.com/pedroapfilho/acme-package";

const DOCS_CONTENT_DIR = "content/docs";

const docsSourceUrl = (pagePath: string) =>
  `${REPOSITORY_URL}/blob/main/apps/docs/${DOCS_CONTENT_DIR}/${pagePath}`;

const siteUrl = (path: string) => `${SITE_ORIGIN}${path}`;

export {
  DOCS_CONTENT_DIR,
  docsSourceUrl,
  REPOSITORY_URL,
  SITE_DESCRIPTION,
  SITE_NAME,
  SITE_ORIGIN,
  SITE_WORDMARK,
  siteUrl,
};
