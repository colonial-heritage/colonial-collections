import {redirect} from 'next/navigation';
import {revalidatePath} from 'next/cache';

interface Props {
  searchParams: {
    path?: string;
  };
  params: {
    redirect: string[];
  };
}

export default function RevalidatePath({params, searchParams}: Props) {
  const redirectUrl = '/' + params.redirect.join('/');
  revalidatePath(searchParams.path || redirectUrl, 'page');

  redirect(redirectUrl);
}
