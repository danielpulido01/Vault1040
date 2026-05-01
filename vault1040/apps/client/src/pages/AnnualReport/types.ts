export type EntityType = 'profit-corp' | 'non-profit-corp' | 'llc' | 'lp' | 'lllp';

export type OfficerTitle = 'president' | 'vice-president' | 'secretary' | 'treasurer' | 'director';

export type LLCMemberType = 'manager' | 'member';

export type LPPartnerType = 'general' | 'limited';

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

export interface Officer {
  id: string;
  title: OfficerTitle;
  name: string;
  address: Address;
}

export interface LLCMember {
  id: string;
  type: LLCMemberType;
  name: string;
  address: Address;
}

export interface LPPartner {
  id: string;
  type: LPPartnerType;
  name: string;
  address: Address;
}

export interface AnnualReportFormData {
  // Step 1: Entity Information
  documentNumber: string;
  entityType: EntityType;
  businessName: string;
  fein: string;

  // Step 2: Addresses
  principalOffice: Address;
  sameAsPrincipal: boolean;
  mailingAddress: Address;
  registeredAgent: {
    name: string;
    address: FloridaAddress;
  };

  // Step 3: Officers/Members/Partners (based on entity type)
  officers: Officer[];
  llcMembers: LLCMember[];
  lpPartners: LPPartner[];

  // Contact info
  contactEmail: string;
  contactPhone: string;
}

export interface FilingFees {
  stateFee: number;
  serviceFee: number;
  lateFee: number;
  total: number;
}

export const STATE_FEES: Record<EntityType, number> = {
  'profit-corp': 150.0,
  'non-profit-corp': 61.25,
  'llc': 138.75,
  'lp': 500.0,
  'lllp': 500.0,
};

export const SERVICE_FEE = 50.0;
export const LATE_FEE = 400.0;

export function calculateFees(entityType: EntityType, isLate: boolean): FilingFees {
  const stateFee = STATE_FEES[entityType];
  const lateFee = isLate && entityType !== 'non-profit-corp' ? LATE_FEE : 0;
  const serviceFee = SERVICE_FEE;

  return {
    stateFee,
    serviceFee,
    lateFee,
    total: stateFee + serviceFee + lateFee,
  };
}

export function isAfterMay1(): boolean {
  const now = new Date();
  const may2 = new Date(now.getFullYear(), 4, 2); // Late fee starts May 2
  return now >= may2;
}
