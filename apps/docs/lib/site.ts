const GITHUB_URL = "https://github.com/pedroapfilho/acme-package";

const SITE_ORIGIN = "https://docs.acme-package.dev";

const GITHUB_DOCS_BASE = `${GITHUB_URL}/blob/main/apps/docs/content/docs`;

// The index page's url is "/", and neither rewrite in next.config.ts matches the
// "/.md" a plain `${url}.md` would produce, so it must spell the root "/index.md".
const docsMarkdownUrl = (pageUrl: string) => (pageUrl === "/" ? "/index.md" : `${pageUrl}.md`);

const docsSourceUrl = (pagePath: string) => `${GITHUB_DOCS_BASE}/${pagePath}`;

export { docsMarkdownUrl, docsSourceUrl, GITHUB_URL, SITE_ORIGIN };
