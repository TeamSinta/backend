import styled, { css } from "styled-components";
import { ButtonLayout } from "../button/StyledBtn";

export const IconBtnWrap = styled(ButtonLayout)`
    height: 40px;
    background: ${(props) => props.theme.colors.white};
    color: ${(props) => props.theme.colors.black};
`;

export const IconBtnIcon = styled.div``;