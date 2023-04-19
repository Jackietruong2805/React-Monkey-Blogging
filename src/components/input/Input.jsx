import React from "react";
import { useController } from "react-hook-form";
import styled from "styled-components";
import PropTypes from "prop-types";


const InputStyles = styled.div`
  position: relative;
  width: 100%;
  input {
    width: 100%;
    padding: ${props => props.hasIcon ? "20px 60px 20px 20px" : "20px"};
    background-color: ${(props) => props.theme.grayLight};
    padding: ${(props) =>
      props.hasIcon ? "15px 60px 15px 25px" : "15px 25px"};
    background-color: transparent;
    border: 1px solid ${(props) => props.theme.grayf1};
    border-radius: 8px;
    font-weight: 500;
    transition: all 0.2s linear;
    :focus {
      background-color: white;
      border-color: ${(props) => props.theme.primary};
      color: ${(props) => props.theme.black};
      font-size: 14px;
    }
    ::-webkit-input-placeholder {
      color: #84878b;
    }
    ::-moz-input-placeholder {
      color: #84878b;
    }
  }
  .input-icon{
    position: absolute;
    right: 20px;
    top: 50%;
    transform: translateY(-50%);
    cursor: pointer;
  }
`;

const Input = ({ name, type = "text", children, control, ...props }) => {
  const {field} = useController({
    control,
    name,
    defaultValue: "", 
  })
  return <InputStyles hasIcon={children ? true : false}>
      <input id={name} type={type} {...field} {...props} />
      {children ? <div className="input-icon">{children}</div> : null}
  </InputStyles>
};

Input.propTypes = {
  // value: PropTypes.string
  name: PropTypes.string.isRequired,
  type: PropTypes.string,
  children: PropTypes.any,
  control: PropTypes.any.isRequired
}

export default Input;
