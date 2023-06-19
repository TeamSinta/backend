import { MockMembers } from "../roles/rolesAPI";
import { IMockMembers } from "../roles/rolesInterface";
import { IInviteMember } from "./inviteMemberInterface";

export const postInviteMember = (inviteMember: IInviteMember) => {
  //MOCK DATA
  const invitedMember = {
    member_idx: Math.random(),
    member_name: "Sammy Kavanagh",
    member_url: "",
    member_type: inviteMember.admin ? "admin" : "member",
  };

  MockMembers.push(invitedMember);
  return new Promise<{ data: IMockMembers }>((resolve) =>
    setTimeout(() => resolve({ data: invitedMember }), 500)
  );
};
