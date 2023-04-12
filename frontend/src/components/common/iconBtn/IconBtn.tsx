import { ButtonShadow } from "../button/StyledBtn";
import { IconBtnIcon, IconBtnWrap } from "./StyledIconBtn";

interface IIconBtnProps {
    icon: JSX.Element;
    disable: boolean;
}

const IconBtn = (props: IIconBtnProps) => {
    const { icon, disable } = props;

    return (
        <>
            <IconBtnWrap disable={disable}>
                <div></div>
                <IconBtnIcon>{icon}</IconBtnIcon>
                <ButtonShadow />
            </IconBtnWrap>
        </>
    );
};

export default IconBtn;