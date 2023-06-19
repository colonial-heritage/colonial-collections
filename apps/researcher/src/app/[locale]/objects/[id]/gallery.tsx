'use client';

import {Tab} from '@headlessui/react';
import classNames from 'classnames';
import Image from 'next/image';
import {SlideOver, SlideOverOpenButton} from 'ui';
import dynamic from 'next/dynamic';

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
}

export default function Gallery({images}: Props) {
  return (
    <Tab.Group as="div" className="flex flex-col-reverse">
      {images.length > 1 && (
        <div className="mx-auto mt-6 w-full max-w-2xl lg:max-w-none">
          <Tab.List className="grid grid-cols-4 gap-6">
            {images.map(image => (
              <Tab
                key={image.id}
                className="relative flex h-24 cursor-pointer items-center justify-center rounded-md bg-white text-sm font-medium uppercase text-gray-900 hover:bg-gray-50 focus:outline-none focus:ring focus:ring-opacity-50 focus:ring-offset-4"
              >
                {({selected}) => (
                  <>
                    <span className="sr-only">{image.alt}</span>
                    <span className="absolute inset-0 overflow-hidden rounded-md">
                      <Image
                        fill
                        src={image.src}
                        alt={image.alt}
                        className="h-full w-full object-cover object-center"
                        sizes="10vw"
                      />
                    </span>
                    <span
                      className={classNames(
                        selected ? 'ring-indigo-500' : 'ring-transparent',
                        'pointer-events-none absolute inset-0 rounded-md ring-2 ring-offset-2'
                      )}
                      aria-hidden="true"
                    />
                  </>
                )}
              </Tab>
            ))}
          </Tab.List>
        </div>
      )}

      <Tab.Panels className="aspect-h-1 aspect-w-1 w-full">
        {images.map((image, index) => (
          <Tab.Panel key={image.id}>
            <SlideOver variant="gallery">
              <SlideOverOpenButton>
                <Image
                  fill
                  src={image.src}
                  alt={image.alt}
                  className="h-full w-full object-contain object-center sm:rounded-lg"
                  sizes="40vw"
                />
              </SlideOverOpenButton>
              <SlideOverGallery images={images} selected={index} />
            </SlideOver>
          </Tab.Panel>
        ))}
      </Tab.Panels>
    </Tab.Group>
  );
}
