import {SignUp} from '@clerk/nextjs';
import {createPersistentIri} from '@colonial-collections/iris';
import {getLocale, getTranslations} from 'next-intl/server';
import {env} from 'node:process';

export default async function Page() {
  const t = await getTranslations('SignUp');
  const locale = await getLocale();
  const iri = createPersistentIri();

  return (
    <div>
      <div className="bg-consortium-blue-800 text-white">
        <div className="max-w-6xl w-full m-auto px-4 sm:px-10">
          <h1 className="text-xl md:text-4xl py-10 md:py-20">
            {t('pageTitle')}
          </h1>
        </div>
      </div>

      <div className="mx-auto mt-16 px-4 sm:px-10 mb-16 max-w-6xl flex flex-col gap-6 w-full">
        <div className="flex flex-col md:flex-row w-full gap-20">
          <div className="w-full md:w-2/3 flex flex-col gap-6 order-2 md:order-1">
            <div className="flex-col flex gap-2">
              <h2 className="text-xl">{t('whyTitle')}</h2>
              <p>{t('whyText')}</p>
              <div className="flex-col flex gap-4 mt-12">
                <h2 className="text-xl">{t('whatTitle')}</h2>
              </div>

              <div className="flex-col flex gap-2">
                <h3 className="text-lg">{t('addTitle')}</h3>
                <p className="whitespace-pre-wrap">
                  {t.rich('addText', {
                    important: text => <em>{text}</em>,
                  })}
                </p>
              </div>

              <div className="flex-col flex gap-2 mt-4">
                <h3 className="text-lg">{t('useTitle')}</h3>
                <p>{t('useText')}</p>
              </div>
            </div>
          </div>
          <div className="w-full md:w-1/3 order-1 md:order-2">
            <div className="w-full p-4 md:sticky top-0 {{> styles/style_form }} rounded-lg min-h-[300px]">
              <div className="-translate-x-5 md:-translate-x-10">
                <SignUp
                  unsafeMetadata={{iri}}
                  redirectUrl="/"
                  path={`/${locale}${env.NEXT_PUBLIC_CLERK_SIGN_UP_URL}`}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
