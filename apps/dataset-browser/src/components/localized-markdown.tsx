import {useLocale} from 'next-intl';
import {notFound} from 'next/navigation';
import classNames from 'classnames';

interface Props {
  name: string;
}

async function LocalizedMarkdown({name}: Props) {
  const markdownClassName = classNames(
    'max-w-3xl prose',
    'prose-headings:font-semibold prose:text-blue-100',
    'prose-h1:text-2xl prose-h1:mb-10',
    'prose-h2:text-xl prose-h2:mb-1 prose-h2:mt-10',
    'prose-h3:text-lg prose-h3:mb-2',
    'prose-a:text-sky-700 prose-a:no-underline'
  );
  const locale = useLocale();
  try {
    const Markdown = (await import(`@/messages/${locale}/${name}.mdx`)).default;
    return (
      <div className={markdownClassName}>
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
