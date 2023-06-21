'use client';

import React, {useEffect, useState} from 'react';
import OpenSeaDragon from 'openseadragon';
import {SlideOverDialog, SlideOverHeader, SlideOverContent} from 'ui';
import Image from 'next/image';
import {Tab} from '@headlessui/react';
import classNames from 'classnames';

interface Props {
  images: {
    id: string;
    src: string;
    alt: string;
  }[];
  selected?: number;
}

export default function SlideOverGallery({images, selected = 0}: Props) {
  const [selectedIndex, setSelectedIndex] = useState(selected);

  return (
    <SlideOverDialog>
      <Tab.Group
        as="div"
        className="flex flex-col h-full"
        selectedIndex={selectedIndex}
        onChange={setSelectedIndex}
      >
        <SlideOverHeader>
          {images.length > 1 && (
            <div className="mx-auto w-full max-w-4xl lg:max-w-none p-2">
              <Tab.List className="grid sm:grid-cols-5 md:grid-cols-10 grid-cols-3 gap-2">
                {images.map(image => (
                  <Tab
                    key={image.id}
                    className="relative flex h-24 cursor-pointer items-center justify-center text-sm font-medium uppercase text-gray-900 hover:bg-gray-50 focus:outline-none focus:ring focus:ring-opacity-50 focus:ring-offset-1"
                  >
                    {({selected}) => (
                      <>
                        <span className="sr-only">{image.alt}</span>
                        <span className="absolute inset-0 overflow-hidden">
                          <Image
                            fill
                            src={image.src}
                            alt={image.alt}
                            className="h-full w-full object-cover object-center"
                            sizes="13vw"
                          />
                        </span>
                        <span
                          className={classNames(
                            selected
                              ? 'ring-indigo-500 ring-1'
                              : 'ring-transparent',
                            'pointer-events-none absolute inset-0'
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
        </SlideOverHeader>
        <SlideOverContent>
          <Tab.Panels className="h-full w-full">
            {images.map(image => (
              <Tab.Panel key={image.id} className="h-full w-full">
                <OpenSeaDragonViewer image={image.src} />
              </Tab.Panel>
            ))}
          </Tab.Panels>
        </SlideOverContent>
      </Tab.Group>
    </SlideOverDialog>
  );
}

interface OpenSeaDragonViewer {
  image: string;
}

function OpenSeaDragonViewer({image}: OpenSeaDragonViewer) {
  useEffect(() => {
    OpenSeaDragon({
      id: 'openSeaDragon',
      showNavigationControl: false,
      showNavigator: true,
      tileSources: {
        type: 'image',
        url: image,
      },
    });
  }, [image]);

  return <div id="openSeaDragon" className="h-full w-full" />;
}
