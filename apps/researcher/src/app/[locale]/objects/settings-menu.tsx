'use client';

import PopoverMenu from '@/components/popover';
import {useListStore} from '@colonial-collections/list-store';
import {ListBulletIcon, Squares2X2Icon} from '@heroicons/react/24/solid';
import {useTranslations} from 'next-intl';
import {ImageVisibility} from './definitions';

export default function SettingsMenu() {
  const t = useTranslations('Settings');
  const view = useListStore(s => s.view);
  const imageVisibility = useListStore(s => s.imageVisibility);
  const viewChange = useListStore(s => s.viewChange);
  const imageVisibilityChange = useListStore(s => s.imageVisibilityChange);
  const limitChange = useListStore(s => s.limitChange);
  const limit = useListStore(s => s.limit);

  return (
    <PopoverMenu buttonText={t('settings')} variant="default">
      <div className="flex w-[300px] flex-col">
        <div className="p-4 border-b flex gap-2 flex-wrap">
          <div className="w-full text-sm italic">{t('resultView')}:</div>
          <button
            onClick={() => viewChange('grid')}
            className="p-1 sm:py-2 sm:px-3 rounded-full text-xs bg-neutral-200/50 hover:bg-neutral-300/50 text-neutral-800 transition flex items-center gap-1"
          >
            <Squares2X2Icon className="w-4 h-4 fill-neutral-800" />
            {t('grid')}
          </button>
          <button
            onClick={() => viewChange('list')}
            className="p-1 sm:py-2 sm:px-3 rounded-full text-xs bg-neutral-200/50 hover:bg-neutral-300/50 text-neutral-800 transition flex items-center gap-1"
          >
            <ListBulletIcon className="w-4 h-4 fill-neutral-800" />
            {t('list')}
          </button>
        </div>
        <div className="p-4 border-b flex gap-2 flex-wrap">
          <div className="w-full text-sm italic">{t('resultAmount')}</div>
          <select
            className="rounded p-2 text-sm border bg-neutral-100 pr-6"
            onChange={e => limitChange(parseInt(e.target.value))}
            value={limit}
          >
            <option value="10">10</option>
            <option value="25">25</option>
            <option value="50">50</option>
            <option value="100">100</option>
          </select>
        </div>
        <div className="p-4 border-b flex gap-2 flex-col text-sm">
          <div className="w-full italic">{t('images')}</div>
          <div className="w-full">
            <input
              className="mr-2"
              type="radio"
              id="hide"
              name="img"
              value={ImageVisibility.Hide}
              onChange={() => imageVisibilityChange(ImageVisibility.Hide)}
              checked={imageVisibility === ImageVisibility.Hide}
            />
            <label htmlFor="hide">{t('hideImages')}</label>
          </div>
          {view === 'grid' && (
            <>
              <div className="w-full">
                <input
                  className="mr-2"
                  type="radio"
                  id="small"
                  name="img"
                  value={ImageVisibility.Small}
                  onChange={() => imageVisibilityChange(ImageVisibility.Small)}
                  checked={imageVisibility === ImageVisibility.Small}
                />
                <label htmlFor="small">{t('showSmallerImages')}</label>
              </div>
              <div className="w-full">
                <input
                  className="mr-2"
                  type="radio"
                  id="large"
                  name="img"
                  value={ImageVisibility.Large}
                  onChange={() => imageVisibilityChange(ImageVisibility.Large)}
                  checked={imageVisibility === ImageVisibility.Large}
                />
                <label htmlFor="large">{t('showLargerImages')}</label>
              </div>
            </>
          )}
          {view === 'list' && (
            <div className="w-full">
              <input
                className="mr-2"
                type="radio"
                id="showImages"
                name="img"
                value={ImageVisibility.Small}
                onChange={() => imageVisibilityChange('large')}
                checked={
                  imageVisibility === ImageVisibility.Small ||
                  imageVisibility === ImageVisibility.Large
                }
              />
              <label htmlFor="showImages">{t('showImages')}</label>
            </div>
          )}
        </div>
      </div>
    </PopoverMenu>
  );
}
