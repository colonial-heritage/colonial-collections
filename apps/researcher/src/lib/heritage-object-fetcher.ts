export type Dataset = {
  id: string; // "https://example.org/datasets/1"
  name: string; // "Dataset 1"
};

export type Organization = {
  id: string; // "https://museum.example.org/"
  name: string; // "Museum"
};

export type Person = {
  id: string; // "https://data.rkd.nl/artists/32439"
  name: string; // "Vincent van Gogh"
};

export type Term = {
  id: string; // "http://vocab.getty.edu/aat/300033618"
  name: string; // "Painting"
};

export type HeritageObject = {
  id: string; // "https://example.org/objects/1"
  name: string; // "Mauris vestibulum varius lectus"
  description: string; // "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean ultrices velit vitae vulputate tincidunt. Donec dictum tortor nec tempus mollis."
  // dateCreated: string; // "1889-1890"
  // additionalType: Term[];
  // about: Term[];
  // material: Term[];
  // creator: Person[];
  // owner: Organization;
  // isPartOf: Dataset;
};

export type SearchResult = {
  heritageObjects: HeritageObject[];
  totalCount: number;
};
