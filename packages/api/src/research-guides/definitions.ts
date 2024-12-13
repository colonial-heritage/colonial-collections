import {Event, Place, Term, Thing} from '../definitions';

export type Citation = Thing & {url?: string};

export type ResearchGuide = Thing & {
  alternateNames?: string[];
  abstract?: string;
  text?: string;
  encodingFormat?: string;
  contentReferenceTimes?: Event[];
  contentLocations?: Place[];
  keywords?: Term[];
  citations?: Citation[];
  hasParts?: ResearchGuide[];
  seeAlso?: ResearchGuide[];
};
