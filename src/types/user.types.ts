export interface UserCredentials {
  username: string;
  password: string;
}

export type UserRole = 'admin' | 'user' | 'viewer' | 'manager';

export interface UserProfile {
  id:        string;
  username:  string;
  email:     string;
  firstName: string;
  lastName:  string;
  role:      UserRole;
  avatar?:   string;
}
