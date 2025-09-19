export interface LoginFormData {
  username: string;
  password: string;
}

export interface RegisterFormData extends LoginFormData {
  email: string;
  country: string;
  region: string;
  city: string;
  postal_code: string;
  address: string;
  house_number: string;
  phone: string;
  AFM: string;
}