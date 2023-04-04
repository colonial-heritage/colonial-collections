import {useLocale} from 'next-intl';
import {notFound} from 'next/navigation';

interface Props {
  name: string;
}

async function LocalizedMarkdown({name}: Props) {
  const locale = useLocale();
  try {
    const Markdown = (await import(`@/messages/${locale}/${name}.mdx`)).default;
    return (
      <div className="max-w-3xl">
        <Markdown />
      </div>
    );
  } catch {
    notFound();
  }
}

// TypeScript doesn't understand async components yet.
// So this is a temporary workaround.
// More info:
//  - Next.js issue: https://github.com/vercel/next.js/issues/42292
//  - Typescript pull request: https://github.com/microsoft/TypeScript/pull/51328
export default LocalizedMarkdown as unknown as (props: Props) => JSX.Element;
