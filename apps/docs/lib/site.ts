const GITHUB_URL = "https://github.com/pedroapfilho/acme-package";

const SITE_ORIGIN = "https://docs.acme-package.dev";

const GITHUB_DOCS_BASE = `${GITHUB_URL}/blob/main/apps/docs/content/docs`;

const docsSourceUrl = (pagePath: string) => `${GITHUB_DOCS_BASE}/${pagePath}`;

export { docsSourceUrl, GITHUB_URL, SITE_ORIGIN };
