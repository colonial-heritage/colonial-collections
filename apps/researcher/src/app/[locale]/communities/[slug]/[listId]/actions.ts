'use server';

import {objectList} from '@colonial-collections/database';
import {revalidatePath} from 'next/cache';

interface Props {
  id: number;
  revalidatePathName: string;
}

export async function deleteObjectFromList({id, revalidatePathName}: Props) {
  await objectList.removeObject(id);
  revalidatePath(`/[locale]${revalidatePathName}`, 'page');
}

export async function deleteList({id, revalidatePathName}: Props) {
  await objectList.remove(id);
  revalidatePath(`/[locale]${revalidatePathName}`, 'page');
}
