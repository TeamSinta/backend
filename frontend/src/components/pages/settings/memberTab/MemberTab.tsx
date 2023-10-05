import ElWrap from "@/components/layouts/elWrap/ElWrap";
import GlobalModal, { MODAL_TYPE } from "@/components/common/modal/GlobalModal";
import { AppDispatch } from "@/app/store";
import { openModal } from "@/features/modal/modalSlice";
import { setMemberInfo } from "@/features/members/memberSlice";
import Stack from "@mui/material/Stack";
import DropdownFilter from "@/components/common/filters/dropdownFilter/DropdownFilter";
import StyledInvitationBox from "@/components/common/form/inviteBox/InviteBox";
import SettingsUserCard from "@/components/common/cards/settingsUserCard/SettingsUserCard";
import { UserListContainer } from "@/pages/Settings/StyledSettings";
import { useEffect, useState } from "react";
import { useGetCompanyMembersMutation } from "@/features/settingsDetail/userSettingsAPI";
import { useDispatch, useSelector } from "react-redux";
import { useCookies } from "react-cookie";
import { RootState } from "@/app/store";
import {
  AccessToken,
  CompanyID,
} from "@/features/settingsDetail/userSettingTypes";
import { MembersList } from "@/features/settingsDetail/userSettingsInterface";

const MemberTab = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.user);
  const [users, setUsers] = useState<MembersList[]>([]);
  const [cookies, ,] = useCookies(["access_token"]);
  const accessToken = cookies.access_token as AccessToken;
  const [getCompanyMembers] = useGetCompanyMembersMutation();
  const [sortCriteria, setSortCriteria] = useState<string>("");

  const onClickModalOpen = (modalType: MODAL_TYPE) => {
    dispatch(
      openModal({
        modalType: modalType,
      })
    );
  };

  const companyId = user.company as CompanyID;

  useEffect(() => {
    getCompanyMembers({ access: accessToken, company_id: companyId })
      .then((response) => {
        if ("data" in response) {
          setUsers(response.data);
        } else if ("error" in response) {
          console.error("Error fetching company users:", response.error);
        }
      })
      .catch((error) => console.error("Error fetching company users:", error));
  }, [accessToken, companyId, getCompanyMembers]);

  useEffect(() => {}, [users]);

  const handleSortMembers = (value: string) => {
    setSortCriteria(value);
  };

  const sortedUsers = [...users].sort((a, b) => {
    switch (sortCriteria) {
      case "name-asc":
        return a.first_name.localeCompare(b.first_name);
      case "name-desc":
        return b.first_name.localeCompare(a.first_name);
      case "permission":
        return a.role.localeCompare(b.role);
      default:
        return 0;
    }
  });

  return (
    <>
      <Stack direction="column" spacing={4}>
        <Stack
          direction="row"
          spacing={4}
          justifyContent="space-between"
          style={{}}
        >
          <ElWrap w={270}>
            <DropdownFilter
              label="Department"
              value=""
              optionArr={[
                { name: "All", value: "all" },
                { name: "Department 1", value: "dept1" },
                { name: "Department 2", value: "dept2" },
              ]}
              dropdownName=""
            />
          </ElWrap>
          <ElWrap w={120}>
            <DropdownFilter
              label="Sort By"
              value={sortCriteria}
              onChange={(value) => handleSortMembers(value)}
              optionArr={[
                { name: "Name (A-Z)", value: "name-asc" },
                { name: "Name (Z-A)", value: "name-desc" },
                { name: "Permission Level", value: "permission" },
              ]}
              dropdownName=""
            />
          </ElWrap>
        </Stack>

        <UserListContainer>
          <Stack direction="column" spacing={3}>
            {sortedUsers.map((user) => (
              <SettingsUserCard
                key={user.id}
                user={user}
                onClick={() => {
                  dispatch(
                    setMemberInfo({
                      firstName: user.first_name,
                      lastName: user.last_name,
                      email: user.email,
                      pictureUrl: user.profile_picture,
                    })
                  );
                  onClickModalOpen(MODAL_TYPE.MEMBER_SET);
                }}
              />
            ))}
          </Stack>
        </UserListContainer>
      </Stack>
      <StyledInvitationBox />
      <GlobalModal></GlobalModal>
    </>
  );
};

export default MemberTab;
