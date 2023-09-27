'use client';

import {useForm, SubmitHandler} from 'react-hook-form';
import {useTranslations} from 'next-intl';
import {useSlideOut, useNotifications} from 'ui';
import {editDescriptionAction} from './actions';

interface Props {
  communityId: string;
  communitySlug: string;
  slideOutId: string;
  description?: string;
}

interface FormValues {
  description: string;
  communityId: string;
  communitySlug: string;
}

export default function EditDescriptionForm({
  slideOutId,
  communityId,
  communitySlug,
  description,
}: Props) {
  const {
    register,
    handleSubmit,
    setError,
    formState: {errors, isSubmitting},
  } = useForm({
    defaultValues: {
      description: description ?? '',
      communityId,
      communitySlug,
    },
  });

  const t = useTranslations('Community');
  const {setIsVisible} = useSlideOut();
  const {addNotification} = useNotifications();

  const onSubmit: SubmitHandler<FormValues> = async descriptionFormValues => {
    try {
      await editDescriptionAction(descriptionFormValues);
      addNotification({
        id: 'add-object-list-success',
        message: <>{t('descriptionSuccessfullyEdited')}</>,
        type: 'success',
      });
      setIsVisible(slideOutId, false);
    } catch (err) {
      setError('root.serverError', {
        message: t('serverError'),
      });
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex-col gap-6 flex w-full max-w-3xl"
    >
      {errors.root?.serverError.message && (
        <div className="rounded-md bg-red-50 p-4 mt-3">
          <div className="ml-3">
            <h3 className="text-sm leading-5 font-medium text-red-800">
              {errors.root.serverError.message}
            </h3>
          </div>
        </div>
      )}
      <div className="flex flex-col sm:flex-row gap-4 ">
        <div className="flex flex-col w-full">
          <label className="flex flex-col text-sm">
            <strong>{t('labelDescription')}</strong>
          </label>
          <textarea
            id="description"
            {...register('description', {
              maxLength: 2000,
            })}
            rows={4}
            className="border border-greenGrey-200 rounded p-2 w-full"
          />
          <p>
            {errors.description && t(`description_${errors.description.type}`)}
          </p>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-4">
        <div className="w-full lg:w-2/3 flex gap-2">
          <button
            disabled={isSubmitting}
            type="submit"
            className="p-1 sm:py-2 sm:px-3 rounded-full text-xs bg-greenGrey-100 hover:bg-greenGrey-200 transition text-greenGrey-800 flex items-center gap-1"
          >
            {t('changeDescriptionSaveButton')}
          </button>
          <button
            onClick={() => setIsVisible(slideOutId, false)}
            className="p-1 sm:py-2 sm:px-3 rounded-full text-xs border border-greenGrey-300 hover:bg-greenGrey-200 transition text-greenGrey-800 flex items-center gap-1"
          >
            {t('changeDescriptionCancelButton')}
          </button>
        </div>
      </div>
    </form>
  );
}
