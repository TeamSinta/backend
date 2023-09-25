import React, { useState, useEffect } from "react";
import { Stack, Box } from "@mui/material";
import { fetchCompanyUsers } from "@/features/settingsDetail/userSettingsAPI";
import {
  BodyLMedium,
  BodySMedium,
  H1,
} from "@/components/common/typeScale/StyledTypeScale";
import TextIconFilter from "@/components/common/filters/textIconFilter/TextIconFilter";
import TextInput from "@/components/common/form/textInput/TextInput";
import {
  PlusIcon,
  BinIcon,
  CandidateIcon,
  PencilIcon,
} from "@/components/common/svgIcons/Icons";
import SettingsUserCard from "@/components/common/cards/settingsUserCard/SettingsUserCard";
import UserModal from "@/components/common/modal/userSettingsModal/UserSettingsModal";
import DropdownFilter from "@/components/common/filters/dropdownFilter/DropdownFilter";
import { BackgroundColor } from "@/features/utils/utilEnum";
import ElWrap from "@/components/layouts/elWrap/ElWrap";
import ProfilePicture from "src/assets/images/Homie.png";
import { TextIconBtnL } from "@/components/common/buttons/textIconBtn/TextIconBtn";
import {
  StyledImage,
  PageContainer,
  DeleteBox,
  ChildElement,
  UserListContainer,
  ProfilePictureContainer,
} from "./StyledSettings";
import StyledInvitationBox from "@/components/common/form/inviteBox/InviteBox";

const SettingsPage = () => {
  const hardCodedUsers = [
    {
      id: 1,
      username: "User1",
      email: "user1@example.com",
      role: "Admin",
      profile_picture: "https://via.placeholder.com/40x40",
    },
    {
      id: 2,
      username: "User2",
      email: "user2@example.com",
      role: "Interviewer",
      profile_picture: "https://via.placeholder.com/40x40",
    },
    {
      id: 3,
      username: "User3",
      email: "user3@example.com",
      role: "Candidate",
      profile_picture: "https://via.placeholder.com/40x40",
    },
    {
      id: 4,
      username: "User4",
      email: "user4@example.com",
      role: "Admin",
      profile_picture: "https://via.placeholder.com/40x40",
    },
    {
      id: 5,
      username: "User5",
      email: "user5@example.com",
      role: "Interviewer",
      profile_picture: "https://via.placeholder.com/40x40",
    },
    {
      id: 6,
      username: "User6",
      email: "user6@example.com",
      role: "Candidate",
      profile_picture: "https://via.placeholder.com/40x40",
    },
    {
      id: 6,
      username: "User6",
      email: "user6@example.com",
      role: "Candidate",
      profile_picture: "https://via.placeholder.com/40x40",
    },
    {
      id: 6,
      username: "User6",
      email: "user6@example.com",
      role: "Candidate",
      profile_picture: "https://via.placeholder.com/40x40",
    },
  ];

  const [users, setUsers] = useState(hardCodedUsers);
  const [activeTab, setActiveTab] = useState("profile");
  const [selectedUser, setSelectedUser] = useState(null);

  const handleCardClick = (user) => {
    setSelectedUser(user);
  };

  const handleCloseModal = () => {
    setSelectedUser(null);
  };

  const companyId = 1; // Replace with the actual company ID

  useEffect(() => {
    // Fetch company users when the component mounts
    fetchCompanyUsers(companyId)
      .then((data) => setUsers(data))
      .catch((error) => console.error("Error fetching company users:", error));
  }, [companyId]);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  return (
    <div>
      <H1>Settings</H1>
      <Box
        sx={{
          paddingTop: "20px",
          paddingBottom: "28px",
          display: "flex",
          gap: "4px",
        }}
      >
        <TextIconFilter
          label="Profile"
          icon={<PencilIcon />}
          select={activeTab === "profile"}
          onClick={() => handleTabChange("profile")}
        />

        <TextIconFilter
          label="Members"
          icon={<CandidateIcon />}
          select={activeTab === "members"}
          onClick={() => handleTabChange("members")}
        />
      </Box>
      <PageContainer>
        {activeTab === "profile" && (
          <div>
            <Stack direction="row" spacing={4}>
              <Stack direction="column" spacing={1}>
                <BodySMedium style={{ opacity: 0.7 }}> Photo</BodySMedium>
                <ProfilePictureContainer
                  onClick={() => {
                    // Trigger input click when the profile picture is clicked
                    document.getElementById("profile-picture-input")?.click();
                  }}
                >
                  <StyledImage src={ProfilePicture} alt="dashboard_picture" />
                  <input
                    type="file"
                    id="profile-picture-input"
                    style={{ display: "none" }}
                    onChange={(e) => {
                      // Handle file upload logic here
                      // const selectedFile = e.target.files[0];
                      // Add logic to upload and update the profile picture
                    }}
                  />
                </ProfilePictureContainer>
              </Stack>
              <Stack direction="column" spacing={2.5}>
                <BodySMedium style={{ opacity: 0.7 }}> Username</BodySMedium>
                <ElWrap w={630} h={40}>
                  <TextInput
                    disable={true}
                    placeholder="Username"
                    error={false}
                    onChange={() => {}}
                    name="username"
                    value="YourUsername"
                  />
                </ElWrap>
                <BodySMedium style={{ opacity: 0.7 }}> Full Name</BodySMedium>

                <ElWrap w={630} h={40}>
                  <TextInput
                    disable={false}
                    placeholder="Full Name"
                    error={false}
                    onChange={(e) => {}}
                    name="fullName"
                    value="Your Full Name"
                  />
                </ElWrap>
              </Stack>
            </Stack>
            <BodySMedium
              className="m-top-6"
              style={{ marginBottom: "12px", opacity: 0.7 }}
            >
              {" "}
              Email
            </BodySMedium>
            <Stack direction="column" spacing={4}>
              <ElWrap w={820} h={40}>
                <TextInput
                  disable={true}
                  placeholder="Email"
                  error={false}
                  onChange={() => {}}
                  name="email"
                  value="youremail@example.com"
                />
              </ElWrap>
              <ElWrap w={820} h={40}>
                <TextIconBtnL
                  label="Save Changes"
                  icon={<PlusIcon />}
                  disable={false}
                  className={BackgroundColor.ACCENT_PURPLE}
                  onClick={() => {
                    // Show the confirmation popup
                  }}
                />
              </ElWrap>
              <DeleteBox>
                <ChildElement>
                  <BodyLMedium>
                    Delete Account?{" "}
                    <BodySMedium>
                      You can't undo these changes, think carefully.
                    </BodySMedium>
                  </BodyLMedium>

                  <ElWrap w={282} h={90}>
                    <TextIconBtnL
                      label="Delete"
                      icon={<BinIcon />}
                      disable={false}
                      className={BackgroundColor.WHITE}
                      onClick={() => {
                        // Show the confirmation popup
                      }}
                    />
                  </ElWrap>
                </ChildElement>
              </DeleteBox>
            </Stack>
          </div>
        )}

        {activeTab === "members" && (
          <Stack direction="column" spacing={3}>
            <Stack
              direction="row"
              spacing={4}
              justifyContent="space-between"
              style={{}}
            >
              {/* List of members with profile pictures, names, emails, and tags */}
              {/* Filter and sort options */}
              <ElWrap w={270}>
                <DropdownFilter
                  label="Department"
                  optionArr={[
                    { name: "All", value: "all" },
                    { name: "Department 1", value: "dept1" },
                    { name: "Department 2", value: "dept2" },
                  ]}
                  dropdownName="department"
                />
              </ElWrap>
              <ElWrap w={120}>
                <DropdownFilter
                  label="Sort By"
                  optionArr={[
                    { name: "Name (A-Z)", value: "name-asc" },
                    { name: "Name (Z-A)", value: "name-desc" },
                    { name: "Permission Level", value: "permission" },
                  ]}
                  dropdownName="sort"
                />
              </ElWrap>
            </Stack>

            <UserListContainer>
              <Stack direction="column" spacing={3}>
                {users.map((user) => (
                  <SettingsUserCard
                    key={user.id}
                    user={user}
                    onClick={handleCardClick}
                  />
                ))}
              </Stack>
              {selectedUser && (
                <UserModal user={selectedUser} onClose={handleCloseModal} />
              )}
            </UserListContainer>
            <StyledInvitationBox />
          </Stack>
        )}
      </PageContainer>
    </div>
  );
};

export default SettingsPage;
