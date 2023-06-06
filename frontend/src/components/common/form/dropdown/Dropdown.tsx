import React, { useState } from "react";
import { SelectArrowOpenIcon } from "@/components/common/svgIcons/Icons";
import { iconXSB } from "@/components/common/svgIcons/iconType";
import {
  DropdownArrowIconDiv,
  DropdownEl,
  DropdownLabel,
  DropdownLayout,
  type DropdownLayoutType,
  DropdownWrap,
  OptionA,
  OptionLi,
  OptionUl,
  SelectedItemDiv,
  SelectedItemIcon,
} from "./StyledDropdown";

interface IDropdown {
  label: string;
  layoutType: DropdownLayoutType;
  optionArr: IOption[];
  dropdownName: string;
  dropdownIconVisible: boolean;
}

interface IOption {
  name: string;
  value: string;
}

const Dropdown = (props: IDropdown): JSX.Element => {
  const { label, layoutType, optionArr, dropdownName, dropdownIconVisible } =
    props;
  const [open, setOpen] = useState(false);
  const [selectedItemName, setSelectedItemName] = useState("");
  const [selectedItem, setSelectedItem] = useState({
    [dropdownName]: "",
  });

  const onSelectOpen = (): void => {
    if (open) {
      setOpen(false);
    } else {
      setOpen(true);
    }
  };

  const onSelectedItem = (value: string, name: string): void => {
    setSelectedItem({ [dropdownName]: value });
    setSelectedItemName(name);
    setOpen(false);
  };

  return (
    <>
      <DropdownLayout layoutType={layoutType}>
        <DropdownLabel>{label}</DropdownLabel>
        <DropdownWrap>
          <DropdownEl onClick={onSelectOpen}>
            <SelectedItemDiv>
              {dropdownIconVisible && selectedItem[dropdownName] !== "" ? (
                <SelectedItemIcon>
                  {selectedItemName.substring(0, 1).toUpperCase()}
                </SelectedItemIcon>
              ) : (
                <></>
              )}
              <div>
                {selectedItem[dropdownName] === ""
                  ? `------------`
                  : selectedItemName}
              </div>
            </SelectedItemDiv>
          </DropdownEl>
          <OptionUl open={open}>
            <OptionLi>
              <OptionA
                onClick={() => {
                  onSelectedItem("", "");
                }}
              >
                ------------
              </OptionA>
            </OptionLi>
            {optionArr.map((item, index) => (
              <OptionLi key={index}>
                <OptionA
                  onClick={() => {
                    onSelectedItem(item.value, item.name);
                  }}
                >
                  {item.name}
                </OptionA>
              </OptionLi>
            ))}
          </OptionUl>
          <DropdownArrowIconDiv onClick={onSelectOpen} open={open}>
            <SelectArrowOpenIcon {...iconXSB} />
          </DropdownArrowIconDiv>
        </DropdownWrap>
      </DropdownLayout>
    </>
  );
};

export default Dropdown;
