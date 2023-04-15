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
import { iconSW } from "../svgIcons/iconType";
import IconBtnLP from "./IconBtnLP";

const icons = {
    ArrowDown: <ArrowDownIcon {...iconSW} />,
    Calendar: <CalendarIcon {...iconSW} />,
    Candidate: <CandidateIcon {...iconSW} />,
    Close: <CloseIcon {...iconSW} />,
    Edit: <EditIcon {...iconSW} />,
    Plus: <PlusIcon {...iconSW} />,
    Setting: <SettingIcon {...iconSW} />,
};


export default {
    title: "common/IconButtonLP",
    component: IconBtnLP,
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
        }
    },
} as ComponentMeta<typeof IconBtnLP>;

const Template: ComponentStory<typeof IconBtnLP> = (arg) => {
    var icon = arg.icon;
    if (icon !== undefined) {
        icon = icons[arg.icon.toString() as keyof typeof icons];
    }

    if (icon === undefined) {
        return <IconBtnLP {...arg} />;
    } else {
        var current = {
            ...arg,
            icon: icon,
        };
        return <IconBtnLP {...current} />;
    }
};

export const Primary = Template.bind({});

Primary.args = {
    icon: <EditIcon {...iconSW} />,
    disable: false,
};

export const Disable = Template.bind({});

Disable.args = {
    icon: <EditIcon {...iconSW} />,
    disable: true,
};