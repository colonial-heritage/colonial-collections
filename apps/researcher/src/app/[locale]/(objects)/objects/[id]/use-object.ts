import {create} from 'zustand';
import {Organization} from '@/lib/api/definitions';

interface State {
  organization?: Organization;
  objectId: string;
  locale: string;
}

export default create<State>(() => ({
  organization: undefined,
  objectId: '',
  locale: '',
}));
