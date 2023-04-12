import styled, { css } from "styled-components";
import { ButtonLayout } from "../button/StyledBtn";
import { ButtonBgColor } from "../button/ButtonTypes";

interface IIconBtnWrap{
    background: ButtonBgColor.AccentPurple| ButtonBgColor.White;
}

export const IconBtnWrap = styled(ButtonLayout)<IIconBtnWrap>`
    height: 40px;
    width: 20px;
    background: ${(props) => props.background};
    color: ${(props) => props.background === ButtonBgColor.AccentPurple ? props.theme.colors.white : props.theme.colors.black};
`;

export const IconBtnIcon = styled.div``;