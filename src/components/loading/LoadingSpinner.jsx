import React from 'react';
import styled, {css} from "styled-components";

const LoadingStyles = styled.div`
    width: ${props => props.size};
    height: ${props => props.size};
    border: ${props => props.borderSize} solid white;
    border-top: ${props => props.borderSize} solid transparent;
    border-bottom: ${props => props.borderSize} solid transparent;
    border-radius: 50%;
    margin: 0 auto;
    animation: 1s spinner linear infinite;
    @keyframes spinner{
        to{
            transform: rotate(360deg);
        }
    }
`

const LoadingSpinner = ({size = "40px", borderSize="5px"}) => {
    return (
        <LoadingStyles size={size} borderSize={borderSize}></LoadingStyles>
    );
};

export default LoadingSpinner;