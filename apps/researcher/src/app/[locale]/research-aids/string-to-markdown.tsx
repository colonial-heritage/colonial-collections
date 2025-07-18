import {MDXRemote} from 'next-mdx-remote/rsc';
import {AnchorHTMLAttributes, createElement} from 'react';
import {textToSlug} from './linkable-headers';

// Escape html characters to be sure the text renders without any issues.
function escapeHtml(unsafe: string) {
  return unsafe
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function extractTextFromChildren(children: React.ReactNode): string {
  if (typeof children === 'string' || typeof children === 'number') {
    return String(children);
  }
  if (Array.isArray(children)) {
    return children.map(extractTextFromChildren).join('');
  }
  if (typeof children === 'object' && children && 'props' in children) {
    return extractTextFromChildren(
      (children as React.ReactElement).props.children
    );
  }
  return '';
}

function HeadingComponent({
  level,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement> & {
  level: number;
}): React.ReactElement {
  const text = extractTextFromChildren(props.children);
  const id = textToSlug(text);
  return createElement(`h${level}`, {id, ...props});
}

const components = {
  a: (props: AnchorHTMLAttributes<HTMLAnchorElement>) => (
    <a
      target="_blank"
      className="font-normal underline decoration-[#a3a3a3]"
      rel="noopener noreferrer"
      {...props}
    />
  ),
  h1: (props: React.HTMLAttributes<HTMLHeadingElement>) => {
    return <HeadingComponent {...props} level={1} />;
  },
  h2: (props: React.HTMLAttributes<HTMLHeadingElement>) => {
    return <HeadingComponent {...props} level={2} />;
  },
  h3: (props: React.HTMLAttributes<HTMLHeadingElement>) => {
    return <HeadingComponent {...props} level={3} />;
  },
};

export default function StringToMarkdown({text}: {text: string}) {
  return <MDXRemote source={escapeHtml(text)} components={components} />;
}
