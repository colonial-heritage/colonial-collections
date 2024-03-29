'use client';

import {useTranslations} from 'next-intl';
import ObjectListForm from './form';
import {updateList} from './actions';
import {ObjectList} from '@colonial-collections/database';
import {useSlideOut} from '@colonial-collections/ui';

interface ObjectListFormProps {
  communityId: string;
  slideOutId: string;
  list: ObjectList;
}

export default function EditObjectListForm({
  communityId,
  slideOutId,
  list,
}: ObjectListFormProps) {
  const t = useTranslations('ObjectListForm');
  const {setIsVisible} = useSlideOut();

  return (
    <div className="flex flex-col px-4 gap-6 items-start bg-neutral-50 rounded-xl p-4 border border-neutral-300 text-neutral-800 max-w-3xl">
      <h2 className="font-semibold text-xl">{t('editTitle')}</h2>
      <ObjectListForm
        {...{
          ...list,
          listId: list.id,
          communityId,
          closeAction() {
            setIsVisible(slideOutId, false);
          },
          saveButtonMessageKey: 'buttonEditList',
          successfulSaveMessageKey: 'listSuccessfullyEdited',
          saveAction: updateList,
        }}
      />
    </div>
  );
}
