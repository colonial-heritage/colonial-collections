import {describe, expect, it} from '@jest/globals';
import {clerkClient, auth} from '@clerk/nextjs';
import {getCommunity, getMemberships, isAdminOf, Membership} from './community';

jest.mock('@clerk/nextjs', () => ({
  auth: jest.fn().mockImplementation(() => ({
    userId: 'me',
  })),
  clerkClient: {
    organizations: {
      getOrganization: jest.fn(),
      getOrganizationMembershipList: jest.fn(),
    },
  },
}));

describe('getCommunity', () => {
  it('should return a community', async () => {
    (clerkClient.organizations.getOrganization as jest.Mock).mockImplementation(
      () => ({
        id: 'community1',
      })
    );

    const {community, error} = await getCommunity('community1');

    expect(community).toEqual({id: 'community1'});
    expect(error).toBeUndefined();
  });

  it('should return an error', async () => {
    (clerkClient.organizations.getOrganization as jest.Mock).mockImplementation(
      () => {
        throw {status: 404};
      }
    );

    const {community, error} = await getCommunity('throwError');

    expect(community).toBeUndefined();
    expect(error).toEqual({status: 404});
  });
});

describe('getMemberships', () => {
  it('should return memberships', async () => {
    (
      clerkClient.organizations.getOrganizationMembershipList as jest.Mock
    ).mockImplementation(() => [
      {
        role: 'role',
      },
    ]);

    const {memberships, error} = await getMemberships('community1');

    expect(memberships).toEqual([
      {
        role: 'role',
      },
    ]);
    expect(error).toBeUndefined();
  });
  it('should return an error', async () => {
    (
      clerkClient.organizations.getOrganizationMembershipList as jest.Mock
    ).mockImplementation(() => {
      throw {status: 500};
    });

    const {memberships, error} = await getMemberships('community1');

    expect(memberships).toBeUndefined();
    expect(error).toEqual({status: 500});
  });
});

describe('isAdminOf', () => {
  it('should return true is the user is an admin', () => {
    const memberships = [
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
        role: 'basis_member',
        publicUserData: {
          userId: 'notMe',
          firstName: 'Jane',
          lastName: 'Doe',
          profileImageUrl: 'https://example.com/image.png',
        },
      },
    ];
    expect(isAdminOf(memberships)).toEqual(true);
  });

  it('should return false if the user is not an admin', () => {
    const memberships = [
      {
        id: 'membership1',
        role: 'basis_member',
        publicUserData: {
          userId: 'me',
          firstName: 'John',
          lastName: 'Doe',
          profileImageUrl: 'https://example.com/image.png',
        },
      },
    ];
    expect(isAdminOf(memberships)).toEqual(false);
  });

  it('should return false is user is not an member', () => {
    const memberships = [
      {
        id: 'membership1',
        role: 'basis_member',
        publicUserData: {
          userId: 'notMe',
          firstName: 'John',
          lastName: 'Doe',
          profileImageUrl: 'https://example.com/image.png',
        },
      },
    ];
    expect(isAdminOf(memberships)).toEqual(false);
  });

  it('should return false if user is not logged in', () => {
    (auth as jest.Mock).mockImplementation(() => ({
      userId: undefined,
    }));

    const memberships = [
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
    expect(isAdminOf(memberships)).toEqual(false);
  });

  it('should return false if memberships is empty', () => {
    const memberships: Membership[] = [];
    expect(isAdminOf(memberships)).toEqual(false);
  });
});
