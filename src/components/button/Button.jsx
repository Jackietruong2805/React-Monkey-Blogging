import React from 'react';
import styled, {css} from "styled-components";
import { LoadingSpinner } from '../loading';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';

const ButtonStyles = styled.button`
    display: block;
    cursor: pointer;
    padding: 0 25px;
    line-height: 1;
    ${props => props.kind === 'secondary' && css`
        color: ${props => props.theme.primary};
        background-color: white;
    `};
    ${props => props?.kind === 'primary' && css`
        color: white;
        background-color: ${(props) => props.theme.primary};
    `};
    ${(props) =>
    props.kind === "ghost" &&
    css`
      color: ${(props) => props.theme.primary};
      background-color: rgba(29, 192, 113, 0.1);
    `};
    font-weight: 600;
    font-size: 16px;
    border-radius: 8px;
    height: ${props => props.height};
    width: 100%;
    :disabled{
        pointer-events: none;
        opacity: 0.5;
    }   
`;
/**
 * @param {function} onClick Handler onClick
 * @requires
 * @param {string} type type of button 'button' | 'submit'  
 */
const Button = ({type = 'button', onClick = () => {}, height="70px",  kind = 'primary', ...props}) => {
    const {to, isLoading = false} = props;
    const child = isLoading ? <LoadingSpinner></LoadingSpinner> : props.children;
    if(to !== '' && typeof to === 'string'){
        return (
            <span>
                <NavLink to={to}>
                    <ButtonStyles type={type} onClick={onClick} height={height} kind={kind} {...props} >
                        {child}
                    </ButtonStyles>
                </NavLink>
            </span>
        )
    }
    return (
        <ButtonStyles type={type} onClick={onClick} height={height} kind={kind} {...props}>
            {child}
        </ButtonStyles>
    );
};

Button.prototype = {
    type: PropTypes.oneOf(['button', 'submit']),
    isLoading: PropTypes.bool,
    onClick: PropTypes.func,
    children: PropTypes.node,
    kind: PropTypes.oneOf(['primary', 'secondary'])
}

export default Button;