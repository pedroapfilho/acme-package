import type { MetadataRoute } from "next";

import { siteUrl } from "@/lib/site";
import { source } from "@/lib/source";

const sitemap = (): MetadataRoute.Sitemap =>
  source.getPages().map((page) => ({ url: siteUrl(page.url) }));

export default sitemap;
