import {describe, expect, it, jest, beforeEach} from '@jest/globals';
import {resolveLinkedArtImages} from './resolve-linked-art-images';

// Mock global fetch
const mockFetch = jest.fn<typeof fetch>();
global.fetch = mockFetch;

// --- Test fixtures based on real Rijksmuseum API responses ---

const objectResponse = {
  '@context': 'https://linked.art/ns/v1/linked-art.json',
  id: 'https://id.rijksmuseum.nl/200756632',
  type: 'HumanMadeObject',
  shows: [
    {id: 'https://id.rijksmuseum.nl/202756632', type: 'VisualItem'},
  ],
};

const visualItemResponse = {
  '@context': 'https://linked.art/ns/v1/linked-art.json',
  id: 'https://id.rijksmuseum.nl/202756632',
  type: 'VisualItem',
  digitally_shown_by: [
    {id: 'https://id.rijksmuseum.nl/500501061', type: 'DigitalObject'},
  ],
  subject_to: [
    {
      type: 'Right',
      classified_as: [
        {
          id: 'https://creativecommons.org/licenses/by/4.0/',
          type: 'Type',
        },
      ],
    },
  ],
};

const digitalObjectResponse = {
  '@context': 'https://linked.art/ns/v1/linked-art.json',
  id: 'https://id.rijksmuseum.nl/500501061',
  type: 'DigitalObject',
  access_point: [
    {
      id: 'https://iiif.micr.io/vYckM/full/max/0/default.jpg',
      type: 'DigitalObject',
    },
  ],
};

function jsonResponse(body: object): Response {
  return new Response(JSON.stringify(body), {
    status: 200,
    headers: {'Content-Type': 'application/ld+json'},
  });
}

describe('resolveLinkedArtImages', () => {
  beforeEach(() => {
    mockFetch.mockReset();
  });

  it('resolves images by walking the Linked Art chain', async () => {
    mockFetch
      .mockResolvedValueOnce(jsonResponse(objectResponse))
      .mockResolvedValueOnce(jsonResponse(visualItemResponse))
      .mockResolvedValueOnce(jsonResponse(digitalObjectResponse));

    const images = await resolveLinkedArtImages(
      'https://id.rijksmuseum.nl/200756632'
    );

    expect(images).toEqual([
      {
        id: 'https://id.rijksmuseum.nl/500501061',
        contentUrl: 'https://iiif.micr.io/vYckM/full/max/0/default.jpg',
        license: {id: 'https://creativecommons.org/licenses/by/4.0/'},
      },
    ]);

    // Verify 3 fetches were made with correct Accept header
    expect(mockFetch).toHaveBeenCalledTimes(3);
    expect(mockFetch).toHaveBeenNthCalledWith(
      1,
      'https://id.rijksmuseum.nl/200756632',
      expect.objectContaining({
        headers: expect.objectContaining({Accept: 'application/ld+json'}),
      })
    );
  });

  it('returns empty array when response is not Linked Art JSON-LD', async () => {
    mockFetch.mockResolvedValueOnce(
      new Response('<html><body>Not JSON</body></html>', {
        status: 200,
        headers: {'Content-Type': 'text/html'},
      })
    );

    const images = await resolveLinkedArtImages(
      'https://example.org/not-linked-art'
    );

    expect(images).toEqual([]);
  });

  it('returns empty array when fetch fails', async () => {
    mockFetch.mockRejectedValueOnce(new Error('Network error'));

    const images = await resolveLinkedArtImages(
      'https://example.org/unreachable'
    );

    expect(images).toEqual([]);
  });

  it('returns empty array when object has no shows property', async () => {
    const objectWithoutShows = {
      '@context': 'https://linked.art/ns/v1/linked-art.json',
      id: 'https://id.rijksmuseum.nl/200756632',
      type: 'HumanMadeObject',
    };

    mockFetch.mockResolvedValueOnce(jsonResponse(objectWithoutShows));

    const images = await resolveLinkedArtImages(
      'https://id.rijksmuseum.nl/200756632'
    );

    expect(images).toEqual([]);
  });

  it('returns images without license when VisualItem has no subject_to', async () => {
    const visualItemNoLicense = {
      '@context': 'https://linked.art/ns/v1/linked-art.json',
      id: 'https://id.rijksmuseum.nl/202756632',
      type: 'VisualItem',
      digitally_shown_by: [
        {id: 'https://id.rijksmuseum.nl/500501061', type: 'DigitalObject'},
      ],
    };

    mockFetch
      .mockResolvedValueOnce(jsonResponse(objectResponse))
      .mockResolvedValueOnce(jsonResponse(visualItemNoLicense))
      .mockResolvedValueOnce(jsonResponse(digitalObjectResponse));

    const images = await resolveLinkedArtImages(
      'https://id.rijksmuseum.nl/200756632'
    );

    expect(images).toEqual([
      {
        id: 'https://id.rijksmuseum.nl/500501061',
        contentUrl: 'https://iiif.micr.io/vYckM/full/max/0/default.jpg',
      },
    ]);
  });

  it('handles multiple visual items and digital objects', async () => {
    const objectWithMultipleShows = {
      '@context': 'https://linked.art/ns/v1/linked-art.json',
      id: 'https://id.rijksmuseum.nl/200000001',
      type: 'HumanMadeObject',
      shows: [
        {id: 'https://id.rijksmuseum.nl/202000001', type: 'VisualItem'},
        {id: 'https://id.rijksmuseum.nl/202000002', type: 'VisualItem'},
      ],
    };

    const visualItem1 = {
      '@context': 'https://linked.art/ns/v1/linked-art.json',
      id: 'https://id.rijksmuseum.nl/202000001',
      type: 'VisualItem',
      digitally_shown_by: [
        {id: 'https://id.rijksmuseum.nl/500000001', type: 'DigitalObject'},
      ],
      subject_to: [
        {
          type: 'Right',
          classified_as: [
            {id: 'https://creativecommons.org/publicdomain/zero/1.0/', type: 'Type'},
          ],
        },
      ],
    };

    const visualItem2 = {
      '@context': 'https://linked.art/ns/v1/linked-art.json',
      id: 'https://id.rijksmuseum.nl/202000002',
      type: 'VisualItem',
      digitally_shown_by: [
        {id: 'https://id.rijksmuseum.nl/500000002', type: 'DigitalObject'},
        {id: 'https://id.rijksmuseum.nl/500000003', type: 'DigitalObject'},
      ],
    };

    const digitalObject1 = {
      '@context': 'https://linked.art/ns/v1/linked-art.json',
      id: 'https://id.rijksmuseum.nl/500000001',
      type: 'DigitalObject',
      access_point: [
        {id: 'https://example.org/image1.jpg', type: 'DigitalObject'},
      ],
    };

    const digitalObject2 = {
      '@context': 'https://linked.art/ns/v1/linked-art.json',
      id: 'https://id.rijksmuseum.nl/500000002',
      type: 'DigitalObject',
      access_point: [
        {id: 'https://example.org/image2.jpg', type: 'DigitalObject'},
      ],
    };

    const digitalObject3 = {
      '@context': 'https://linked.art/ns/v1/linked-art.json',
      id: 'https://id.rijksmuseum.nl/500000003',
      type: 'DigitalObject',
      access_point: [
        {id: 'https://example.org/image3.jpg', type: 'DigitalObject'},
      ],
    };

    mockFetch
      .mockResolvedValueOnce(jsonResponse(objectWithMultipleShows))
      // VisualItems fetched in parallel — order depends on Promise.all
      .mockResolvedValueOnce(jsonResponse(visualItem1))
      .mockResolvedValueOnce(jsonResponse(visualItem2))
      // DigitalObjects fetched in parallel
      .mockResolvedValueOnce(jsonResponse(digitalObject1))
      .mockResolvedValueOnce(jsonResponse(digitalObject2))
      .mockResolvedValueOnce(jsonResponse(digitalObject3));

    const images = await resolveLinkedArtImages(
      'https://id.rijksmuseum.nl/200000001'
    );

    expect(images).toHaveLength(3);
    expect(images).toEqual(
      expect.arrayContaining([
        {
          id: 'https://id.rijksmuseum.nl/500000001',
          contentUrl: 'https://example.org/image1.jpg',
          license: {id: 'https://creativecommons.org/publicdomain/zero/1.0/'},
        },
        {
          id: 'https://id.rijksmuseum.nl/500000002',
          contentUrl: 'https://example.org/image2.jpg',
        },
        {
          id: 'https://id.rijksmuseum.nl/500000003',
          contentUrl: 'https://example.org/image3.jpg',
        },
      ])
    );
  });
});
