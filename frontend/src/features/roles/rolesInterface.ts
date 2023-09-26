import { Loading } from "../utils/utilEnum";

export interface IMockMembers {
  id: number;
  first_name: string;
  last_name: string;
  profile_picture: string;
  member_type: string;
}

export interface IMember extends IMockMembers {
  selected: boolean;
}

export interface RolesCreateSlice {
  title: string;
  members: IMember[];
  status:
    | Loading.UNSEND
    | Loading.FULFILLED
    | Loading.PENDING
    | Loading.REJECTED;
}
