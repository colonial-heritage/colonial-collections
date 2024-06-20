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
import {addUserNotice} from './actions';
import {InformationCircleIcon, XMarkIcon} from '@heroicons/react/24/outline';
import {
  FormRow,
  InputLabel,
  LanguageSelector,
  Textarea,
  FieldValidationMessage,
  CommunitySelector,
  ButtonGroup,
} from '@/components/form';
import {ReactNode} from 'react';
import {useUser} from '@/lib/user/hooks';
import {CheckboxWithLabel} from '@/components/form/checkbox-with-label';
import {DefaultButton, PrimaryButton} from '@/components/buttons';
import {
  LocalContextsNoticeEnrichmentType,
  localContextsNoticeEnrichmentTypeMapping,
} from './mapping';
import {LocalContextsNoticeSelector} from '@/components/form/local-contexts-notice-selector';

interface FormValues {
  type: LocalContextsNoticeEnrichmentType | null;
  description: string;
  inLanguage?: string;
  agreedToLicense: boolean;
  community: {id: string; name: string};
}

interface Props {
  slideOutId: string;
  objectId: string;
  licenceComponent: ReactNode;
}

export function LocalContextsNoticeForm({
  slideOutId,
  objectId,
  licenceComponent,
}: Props) {
  const locale = useLocale();
  const {user} = useUser();

  const t = useTranslations('LocalContextsNoticeForm');
  const tNotices = useTranslations('LocalContextsNotices');

  const userEnricherSchema = z.object({
    type: z.nativeEnum(LocalContextsNoticeEnrichmentType),
    description: z
      .string()
      .trim()
      .min(1, {message: t('descriptionRequired')}),
    inLanguage: z.string().optional(),
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
      type: null,
      description: '',
      inLanguage: locale,
      agreedToLicense: false,
      community: {id: '', name: ''},
    },
  });

  const {
    handleSubmit,
    setError,
    getValues,
    watch,
    formState: {errors, isSubmitting},
  } = methods;

  const {setIsVisible} = useSlideOut();
  const {addNotification} = useNotifications();

  const onSubmit: SubmitHandler<FormValues> = async userNotice => {
    try {
      await addUserNotice({
        ...userNotice,
        type: userNotice.type!,
        objectId,
        user: {
          name: user!.fullName!,
          id: user!.iri,
        },
      });

      addNotification({
        id: 'add-user-notice-success',
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
        data-testid="notice-form"
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
        <div>
          {t('type')}
          <LocalContextsNoticeSelector name="type" />
        </div>
        <FormRow>
          <div className="w-full md:w-1/2 flex flex-col">
            <InputLabel
              title={t('description')}
              description={t('descriptionSubTitle')}
              required
              id="description"
            />
            <Textarea name="description" />
            <FieldValidationMessage field="description" />
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
          </div>
          {watch('type') && (
            <div className="w-full md:w-1/2 prose">
              <strong className="flex items-center gap-1">
                <InformationCircleIcon className="w-4 h-4 stroke-neutral-900" />
                {t('noticeInformationTitle')}
              </strong>
              <p>
                {tNotices(
                  localContextsNoticeEnrichmentTypeMapping[
                    watch('type')! as LocalContextsNoticeEnrichmentType
                  ].informationTranslationKey
                )}
              </p>
              <p>
                <a
                  href="http://www.localcontexts.org"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {t('noticeInformationLink')}
                </a>
              </p>
            </div>
          )}
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
