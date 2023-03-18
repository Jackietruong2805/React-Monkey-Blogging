import React from 'react';
import { NavLink } from 'react-router-dom';
import styled, { css } from "styled-components";

const PostTitleStyles = styled.h3`
    a{
        display: block;
    }
    font-weight: bold;
    line-height: 1.5;
    letter-spacing: 0.25px;
    ${props => props.size === 'normal' && css`
        font-size: 18px;
        @media screen and (max-width: 1023.98px) {
            font-size: 14px;
        }
    `};
    ${props => props.size === 'big' && css`
        font-size: 22px;
        @media screen and (max-width: 1023.98px) {
            font-size: 16px;
        }
    `};
`;

const PostTitle = ({children, className = '', size = 'normal', to="/"}) => {
    return (
        <PostTitleStyles size={size} className={`${className} post-title`}>
            <NavLink to={to}>
                {children}
            </NavLink>
        </PostTitleStyles>
    );
};

export default PostTitle;