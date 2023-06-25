import { InitialsGenerator } from "@/utils/Utils";
import { useEffect, useState } from "react";
import {
  Checked,
  NameCheckBox,
  PhotoCheckBox,
  PhotoCheckBoxCover,
  PhotoCheckBoxDiv,
} from "./StyledPhoto";
import { PhotoType } from "@/features/utils/utilEnum";

export interface IPhotoProps {
  member_idx: number;
  member_name: string;
  member_url: string;
  selected: boolean;
  onSelect: (memberIdx: number) => void;
  photoType: PhotoType.L | PhotoType.S;
}

const Photo = (props: IPhotoProps) => {
  const { member_idx, member_name, member_url, selected, onSelect, photoType } =
    props;

  const [selectPhoto, setSelectPhoto] = useState(selected);

  useEffect(() => {
    setSelectPhoto(selected);
  }, [selected]);

  return (
    <PhotoCheckBoxDiv
      photoType={photoType}
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
  );
};

export default Photo;
