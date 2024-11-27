import {Event, Place, Term, Thing} from '../definitions';

export type Citation = Thing & {url?: string};

export type ResearchGuide = Thing & {
  alternateName?: string;
  abstract?: string;
  text?: string;
  encodingFormat?: string;
  contentReferenceTimes?: Event[];
  contentLocations?: Place[];
  keywords?: Term[];
  citations?: Citation[];
  seeAlso?: ResearchGuide[];
};
