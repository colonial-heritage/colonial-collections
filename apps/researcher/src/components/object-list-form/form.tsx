'use client';

import {useAuth} from '@clerk/nextjs';
import {useForm, SubmitHandler} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import {insertObjectListSchema} from '@colonial-collections/database/client';
import {useTranslations} from 'next-intl';
import {useNotifications} from '@colonial-collections/ui';
import {camelCase} from 'tiny-case';
import {usePathname} from '@/navigation';
import {ActionProps} from './actions';

interface FormProps {
  communityId: string;
  userId: string;
  listId?: number;
  name: string | null;
  description: string | null;
  closeAction: () => void;
  saveButtonMessageKey: string;
  successfulSaveMessageKey: string;
  saveAction: (props: ActionProps) => Promise<void>;
}

interface FormValues {
  name: string;
  description: string;
  createdBy: string;
  communityId: string;
}

function Form({
  communityId,
  userId,
  closeAction,
  saveButtonMessageKey,
  successfulSaveMessageKey,
  listId,
  name,
  description,
  saveAction,
}: FormProps) {
  const {
    register,
    handleSubmit,
    setError,
    formState: {errors, isSubmitting},
  } = useForm({
    resolver: zodResolver(insertObjectListSchema),
    defaultValues: {
      name: name || '',
      description: description || '',
      createdBy: userId,
      communityId,
    },
  });

  const t = useTranslations('ObjectListForm');
  const {addNotification} = useNotifications();
  const pathName = usePathname();

  const onSubmit: SubmitHandler<FormValues> = async list => {
    try {
      await saveAction({list, pathName, id: listId});
      addNotification({
        id: 'add-object-list-success',
        message: t.rich(successfulSaveMessageKey, {
          name: () => <em>{list.name}</em>,
        }),
        type: 'success',
      });
      closeAction();
    } catch (err) {
      setError('root.serverError', {
        message: t('serverError'),
      });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex-col gap-6 flex">
      {errors.root?.serverError.message && (
        <div className="rounded-md bg-red-50 p-4 mt-3">
          <div className="ml-3">
            <h3 className="text-sm leading-5 font-medium text-red-800">
              {errors.root.serverError.message}
            </h3>
          </div>
        </div>
      )}
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="flex flex-col w-full">
          <label
            htmlFor="name"
            className="block text-sm font-medium leading-6 text-gray-900"
          >
            <strong>{t('labelName')}</strong>
          </label>
          <input
            id="name"
            {...register('name')}
            className="border border-neutral-400 rounded p-2 text-sm"
          />
          <p>{errors.name && t(camelCase(`name_${errors.name.type}`))}</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex flex-col w-full">
          <label htmlFor="description" className="flex flex-col text-sm">
            <strong>{t('labelDescription')}</strong>
          </label>
          {t('labelDescriptionSubTitle')}
          <textarea
            id="description"
            {...register('description')}
            rows={4}
            className="border border-neutral-400 rounded p-2 text-sm"
          />
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-4">
        <div className="w-full flex gap-2">
          <button
            data-testid="save-button"
            disabled={isSubmitting}
            type="submit"
            className="p-1 sm:py-2 sm:px-3 rounded-full text-xs bg-consortium-green-300 text-consortium-blue-800 hover:bg-consortium-green-200 transition flex items-center gap-1"
          >
            {t(saveButtonMessageKey)}
          </button>
          <button
            onClick={() => closeAction()}
            className="p-1 sm:py-2 sm:px-3 rounded-full text-xs bg-none hover:bg-neutral-300 text-neutral-800 border border-neutral-300 transition flex items-center gap-1"
          >
            {t('buttonCancel')}
          </button>
        </div>
      </div>
    </form>
  );
}

export default function ObjectListForm(formProps: Omit<FormProps, 'userId'>) {
  const {userId} = useAuth();
  // Wait for userId to be available.
  // In most cases, this will be available immediately
  // so no loading state is needed
  return <>{userId && <Form {...formProps} userId={userId} />}</>;
}
