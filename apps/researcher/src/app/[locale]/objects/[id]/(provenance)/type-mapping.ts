export enum ProvenanceEventType {
  Acquisition = 'acquisition',
  TransferOfCustody = 'transferOfCustody',
}

export enum UserTypeOption {
  Bequest = 'Bequest',
  Donation = 'Donation',
  Gift = 'Gift',
  Transfer = 'Transfer',
  Purchase = 'Purchase',
  OriginalOwner = 'OriginalOwner',
  Restitution = 'Restitution',
  Inheritance = 'Inheritance',
  Stolen = 'Stolen',
  Loot = 'Loot',
  Confiscated = 'Confiscated',
}

export const typeMapping = {
  [UserTypeOption.Bequest]: {
    type: ProvenanceEventType.Acquisition,
    additionalType: 'http://vocab.getty.edu/aat/300417641',
    translationKey: 'bequest',
  },
  [UserTypeOption.Donation]: {
    type: ProvenanceEventType.Acquisition,
    additionalType: 'http://vocab.getty.edu/aat/300417638',
    translationKey: 'donation',
  },
  [UserTypeOption.Gift]: {
    type: ProvenanceEventType.Acquisition,
    additionalType: 'http://vocab.getty.edu/aat/300417637',
    translationKey: 'gift',
  },
  [UserTypeOption.Transfer]: {
    type: ProvenanceEventType.Acquisition,
    additionalType: 'http://vocab.getty.edu/aat/300417644',
    translationKey: 'transfer',
  },
  [UserTypeOption.Purchase]: {
    type: ProvenanceEventType.Acquisition,
    additionalType: 'http://vocab.getty.edu/aat/300417642',
    translationKey: 'purchase',
  },
  [UserTypeOption.OriginalOwner]: {
    type: ProvenanceEventType.TransferOfCustody,
    additionalType: 'http://vocab.getty.edu/aat/300417653',
    translationKey: 'originalOwner',
  },
  [UserTypeOption.Restitution]: {
    type: ProvenanceEventType.TransferOfCustody,
    additionalType: 'http://vocab.getty.edu/aat/300417843',
    translationKey: 'restitution',
  },
  [UserTypeOption.Inheritance]: {
    type: ProvenanceEventType.TransferOfCustody,
    additionalType: 'http://vocab.getty.edu/aat/300444188',
    translationKey: 'inheritance',
  },
  [UserTypeOption.Stolen]: {
    type: ProvenanceEventType.TransferOfCustody,
    additionalType: 'http://vocab.getty.edu/aat/300417657',
    translationKey: 'stolen',
  },
  [UserTypeOption.Loot]: {
    type: ProvenanceEventType.TransferOfCustody,
    additionalType: 'http://vocab.getty.edu/aat/300417659',
    translationKey: 'loot',
  },
  [UserTypeOption.Confiscated]: {
    type: ProvenanceEventType.TransferOfCustody,
    additionalType: 'http://vocab.getty.edu/aat/300417658',
    translationKey: 'confiscated',
  },
};
