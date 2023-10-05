export interface UserData {
  first_name: string | null;
  last_name: string | null;
}

export interface MembersList {
  id: number;
  username: string;
  first_name: string;
  last_name: string;
  email: string;
  role: string;
  profile_picture: string | null;
}
