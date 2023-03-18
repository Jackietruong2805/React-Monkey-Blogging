import React from 'react';
import { NavLink } from 'react-router-dom';
import styled from "styled-components";

const NotFoundPageStyles = styled.div`
    height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    .logo{
        display: block;
        margin-bottom: 40px;
    }
    .heading{
        font-size: 60px;
        font-weight: 500;
        margin-bottom: 40px;
    }
    .back{
        padding: 15px 30px;
        display: block;
        color: white;
        background-color: ${props => props.theme.primary};
        border-radius: 4px;
        font-weight: 500;
    }
`

const NotFoundPage = () => {
    return (
        <NotFoundPageStyles>
            <NavLink to='/' className="logo">
                <img srcSet='/images/logo.png 2x' alt='monkey-blogging'/>
            </NavLink>
            <h1 className='heading'>Oops! Page not found</h1>
            <NavLink to='/' className='back'>
                Back to Home
            </NavLink>
        </NotFoundPageStyles>
    );
};

export default NotFoundPage;