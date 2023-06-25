import { SelectArrowOpenIcon } from "@/components/common/svgIcons/Icons";
import { useState } from "react";
import {
  DropdownArrowIconDiv,
  DropdownEl,
  DropdownLabel,
  DropdownLayout,
  DropdownWrap,
  OptionA,
  OptionLi,
  OptionUl,
  SelectedItemDiv,
} from "./StyledDropdownFilter";
import { BodyMMedium } from "../../typeScale/StyledTypeScale";

interface IDropdown {
  label?: string;
  optionArr: IOption[];
  dropdownName: string;
}

interface IOption {
  name: string;
  value: string;
}

const DropdownFilter = (props: IDropdown): JSX.Element => {
  const { label, optionArr, dropdownName } = props;
  const [open, setOpen] = useState(false);
  const [shadow, setShadow] = useState(false);
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
      <DropdownLayout>
        {label ? <DropdownLabel>{label}</DropdownLabel> : <></>}
        <DropdownWrap
          onMouseEnter={() => {
            setShadow(true);
          }}
          onMouseLeave={() => {
            setShadow(false);
          }}
          className={shadow ? "hover" : ""}
          onClick={() => {
            setShadow(false);
          }}
        >
          <DropdownEl onClick={onSelectOpen}>
            <SelectedItemDiv>
              <BodyMMedium>
                {selectedItem[dropdownName] === ""
                  ? dropdownName
                  : selectedItemName}
              </BodyMMedium>
              <DropdownArrowIconDiv onClick={onSelectOpen} open={open}>
                <SelectArrowOpenIcon />
              </DropdownArrowIconDiv>
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
                  <BodyMMedium>{item.name}</BodyMMedium>
                </OptionA>
              </OptionLi>
            ))}
          </OptionUl>
        </DropdownWrap>
      </DropdownLayout>
    </>
  );
};

export default DropdownFilter;
