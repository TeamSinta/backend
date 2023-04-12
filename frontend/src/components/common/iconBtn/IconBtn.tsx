import { ButtonBgColor } from "../button/ButtonTypes";
import { ButtonShadow } from "../button/StyledBtn";
import { IconBtnIcon, IconBtnWrap } from "./StyledIconBtn";

interface IIconBtnProps {
    icon: JSX.Element;
    disable: boolean;
    background: ButtonBgColor.AccentPurple| ButtonBgColor.White;
}

const IconBtn = (props: IIconBtnProps) => {
    const { icon, disable, background} = props;

    return (
        <>
            <IconBtnWrap disable={disable} background={background}>
                <IconBtnIcon>{icon}</IconBtnIcon>
                <ButtonShadow />
            </IconBtnWrap>
        </>
    );
};

export default IconBtn;