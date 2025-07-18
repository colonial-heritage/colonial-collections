'use client';

import {
  useSlideOut,
  useNotifications,
  SlideOutButton,
} from '@colonial-collections/ui';
import {useForm, SubmitHandler, FormProvider} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import {useLocale, useTranslations} from 'next-intl';
import {z} from 'zod';
import {addUserEnrichment} from './actions';
import {XMarkIcon} from '@heroicons/react/24/outline';
import {
  FormRow,
  InputLabel,
  LanguageSelector,
  Textarea,
  FieldValidationMessage,
  CommunitySelector,
  ButtonGroup,
} from '@/components/form';
import type {HeritageObjectEnrichmentType} from '@colonial-collections/enricher';
import {Fragment, ReactNode} from 'react';
import {useUser} from '@/lib/user/hooks';
import {CheckboxWithLabel} from '@/components/form/checkbox-with-label';
import {DefaultButton, PrimaryButton} from '@/components/buttons';
import {Field} from '@headlessui/react';

interface FormValues {
  description: string;
  citation: string;
  inLanguage?: string;
  agreedToLicense: boolean;
  community: {id: string; name: string};
}

interface Props {
  slideOutId: string;
  enrichmentType: HeritageObjectEnrichmentType;
  objectId: string;
  licenceComponent: ReactNode;
}

export function UserEnrichmentForm({
  slideOutId,
  enrichmentType,
  objectId,
  licenceComponent,
}: Props) {
  const locale = useLocale();
  const {user} = useUser();

  const t = useTranslations('UserEnrichmentForm');

  const userEnricherSchema = z.object({
    description: z
      .string()
      .trim()
      .min(1, {message: t('descriptionRequired')}),
    citation: z
      .string()
      .trim()
      .min(1, {message: t('citationRequired')}),
    inLanguage: z.string().optional(),
    agreedToLicense: z.literal<boolean>(true, {
      errorMap: () => ({message: t('agreedToLicenseUnchecked')}),
    }),
    community: z.object({
      id: z.string().min(1, {message: t('communityRequired')}),
      name: z.string(),
    }),
  });

  const methods = useForm({
    resolver: zodResolver(userEnricherSchema),
    defaultValues: {
      description: '',
      citation: '',
      inLanguage: locale,
      agreedToLicense: false,
      community: {id: '', name: ''},
    },
  });

  const {
    handleSubmit,
    setError,
    formState: {errors, isSubmitting},
  } = methods;

  const {setIsVisible} = useSlideOut();
  const {addNotification} = useNotifications();

  const onSubmit: SubmitHandler<FormValues> = async userEnrichment => {
    try {
      await addUserEnrichment({
        ...userEnrichment,
        additionalType: enrichmentType,
        objectId,
        user: {
          name: user!.fullName!,
          id: user!.id,
        },
      });

      addNotification({
        id: `userEnrichment.${enrichmentType}.added.success`,
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
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full bg-neutral-50 rounded-xl p-4 border border-neutral-100 text-neutral-800 self-end flex-col gap-6 flex"
        data-testid="enrichment-form"
      >
        <div className="flex justify-between items-center border-b -mx-4 px-4 pb-2 mb-2">
          <h3 tabIndex={0}>{t('title')}</h3>
          <SlideOutButton
            className="p-1 sm:py-2 sm:px-3 rounded-full text-xs bg-neutral-200/50 hover:bg-neutral-300/50 text-neutral-800 transition flex items-center gap-1"
            id={slideOutId}
            aria-label={t('accessibilityCloseButton')}
          >
            <XMarkIcon className='className="w-4 h-4 stroke-neutral-900' />
          </SlideOutButton>
        </div>
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
        <FormRow>
          <LeftFormColumn>
            <Field as={Fragment}>
              <InputLabel
                title={t('description')}
                description={t('descriptionSubTitle')}
                required
              />
              <Textarea name="description" />
              <FieldValidationMessage field="description" />
            </Field>
          </LeftFormColumn>
          <RightFormColumn>
            <Field as={Fragment}>
              <InputLabel
                title={t('inLanguage')}
                description={t('languageSubTitle')}
              />
              <LanguageSelector name="inLanguage" />
            </Field>
          </RightFormColumn>
        </FormRow>
        <FormRow>
          <LeftFormColumn>
            <Field as={Fragment}>
              <InputLabel
                title={t('citation')}
                description={t('citationSubTitle')}
                required
              />
              <Textarea name="citation" />
              <FieldValidationMessage field="citation" />
            </Field>
          </LeftFormColumn>
          <RightFormColumn>
            <Field as={Fragment}>
              <InputLabel
                title={t('community')}
                description={t('communityDescription')}
                required
              />
              <CommunitySelector />
              <FieldValidationMessage field="community.id" />
            </Field>
          </RightFormColumn>
        </FormRow>
        <FormRow>
          <LeftFormColumn>
            <div className="mt-4">
              <CheckboxWithLabel
                name="agreedToLicense"
                testId="agreed-to-license"
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
          </LeftFormColumn>
        </FormRow>
        <ButtonGroup>
          <PrimaryButton type="submit" disabled={isSubmitting}>
            {t('buttonSubmit')}
          </PrimaryButton>
          <DefaultButton onClick={() => setIsVisible(slideOutId, false)}>
            {t('buttonCancel')}
          </DefaultButton>
        </ButtonGroup>
      </form>
    </FormProvider>
  );
}

function LeftFormColumn({children}: {children: ReactNode}) {
  return <div className="flex flex-col w-full lg:w-2/3">{children}</div>;
}

function RightFormColumn({children}: {children: ReactNode}) {
  return <div className="flex flex-col w-full lg:w-1/3 gap-4">{children}</div>;
}
