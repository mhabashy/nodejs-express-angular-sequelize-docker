export interface Patient {
  id?: number;
  firstName?: string,
  lastName?: string,
  name?: string,
  dateOfBirth?: string,
  age?: string,
  phone?: string;
  email?: string;
  refills?: boolean;
  online?: boolean;
  contactType?: string;
  address?: string;
  city?: string;
  zipcode?: number;
  isNew?: boolean;
  generalQuestion?: boolean;
}

