import styled from "styled-components";
import { ButtonLayout } from "../button/StyledBtn";


export const IconBtnLWWrap = styled(ButtonLayout)`
    height: 40px;
    width: 40px;
    background: ${(props) => props.theme.colors.white};
    color: ${(props) => props.theme.colors.black};
`;

export const IconBtnLWIcon = styled.div``;