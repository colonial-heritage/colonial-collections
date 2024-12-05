import {MDXRemote} from 'next-mdx-remote/rsc';
import {AnchorHTMLAttributes} from 'react';

// Escape html characters to be sure the text renders without any issues.
function escapeHtml(unsafe: string) {
  return unsafe
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

const components = {
  a: (props: AnchorHTMLAttributes<HTMLAnchorElement>) => (
    <a
      target="_blank"
      className="font-normal no-underline border-b border-dashed border-gray-400"
      rel="noopener noreferrer"
      {...props}
    />
  ),
};

export default function StringToMarkdown({text}: {text: string}) {
  return <MDXRemote source={escapeHtml(text)} components={components} />;
}
