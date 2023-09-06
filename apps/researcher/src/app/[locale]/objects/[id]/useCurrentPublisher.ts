import {create} from 'zustand';
import {Organization} from '@/lib/api/definitions';

export default create<Organization>(() => ({
  name: '',
  id: '',
  type: 'Organization',
  url: '',
  address: {
    id: '',
    streetAddress: '',
    postalCode: '',
    addressLocality: '',
    addressCountry: '',
  },
}));
