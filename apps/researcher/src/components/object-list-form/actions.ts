'use server';

import {objectList} from '@colonial-collections/database';
import {revalidatePath} from 'next/cache';

interface List {
  communityId: string;
  createdBy: string;
  name: string;
  description?: string;
}

export interface AddListProps {
  list: List;
  pathName: string;
}

export interface ActionProps {
  list: List;
  pathName: string;
  id?: number;
}

export async function addList({list, pathName}: ActionProps) {
  await objectList.create(list);
  revalidatePath(`/[locale]/${pathName}`, 'page');
}

export interface UpdateListProps {
  list: List;
  pathName: string;
  id: number;
}

export async function updateList({list, pathName, id}: ActionProps) {
  await objectList.update({...list, id: id!});
  revalidatePath(`/[locale]/${pathName}`, 'page');
}
