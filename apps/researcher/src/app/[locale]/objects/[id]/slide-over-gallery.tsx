'use client';

import React, {useEffect, useState} from 'react';
import OpenSeaDragon, {Viewer} from 'openseadragon';
import {SlideOverDialog, SlideOverHeader, SlideOverContent} from 'ui';
import Image from 'next/image';
import {Tab} from '@headlessui/react';
import classNames from 'classnames';
import {
  MagnifyingGlassPlusIcon,
  MagnifyingGlassMinusIcon,
} from '@heroicons/react/24/solid';

interface Props {
  images: {
    id: string;
    src: string;
    alt: string;
  }[];
  selected?: number;
  resetText: string;
}

export default function SlideOverGallery({
  images,
  selected = 0,
  resetText,
}: Props) {
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
              <Tab.List className="grid sm:grid-cols-5 lg:grid-cols-12 grid-cols-3 gap-2">
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
                              ? 'ring-sand-700 ring-1'
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
          <div className="flex flex-row justify-center items-center gap-2">
            <button
              className="p-2 bg-black rounded top-2 left-2 !static"
              id="zoom-out"
            >
              <MagnifyingGlassMinusIcon className="w-6 h-6 fill-white" />
            </button>
            <button
              className="p-2 bg-black rounded top-2 left-2 !static"
              id="zoom-in"
            >
              <MagnifyingGlassPlusIcon className="w-6 h-6 fill-white" />
            </button>
            <button
              className="p-2 bg-black rounded top-2 left-2 text-white !static"
              id="home"
            >
              {resetText}
            </button>
          </div>
        </SlideOverHeader>
        <SlideOverContent>
          <div className="h-full w-full">
            <OpenSeaDragonViewer image={images[selectedIndex].src} />
          </div>
        </SlideOverContent>
      </Tab.Group>
    </SlideOverDialog>
  );
}

interface OpenSeaDragonViewer {
  image: string;
}

const OpenSeaDragonViewer = ({image}: OpenSeaDragonViewer) => {
  const [viewer, setViewer] = useState<Viewer | null>(null);

  useEffect(() => {
    if (image && viewer) {
      viewer.open({
        type: 'image',
        url: image,
      });
    }
  }, [image, viewer]);

  useEffect(() => {
    const initOpenseadragon = () => {
      viewer && viewer.destroy();
      setViewer(
        OpenSeaDragon({
          id: 'openSeaDragon',
          showNavigator: true,
          zoomInButton: 'zoom-in',
          zoomOutButton: 'zoom-out',
          homeButton: 'home',
          tileSources: {
            type: 'image',
            url: image,
          },
        })
      );
    };

    initOpenseadragon();
    return () => {
      viewer && viewer.destroy();
    };
  }, []);

  return <div id="openSeaDragon" className="h-full w-full" />;
};
