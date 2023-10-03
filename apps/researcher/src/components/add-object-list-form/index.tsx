'use client';

import {useAuth} from '@clerk/nextjs';
import {addList} from './actions';
import {useForm, SubmitHandler} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import {insertObjectListSchema} from '@colonial-collections/database/src/db/schema';
import {useTranslations} from 'next-intl';
import {useSlideOut, useNotifications} from 'ui';
import {camelCase} from 'tiny-case';

interface FormProps {
  communityId: string;
  userId: string;
  slideOutId: string;
}

interface FormValues {
  name: string;
  description: string;
  createdBy: string;
  communityId: string;
}

function Form({communityId, userId, slideOutId}: FormProps) {
  const {
    register,
    handleSubmit,
    setError,
    formState: {errors, isSubmitting},
  } = useForm({
    resolver: zodResolver(insertObjectListSchema),
    defaultValues: {
      name: '',
      description: '',
      createdBy: userId,
      communityId,
    },
  });

  const t = useTranslations('AddObjectListForm');
  const {setIsVisible} = useSlideOut();
  const {addNotification} = useNotifications();

  const onSubmit: SubmitHandler<FormValues> = async listItem => {
    try {
      await addList(listItem);
      addNotification({
        id: 'add-object-list-success',
        message: t.rich('listSuccessfullyAdded', {
          name: () => <em>{listItem.name}</em>,
        }),
        type: 'success',
      });
      setIsVisible(slideOutId, false);
    } catch (error) {
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
        <div className="flex flex-col w-full lg:w-2/3">
          <label className="block text-sm font-medium leading-6 text-gray-900">
            <strong>{t('labelName')}</strong>
          </label>
          <input
            {...register('name')}
            className="border border-greenGrey-200 rounded p-2"
          />
          <p>{errors.name && t(camelCase(`name_${errors.name.type}`))}</p>
        </div>
        <div className="flex flex-col w-full lg:w-1/3"></div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex flex-col w-full lg:w-2/3">
          <label className="flex flex-col text-sm">
            <strong>{t('labelDescription')}</strong>
          </label>
          {t('labelDescriptionSubTitle')}
          <textarea
            id="description"
            {...register('description')}
            rows={4}
            className="border border-greenGrey-200 rounded p-2"
          />
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-4">
        <div className="w-full lg:w-2/3 flex gap-2">
          <button
            disabled={isSubmitting}
            type="submit"
            className="p-1 sm:py-2 sm:px-3 rounded-full text-xs bg-greenGrey-100 hover:bg-greenGrey-200 transition text-greenGrey-800 flex items-center gap-1"
          >
            {t('buttonSubmit')}
          </button>
          <button
            onClick={() => setIsVisible(slideOutId, false)}
            className="p-1 sm:py-2 sm:px-3 rounded-full text-xs border border-greenGrey-300 hover:bg-greenGrey-200 transition text-greenGrey-800 flex items-center gap-1"
          >
            {t('buttonCancel')}
          </button>
        </div>
      </div>
    </form>
  );
}

interface AddObjectListFormProps {
  communityId: string;
  slideOutId: string;
}

export default function AddObjectListForm({
  communityId,
  slideOutId,
}: AddObjectListFormProps) {
  const {userId} = useAuth();
  const t = useTranslations('AddObjectListForm');

  // Wait for userId to be available.
  // In most cases, this will be available immediately
  // so no loading state is needed
  return (
    <div className="w-full bg-greenGrey-50 border border-greenGrey-100 p-4 rounded-xl text-greenGrey-800 self-end flex-col gap-6 flex">
      <h2 className="font-semibold text-xl">{t('title')}</h2>
      {userId && (
        <Form
          slideOutId={slideOutId}
          communityId={communityId}
          userId={userId}
        />
      )}
    </div>
  );
}
