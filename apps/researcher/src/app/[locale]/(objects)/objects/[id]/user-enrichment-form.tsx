'use client';

import {
  useSlideOut,
  useNotifications,
  SlideOutButton,
} from '@colonial-collections/ui';
import {useForm, SubmitHandler} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import {useLocale, useTranslations} from 'next-intl';
import {z} from 'zod';
import {addUserEnrichment} from './actions';
import {useUserCommunities} from '@/lib/community/hooks';
import {camelCase} from 'tiny-case';
import {Community} from '@/lib/community/definitions';
import {XMarkIcon} from '@heroicons/react/24/outline';
import LanguageSelector from '@/components/language-selector';
import type {AdditionalType} from '@colonial-collections/enricher';

interface FormValues {
  description: string;
  attributionId: string;
  citation: string;
  inLanguage?: string;
}

interface Props {
  slideOutId: string;
  enrichmentType: AdditionalType;
  objectId: string;
}

const userEnricherSchema = z.object({
  description: z.string().trim().min(1),
  attributionId: z.string().trim().min(1),
  citation: z.string().trim().min(1),
  inLanguage: z.string().optional(),
});

function Form({
  slideOutId,
  enrichmentType,
  objectId,
  communities,
}: Props & {communities: Community[]}) {
  const locale = useLocale();
  const {
    register,
    handleSubmit,
    setError,
    formState: {errors, isSubmitting},
    setValue,
    watch,
  } = useForm({
    resolver: zodResolver(userEnricherSchema),
    defaultValues: {
      description: '',
      attributionId: communities[0].attributionId || '',
      citation: '',
      inLanguage: locale,
    },
  });

  const t = useTranslations('UserEnrichmentForm');
  const {setIsVisible} = useSlideOut();
  const {addNotification} = useNotifications();

  const onSubmit: SubmitHandler<FormValues> = async userEnrichment => {
    try {
      const community = communities.find(
        community => community.attributionId === userEnrichment.attributionId
      );
      await addUserEnrichment({
        ...userEnrichment,
        additionalType: enrichmentType,
        objectId,
        community: {
          name: community!.name,
          id: community!.attributionId!,
        },
      });
      addNotification({
        id: 'add-user-enrichment-success',
        message: t.rich('successfullyAdded'),
        type: 'success',
      });
      setIsVisible(slideOutId, false);
    } catch (err) {
      console.error(err);
      setError('root.serverError', {
        message: t('serverError'),
      });
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="w-full bg-neutral-50 rounded-xl p-4 border border-neutral-100 text-neutral-800 self-end flex-col gap-6 flex"
    >
      <div className="flex justify-between items-center border-b -mx-4 px-4 pb-2 mb-2">
        <h3>{t('title')}</h3>
        <SlideOutButton
          className="p-1 sm:py-2 sm:px-3 rounded-full text-xs bg-neutral-200/50 hover:bg-neutral-300/50 text-neutral-800 transition flex items-center gap-1"
          id={slideOutId}
        >
          <XMarkIcon className='className="w-4 h-4 stroke-neutral-900' />
        </SlideOutButton>
      </div>
      <div className="flex flex-col lg:flex-row gap-4">
        {errors.root?.serverError.message && (
          <div className="rounded-md bg-red-50 p-4 mt-3">
            <div className="ml-3">
              <h3 className="text-sm leading-5 font-medium text-red-800">
                {errors.root.serverError.message}
              </h3>
            </div>
          </div>
        )}
      </div>

      <div className="flex flex-col lg:flex-row gap-4">
        <div className='className="flex flex-col w-full lg:w-2/3'>
          <label htmlFor="description" className="flex flex-col gap-1 mb-1">
            <strong>
              {t('description')}
              <span className="font-normal text-neutral-600">*</span>
            </strong>
            <div>{t('descriptionSubTitle')}</div>
          </label>
          <textarea
            {...register('description')}
            rows={4}
            className="border border-neutral-400 rounded p-2 text-sm w-full"
          />
          <p>
            {errors.description &&
              t(camelCase(`description_${errors.description.type}`))}
          </p>
        </div>
        <div className="flex flex-col w-full lg:w-1/3 gap-4">
          <label htmlFor="attributionId" className="flex flex-col">
            <strong>
              {t('community')}
              <span className="font-normal text-neutral-600">*</span>
            </strong>
            <div>{t('communitySubTitle')}</div>
          </label>
          <select
            {...register('attributionId')}
            className="p-2 rounded border border-greenGrey-200 bg-white"
          >
            {communities.map(community => (
              <option key={community.id} value={community.attributionId!}>
                {community.name}
              </option>
            ))}
          </select>
          <p>
            {errors.attributionId &&
              t(camelCase(`attributionId_${errors.attributionId.type}`))}
          </p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex flex-col w-full lg:w-2/3">
          <label htmlFor="citation" className="flex flex-col gap-1 mb-1">
            <strong>
              {t('citation')}
              <span className="font-normal text-neutral-600">*</span>
            </strong>
            <div>{t('citationSubTitle')}</div>
          </label>
          <textarea
            {...register('citation')}
            cols={30}
            rows={2}
            className="border border-greenGrey-200 rounded p-2"
          />
          <p>
            {errors.citation &&
              t(camelCase(`citation_${errors.citation.type}`))}
          </p>
        </div>
        <div className="flex flex-col w-full lg:w-1/3">
          <div className="flex flex-col gap-1 mb-1">
            <label>
              <strong>{t('inLanguage')}</strong>
              <div>{t('languageSubTitle')}</div>
            </label>
            <LanguageSelector
              value={watch('inLanguage')}
              setValue={inLanguage => setValue('inLanguage', inLanguage)}
            />
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-4">
        <div className="w-full lg:w-2/3 flex gap-2">
          {isSubmitting ? (
            <p className="text-xs p-1 sm:py-2 sm:px-3 text-neutral-800">
              {t('saving')}
            </p>
          ) : (
            <button
              type="submit"
              className="p-1 sm:py-2 sm:px-3 rounded-full text-xs bg-neutral-200/50 hover:bg-neutral-300/50 text-neutral-800 transition flex items-center gap-1"
            >
              {t('buttonSubmit')}
            </button>
          )}
          <button
            onClick={() => setIsVisible(slideOutId, false)}
            className="p-1 sm:py-2 sm:px-3 rounded-full text-xs bg-none hover:bg-neutral-300 text-neutral-800 transition flex items-center gap-1 border border-neutral-300"
          >
            {t('buttonCancel')}
          </button>
        </div>
      </div>
    </form>
  );
}

export function UserEnrichmentForm({
  slideOutId,
  enrichmentType,
  objectId,
}: Props) {
  const t = useTranslations('UserEnrichmentForm');
  const {communities, isLoaded} = useUserCommunities({canAddEnrichments: true});

  if (!isLoaded) {
    return null;
  }

  if (isLoaded && !communities.length) {
    return <p>{t('noCommunities')}</p>;
  }

  return (
    <Form
      slideOutId={slideOutId}
      enrichmentType={enrichmentType}
      objectId={objectId}
      communities={communities}
    />
  );
}
