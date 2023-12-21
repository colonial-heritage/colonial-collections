'use client';

import {Tab} from '@headlessui/react';
import classNames from 'classnames';
import Image from 'next/image';
import {SlideOver, SlideOverOpenButton} from '@colonial-collections/ui';
import dynamic from 'next/dynamic';
import {Fragment} from 'react';
import {useTranslations} from 'next-intl';

// SSR needs to be false for plugin 'openseadragon'
const SlideOverGallery = dynamic(() => import('./slide-over-gallery'), {
  ssr: false,
});

interface Props {
  images: {
    id: string;
    src: string;
    alt: string;
    license?: {
      name?: string;
      id: string;
    };
  }[];
  organizationName?: string;
}

export default function Gallery({images, organizationName}: Props) {
  const t = useTranslations('Gallery');

  return (
    <Tab.Group
      as="div"
      className="flex flex-row md:flex-col gap-1 sticky top-4"
    >
      <Tab.Panels className="w-1/2 md:w-full relative flex flex-col justify-center items-center">
        {images.map((image, index) => (
          <Tab.Panel key={image.id}>
            <div>
              <SlideOver variant="gallery">
                <SlideOverOpenButton className="w-full h-full justify-start items-start align-top">
                  <Image
                    width="0"
                    height="0"
                    src={image.src}
                    alt={image.alt}
                    className="max-h-[450px] w-auto"
                    sizes="40vw"
                  />
                  <span className="absolute p-1 md:p-3 bg-consortiumBlue-100 hover:bg-consortiumBlue-100/80 rounded-full top-2 left-2 transition">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="w-4 h-4 fill-consortiumBlue-800"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10.5 3.75a6.75 6.75 0 100 13.5 6.75 6.75 0 000-13.5zM2.25 10.5a8.25 8.25 0 1114.59 5.28l4.69 4.69a.75.75 0 11-1.06 1.06l-4.69-4.69A8.25 8.25 0 012.25 10.5z"
                        clipRule="evenodd"
                      ></path>
                    </svg>
                  </span>
                </SlideOverOpenButton>
                <SlideOverGallery images={images} selected={index} />
              </SlideOver>
            </div>
            <div className="text-xs w-full p-2 flex flex-wrap justify-center gap-1 my-2">
              <div className=" text-consortiumBlue-100">{t('license')}:</div>
              {image.license ? (
                <a target="_blank" href={image.license.id}>
                  {image.license.name}
                </a>
              ) : (
                <p>
                  {t.rich('noLicense', {
                    organizationName,
                  })}
                </p>
              )}
            </div>
          </Tab.Panel>
        ))}
      </Tab.Panels>

      {images.length > 1 && (
        <Tab.List className="w-1/2 md:w-full grid grid-cols-2 md:flex md:flex-row md:flex-wrap md:items-end gap-2 md:py-2 md:border-y-4 border-consortiumBlue-800">
          {images.map(image => (
            <Tab
              as="div"
              key={image.id}
              className="w-full md:w-1/5 cursor-pointer"
            >
              {({selected}) => (
                <>
                  <span className="sr-only">{image.alt}</span>
                  <Image
                    width="0"
                    height="0"
                    src={image.src}
                    alt={image.alt}
                    className={classNames(
                      selected
                        ? 'border-white'
                        : 'border-consortiumBlue-400 hover:border-consortiumBlue-100',
                      'w-full border-4 transition'
                    )}
                    sizes="10vw"
                  />
                </>
              )}
            </Tab>
          ))}
        </Tab.List>
      )}
    </Tab.Group>
  );
}
