import styled from "styled-components";

export const StyledImage = styled.img`
  width: 150px;
  height: 150px;
  min-width: 100px;
  border-radius: 16px;

  transition: opacity 0.3s ease; /* Add a transition effect */

  /* Add hover styles */
  &:hover {
    opacity: 1; /* Adjust the opacity value as needed */
    background-color: rgba(15, 13, 98, 0.5);
  }
`;

// Add the profile picture container styling
export const ProfilePictureContainer = styled.div`
  cursor: pointer;
  display: inline-block;
  position: relative;

  /* Styles for the "Change Picture" label */
  &:hover::before {
    content: "Change Picture";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 98%;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: rgba(15, 13, 98, 0.5); /* Updated background color */
    color: #fff;
    border-radius: 16px;
    font-size: 12px;
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  /* Styles for the file input */
  &:hover input[type="file"] {
    opacity: 0.01;
    cursor: pointer;
  }

  /* Styles to show the "Change Picture" label and profile picture on hover */
  &:hover::before,
  &:hover input[type="file"]:hover + .profile-picture {
    opacity: 1;
  }
`;

export const PageContainer = styled.div`
  background: white;
  display: flex;
  justify-content: space-around;
  margin-top: 20px;
  overflow-x: scroll;
  overflow-y: hidden;
  @media (min-width: 1900px) {
    /* Adjust styles for screens with a max width of 768px */
    justify-content: center;
  }

  @media (max-width: 1350px) {
    /* Adjust styles for screens with a max width of 768px */
    justify-content: center;
  }
`;

export const UserListContainer = styled.div`
  max-height: calc(100vh - 300px); /* Adjust this value as needed */
  overflow-x: hidden;
  height: 388px;
  width: 840px;
  display: flex;
  align-items: center;
  justify-content: center;

  /* Hide the scrollbar for webkit-based browsers */
  &::-webkit-scrollbar {
    width: 0.5rem; /* Adjust this width as needed */
  }

  &::-webkit-scrollbar-thumb {
    background-color: transparent; /* Hide the thumb */
  }

  &::-webkit-scrollbar-track {
    background: transparent; /* Hide the track */
  }
`;

export const DeleteBox = styled.div`
  width: 820px;
  height: 154px;
  border-radius: 16px;
  background: var(--bg, #f6f6fb);
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const ChildElement = styled.div`
  margin-top: 48px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 24px;
  text-align: center;
`;
