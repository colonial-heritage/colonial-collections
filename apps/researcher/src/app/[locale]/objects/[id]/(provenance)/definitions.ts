import {ProvenanceEvent} from '@/lib/api/definitions';

export type LabeledProvenanceEvent = ProvenanceEvent & {label: string};
