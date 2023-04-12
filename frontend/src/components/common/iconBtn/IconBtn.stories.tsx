import { ComponentMeta, ComponentStory } from "@storybook/react";
import {
    ArrowDownIcon,
    CalendarIcon,
    CandidateIcon,
    CloseIcon,
    EditIcon,
    PlusIcon,
    SettingIcon,
} from "../svgIcons/Icons";
import { iconLB } from "../svgIcons/iconType";
import IconBtn from "./IconBtn";
import { ButtonBgColor } from "../button/ButtonTypes";

const icons = {
    ArrowDown: <ArrowDownIcon {...iconLB} />,
    Calendar: <CalendarIcon {...iconLB} />,
    Candidate: <CandidateIcon {...iconLB} />,
    Close: <CloseIcon {...iconLB} />,
    Edit: <EditIcon {...iconLB} />,
    Plus: <PlusIcon {...iconLB} />,
    Setting: <SettingIcon {...iconLB} />,
};

export default {
    title: "common/IconButton",
    component: IconBtn,
    argTypes: {
        icon: {
            control: {
                type: "select",
                options: Object.keys(icons),
                mapping: {
                    icons,
                },
            },
            description: "Icon components",
        },
        disable: {
            control: {
                type: "boolean",
            },
            description: "Disable or able",
        },
        background: {
            control : {
                type: "color",
                presetColors: [ButtonBgColor.White, ButtonBgColor.AccentPurple]
            }
        }
    },
} as ComponentMeta<typeof IconBtn>;

const Template: ComponentStory<typeof IconBtn> = (arg) => {
    var icon = arg.icon;
    if (icon !== undefined) {
        icon = icons[arg.icon.toString() as keyof typeof icons];
    }

    if (icon === undefined) {
        return <IconBtn {...arg} />;
    } else {
        var current = {
            ...arg,
            icon: icon,
        };
        return <IconBtn {...current} />;
    }
};

export const Primary = Template.bind({});

Primary.args = {
    icon: <EditIcon {...iconLB} />,
    disable: false,
    background: ButtonBgColor.White
};

export const Disable = Template.bind({});

Disable.args = {
    icon: <EditIcon {...iconLB} />,
    disable: true,
    background: ButtonBgColor.White
};