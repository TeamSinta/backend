import { Loading } from "../utils/utilEnum";

export interface IMockMembers {
  member_idx: number;
  member_name: string;
  member_url: string;
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
