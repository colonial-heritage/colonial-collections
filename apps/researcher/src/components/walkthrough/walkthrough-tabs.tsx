'use client';

import {Tab} from '@headlessui/react';
import classNames from 'classnames';
import type {Video} from './schema';

interface Props {
  videos: Video[];
}

function vimeoSrc(video: Video) {
  const base = `https://player.vimeo.com/video/${video.vimeoId}`;
  return video.vimeoHash ? `${base}?h=${video.vimeoHash}` : base;
}

export default function WalkthroughTabs({videos}: Props) {
  return (
    <Tab.Group
      as="div"
      className="flex flex-col md:flex-row gap-4 md:gap-6 w-full"
    >
      <Tab.List className="flex flex-row md:flex-col w-full md:w-1/5 gap-2 flex-wrap">
        {videos.map(video => (
          <Tab
            key={video.vimeoId}
            className={({selected}) =>
              classNames(
                'text-left px-2 py-1 rounded text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-consortium-blue-400',
                selected
                  ? 'bg-consortium-blue-50 text-consortium-blue-800'
                  : 'bg-neutral-200 hover:bg-neutral-300'
              )
            }
          >
            {video.title}
          </Tab>
        ))}
      </Tab.List>
      <Tab.Panels className="flex flex-col w-full md:w-4/5">
        {videos.map(video => (
          <Tab.Panel
            key={video.vimeoId}
            className="flex flex-col focus:outline-none"
          >
            <div className="bg-neutral-200 rounded-t p-2">
              <div className="aspect-w-16 aspect-h-9">
                <iframe
                  src={vimeoSrc(video)}
                  title={video.title}
                  allow="autoplay; fullscreen; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </div>
            <div className="bg-neutral-200 rounded-b py-4 px-4">
              {video.text}
            </div>
          </Tab.Panel>
        ))}
      </Tab.Panels>
    </Tab.Group>
  );
}
