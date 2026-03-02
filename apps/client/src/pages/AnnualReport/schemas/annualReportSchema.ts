import { z } from 'zod';

export const entityTypes = ['profit-corp', 'non-profit-corp', 'llc', 'lp', 'lllp'] as const;
export const officerTitles = ['president', 'vice-president', 'secretary', 'treasurer', 'director'] as const;
export const llcMemberTypes = ['manager', 'member'] as const;
export const lpPartnerTypes = ['general', 'limited'] as const;

export const addressSchema = z.object({
  street: z.string().min(1, 'Street address is required'),
  city: z.string().min(1, 'City is required'),
  state: z.string().min(2, 'State is required').max(2, 'Use state abbreviation'),
  zipCode: z.string().regex(/^\d{5}(-\d{4})?$/, 'Invalid ZIP code format'),
  country: z.string().default('United States'),
});

export const floridaAddressSchema = z.object({
  street: z.string().min(1, 'Street address is required'),
  city: z.string().min(1, 'City is required'),
  zipCode: z.string().regex(/^\d{5}(-\d{4})?$/, 'Invalid ZIP code format'),
});

export const officerSchema = z.object({
  id: z.string(),
  title: z.enum(officerTitles),
  name: z.string().min(1, 'Name is required'),
  address: addressSchema,
});

export const llcMemberSchema = z.object({
  id: z.string(),
  type: z.enum(llcMemberTypes),
  name: z.string().min(1, 'Name is required'),
  address: addressSchema,
});

export const lpPartnerSchema = z.object({
  id: z.string(),
  type: z.enum(lpPartnerTypes),
  name: z.string().min(1, 'Name is required'),
  address: addressSchema,
});

// Step 1: Entity Information
export const entityInfoSchema = z.object({
  documentNumber: z
    .string()
    .min(1, 'Document number is required')
    .regex(/^[A-Z]\d{11,12}$/i, 'Invalid Florida document number format (e.g., L12345678901)'),
  entityType: z.enum(entityTypes, {
    required_error: 'Please select an entity type',
  }),
  businessName: z.string().min(1, 'Business name is required'),
  fein: z
    .string()
    .min(1, 'FEIN is required')
    .regex(/^\d{2}-\d{7}$/, 'FEIN must be in XX-XXXXXXX format'),
});

// Step 2: Addresses
export const addressesSchema = z.object({
  principalOffice: addressSchema,
  sameAsPrincipal: z.boolean().default(false),
  mailingAddress: addressSchema,
  registeredAgent: z.object({
    name: z.string().min(1, 'Registered agent name is required'),
    address: floridaAddressSchema,
  }),
});

// Step 3: Officers (validated based on entity type in the full schema)
export const officersSchema = z.object({
  officers: z.array(officerSchema).optional(),
  llcMembers: z.array(llcMemberSchema).optional(),
  lpPartners: z.array(lpPartnerSchema).optional(),
});

// Contact info
export const contactSchema = z.object({
  contactEmail: z.string().email('Invalid email address'),
  contactPhone: z.string().optional(),
});

// Full form schema with cross-field validation
export const annualReportSchema = z
  .object({
    // Step 1
    documentNumber: entityInfoSchema.shape.documentNumber,
    entityType: entityInfoSchema.shape.entityType,
    businessName: entityInfoSchema.shape.businessName,
    fein: entityInfoSchema.shape.fein,
    // Step 2
    principalOffice: addressSchema,
    sameAsPrincipal: z.boolean().default(false),
    mailingAddress: addressSchema,
    registeredAgent: z.object({
      name: z.string().min(1, 'Registered agent name is required'),
      address: floridaAddressSchema,
    }),
    // Step 3
    officers: z.array(officerSchema).default([]),
    llcMembers: z.array(llcMemberSchema).default([]),
    lpPartners: z.array(lpPartnerSchema).default([]),
    // Contact
    contactEmail: z.string().email('Invalid email address'),
    contactPhone: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    // Validate officers based on entity type
    if (data.entityType === 'profit-corp' || data.entityType === 'non-profit-corp') {
      if (!data.officers || data.officers.length === 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'At least one officer is required for corporations',
          path: ['officers'],
        });
      } else {
        const hasPresident = data.officers.some((o) => o.title === 'president');
        if (!hasPresident) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'A President is required',
            path: ['officers'],
          });
        }
      }
    }

    if (data.entityType === 'llc') {
      if (!data.llcMembers || data.llcMembers.length === 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'At least one manager or member is required for LLCs',
          path: ['llcMembers'],
        });
      }
    }

    if (data.entityType === 'lp' || data.entityType === 'lllp') {
      const hasGeneralPartner = data.lpPartners?.some((p) => p.type === 'general');
      if (!hasGeneralPartner) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'At least one general partner is required',
          path: ['lpPartners'],
        });
      }
    }
  });

export type AnnualReportSchemaType = z.infer<typeof annualReportSchema>;
