interface Role {
  _id: string;
  role: string;
}

export interface User {
  datavantMatchStatus: string;
  _id: string;
  lastLoginTime: Date;
  status: string;
  role: Role;
  firstName: string;
  lastName: string;
  email: string;
  gender: string;
  genderOther?: string;
  birthday: Date;
  phoneNumberPrimary: string;
  phoneNumberSecondary: string;
  zip: number;
  referralLinked:boolean;
  pushToken?: string;
  isBiometricEnabled?:boolean
  fhirPatientID?: string; // this will not be coming from DB. IT will be set from Patient Search API
}

export interface VerifyUser {
  status: string;
  userExists:boolean
}
