export interface Community {
  id: string;
  name: string;
  slug: string;
  description?: string;
  attributionId?: string;
  imageUrl: string;
  createdAt: number;
  membershipCount?: number;
  license?: string;
  canAddEnrichments: boolean;
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
