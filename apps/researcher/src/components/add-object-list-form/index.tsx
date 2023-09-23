'use client';

import {useAuth} from '@clerk/nextjs';
import {addList} from './actions';
import {useForm, SubmitHandler} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import {insertObjectListSchema} from '@colonial-collections/database/src/db/schema';
import {useTranslations} from 'next-intl';

interface FormProps {
  communityId: string;
  userId: string;
}

interface FormValues {
  name: string;
  description: string;
  createdBy: string;
  communityId: string;
}

function Form({communityId, userId}: FormProps) {
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

  console.log(errors.name);

  const onSubmit: SubmitHandler<FormValues> = async data => {
    const response = await addList(data);

    if (response.statusCode > 200) {
      setError('root.serverError', {
        message: t('serverError'),
      });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="space-y-12">
        <div className="border-b border-gray-900/10 pb-12">
          <h2 className="text-base font-semibold leading-7 text-gray-900">
            {t('title')}
          </h2>
        </div>
      </div>
      {errors.root?.serverError.message && (
        <div className="rounded-md bg-red-50 p-4 mt-3">
          <div className="ml-3">
            <h3 className="text-sm leading-5 font-medium text-red-800">
              {errors.root.serverError.message}
            </h3>
          </div>
        </div>
      )}
      <div className="mt-5 space-y-8">
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium leading-6 text-gray-900"
          >
            {t('labelName')}
          </label>
          <div className="mt-2">
            <input
              {...register('name')}
              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            />
            <p>{errors.name && t(`name${errors.name.type}`)}</p>
          </div>
        </div>

        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium leading-6 text-gray-900"
          >
            {t('labelDescription')}
          </label>
          <div className="mt-2">
            <textarea
              id="description"
              {...register('description')}
              rows={3}
              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            />
          </div>
        </div>
      </div>

      <button
        disabled={isSubmitting}
        type="submit"
        className="mt-8 rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
      >
        {t('buttonSave')}
      </button>
    </form>
  );
}

interface AddObjectListFormProps {
  communityId: string;
}
export default function AddObjectListForm({
  communityId,
}: AddObjectListFormProps) {
  const {userId} = useAuth();

  // Wait for userId to be available
  // in most cases, this will be available immediately
  // so no loading state is needed
  if (!userId) {
    return null;
  }

  return <Form communityId={communityId} userId={userId} />;
}
