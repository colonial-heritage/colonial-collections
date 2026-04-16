import {readFile} from 'node:fs/promises';
import {dirname, join} from 'node:path';
import {fileURLToPath} from 'node:url';
import {getLocale} from 'next-intl/server';
import {parseWalkthrough} from './schema';
import WalkthroughTabs from './walkthrough-tabs';

const moduleDir = dirname(fileURLToPath(import.meta.url));

async function loadVideos(locale: string) {
  const path = join(
    moduleDir,
    '..',
    '..',
    'messages',
    locale,
    'walkthrough.yaml'
  );
  const raw = await readFile(path, 'utf-8');
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

  let videos;
  try {
    videos = await loadVideos(locale);
  } catch (error) {
    console.warn(
      `[walkthrough] could not load walkthrough for locale "${locale}":`,
      error
    );
    return null;
  }

  if (videos.length === 0) return null;

  return <WalkthroughTabs videos={videos} />;
}
