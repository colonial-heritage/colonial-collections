import {useTranslations} from 'next-intl';
import ObjectListForm from './form';
import {addList} from './actions';

interface ObjectListFormProps {
  communityId: string;
  slideOutId: string;
}

export default function CreateObjectListForm({
  communityId,
  slideOutId,
}: ObjectListFormProps) {
  const t = useTranslations('ObjectListForm');

  return (
    <div className="w-full bg-neutral-50 rounded-xl p-4 border border-neutral-100 text-neutral-800 self-end flex-col gap-6 flex">
      <h2 className="font-semibold text-xl">{t('createTitle')}</h2>
      <ObjectListForm
        {...{
          communityId,
          slideOutId,
          saveButtonMessageKey: 'buttonCreateList',
          successfulSaveMessageKey: 'listSuccessfullyAdded',
          saveAction: addList,
          description: null,
          name: null,
        }}
      />
    </div>
  );
}
