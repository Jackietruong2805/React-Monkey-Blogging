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
        className="py-[15px] px-[25px] cursor-pointer flex items-center justify-between hover:text-primary transition-all"
        onClick={handleClick}
      >
        {props.children}  
      </div>}
    </Fragment>
  );
};

export default Option;