import {redirect} from 'next/navigation';
import {revalidatePath} from 'next/cache';

interface Props {
  searchParams?: {
    path?: string;
    redirect?: string;
  };
}

export default async function RevalidatePaths({searchParams = {}}: Props) {
  if (searchParams.path) {
    revalidatePath(searchParams.path);
  }

  if (!searchParams.redirect) {
    return redirect('/');
  }

  redirect(searchParams.redirect);
}
