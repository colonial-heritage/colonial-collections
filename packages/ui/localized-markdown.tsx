import {getLocale} from 'next-intl/server';
import {notFound} from 'next/navigation';
import classNames from 'classnames';
import dynamic from 'next/dynamic';

interface Props {
  name: string;
  // Note: the path prefix for dynamic imports must be static to work correctly.
  // See the issue: https://github.com/webpack/webpack/issues/6680
  // That is why `contentPath` can only be fixed values.
  contentPath: '@colonial-collections/content' | '@/messages';
  textSize?: 'small' | 'normal';
  textProps?: {[key: string]: string | number | boolean};
}

export async function LocalizedMarkdown({
  name,
  contentPath,
  textSize,
  textProps = {},
}: Props) {
  const locale = await getLocale();
  const markdownClassName = classNames(
    'max-w-3xl prose',
    'prose-headings:font-semibold prose:text-blue-100',
    'prose-h1:text-2xl prose-h1:mb-10',
    'prose-h2:text-xl prose-h2:mb-1 prose-h2:mt-10',
    'prose-h3:text-lg prose-h3:mb-2',
    'prose-a:text-sky-700 prose-a:no-underline',
    {
      'text-sm': textSize === 'small',
    }
  );
  let Markdown;
  try {
    if (contentPath === '@colonial-collections/content') {
      Markdown = dynamic(
        () => import(`@colonial-collections/content/${locale}/${name}.mdx`)
      );
    }
    if (contentPath === '@/messages') {
      Markdown = dynamic(() => import(`@/messages/${locale}/${name}.mdx`));
    }
    if (!Markdown) {
      notFound();
    }
    return (
      <div className={markdownClassName} data-testid="markdown-container">
        <Markdown {...textProps} />
      </div>
    );
  } catch {
    notFound();
  }
}
