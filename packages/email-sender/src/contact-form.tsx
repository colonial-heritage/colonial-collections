'use client';

import {useForm, SubmitHandler} from 'react-hook-form';
import {useTranslations} from 'next-intl';
import {useNotifications} from '@colonial-collections/ui';
import {z} from 'zod';
import {zodResolver} from '@hookform/resolvers/zod';
import {sendEmail} from './actions';
import {camelCase} from 'tiny-case';

interface FormValues {
  emailAddress: string;
  subject: string;
  body: string;
}

const communitySchema = z.object({
  emailAddress: z.string().email(),
  subject: z.string().trim().min(1).max(250),
  body: z.string().min(1),
});

export function ContactForm() {
  const {
    register,
    handleSubmit,
    setError,
    formState: {errors, isSubmitting},
  } = useForm({
    resolver: zodResolver(communitySchema),
    defaultValues: {
      emailAddress: '',
      subject: '',
      body: '',
    },
  });

  const t = useTranslations('ContactForm');
  const {addNotification} = useNotifications();

  const onSubmit: SubmitHandler<FormValues> = async formValues => {
    try {
      await sendEmail(formValues);
      addNotification({
        id: 'email-send-success',
        message: t('emailIsSended'),
        type: 'success',
      });
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
        {t('title')}
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
        <label htmlFor="emailAddress" className="flex flex-col gap-1 mb-1">
          <strong>
            {t('labelEmailAddress')}
            <span className="font-normal text-neutral-600"> *</span>
          </strong>
        </label>
        <input
          id="emailAddress"
          {...register('emailAddress')}
          className="border border-neutral-500 rounded p-2 text-sm"
        />
        <p>
          {errors.emailAddress &&
            t(camelCase(`emailAddress_${errors.emailAddress.type}`))}
        </p>
      </div>

      <div className="flex flex-col gap-1 max-w-2xl w-full">
        <label htmlFor="subject" className="flex flex-col gap-1 mb-1">
          <strong>
            {t('labelSubject')}
            <span className="font-normal text-neutral-600"> *</span>
          </strong>
        </label>
        <input
          id="subject"
          {...register('subject')}
          className="border border-neutral-500 rounded p-2 text-sm"
        />
        <p>
          {errors.subject && t(camelCase(`subject_${errors.subject.type}`))}
        </p>
      </div>

      <div className="flex flex-col gap-1 max-w-2xl w-full">
        <label htmlFor="body" className="flex flex-col gap-1 mb-1">
          <strong>
            {t('labelBody')}
            <span className="font-normal text-neutral-600"> *</span>
          </strong>
        </label>
        <textarea
          id="body"
          {...register('body')}
          rows={4}
          className="border border-neutral-500 rounded p-2 text-sm h-56"
        />
        <p>{errors.body && t(camelCase(`body_${errors.body.type}`))}</p>
      </div>

      <div className="flex flex-row max-w-2xl w-full">
        <div className=" flex flex-col md:flex-row justify-between gap-2">
          <button
            className="p-1 sm:py-2 sm:px-3 rounded-full text-xs bg-neutral-200 hover:bg-neutral-300 text-neutral-800 transition flex items-center gap-1"
            disabled={isSubmitting}
            type="submit"
          >
            {t('sendEmailButton')}
          </button>
        </div>
      </div>
    </form>
  );
}
