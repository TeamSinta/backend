import React from "react";
import styled from "styled-components";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";

interface UserModalProps {
  user: {
    username: string;
    email: string;
    role: string;
  };
  onClose: () => void;
}

const ModalContainer = styled(Dialog)`
  .MuiPaper-root {
    width: 400px;
    border-radius: 12px;
    padding: 20px;
    position: relative;
  }
`;

const CloseButton = styled(Button)`
  position: absolute;
  top: 10px;
  right: 10px;
`;

const UserModal: React.FC<UserModalProps> = ({ user, onClose }) => {
  return (
    <ModalContainer open={true} onClose={onClose}>
      <DialogTitle>User Details</DialogTitle>
      <DialogContent>
        <div>
          <h2>{user.username}</h2>
          <p>Email: {user.email}</p>
          <p>Role: {user.role}</p>
        </div>
      </DialogContent>
      <DialogActions>
        <CloseButton onClick={onClose}>Close</CloseButton>
      </DialogActions>
    </ModalContainer>
  );
};

export default UserModal;
