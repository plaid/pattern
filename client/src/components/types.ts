// reserved for types

export interface RouteInfo {
  userId: string;
}

export interface ItemType {
  id: number;
  plaid_item_id: string;
  user_id: number;
  plaid_access_token: string;
  plaid_institution_id: string;
  plaid_account_id: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface AccountType {
  id: number;
  item_id: number;
  user_id: number;
  plaid_account_id: string;
  name: string;
  mask: string;
  official_name: string;
  current_balance: number;
  available_balance: number;
  iso_currency_code: string;
  unofficial_currency_code: string;
  ach_account: string;
  ach_routing: string;
  ach_wire_routing: string;
  owner_names: string[];
  emails: string[];
  type: 'depository' | 'investment' | 'loan' | 'credit';
  subtype:
    | 'checking'
    | 'savings'
    | 'cd'
    | 'money market'
    | 'ira'
    | '401k'
    | 'student'
    | 'mortgage'
    | 'credit card';
  created_at: string;
  updated_at: string;
}
export interface UserType {
  id: number;
  username: string;
  fullname: string;
  email: string;
  identity_check: boolean;
  created_at: string;
  updated_at: string;
}
