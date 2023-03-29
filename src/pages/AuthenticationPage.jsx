import React from 'react';
import { NavLink } from 'react-router-dom';
import styled from 'styled-components';

const AuthenticationPageStyles = styled.div`
    min-height: 100vh;
    padding: 40px;
    .logo{
        margin: 0 auto 20px;
    }
    .heading{
        text-align: center;
        color: ${props => props.theme.primary};
        font-weight: bold;
        font-size: 40px;
        margin-bottom: 40px;
        font-size: 14px;
    }
    .form{
        max-width: 600px;
        margin: 0 auto;
    }
    .have-account{
        margin-bottom: 20px;
        a{
            display: inline-block;
            font-weight: 500;
            color: ${props => props.theme.primary};
        }
    }
`;

const AuthenticationPage = ({children}) => {
    return (
        <AuthenticationPageStyles>
            <div className='container'>
                <NavLink to='/'>
                    <img srcSet='/images/logo.png 2x' alt='monkey-blogging' className='logo'/>
                </NavLink>
                <h1 className='heading'>Monkey Blogging</h1>
                {children}
            </div>
        </AuthenticationPageStyles>
    );
};

export default AuthenticationPage;