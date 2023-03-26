import React, { Fragment } from "react";
import { useDropdown } from "./dropdown-context";

const Option = (props) => {
  const {onClick} = props;
  const { setShow, show } = useDropdown();
  const handleClick  = () =>{
    onClick && onClick();
    setShow(false);
  }
  return (
    <Fragment>
      {show && <div
        className="px-5 py-4 cursor-pointer flex items-center justify-between hover:bg-gray-100"
        onClick={handleClick}
      >
        {props.children}  
      </div>}
    </Fragment>
  );
};

export default Option;