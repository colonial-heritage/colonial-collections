import {create} from 'zustand';
import {Organization} from '@/lib/api/definitions';

export default create<{organization?: Organization}>(() => ({
  organization: undefined,
}));
