'use client';

import {useSlideOut, useNotifications} from '@colonial-collections/ui';
import {useForm, SubmitHandler} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import {useTranslations} from 'next-intl';
import {z} from 'zod';
import {addUserEnrichment} from './actions';
import {useUserCommunities} from '@/lib/community/hooks';
import {camelCase} from 'tiny-case';
import {Community} from '@/lib/community/definitions';

interface FormValues {
  description: string;
  attributionId: string;
  citation: string;
}

interface Props {
  slideOutId: string;
  identifier: string;
  objectId: string;
}

const userEnricherSchema = z.object({
  description: z.string().trim().min(1),
  attributionId: z.string().trim().min(1),
  citation: z.string().trim().min(1),
});

function Form({
  slideOutId,
  identifier,
  objectId,
  communities,
}: Props & {communities: Community[]}) {
  const {
    register,
    handleSubmit,
    setError,
    formState: {errors, isSubmitting},
  } = useForm({
    resolver: zodResolver(userEnricherSchema),
    defaultValues: {
      description: '',
      attributionId: communities[0].attributionId || '',
      citation: '',
    },
  });

  const t = useTranslations('UserEnricherForm');
  const {setIsVisible} = useSlideOut();
  const {addNotification} = useNotifications();

  const onSubmit: SubmitHandler<FormValues> = async userEnrichment => {
    try {
      await addUserEnrichment({...userEnrichment, about: identifier, objectId});
      addNotification({
        id: 'add-user-enrichment-success',
        message: t.rich('successfullyAdded'),
        type: 'success',
      });
      setIsVisible(slideOutId, false);
    } catch (err) {
      console.log(err);
      setError('root.serverError', {
        message: t('serverError'),
      });
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="w-full lg:w-4/5 bg-greenGrey-50 border border-greenGrey-100 p-4 rounded-xl text-greenGrey-800 self-end flex-col gap-6 flex"
    >
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
        <div className="flex flex-col w-full lg:w-2/3">
          <label htmlFor="nar" className="flex flex-col">
            <strong>{t('description')}</strong>
            {t('descriptionSubTitle')}
          </label>
          <textarea
            {...register('description')}
            cols={30}
            rows={4}
            className="border border-greenGrey-200 rounded p-2"
          />
          <p>
            {errors.description &&
              t(camelCase(`description_${errors.description.type}`))}
          </p>
        </div>
        <div className="flex flex-col w-full lg:w-1/3">
          <label htmlFor="nar" className="flex flex-col">
            <strong>{t('community')}</strong>
            {t('communitySubTitle')}
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
          <label htmlFor="nar" className="flex flex-col">
            <strong>{t('citation')}</strong>
            {t('citationSubTitle')}
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
        <div className="flex flex-col w-full lg:w-1/3"></div>
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

export function UserEnricherForm({slideOutId, identifier, objectId}: Props) {
  const t = useTranslations('UserEnricherForm');
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
      identifier={identifier}
      objectId={objectId}
      communities={communities}
    />
  );
}
