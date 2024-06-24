'use client';

import {Tab} from '@headlessui/react';
import {useLocale, useTranslations} from 'next-intl';
import {Fragment, ReactNode, useMemo, useState} from 'react';
import classNames from 'classnames';
import {useNotifications, useSlideOut} from '@colonial-collections/ui';
import {
  useForm,
  SubmitHandler,
  FormProvider,
  useFormContext,
} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import {z} from 'zod';
import {useUser} from '@/lib/user/hooks';
import edtf from 'edtf';
import {
  ButtonGroup,
  FormRow,
  FormColumn,
  InputLabel,
  SearchSelector,
  LanguageSelector,
  Textarea,
  EdtfInput,
  Select,
  FieldValidationMessage,
  isEdtf,
  CommunitySelector,
  QualifierSelector,
  MotivationInput,
} from '@/components/form';
import {DefaultButton, PrimaryButton} from '@/components/buttons';
import {ExclamationTriangleIcon} from '@heroicons/react/24/outline';
import {CheckboxWithLabel} from '@/components/form/checkbox-with-label';
import {addProvenanceEnrichment} from './actions';
import {UserTypeOption, typeMapping} from '@/lib/provenance-options';

interface FormValues {
  citation: string;
  inLanguage?: string;
  transferredFrom: {id: string; name: string};
  transferredTo: {id: string; name: string};
  location: {id: string; name: string};
  type: {id: string; translationKey: string};
  community: {id: string; name: string};
  qualifier: {id: string; translationKey: string};
  date: {
    startDate: string;
    endDate: string;
  };
  agreedToLicense: boolean;
  motivations: {
    type: string;
    transferredFrom: string;
    transferredTo: string;
    location: string;
    startDate: string;
    endDate: string;
    qualifier: string;
  };
}

interface Props {
  objectId: string;
  slideOutId: string;
  licenceComponent: ReactNode;
}

export default function AddProvenanceForm({
  objectId,
  slideOutId,
  licenceComponent,
}: Props) {
  const t = useTranslations('ProvenanceForm');
  const tType = useTranslations('ProvenanceEventType');

  const locale = useLocale();
  const {user} = useUser();

  const {addNotification} = useNotifications();
  const {setIsVisible} = useSlideOut();

  const [selectedIndex, setSelectedIndex] = useState(0);

  const provenanceEnricherSchema = z.object({
    citation: z
      .string()
      .trim()
      .min(1, {message: t('citationRequired')}),
    inLanguage: z.string().optional(),
    agreedToLicense: z.literal<boolean>(true, {
      errorMap: () => ({message: t('agreedToLicenseUnchecked')}),
    }),
    type: z.object({
      id: z.nativeEnum(UserTypeOption, {
        errorMap: () => ({message: t('typeRequired')}),
      }),
      translationKey: z.string(),
    }),
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
    transferredFrom: z.object({
      id: z.string(),
      name: z.string(),
    }),
    transferredTo: z.object({
      id: z.string(),
      name: z.string(),
    }),
    location: z.object({
      id: z.string(),
      name: z.string(),
    }),
    community: z.object({
      id: z.string(),
      name: z.string(),
    }),
    qualifier: z.object({
      id: z.string(),
      translationKey: z.string(),
    }),
    motivations: z.object({
      type: z.string(),
      transferredFrom: z.string(),
      transferredTo: z.string(),
      location: z.string(),
      startDate: z.string(),
      endDate: z.string(),
      qualifier: z.string(),
    }),
  });

  const methods = useForm({
    resolver: zodResolver(provenanceEnricherSchema),
    defaultValues: {
      citation: '',
      inLanguage: locale,
      agreedToLicense: false,
      type: {id: '', translationKey: ''},
      transferredFrom: {id: '', name: ''},
      transferredTo: {id: '', name: ''},
      location: {id: '', name: ''},
      community: {id: '', name: ''},
      qualifier: {id: '', translationKey: ''},
      date: {startDate: '', endDate: ''},
      motivations: {
        type: '',
        transferredFrom: '',
        transferredTo: '',
        location: '',
        startDate: '',
        endDate: '',
        qualifier: '',
      },
    },
  });

  const {
    handleSubmit,
    setError,
    formState: {errors, isSubmitting},
  } = methods;

  const typeOptions = useMemo(() => {
    return Object.values(UserTypeOption).map(value => ({
      id: value,
      translationKey: typeMapping[value].translationKey,
      name: tType(typeMapping[value].translationKey),
      description: tType(`${typeMapping[value].translationKey}Description`),
    }));
  }, [tType]);

  const onSubmit: SubmitHandler<FormValues> = async provenanceEnrichment => {
    try {
      await addProvenanceEnrichment({
        ...provenanceEnrichment,
        objectId,
        user: {
          name: user!.fullName!,
          id: user!.iri,
        },
      });

      addNotification({
        id: 'add-user-enrichment-success',
        message: t('successfullyAdded'),
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
    <FormProvider {...methods}>
      {errors.root?.serverError.message && (
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="rounded-md bg-red-50 p-4 mt-3">
            <div className="ml-3">
              <h3 className="text-sm leading-5 font-medium text-red-800">
                {errors.root.serverError.message}
              </h3>
            </div>
          </div>
        </div>
      )}
      <Tab.Group
        manual
        selectedIndex={selectedIndex}
        onChange={setSelectedIndex}
      >
        <Tab.List className="w-full pb-4 pt-8 flex flex-row flex-wrap gap-4 lg:gap-8 border-b  -mx-4 px-4 mb-4 italic">
          <ProvenanceTab fields={['type']} number={1} title={t('TabWhat')} />
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
              <FormRow>
                <FormColumn>
                  <InputLabel
                    title={t('type')}
                    description={t('typeDescription')}
                    required
                  />
                  <Select
                    name="type"
                    options={typeOptions}
                    placeholder={t('typePlaceholder')}
                  />
                  <FieldValidationMessage field="type.id" />
                  <MotivationInput name="motivations.type" />
                </FormColumn>
                <FormColumn>
                  <InputLabel
                    title={t('inLanguage')}
                    description={t('inLanguageDescription')}
                    required
                  />
                  <LanguageSelector name="inLanguage" />
                </FormColumn>
                <FormColumn>
                  <InputLabel
                    title={t('community')}
                    description={t('communityDescription')}
                  />
                  <CommunitySelector />
                </FormColumn>
              </FormRow>
              <ButtonGroup>
                <DefaultButton disabled>{t('previousButton')}</DefaultButton>
                <DefaultButton onClick={() => setSelectedIndex(1)}>
                  {t('nextButton')}
                </DefaultButton>
              </ButtonGroup>
            </Tab.Panel>

            <Tab.Panel>
              <FormRow>
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
                  <MotivationInput name="motivations.transferredFrom" />
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
                  <MotivationInput name="motivations.transferredTo" />
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
                  <MotivationInput name="motivations.location" />
                </FormColumn>
                <FormColumn>
                  <InputLabel
                    title={t('startDate')}
                    description={t('startDateDescription')}
                  />
                  <EdtfInput name="date.startDate" />
                  <FieldValidationMessage field="date.startDate" />
                  <MotivationInput name="motivations.startDate" />
                  <InputLabel
                    title={t('endDate')}
                    description={t('startDateDescription')}
                  />
                  <EdtfInput name="date.endDate" />
                  <FieldValidationMessage field="date.endDate" />
                  <FieldValidationMessage field="date.root" />
                  <MotivationInput name="motivations.endDate" />
                </FormColumn>
              </FormRow>
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
              <FormRow>
                <FormColumn>
                  <InputLabel
                    title={t('qualifier')}
                    description={t('qualifierDescription')}
                    required
                  />
                  <QualifierSelector name="qualifier" />
                  <MotivationInput name="motivations.qualifier" />
                </FormColumn>
                <FormColumn>
                  <InputLabel
                    title={t('citation')}
                    description={t('citationDescription')}
                    required
                  />
                  <Textarea name="citation" />
                  <FieldValidationMessage field="citation" />
                </FormColumn>
                <FormColumn>
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
                    <div className="text-sm mb-1">{licenceComponent}</div>
                  </div>
                </FormColumn>
              </FormRow>
              <ButtonGroup>
                <DefaultButton onClick={() => setSelectedIndex(1)}>
                  {t('previousButton')}
                </DefaultButton>
                <PrimaryButton type="submit" disabled={isSubmitting}>
                  {t('saveButton')}
                </PrimaryButton>
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
