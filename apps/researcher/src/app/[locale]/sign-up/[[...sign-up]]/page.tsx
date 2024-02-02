import {SignUp} from '@clerk/nextjs';
import {headers} from 'next/headers';
import {getTranslations} from 'next-intl/server';

export default async function Page() {
  const t = await getTranslations('Signup');

  // Get the path with the locale preset.
  const activePath = headers().get('x-pathname') || '/sign-up';

  return (
    <div>
      <div className="bg-consortiumBlue-800 text-white">
        <div className="max-w-6xl w-full m-auto px-4 sm:px-10">
          <h1 className="text-xl md:text-4xl py-10 md:py-20">{t('title')}</h1>
        </div>
      </div>

      <div className="mx-auto mt-16 px-4 sm:px-10 mb-16 max-w-6xl flex flex-col gap-6 w-full">
        <div className="flex flex-col md:flex-row w-full gap-20">
          <div className="w-full md:w-2/3 flex flex-col gap-6 order-2 md:order-1">
            <div className="flex-col flex gap-2">
              <h2 className="text-xl">{t('WhyH2')}</h2>
              <p>{t('WhyP1')}</p>
              <div className="flex-col flex gap-4 mt-12">
                <h2 className="text-xl">{t('WhatH2')}</h2>
              </div>

              <div className="flex-col flex gap-2">
                <h3 className="text-lg">{t('AddH3')}</h3>
                <p>{t('AddP1')}</p>
                <p>
                  <em>{t('NoteBold')}</em> {t('NoteText')}
                </p>
              </div>

              <div className="flex-col flex gap-2 mt-4">
                <h3 className="text-lg">{t('UseH3')}</h3>
                <p>{t('UseP')}</p>
              </div>
            </div>
          </div>
          <div className="w-full md:w-1/3 order-1 md:order-2">
            <div className="w-full p-4 md:sticky top-0 {{> styles/style_form }} rounded-lg min-h-[300px]">
              <div className="-translate-x-5 md:-translate-x-10">
                <SignUp path={activePath} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
