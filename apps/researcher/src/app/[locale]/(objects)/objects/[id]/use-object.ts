import {create} from 'zustand';
import {Organization} from '@/lib/api/definitions';
import {Enrichment} from '@colonial-collections/enricher/src/definitions';

interface State {
  organization?: Organization;
  objectId: string;
  locale: string;
  enrichments: Enrichment[];
}

export default create<State>(() => ({
  organization: undefined,
  objectId: '',
  locale: '',
  enrichments: [],
}));
