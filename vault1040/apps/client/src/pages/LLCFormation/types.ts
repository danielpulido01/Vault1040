export type ManagementType = 'MEMBER_MANAGED' | 'MANAGER_MANAGED';
export type MemberManagerRole = 'member' | 'manager';

export interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface FloridaAddress {
  street: string;
  city: string;
  zipCode: string;
}

export interface MemberManager {
  id: string;
  role: MemberManagerRole;
  name: string;
  address: Address;
}

export interface LLCFormationData {
  // Step 1: Business Info
  llcName: string;
  fein: string;
  effectiveDate: string;

  // Step 2: Addresses
  principalOffice: Address;
  sameAsPrincipal: boolean;
  mailingAddress: Address;
  registeredAgent: {
    name: string;
    address: FloridaAddress;
  };

  // Step 3: Management
  managementType: ManagementType;
  membersManagers: MemberManager[];

  // Contact
  contactEmail: string;
  contactPhone: string;
}

export const STATE_FEE = 125.0;
export const SERVICE_FEE = 50.0;
export const TOTAL_FEE = STATE_FEE + SERVICE_FEE;
