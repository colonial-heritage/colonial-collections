import {redirect} from 'next/navigation';
import {revalidatePath} from 'next/cache';
import {decodeRouteSegment} from '@/lib/clerk-route-segment-transformer';

interface Props {
  searchParams: {
    path?: string;
  };
  params: {
    redirect: string;
  };
}

export default function RevalidatePath({params, searchParams}: Props) {
  console.log(params, searchParams);
  console.log(decodeRouteSegment(params.redirect));
  const redirectUrl = '/' + decodeRouteSegment(params.redirect);
  revalidatePath(searchParams.path || redirectUrl, 'page');

  redirect(redirectUrl);
}
