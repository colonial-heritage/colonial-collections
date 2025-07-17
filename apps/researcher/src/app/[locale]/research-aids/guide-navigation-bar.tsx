import {useTranslations} from 'next-intl';

interface GuideNavigationBarLink {
  slug: string;
  name: string;
}

interface GuideNavigationBarProps {
  links: GuideNavigationBarLink[];
  maxWidth?: string;
}

export default function GuideNavigationBar({
  links,
  maxWidth = '1800px',
}: GuideNavigationBarProps) {
  const t = useTranslations('ResearchGuide');
  return (
    <div className="hidden md:block w-full bg-consortium-purple-100 text-consortium-blue-900 sticky top-0 z-30 text-xs border-t border-consortium-purple-200">
      <div
        className="px-4 sm:px-10 mx-auto flex justify-between items-center"
        style={{maxWidth}}
      >
        <div className="w-auto flex justify-end relative py-2 ">
          <div className="peer-hover:flex hover:flex lg:w-auto flex flex-row items-center gap-3 relative left-0 bg-consortium-purple-100 p-0">
            <div className="italic text-sm text-consortium-purple-600">
              {t('pageNavigationSegments')}:
            </div>
            {links.map(link => (
              <a
                key={link.slug}
                className="whitespace-nowrap no-underline rounded-full px-2 py-1 text-xs md:text-xs bg-consortium-purple-200 hover:bg-consortium-purple-300 text-consortium-blue-900 transitions"
                href={`#${link.slug}`}
              >
                {link.name}
              </a>
            ))}
            <a
              className="whitespace-nowrap no-underline rounded-full px-2 py-1 text-xs md:text-xs bg-consortium-purple-200 hover:bg-consortium-purple-300 text-consortium-blue-900 transitions"
              href="#top"
            >
              {t('pageNavigationTop')} ↑
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
