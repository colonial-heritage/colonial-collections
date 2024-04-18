'use client';

import {
  useSlideOut,
  useNotifications,
  SlideOutButton,
  LocalizedMarkdown,
} from '@colonial-collections/ui';
import {useForm, SubmitHandler, FormProvider, Form} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import {useLocale, useTranslations} from 'next-intl';
import {z} from 'zod';
import {addUserEnrichment} from './actions';
import {XMarkIcon} from '@heroicons/react/24/outline';
import {
  FormColumn,
  FormWrapper,
  InputLabel,
  LanguageSelector,
  Textarea,
  FieldValidationMessage,
  Input,
  CommunitySelector,
  ButtonGroup,
} from '@/components/form';
import type {HeritageObjectEnrichmentType} from '@colonial-collections/enricher';
import {Suspense, useMemo} from 'react';
import {useUser} from '@clerk/nextjs';
import {addAttributionId} from '@/lib/user/actions';
import {CheckboxWithLabel} from '@/components/form/checkbox-with-label';
import {DefaultButton, PrimaryButton} from '@/components/buttons';

interface FormValues {
  description: string;
  attributionId: string;
  citation: string;
  inLanguage?: string;
  agreedToLicense: boolean;
  community: {id: string; name: string};
}

interface Props {
  slideOutId: string;
  enrichmentType: HeritageObjectEnrichmentType;
  objectId: string;
}

export function UserEnrichmentForm({
  slideOutId,
  enrichmentType,
  objectId,
}: Props) {
  const locale = useLocale();
  const {user} = useUser();
  const attributionIds = useMemo(
    () => user?.publicMetadata?.attributionIds as string[] | undefined,
    [user?.publicMetadata?.attributionIds]
  );

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
    attributionId: z.string().url({message: t('invalidAttributionId')}),
    agreedToLicense: z.literal<boolean>(true, {
      errorMap: () => ({message: t('agreedToLicenseUnchecked')}),
    }),
    community: z
      .object({
        id: z.string(),
        name: z.string(),
      })
      .optional(),
  });

  const methods = useForm({
    resolver: zodResolver(userEnricherSchema),
    defaultValues: {
      description: '',
      attributionId:
        attributionIds && attributionIds.length > 0
          ? attributionIds[attributionIds.length - 1]
          : '',
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
          id: userEnrichment.attributionId,
        },
      });

      await addAttributionId({
        userId: user!.id,
        attributionId: userEnrichment.attributionId,
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
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full bg-neutral-50 rounded-xl p-4 border border-neutral-100 text-neutral-800 self-end flex-col gap-6 flex"
        data-testid="enrichment-form"
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
        <FormWrapper>
          <FormColumn>
            <InputLabel
              title={t('description')}
              description={t('descriptionSubTitle')}
              required
              id="description"
            />
            <Textarea name="description" />
            <FieldValidationMessage field="description" />
            <InputLabel
              title={t('citation')}
              description={t('citationSubTitle')}
              required
              id="citation"
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
              description={t('languageSubTitle')}
            />
            <LanguageSelector name="inLanguage" />
            <InputLabel
              title={t('community')}
              description={t('communityDescription')}
            />
            <CommunitySelector />
          </FormColumn>
        </FormWrapper>
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
