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
export interface TransactionType {
  id: number;
  account_id: number;
  item_id: number;
  user_id: number;
  plaid_transaction_id: string;
  plaid_category_id: string;
  category: string;
  subcategory: string;
  type: string;
  name: string;
  amount: number;
  iso_currency_code: string;
  unofficial_currency_code: string;
  date: string;
  pending: boolean;
  label: string | null;
  account_owner: string;
  created_at: string;
  updated_at: string;
}

export interface AssetType {
  id: number;
  user_id: number;
  value: number;
  description: string;
  created_at: string;
  updated_at: string;
}

export interface UserType {
  id: number;
  username: string | null;
  created_at: string;
  updated_at: string;
}
