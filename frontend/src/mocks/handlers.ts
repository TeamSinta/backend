import { IInviteMember } from "@/features/inviteMember/inviteMemberInterface";
import { rest } from "msw";
import { invitedMember } from "./mockDatas";

export const handlers = [
  rest.post<IInviteMember>("/inviteMember", async (req, res, ctx) => {
    let result = invitedMember;
    await req.json().then((data: IInviteMember) => {
      result = data.admin
        ? { ...invitedMember, admin: true }
        : { ...invitedMember, admin: false };
    });
    return res(ctx.delay(), ctx.status(200), ctx.json(result));
  }),
];
