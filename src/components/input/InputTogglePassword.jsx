import React, { Fragment, useState } from "react";
import { IconEyeClose, IconEyeOpen } from "../Icon";
import Input from "./Input";

const InputTogglePassword = ({control}) => {
  const [togglePassword, setTogglePassword] = useState(false);
  if(!control) return null;
  return (
    <Fragment>
      <Input
        type={togglePassword ? "text" : "password"}
        name="password"
        id="password"
        placeholder="Enter your password"
        control={control}
      >
        {togglePassword ? (
          <IconEyeOpen onClick={() => setTogglePassword(false)}></IconEyeOpen>
        ) : (
          <IconEyeClose onClick={() => setTogglePassword(true)}></IconEyeClose>
        )}
      </Input>
    </Fragment>
  );
};

export default InputTogglePassword;
