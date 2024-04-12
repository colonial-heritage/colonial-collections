import {createPersistentIri} from './create-persistent-iri';
import {describe, expect, it} from '@jest/globals';

describe('createPersistentIri', () => {
  it('returns a persistent IRI', () => {
    expect(createPersistentIri()).toMatch(
      /^https:\/\/n2t\.net\/ark:\/27023\/.{32}$/
    );
  });
});
