import {create} from 'zustand';
import {Organization} from '@colonial-collections/api';
import {Enrichment} from '@colonial-collections/enricher';

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
