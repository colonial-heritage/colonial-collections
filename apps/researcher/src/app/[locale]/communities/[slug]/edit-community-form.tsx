'use client';

import {useForm, SubmitHandler} from 'react-hook-form';
import {useTranslations} from 'next-intl';
import {useSlideOut, useNotifications} from '@colonial-collections/ui';
import {z} from 'zod';
import {zodResolver} from '@hookform/resolvers/zod';
import {updateCommunityAndRevalidate} from './actions';
import {camelCase} from 'tiny-case';
import {useCommunityProfile} from '@/lib/community/hooks';
import {LocalizedMarkdown} from '@colonial-collections/ui';

interface Props {
  communityId: string;
  slideOutId: string;
  name: string;
  slug: string;
  description?: string;
  attributionId?: string;
  license?: string;
  licenseToAccept: string;
}

interface FormValues {
  name: string;
  description: string;
  attributionId: string;
  licenseChecked: boolean;
}

const communitySchema = z.object({
  name: z.string().trim().min(1).max(250),
  description: z.string().max(2000),
  attributionId: z.string().url().optional().or(z.literal('')),
  licenseChecked: z.boolean(),
});

export default function EditCommunityForm({
  slideOutId,
  communityId,
  name,
  slug,
  description,
  attributionId,
  license,
  licenseToAccept,
}: Props) {
  const {
    register,
    handleSubmit,
    setError,
    formState: {errors, isSubmitting},
  } = useForm({
    resolver: zodResolver(communitySchema),
    defaultValues: {
      name,
      description: description ?? '',
      attributionId: attributionId ?? '',
      licenseChecked: license === licenseToAccept,
    },
  });

  const t = useTranslations('Community');
  const {setIsVisible} = useSlideOut();
  const {addNotification} = useNotifications();
  const {openProfile} = useCommunityProfile({communitySlug: slug, communityId});

  const openSettings = () => {
    openProfile('settings');
  };

  const onSubmit: SubmitHandler<FormValues> = async formValues => {
    try {
      await updateCommunityAndRevalidate({
        id: communityId,
        slug,
        license: formValues.licenseChecked ? licenseToAccept : undefined,
        ...formValues,
      });
      addNotification({
        id: 'add-object-list-success',
        message: <>{t('communityUpdated')}</>,
        type: 'success',
      });
      setIsVisible(slideOutId, false);
    } catch (err) {
      setError('root.serverError', {
        message: t('communityEditServerError'),
      });
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex-col px-4 gap-6 items-center flex"
    >
      <h1 className="text-2xl font-normal w-full text-center mt-4 px-4 my-2">
        {t('editCommunityTitle')}
      </h1>
      {errors.root?.serverError.message && (
        <div className="rounded-md bg-red-50 p-4 mt-3">
          <div className="ml-3">
            <h3 className="text-sm leading-5 font-medium text-red-800">
              {errors.root.serverError.message}
            </h3>
          </div>
        </div>
      )}

      <div className="flex flex-col gap-1 max-w-2xl w-full">
        <label className="flex flex-col gap-1 mb-1">
          <strong>
            {t('labelName')}
            <span className="font-normal text-neutral-600"> *</span>
          </strong>
        </label>
        <input
          id="name"
          {...register('name')}
          className="border border-neutral-500 rounded p-2 text-sm"
        />
        <p>{errors.name && t(camelCase(`name_${errors.name.type}`))}</p>
      </div>

      <div className="flex flex-col gap-1 max-w-2xl w-full">
        <label className="flex flex-col gap-1 mb-1">
          <strong>
            {t('labelDescription')}
            <span className="font-normal text-neutral-600"> *</span>
          </strong>
        </label>
        <textarea
          id="description"
          {...register('description')}
          rows={4}
          className="border border-neutral-500 rounded p-2 text-sm h-56"
        />
        <p>
          {errors.description &&
            t(camelCase(`description_${errors.description.type}`))}
        </p>
      </div>

      <div className="flex flex-col gap-1 max-w-2xl w-full">
        <label className="flex flex-col gap-1 mb-1">
          <strong>
            {t('labelAttributionId')}
            <span className="font-normal text-neutral-600"> *</span>
          </strong>
          <div className="text-sm mb-1 whitespace-pre-line">
            {t.rich('descriptionAttributionId', {
              link: text => (
                <a href="https://orcid.org" target="_blank" rel="noreferrer">
                  {text}
                </a>
              ),
            })}
          </div>
        </label>
        <input
          id="attributionId"
          {...register('attributionId')}
          className="border border-neutral-500 rounded p-2 text-sm"
        />
        <p>
          {errors.attributionId &&
            t(camelCase(`attributionId_${errors.attributionId.type}`))}
        </p>

        <div className="mt-4">
          <div className="flex justify-start gap-2 items-center">
            <input
              type="checkbox"
              id="license"
              {...register('licenseChecked')}
            />
            <label className="flex flex-col gap-1 mb-1" htmlFor="license">
              {t.rich('labelLicense', {
                link: text => (
                  <a href={t('licenseLink')} target="_blank" rel="noreferrer">
                    {text}
                  </a>
                ),
              })}
            </label>
          </div>
          <div className="text-sm mb-1">
            <LocalizedMarkdown
              name="license"
              contentPath="@/messages"
              textSize="small"
            />
          </div>
        </div>
        <p>{errors.licenseChecked?.message}</p>
      </div>

      <div className="flex flex-row max-w-2xl w-full">
        <div className=" flex flex-col md:flex-row justify-between  gap-2">
          <button
            className="p-1 sm:py-2 sm:px-3 rounded-full text-xs bg-neutral-200 hover:bg-neutral-300 text-neutral-800 transition flex items-center gap-1"
            disabled={isSubmitting}
            type="submit"
          >
            {t('editCommunitySaveButton')}
          </button>
          <button
            type="button"
            className="p-1 sm:py-2 sm:px-3 rounded-full text-xs bg-none hover:bg-neutral-300 text-neutral-800 transition flex items-center gap-1 border border-neutral-300"
            onClick={() => setIsVisible(slideOutId, false)}
          >
            {t('editCommunityCancelButton')}
          </button>
        </div>
        <div className="flex justify-end w-full">
          <button
            type="button"
            onClick={openSettings}
            className="p-1 sm:py-2 sm:px-3 rounded-full text-xs bg-neutral-200 hover:bg-neutral-300 text-neutral-800 transition flex items-center gap-1"
          >
            {t('settingsButton')}
          </button>
        </div>
      </div>
    </form>
  );
}
