import React, { useState } from "react";

import { Button, InvitePlayerModalRaw, UserPreview } from "..";
import { createPortal } from "react-dom";
import { UserDTO } from "@/api/back";
import { IoClose } from "react-icons/io5";

interface IUserPickerProps {
  onSelect: (user: UserDTO | undefined) => void;
  value: UserDTO | undefined;
}

export const UserPicker: React.FC<IUserPickerProps> = ({ value, onSelect }) => {
  const [picker, setPicker] = useState(false);
  return (
    <>
      {picker &&
        createPortal(
          <InvitePlayerModalRaw
            close={close}
            onSelect={(user) => {
              onSelect(user);
              setPicker(false);
            }}
          />,
          document.body,
        )}
      <div>
        {value ? (
          <div className="nicerow">
            <UserPreview user={value} />
            <IoClose
              className="adminicon"
              style={{ fontSize: "1rem" }}
              onClick={() => onSelect(undefined)}
            />
          </div>
        ) : (
          <Button onClick={() => setPicker(true)}>Выбрать игрока</Button>
        )}
      </div>
    </>
  );
};
