import {MDXRemote} from 'next-mdx-remote/rsc';

// Escape html characters to be sure the text renders without any issues.
function escapeHtml(unsafe: string) {
  return unsafe
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

export default function StringToMarkdown({text}: {text: string}) {
  return <MDXRemote source={escapeHtml(text)} />;
}
