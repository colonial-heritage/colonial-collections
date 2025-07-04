import {Event, Place, Term, Thing} from '../definitions';

export enum CitationType {
  PrimarySource = 'primary',
  SecondarySource = 'secondary',
}

export type Citation = Thing & {
  type: CitationType;
  url?: string;
};

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
