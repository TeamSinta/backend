import styled from "styled-components";

export const UserCardContainer = styled.div`
  width: 780px;
  height: 72px;
  position: relative;
  border-radius: 12px;
  cursor: pointer;
  background: #f6f6fb;
  transition: background-color 0.5s ease; /* Increase the duration of the transition for a slower effect */

  &:hover {
    cursor: pointer;
    background: ${(props) => props.theme.colors.palePurple};
  }
`;

export const ProfilePicture = styled.img`
  width: 40px;
  height: 40px;
  left: 16px;
  border-radius: 12px;
  top: 16px;
  position: absolute;
  background-color: gray;
`;

export const UserDetails = styled.div`
  left: 72px;
  top: 13px;
  position: absolute;
  flex-direction: column;
  display: inline-flex;
`;

export const PermissionLevel = styled.div`
  left: 389px;
  top: 20px;
  position: absolute;
  justify-content: flex-start;
  align-items: center;
  gap: 8px;
  display: inline-flex;
`;

export const EditButton2 = styled.div`
  width: 32px;
  height: 32px;
  left: 738px;
  top: 20px;
  position: absolute;

  display: flex;
  align-self: center;
`;
