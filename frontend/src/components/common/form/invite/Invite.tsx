import { AppDispatch } from "@/app/store";
import {
  postInviteMemberAsync,
  selectInviteMember,
  setInviteAsAdmin,
  setInviteMemberInput,
} from "@/features/inviteMember/inviteMemberSlice";
import { addInvitedMember } from "@/features/roles/rolesSlice";
import { BackgroundColor, Loading } from "@/features/utils/utilEnum";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { TextBtnL } from "../../buttons/textBtn/TextBtn";
import CheckBox from "../checkBox/CheckBox";
import { Input } from "../input/StyledInput";
import { InviteContainer, InviteWrap } from "./StyledInvite";
import ElWrap from "@/components/layouts/elWrap/ElWrap";

const TextBtnLProps = {
  disable: false,
  label: "invite",
  onclick: () => {},
  className: BackgroundColor.WHITE,
};

export interface IInviteProps {
  invite_member: {
    member_email: string;
    admin: boolean;
  };
  status:
    | Loading.FULFILLED
    | Loading.PENDING
    | Loading.UNSEND
    | Loading.REJECTED;
}

const Invite = () => {
  //redux
  const { invite_member, status } = useSelector(selectInviteMember);
  const dispatch = useDispatch<AppDispatch>();

  const [inviteMemberEmail, setInviteMemberEmail] = useState(
    invite_member.member_email
  );
  const [inviteMemberAdmin, setInviteMemberAdmin] = useState(
    invite_member.admin
  );
  const [apiStatus, setApiStatus] = useState(status);

  if (apiStatus === Loading.PENDING) {
    TextBtnLProps.disable = true;
  } else {
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
    setApiStatus(Loading.PENDING);
    dispatch(postInviteMemberAsync(invite_member))
      .then((action) => {
        dispatch(addInvitedMember({ invitedMember: action.payload }));
      })
      .then(() => {
        setInviteMemberEmail("");
        setInviteMemberAdmin(false);
        setApiStatus(Loading.FULFILLED);
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
          disabled={apiStatus === Loading.PENDING ? true : false}
        />
        <ElWrap w={120}>
          <TextBtnL
            {...TextBtnLProps}
            onClick={
              apiStatus === Loading.PENDING ? () => {} : onIviteMemberClick
            }
          />
        </ElWrap>
      </InviteContainer>
      <CheckBox
        label="Invite as Admin"
        onChange={(e) => {
          onInviteAsAdinCheck(e);
        }}
        inputName={"admin"}
        checked={inviteMemberAdmin}
        disabled={apiStatus === Loading.PENDING ? true : false}
      />
    </InviteWrap>
  );
};

export default Invite;
