'use client';

import {FormWrapper, InputGroup, InputLabel} from '@/components/form/layout';
import {Tab} from '@headlessui/react';
import {useLocale, useTranslations} from 'next-intl';
import {Fragment, useMemo} from 'react';
import classNames from 'classnames';
import {useNotifications} from '@colonial-collections/ui';
import {useForm, SubmitHandler, FormProvider} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import {z} from 'zod';
// Import {addUserEnrichment} from './actions';
import {useUser} from '@clerk/nextjs';
import {addAttributionId} from '@/lib/user/actions';
import {SearchSelector, LanguageSelector, Textarea} from '@/components/form';

enum ProvenanceEventType {
  Acquisition = 'acquisition',
  TransferOfCustody = 'transferOfCustody',
}

interface FormValues {
  attributionId: string;
  citation: string;
  inLanguage?: string;
  transferredFrom?: {id: string; name?: string};
  transferredTo?: {id: string; name?: string};
  location?: {id: string; name?: string};
  type: ProvenanceEventType;
  additionalType?: {id: string; name: string};
  date?: {startDate: string; endDate: string};
  agreedToLicense: boolean;
}

export default function AddProvenanceForm({objectId}: {objectId: string}) {
  const t = useTranslations('ProvenanceForm');
  const locale = useLocale();
  const {user} = useUser();
  const attributionIds = useMemo(
    () => user?.publicMetadata?.attributionIds as string[] | undefined,
    [user?.publicMetadata?.attributionIds]
  );
  const {addNotification} = useNotifications();

  const provenanceEnricherSchema = z.object({
    citation: z
      .string()
      .trim()
      .min(1, {message: t('citationRequired')}),
    inLanguage: z.string().optional(),
    attributionId: z.string().url({message: t('invalidAttributionId')}),
    agreedToLicense: z.literal<boolean>(true, {
      errorMap: () => ({message: t('agreedToLicenseUnchecked')}),
    }),
    // TODO: add descriptions
    type: z.nativeEnum(ProvenanceEventType),
    additionalType: z
      .object({
        id: z.string().url(),
        name: z.string(),
      })
      .optional(),
    date: z
      .object({
        startDate: z.string(),
        endDate: z.string(),
      })
      .optional(),
    transferredFrom: z
      .object({
        id: z.string().url(),
        name: z.string(),
      })
      .optional(),
    transferredTo: z
      .object({
        id: z.string().url(),
        name: z.string(),
      })
      .optional(),
    location: z
      .object({
        id: z.string().url(),
        name: z.string(),
      })
      .optional(),
  });

  const methods = useForm({
    resolver: zodResolver(provenanceEnricherSchema),
    defaultValues: {
      attributionId:
        attributionIds && attributionIds.length > 0
          ? attributionIds[attributionIds.length - 1]
          : '',
      citation: '',
      inLanguage: locale,
      agreedToLicense: false,
      transferredFrom: undefined,
      transferredTo: undefined,
      location: undefined,
      type: ProvenanceEventType.TransferOfCustody,
      additionalType: undefined,
      date: {
        startDate: '',
        endDate: '',
      },
    },
  });

  const {
    handleSubmit,
    setError,
    formState: {errors, isSubmitting},
  } = methods;

  const onSubmit: SubmitHandler<FormValues> = async userEnrichment => {
    try {
      // Await addUserEnrichment({
      //   ...userEnrichment,
      //   additionalType: enrichmentType,
      //   objectId,
      //   user: {
      //     name: user!.fullName!,
      //     id: userEnrichment.attributionId,
      //   },
      // });

      await addAttributionId({
        userId: user!.id,
        attributionId: userEnrichment.attributionId,
      });

      addNotification({
        id: 'add-user-enrichment-success',
        message: t('successfullyAdded'),
        type: 'success',
      });
      // SetIsVisible(slideOutId, false);
    } catch (err) {
      console.error(err);
      setError('root.serverError', {
        message: t('serverError'),
      });
    }
  };

  return (
    <FormProvider {...methods}>
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
      <Tab.Group>
        <Tab.List className="w-full pb-4 pt-8 flex flex-row flex-wrap gap-4 lg:gap-8 border-b  -mx-4 px-4 mb-4 italic">
          <ProvenanceTab number={1} title={t('TabWhat')} />
          <ProvenanceTab number={2} title={t('TabWho')} />
          <ProvenanceTab number={3} title={t('TabMoreInfo')} />
        </Tab.List>
        <Tab.Panels>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Tab.Panel>
              <FormWrapper>
                <InputGroup>
                  <InputLabel
                    title={t('type')}
                    description={t('typeDescription')}
                  />
                </InputGroup>
              </FormWrapper>
            </Tab.Panel>
            <Tab.Panel>
              <FormWrapper>
                <InputGroup>
                  <InputLabel
                    title={t('transferredFrom')}
                    description={t('transferredFromDescription')}
                  />
                  <SearchSelector
                    searchers={[
                      {
                        name: 'Wikidata Constituent',
                        url: '/api/wikidata',
                      },
                      {
                        name: 'Datahub Constituent',
                        url: '/api/datahub',
                      },
                    ]}
                    name="transferredFrom"
                  />
                  <InputLabel
                    title={t('transferredTo')}
                    description={t('transferredToDescription')}
                  />
                  <SearchSelector
                    searchers={[
                      {
                        name: 'Wikidata Constituent',
                        url: '/api/wikidata',
                      },
                      {
                        name: 'Datahub Constituent',
                        url: '/api/datahub',
                      },
                    ]}
                    name="transferredTo"
                  />
                </InputGroup>
                <InputGroup>
                  <InputLabel
                    title={t('location')}
                    description={t('locationDescription')}
                  />
                  <SearchSelector
                    searchers={[
                      {
                        name: 'GeoNames Location',
                        url: '/api/geonames',
                      },
                    ]}
                    name="location"
                  />
                </InputGroup>
              </FormWrapper>
            </Tab.Panel>
            <Tab.Panel>
              <FormWrapper>
                <InputGroup>
                  <InputLabel
                    title={t('citation')}
                    description={t('citationDescription')}
                  />
                  <Textarea name="citation" />
                </InputGroup>
                <InputGroup>
                  <InputLabel
                    title={t('inLanguage')}
                    description={t('inLanguageDescription')}
                  />
                  <LanguageSelector name="inLanguage" />
                </InputGroup>
              </FormWrapper>
            </Tab.Panel>
          </form>
        </Tab.Panels>
      </Tab.Group>
    </FormProvider>
  );
}

function ProvenanceTab({number, title}: {number: number; title: string}) {
  return (
    <Tab as={Fragment}>
      {({selected}) => (
        <button
          className={classNames(
            'flex gap-1 items-end hover:opacity-100 transition',
            {
              'opacity-40': !selected,
              'opacity-100': selected,
            }
          )}
        >
          <div className="text-xl font-semibold">{number}</div>
          {title}
        </button>
      )}
    </Tab>
  );
}
