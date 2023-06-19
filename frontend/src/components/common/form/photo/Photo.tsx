import { InitialsGenerator } from "@/utils/Utils";
import {
  Checked,
  NameCheckBox,
  PhotoCheckBox,
  PhotoCheckBoxCover,
  PhotoCheckBoxDiv,
  PhotoWrap,
} from "./StyledPhoto";
import { useEffect, useState } from "react";

export interface IPhotoProps {
  member_idx: number;
  member_name: string;
  member_url: string;
  selected: boolean;
  onSelect: (memberIdx: number) => void;
}

const Photo = (props: IPhotoProps) => {
  const { member_idx, member_name, member_url, selected, onSelect } = props;

  const [selectPhoto, setSelectPhoto] = useState(selected);

  useEffect(() => {
    setSelectPhoto(selected);
  }, [selected]);

  return (
    <PhotoWrap>
      <PhotoCheckBoxDiv
        onClick={() => {
          onSelect(member_idx);
          setSelectPhoto(selectPhoto ? false : true);
        }}
        className={selectPhoto ? "checked" : ""}
      >
        {member_url ? (
          <PhotoCheckBox url={member_url}></PhotoCheckBox>
        ) : (
          <NameCheckBox>{InitialsGenerator(member_name)}</NameCheckBox>
        )}

        <PhotoCheckBoxCover></PhotoCheckBoxCover>
        <Checked className={selectPhoto ? "checked" : ""}></Checked>
      </PhotoCheckBoxDiv>
    </PhotoWrap>
  );
};

export default Photo;
