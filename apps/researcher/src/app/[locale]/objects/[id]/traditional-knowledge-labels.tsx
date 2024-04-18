import {useTranslations} from 'next-intl';
import Image from 'next/image';
import useObject from './use-object';

export default function TraditionalKnowledgeLabels() {
  const t = useTranslations('TraditionalKnowledgeLabels');
  const {organization} = useObject.getState();

  return (
    <div className="my-16">
      <h2 className="text-2xl mb-4 scroll-mt-20" id="traditionalKnowledge">
        {t('title')}
      </h2>
      <p className="text-neutral-600 text-sm max-w-xl mb-6">
        {t.rich('description', {
          link: text => (
            <a
              href="https://localcontexts.org/labels/traditional-knowledge-labels/"
              target="_blank"
              rel="noopener noreferrer"
            >
              {text}
            </a>
          ),
        })}
      </p>
      <div className="w-full mt-4">
        <div className="flex flex-col xl:flex-row gap-2 xl:gap-10">
          <div className="w-full xl:w-1/5 border-t border-neutral-400">
            <div className="sticky top-8 py-1">
              <h3 className="text-lg w-full my-1 flex items-center">
                {t('nonVerified')}
              </h3>
              <Image
                height={20}
                width={62}
                src="/images/traditional-knowledge-labels/non-verified.png"
                alt={t('nonVerified')}
              />
            </div>
          </div>
          <div className="w-full xl:w-4/5 flex flex-col gap-2 border-t border-neutral-400 pb-12">
            <div className="border-t first:border-0 border-neutral-200 flex flex-col lg:flex-row justify-between gap-2 ">
              <div className="w-full lg:w-2/3 py-3">
                <p>{t('nonVerifiedDescription')}</p>
              </div>
              <div className="p-2 py-3 text-xs  my-1 self-start w-full lg:w-1/3 ">
                <div>
                  {t.rich('providedBy', {
                    name: () => <strong>{organization?.name}</strong>,
                  })}
                </div>
                <div className="flex flex-col justify-between">
                  <div className="italic mt-1">{t('defaultLabel')}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}