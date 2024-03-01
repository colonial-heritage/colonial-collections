'use client';

import {XMarkIcon} from '@heroicons/react/24/outline';
import {deleteObjectFromList, deleteList} from './actions';
import {usePathname} from '@/navigation';
import {useTranslations} from 'next-intl';
import {Modal, ModalButton, ModalHeader} from '@colonial-collections/ui/modal';
import {useRouter} from '@/navigation';
import {useNotifications} from '@colonial-collections/ui';

interface DeleteObjectButtonProps {
  id: number;
}

export function DeleteObjectButton({id}: DeleteObjectButtonProps) {
  const t = useTranslations('ObjectList');
  const {addNotification} = useNotifications();

  const pathName = usePathname();
  async function deleteObjectFromListClick() {
    try {
      await deleteObjectFromList({id, revalidatePathName: pathName});
      addNotification({
        id: 'deleteObjectSuccess',
        message: t('deleteObjectSuccess'),
        type: 'success',
      });
    } catch (err) {
      addNotification({
        id: 'deleteObjectError',
        message: t('deleteObjectError'),
        type: 'error',
      });
      console.error(err);
    }
  }

  return (
    <button
      onClick={deleteObjectFromListClick}
      className="p-1 sm:py-2 sm:px-3 rounded-full text-xs bg-neutral-200/50 hover:bg-neutral-300/50 text-neutral-800 transition flex items-center gap-1 whitespace-nowrap"
    >
      <XMarkIcon className="w-5 h-5 fill-neutral-500" />
      {t.rich('deleteObjectButton', {
        longText: text => <span className="hidden md:inline">{text}</span>,
      })}
    </button>
  );
}

interface DeleteListButtonProps {
  id: number;
  communitySlug: string;
}

export function DeleteListButton({id, communitySlug}: DeleteListButtonProps) {
  const t = useTranslations('ObjectList');
  const router = useRouter();
  const {addNotification} = useNotifications();

  async function deleteListClick() {
    try {
      await deleteList({
        id,
        revalidatePathName: `/communities/${communitySlug}`,
      });
      router.push(`/communities/${communitySlug}`);
    } catch (err) {
      addNotification({
        id: 'deleteListError',
        message: t('deleteListError'),
        type: 'success',
      });
      console.error(err);
    }
  }

  return (
    <>
      <ModalButton
        id="delete-list-modal"
        className="p-1 sm:py-2 sm:px-3 rounded-full text-xs transition flex items-center gap-1 bg-red-700 hover:bg-red-800 text-white whitespace-break-spaces"
      >
        {t('deleteListButton')}
      </ModalButton>
      <Modal id="delete-list-modal" variant="small">
        <ModalHeader title={t('deleteQuestion')} />
        <div className="w-full flex mt-6 gap-2">
          <button
            onClick={deleteListClick}
            className="p-1 sm:py-2 sm:px-3 rounded-full text-xs bg-red-700 hover:bg-red-800 text-white transition flex items-center gap-1"
          >
            {t('confirmDeleteButton')}
          </button>
          <ModalButton
            id="delete-list-modal"
            className="p-1 sm:py-2 sm:px-3 rounded-full text-xs bg-none hover:bg-neutral-300 text-neutral-800 border border-neutral-300 transition flex items-center gap-1"
          >
            {t('cancelButton')}
          </ModalButton>
        </div>
      </Modal>
    </>
  );
}
