import { AppDispatch } from "@/app/store";
import {
  postInviteMemberAsync,
  selectInviteMember,
  setInviteAsAdmin,
  setInviteMemberInput,
} from "@/features/inviteMember/inviteMemberSlice";
import { addInvitedMember } from "@/features/roles/rolesSlice";
import { Loading } from "@/features/utils/utilInterface";
import { useDispatch, useSelector } from "react-redux";
import TextBtnL from "../../buttons/textBtnL/TextBtnL";
import CheckBox from "../checkBox/CheckBox";
import { Input } from "../input/StyledInput";
import { InviteContainer, InviteWrap } from "./StyledInvite";
import { useState } from "react";

const TextBtnLProps = {
  disable: false,
  label: "invite",
  onclick: () => {},
};

const Invite = () => {
  const { status, invite_member } = useSelector(selectInviteMember);
  const dispatch = useDispatch<AppDispatch>();

  const [inviteMemberEmail, setInviteMemberEmail] = useState(
    invite_member.member_email
  );

  const [inviteMemberAdmin, setInviteMemberAdmin] = useState(
    invite_member.admin
  );

  if (status === Loading.PENDING) {
    TextBtnLProps.disable = true;
  }

  if (status === Loading.FULFILLED || status === Loading.UNSEND) {
    TextBtnLProps.disable = false;
  }

  const onInviteMemberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInviteMemberEmail(e.target.value);
    dispatch(setInviteMemberInput({ invite_member: e.target.value }));
  };

  const onInviteAsAdinCheck = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInviteMemberAdmin(e.target.checked);
    dispatch(setInviteAsAdmin({ admin: e.target.checked }));
  };

  const onIviteMemberClick = () => {
    dispatch(postInviteMemberAsync(invite_member)).then((action) => {
      dispatch(addInvitedMember({ invitedMember: action.payload }));
      setInviteMemberEmail("");
      setInviteMemberAdmin(false);
    });
  };

  return (
    <InviteWrap>
      <InviteContainer>
        <Input
          placeholder="Invite"
          name="invite_member"
          onChange={(e) => {
            onInviteMemberChange(e);
          }}
          value={inviteMemberEmail}
          disabled={status === Loading.PENDING ? true : false}
        />
        <TextBtnL
          {...TextBtnLProps}
          onClick={status === Loading.PENDING ? () => {} : onIviteMemberClick}
        />
      </InviteContainer>
      <CheckBox
        label="Invite as Admin"
        onChange={(e) => {
          onInviteAsAdinCheck(e);
        }}
        inputName={"admin"}
        checked={inviteMemberAdmin}
        disabled={status === Loading.PENDING ? true : false}
      />
    </InviteWrap>
  );
};

export default Invite;
