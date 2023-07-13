'use client';

import {Tab} from '@headlessui/react';
import classNames from 'classnames';
import Image from 'next/image';
import {SlideOver, SlideOverOpenButton} from 'ui';
import dynamic from 'next/dynamic';
import {Fragment} from 'react';

// SSR needs to be false for plugin 'openseadragon'
const SlideOverGallery = dynamic(() => import('./slide-over-gallery'), {
  ssr: false,
});

interface Props {
  images: {
    id: string;
    src: string;
    alt: string;
  }[];
  resetText: string;
}

export default function Gallery({images, resetText}: Props) {
  return (
    <Tab.Group
      as="div"
      className="flex flex-row md:flex-col gap-1 sticky top-4"
    >
      <Tab.Panels as={Fragment}>
        {images.map((image, index) => (
          <Tab.Panel
            key={image.id}
            className="aspect-h-1 aspect-w-1 w-1/2 md:w-full"
          >
            <SlideOver variant="gallery">
              <SlideOverOpenButton className="md:w-full h-full">
                <Image
                  fill
                  src={image.src}
                  alt={image.alt}
                  className="h-full w-full object-contain object-center sm:rounded-lg"
                  sizes="40vw"
                />
                <span className="absolute p-1 md:p-3 bg-black rounded top-2 left-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-4 h-4 fill-white"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10.5 3.75a6.75 6.75 0 100 13.5 6.75 6.75 0 000-13.5zM2.25 10.5a8.25 8.25 0 1114.59 5.28l4.69 4.69a.75.75 0 11-1.06 1.06l-4.69-4.69A8.25 8.25 0 012.25 10.5z"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                </span>
              </SlideOverOpenButton>
              <SlideOverGallery
                images={images}
                selected={index}
                resetText={resetText}
              />
            </SlideOver>
          </Tab.Panel>
        ))}
      </Tab.Panels>

      {images.length > 1 && (
        <Tab.List className="w-1/2 md:w-full grid grid-cols-2 md:flex md:flex-row md:flex-wrap gap-2">
          {images.map(image => (
            <Tab key={image.id} className="md:w-1/5 h-1/2 md:h-24 relative">
              {({selected}) => (
                <>
                  <span className="sr-only">{image.alt}</span>
                  <Image
                    fill
                    src={image.src}
                    alt={image.alt}
                    className=" object-cover object-center"
                    sizes="10vw"
                  />
                  <span
                    className={classNames(
                      selected ? 'ring-sand-700' : 'ring-transparent',
                      'pointer-events-none absolute inset-0 ring-1 ring-offset-1'
                    )}
                    aria-hidden="true"
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
