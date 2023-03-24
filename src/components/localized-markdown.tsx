import {useLocale} from 'next-intl';
import {notFound} from 'next/navigation';

export default async function LocalizedMarkdown({name}: {name: string}) {
  const locale = useLocale();
  try {
    const Markdown = (await import(`@/messages/${locale}/${name}.mdx`)).default;
    return <Markdown />;
  } catch {
    notFound();
  }
}
