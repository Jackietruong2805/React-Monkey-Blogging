import React from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const PostImageStyles = styled.div`
    img{
        width: 100%;
        height: 100%;
        object-fit: cover;
        border-radius: inherit;
    }
`;

const PostImage = ({className = '', url = '', alt = '', to = null}) => {
    const navigate = useNavigate();
    if(to) return (
        <div onClick={() => navigate(`/${to}`)} style={{display: 'block'}}>
            <PostImageStyles className={`post-image ${className}`}>
                <img src={url} alt={alt} loading="lazy"/>
            </PostImageStyles>  
        </div>
    )
    return (
        <PostImageStyles className={`post-image ${className}`}>
            <img src={url} alt={alt} loading="lazy"/>
        </PostImageStyles>  
    );
};

export default PostImage;