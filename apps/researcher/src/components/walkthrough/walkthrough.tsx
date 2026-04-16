import {getLocale} from 'next-intl/server';
import {parseWalkthrough} from './schema';
import WalkthroughTabs from './walkthrough-tabs';

// Bundled at build time via webpack asset/source rule
import enYaml from '../../messages/en/walkthrough.yaml';
import nlYaml from '../../messages/nl/walkthrough.yaml';

const yamlByLocale: Record<string, string> = {
  en: enYaml,
  nl: nlYaml,
};

function loadVideos(locale: string) {
  const raw = yamlByLocale[locale] ?? yamlByLocale.en;
  return parseWalkthrough(raw, {
    onInvalid: (index, issues) => {
      console.warn(
        `[walkthrough] skipping invalid entry at index ${index} (locale "${locale}"):`,
        issues
      );
    },
  });
}

export default async function Walkthrough() {
  const locale = await getLocale();
  const videos = loadVideos(locale);

  if (videos.length === 0) return null;

  return <WalkthroughTabs videos={videos} />;
}
