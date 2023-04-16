import React from "react";
import { useController } from "react-hook-form";
import styled from "styled-components";

const TextareaStyles = styled.div`
  position: relative;
  width: 100%;
  textarea {
    width: 100%;
    padding: 16px 20px;
    background-color: ${(props) => props.theme.grayLight};
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
      resize: none;
      min-height: 300px;
    }
    ::-webkit-input-placeholder {
      color: #84878b;
    }
    ::-moz-input-placeholder {
      color: #84878b;
    }
  }
`;

const Textarea = ({ name, type = "text", children, control, ...props }) => {
  const {field} = useController({
    control,
    name,
    defaultValue: "", 
  })
  return <TextareaStyles>
      <textarea id={name} type={type} {...field} {...props} />
  </TextareaStyles>
};

export default Textarea;
