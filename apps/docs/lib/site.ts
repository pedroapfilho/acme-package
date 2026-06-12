// Fork-facing constants: forks update these two URLs — every GitHub link and
// absolute page URL in the docs derives from here. Kept in a plain TS module
// (no JSX) so client components can import them without pulling in the layout.
const GITHUB_URL = "https://github.com/pedroapfilho/acme-package";

const SITE_ORIGIN = "https://docs.acme-package.dev";

export { GITHUB_URL, SITE_ORIGIN };
