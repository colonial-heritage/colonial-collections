'use client';

import {useForm, SubmitHandler} from 'react-hook-form';
import {useTranslations} from 'next-intl';
import {useSlideOut, useNotifications} from '@colonial-collections/ui';
import {z} from 'zod';
import {zodResolver} from '@hookform/resolvers/zod';
import {updateCommunityAndRevalidate} from './actions';
import {camelCase} from 'tiny-case';
import {useRouter} from 'next-intl/client';

interface Props {
  communityId: string;
  slideOutId: string;
  name: string;
  slug: string;
  description?: string;
  attributionId?: string;
}

interface FormValues {
  name: string;
  slug: string;
  description: string;
  attributionId: string;
}

const communitySchema = z.object({
  name: z.string().trim().min(1).max(250),
  slug: z
    .string()
    .trim()
    .min(1)
    .max(250)
    .regex(/^[a-z0-9-]*$/),
  description: z.string().max(2000),
  attributionId: z.string().url().optional().or(z.literal('')),
});

export default function EditCommunityForm({
  slideOutId,
  communityId,
  name,
  slug,
  description,
  attributionId,
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
      slug,
      description: description ?? '',
      attributionId: attributionId ?? '',
    },
  });

  const t = useTranslations('Community');
  const {setIsVisible} = useSlideOut();
  const {addNotification} = useNotifications();
  const router = useRouter();

  const onSubmit: SubmitHandler<FormValues> = async formValues => {
    try {
      const newCommunity = await updateCommunityAndRevalidate({
        id: communityId,
        ...formValues,
      });
      router.push(`/communities/${newCommunity.slug}`, {scroll: false});
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
      className="flex-col px-4 gap-4 items-center flex"
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

      <div className="flex flex-col max-w-2xl w-full">
        <label className="italic">{t('labelName')}</label>
        <input
          id="name"
          {...register('name')}
          className="border border-neutral-300 p-2 text-sm"
        />
        <p>{errors.name && t(camelCase(`name_${errors.name.type}`))}</p>
      </div>

      <div className="flex flex-col max-w-2xl w-full">
        <label className="italic">{t('labelSlug')}</label>
        <input
          id="slug"
          {...register('slug')}
          className="border border-neutral-300 p-2 text-sm"
        />
        <p>{errors.slug && t(camelCase(`slug_${errors.slug.type}`))}</p>
      </div>

      <div className="flex flex-col max-w-2xl w-full">
        <label className="italic">{t('labelDescription')}</label>
        <textarea
          id="description"
          {...register('description')}
          rows={4}
          className="border border-neutral-300 p-2 text-sm h-56"
        />
        <p>
          {errors.description &&
            t(camelCase(`description_${errors.description.type}`))}
        </p>
      </div>

      <div className="flex flex-col max-w-2xl w-full">
        <label className="italic">{t('labelAttributionId')}</label>
        <input
          id="attributionId"
          {...register('attributionId')}
          className="border border-neutral-300 p-2 text-sm"
        />
        <p>
          {errors.attributionId &&
            t(camelCase(`attributionId_${errors.attributionId.type}`))}
        </p>
      </div>

      <div className="flex flex-row max-w-2xl w-full gap-2">
        <button
          disabled={isSubmitting}
          type="submit"
          className="p-1 sm:py-2 sm:px-3 rounded-full text-xs bg-neutral-200 hover:bg-neutral-300
text-neutral-800 transition flex items-center gap-1"
        >
          {t('editCommunitySaveButton')}
        </button>
        <button
          className="p-1 sm:py-2 sm:px-3 rounded-full text-xs bg-neutral-200 hover:bg-neutral-300
text-neutral-800 transition flex items-center gap-1"
          onClick={() => setIsVisible(slideOutId, false)}
        >
          {t('editCommunityCancelButton')}
        </button>
      </div>
    </form>
  );
}
