'use client';

import {Tab} from '@headlessui/react';
import {useLocale, useTranslations} from 'next-intl';
import {Fragment, Suspense, useMemo, useState} from 'react';
import classNames from 'classnames';
import {LocalizedMarkdown, useNotifications} from '@colonial-collections/ui';
import {
  useForm,
  SubmitHandler,
  FormProvider,
  useFormContext,
} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import {date, z} from 'zod';
import {useUser} from '@clerk/nextjs';
import {addAttributionId} from '@/lib/user/actions';
import edtf from 'edtf';
import {
  ButtonGroup,
  FormWrapper,
  FormColumn,
  InputLabel,
  SearchSelector,
  LanguageSelector,
  Textarea,
  Input,
  EdtfInput,
  Select,
  FieldValidationMessage,
  isEdtf,
} from '@/components/form';
import {DefaultButton, PrimaryButton} from '@/components/buttons';
import {ProvenanceEventType} from './definitions';
import {ExclamationTriangleIcon} from '@heroicons/react/24/outline';
import {CheckboxWithLabel} from '@/components/form/checkbox-with-label';
import {addProvenanceEnrichment} from './actions';

const additionalTypes = {
  [ProvenanceEventType.Acquisition]: [
    {id: 'http://vocab.getty.edu/aat/300417641', translationKey: 'bequest'},
    {id: 'http://vocab.getty.edu/aat/300417638', translationKey: 'donation'},
    {id: 'http://vocab.getty.edu/aat/300417637', translationKey: 'gift'},
    {id: 'http://vocab.getty.edu/aat/300417644', translationKey: 'transfer'},
    {id: 'http://vocab.getty.edu/aat/300417642', translationKey: 'purchase'},
  ],
  [ProvenanceEventType.TransferOfCustody]: [
    {
      id: 'http://vocab.getty.edu/aat/300417653',
      translationKey: 'originalOwner',
    },
    {id: 'http://vocab.getty.edu/aat/300417843', translationKey: 'restitution'},
    {id: 'http://vocab.getty.edu/aat/300444188', translationKey: 'inheritance'},
    {id: 'http://vocab.getty.edu/aat/300417657', translationKey: 'stolen'},
    {id: 'http://vocab.getty.edu/aat/300417659', translationKey: 'loot'},
    {id: 'http://vocab.getty.edu/aat/300417658', translationKey: 'confiscated'},
  ],
};

interface FormValues {
  attributionId: string;
  citation: string;
  inLanguage?: string;
  transferredFrom: {id: string; name: string};
  transferredTo: {id: string; name: string};
  location: {id: string; name: string};
  type: {id: string; name: string};
  additionalType: {id: string; name: string};
  date: {
    startDate: string;
    endDate: string;
  };
  agreedToLicense: boolean;
}

export default function AddProvenanceForm({objectId}: {objectId: string}) {
  const t = useTranslations('ProvenanceForm');
  const tType = useTranslations('ProvenanceEventType');
  const tAdditionalType = useTranslations('ProvenanceAdditionalType');

  const locale = useLocale();
  const {user} = useUser();

  const [additionalTypeOptions, setAdditionalTypeOptions] = useState<
    {id: string; name: string}[]
  >([]);

  const attributionIds = useMemo(
    () => user?.publicMetadata?.attributionIds as string[] | undefined,
    [user?.publicMetadata?.attributionIds]
  );
  const {addNotification} = useNotifications();

  const [selectedIndex, setSelectedIndex] = useState(0);

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
    type: z.object({
      id: z.nativeEnum(ProvenanceEventType, {
        errorMap: () => ({message: t('typeRequired')}),
      }),
      name: z.string(),
    }),
    additionalType: z
      .object({
        id: z.string(),
        name: z.string(),
      })
      .optional(),
    date: z
      .object({
        startDate: z.union([
          z.literal(''),
          z.string().refine(isEdtf, {message: t('invalidStartDate')}),
        ]),
        endDate: z.union([
          z.literal(''),
          z.string().refine(isEdtf, {message: t('invalidEndDate')}),
        ]),
      })
      .refine(
        ({startDate, endDate}) => {
          if (!isEdtf(startDate) || !isEdtf(endDate)) return true;
          return (
            edtf(startDate).min <= edtf(endDate).min &&
            edtf(endDate).max >= edtf(startDate).max
          );
        },
        {
          message: t('invalidDateRange'),
        }
      ),
    transferredFrom: z
      .object({
        id: z.string(),
        name: z.string(),
      })
      .optional(),
    transferredTo: z
      .object({
        id: z.string(),
        name: z.string(),
      })
      .optional(),
    location: z
      .object({
        id: z.string(),
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
      transferredFrom: {id: '', name: ''},
      transferredTo: {id: '', name: ''},
      location: {id: '', name: ''},
      type: {id: '', name: ''},
      additionalType: {id: '', name: ''},
      date: {startDate: '', endDate: ''},
    },
  });

  const {
    handleSubmit,
    setError,
    setValue,
    formState: {errors, isSubmitting},
  } = methods;

  const typeOptions = useMemo(() => {
    return Object.entries(ProvenanceEventType).map(([key, value]) => ({
      id: value,
      name: tType(key),
      description: tType(`${key}Description`),
    }));
  }, [tType]);

  const typeChange = (type: {id: string; name: string}) => {
    setValue('additionalType', {id: '', name: ''});
    if (!type.id) setAdditionalTypeOptions([]);

    const newOptions = additionalTypes[type.id as ProvenanceEventType].map(
      ({id, translationKey}) => ({
        id,
        name: tAdditionalType(translationKey),
        description: tAdditionalType(`${translationKey}Description`),
      })
    );

    setAdditionalTypeOptions(newOptions);
  };

  const onSubmit: SubmitHandler<FormValues> = async provenanceEnrichment => {
    try {
      await addProvenanceEnrichment({
        ...provenanceEnrichment,
        objectId,
        user: {
          name: user!.fullName!,
          id: provenanceEnrichment.attributionId,
        },
      });

      await addAttributionId({
        userId: user!.id,
        attributionId: provenanceEnrichment.attributionId,
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
      <Tab.Group
        manual
        selectedIndex={selectedIndex}
        onChange={setSelectedIndex}
      >
        <Tab.List className="w-full pb-4 pt-8 flex flex-row flex-wrap gap-4 lg:gap-8 border-b  -mx-4 px-4 mb-4 italic">
          <ProvenanceTab
            fields={['type', 'additionalType']}
            number={1}
            title={t('TabWhat')}
          />
          <ProvenanceTab
            number={2}
            title={t('TabWho')}
            fields={['transferredFrom', 'transferredTo', 'location', 'date']}
          />
          <ProvenanceTab
            number={3}
            title={t('TabMoreInfo')}
            fields={['citation', 'inLanguage']}
          />
        </Tab.List>
        <Tab.Panels>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Tab.Panel>
              <FormWrapper>
                <FormColumn>
                  <InputLabel
                    title={t('type')}
                    description={t('typeDescription')}
                    required
                  />
                  <Select
                    name="type"
                    options={typeOptions}
                    onChangeCallback={typeChange}
                    placeholder={t('typePlaceholder')}
                  />
                  <FieldValidationMessage field="type.id" />
                  <InputLabel
                    title={t('additionalType')}
                    description={t('additionalTypeDescription')}
                  />
                  <Select
                    name="additionalType"
                    options={additionalTypeOptions}
                    placeholder={t('additionalTypePlaceholder')}
                  />
                </FormColumn>
              </FormWrapper>
              <ButtonGroup>
                <DefaultButton disabled>{t('previousButton')}</DefaultButton>
                <DefaultButton onClick={() => setSelectedIndex(1)}>
                  {t('nextButton')}
                </DefaultButton>
              </ButtonGroup>
            </Tab.Panel>

            <Tab.Panel>
              <FormWrapper>
                <FormColumn>
                  <InputLabel
                    title={t.rich('transferredFrom', {
                      important: text => <em>{text}</em>,
                    })}
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
                    title={t.rich('transferredTo', {
                      important: text => <em>{text}</em>,
                    })}
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
                </FormColumn>
                <FormColumn>
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
                </FormColumn>
                <FormColumn>
                  <InputLabel
                    title={t('startDate')}
                    description={t('startDateDescription')}
                  />
                  <EdtfInput name="date.startDate" />
                  <FieldValidationMessage field="date.startDate" />
                  <InputLabel
                    title={t('endDate')}
                    description={t('startDateDescription')}
                  />
                  <EdtfInput name="date.endDate" />
                  <FieldValidationMessage field="date.endDate" />
                  <FieldValidationMessage field="date" />
                </FormColumn>
              </FormWrapper>
              <ButtonGroup>
                <DefaultButton onClick={() => setSelectedIndex(0)}>
                  {t('previousButton')}
                </DefaultButton>
                <DefaultButton onClick={() => setSelectedIndex(2)}>
                  {t('nextButton')}
                </DefaultButton>
              </ButtonGroup>
            </Tab.Panel>

            <Tab.Panel>
              <FormWrapper>
                <FormColumn>
                  <InputLabel
                    title={t('citation')}
                    description={t('citationDescription')}
                    required
                  />
                  <Textarea name="citation" />
                  <FieldValidationMessage field="citation" />
                  <InputLabel
                    title={t('attributionId')}
                    description={t('attributionIdDescription')}
                    required
                  />
                  <Input name="attributionId" />
                  <FieldValidationMessage field="attributionId" />

                  <div className="mt-4">
                    <CheckboxWithLabel
                      name="agreedToLicense"
                      labelText={t.rich('license', {
                        link: text => (
                          <a
                            href="https://orcid.org"
                            target="_blank"
                            rel="noreferrer"
                          >
                            {text}
                          </a>
                        ),
                      })}
                    />
                    <FieldValidationMessage field="agreedToLicense" />
                    <div className="text-sm mb-1">
                      <Suspense>
                        <LocalizedMarkdown
                          name="license"
                          contentPath="@/messages"
                          textSize="small"
                        />
                      </Suspense>
                    </div>
                  </div>
                </FormColumn>
                <FormColumn>
                  <InputLabel
                    title={t('inLanguage')}
                    description={t('inLanguageDescription')}
                    required
                  />
                  <LanguageSelector name="inLanguage" />
                </FormColumn>
              </FormWrapper>
              <ButtonGroup>
                <DefaultButton onClick={() => setSelectedIndex(1)}>
                  {t('previousButton')}
                </DefaultButton>
                <PrimaryButton type="submit">{t('saveButton')}</PrimaryButton>
              </ButtonGroup>
            </Tab.Panel>
          </form>
        </Tab.Panels>
      </Tab.Group>
    </FormProvider>
  );
}

interface ProvenanceTabProps {
  number: number;
  title: string;
  fields: string[];
}

function ProvenanceTab({number, title, fields}: ProvenanceTabProps) {
  const {formState} = useFormContext();
  const hasError = fields.some(field => {
    return formState.errors[field];
  });
  return (
    <Tab as={Fragment}>
      {({selected}) => (
        <button className="flex gap-1 items-end group">
          <>
            <div
              className={classNames('text-xl font-semibold', {
                'opacity-40': !selected,
                'opacity-100': selected,
              })}
            >
              {number}
            </div>
            <div
              className={classNames({
                'opacity-40': !selected,
                'opacity-100': selected,
              })}
            >
              {title}
            </div>
            {hasError && (
              <div className="bg-orange-200/50 px-2 py-1 rounded">
                <div className="w-4">
                  <ExclamationTriangleIcon className="w-4 h-4 stroke-neutral-700" />
                </div>
              </div>
            )}
          </>
        </button>
      )}
    </Tab>
  );
}
