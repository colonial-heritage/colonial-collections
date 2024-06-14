import {Place, Term, Thing} from '../definitions';

export type Citation = Thing & {url?: string};

export type ResearchGuide = Thing & {
  identifier?: string;
  abstract?: string;
  text?: string;
  encodingFormat?: string;
  contentLocations?: Place[];
  keywords?: Term[];
  citations?: Citation[];
  isPartOf?: ResearchGuide[];
  hasParts?: ResearchGuide[];
  seeAlso?: Thing[];
};
