/** OAuth2 token response from POST .../oauth2/token */
export interface TokenResponse {
  access_token: string;
  refresh_token: string;
  scope: string;
  id_token: string;
  token_type: string;
  expires_in: number;
}

export interface UserMembership {
  token: string;
  organisationId?: string;
}

export interface UserProfile {
  userId: string;
  userName: string;
  firstName: string;
  lastName: string;
  mobileNumber: string;
  isUSCitizen: boolean;
  status: string;
  isDeleted: boolean;
  lastLoginAt: string;
  contacts: unknown[];
  addresses: unknown[];
  listCustomFields: unknown[];
  employmentDetails: unknown[];
  taxDetails: unknown[];
  memberships: UserMembership[];
  orgRelationships: unknown[];
  kycDetails: { documents: unknown[] };
  apps: unknown[];
  listRoles: string[];
  permissions: unknown[];
  segments: unknown[];
  creditDetails: unknown[];
  createdAt: string;
  passwordExpired: boolean;
  updatedAt: string;
  cif: string;
  devices: unknown[];
  roles: unknown[];
}

export interface UserProfileResponse {
  data?: UserProfile;
}
