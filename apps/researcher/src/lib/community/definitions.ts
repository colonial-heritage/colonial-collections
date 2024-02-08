export interface Community {
  id: string;
  name: string;
  slug: string;
  description?: string;
  imageUrl: string;
  createdAt: number;
  membershipCount?: number;
}

export interface Membership {
  id: string;
  role: string;
  userId: string;
  firstName: string;
  lastName: string;
  imageUrl: string;
}

export enum SortBy {
  NameAsc = 'nameAsc',
  NameDesc = 'nameDesc',
  CreatedAtDesc = 'createdAtDesc',
  MembershipCountDesc = 'membershipCountDesc',
}
