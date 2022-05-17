export interface entity {
  goalUserId?: string;
  entityType?: string;
  identityCard?: string;
  personalNumber?: string;
  firstName?: string;
  lastName?: string;
  akaUnit?: string;
  dischargeDay?: Date;
  rank?: string;
  serviceType?: string;
  phone?: string[];
  mobilePhone?: string[];
  address?: string;
  clearance?: string;
  pictures?: {
    profile?: {
      meta?: any;
    };
  };
  sex?: string;
  birthDate?: Date;
  employeeId?: string;
  employeeNumber?: string;
  organization?: string;
}