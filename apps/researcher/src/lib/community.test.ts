import {describe, expect, it} from '@jest/globals';
import {auth} from '@clerk/nextjs';
import {isAdmin, Membership} from './community';

jest.mock('@clerk/nextjs', () => ({
  auth: jest.fn().mockImplementation(() => ({
    userId: 'me',
  })),
}));

describe('isAdmin', () => {
  it('returns true if user is an admin', () => {
    const memberships: ReadonlyArray<Membership> = [
      {
        id: 'membership1',
        role: 'admin',
        publicUserData: {
          userId: 'me',
          firstName: 'John',
          lastName: 'Doe',
          profileImageUrl: 'https://example.com/image.png',
        },
      },
      {
        id: 'membership2',
        role: 'basic_member',
        publicUserData: {
          userId: 'notMe',
          firstName: 'Jane',
          lastName: 'Doe',
          profileImageUrl: 'https://example.com/image.png',
        },
      },
    ];
    expect(isAdmin(memberships)).toEqual(true);
  });

  it('returns false if user is not an admin', () => {
    const memberships: ReadonlyArray<Membership> = [
      {
        id: 'membership1',
        role: 'basic_member',
        publicUserData: {
          userId: 'me',
          firstName: 'John',
          lastName: 'Doe',
          profileImageUrl: 'https://example.com/image.png',
        },
      },
    ];
    expect(isAdmin(memberships)).toEqual(false);
  });

  it('returns false if user is not a member', () => {
    const memberships: ReadonlyArray<Membership> = [
      {
        id: 'membership1',
        role: 'basic_member',
        publicUserData: {
          userId: 'notMe',
          firstName: 'John',
          lastName: 'Doe',
          profileImageUrl: 'https://example.com/image.png',
        },
      },
    ];
    expect(isAdmin(memberships)).toEqual(false);
  });

  it('returns false if user is not logged in', () => {
    (auth as jest.Mock).mockImplementation(() => ({
      userId: undefined,
    }));

    const memberships: ReadonlyArray<Membership> = [
      {
        id: 'membership1',
        role: 'admin',
        publicUserData: {
          userId: 'notMe',
          firstName: 'John',
          lastName: 'Doe',
          profileImageUrl: 'https://example.com/image.png',
        },
      },
    ];
    expect(isAdmin(memberships)).toEqual(false);
  });

  it('returns false if there are no memberships', () => {
    const memberships: Membership[] = [];
    expect(isAdmin(memberships)).toEqual(false);
  });
});
