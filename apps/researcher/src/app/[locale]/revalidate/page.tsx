import {redirect} from 'next/navigation';
import {revalidatePath} from 'next/cache';

interface Props {
  searchParams: {
    path?: string;
    redirect?: string;
  };
}

export default function RevalidatePath({searchParams}: Props) {
  if (searchParams.path) {
    revalidatePath(searchParams.path, 'page');
  }

  if (!searchParams.redirect) {
    return redirect('/');
  }

  redirect(searchParams.redirect);
}
