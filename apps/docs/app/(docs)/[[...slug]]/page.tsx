import { DocsBody, DocsDescription, DocsPage, DocsTitle } from "fumadocs-ui/page";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { PageActions } from "@/components/ai/page-actions";
import { pageMarkdownUrl } from "@/lib/page-markdown";
import { docsSourceUrl, siteUrl } from "@/lib/site";
import { source } from "@/lib/source";
import { getMDXComponents } from "@/mdx-components";

type PageProps = {
  params: Promise<{ slug?: Array<string> }>;
};

const Page = async ({ params }: PageProps) => {
  const { slug } = await params;
  const page = source.getPage(slug);
  if (!page) {
    notFound();
  }

  const MDXContent = page.data.body;

  return (
    <main className="contents" data-testid="docs-shell">
      <DocsPage full={page.data.full} toc={page.data.toc}>
        <DocsTitle>{page.data.title}</DocsTitle>
        <DocsDescription>{page.data.description}</DocsDescription>
        <div className="flex flex-row items-center gap-2 border-b pt-2 pb-6">
          <PageActions
            markdownUrl={pageMarkdownUrl(page.url)}
            pageUrl={siteUrl(page.url)}
            sourceUrl={docsSourceUrl(page.path)}
          />
        </div>
        <DocsBody>
          <MDXContent components={getMDXComponents()} />
        </DocsBody>
      </DocsPage>
    </main>
  );
};

export const generateStaticParams = () => source.generateParams();

export const generateMetadata = async ({ params }: PageProps): Promise<Metadata> => {
  const { slug } = await params;
  const page = source.getPage(slug);
  if (!page) {
    notFound();
  }

  return {
    description: page.data.description,
    title: page.data.title,
  };
};

export default Page;
