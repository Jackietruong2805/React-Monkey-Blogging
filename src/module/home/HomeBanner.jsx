import React from 'react';
import styled from 'styled-components';
import {Button} from "../../components/button"

const HomeBannerStyles = styled.div`
    min-height: 520px;
    background-image: linear-gradient(to right bottom, ${props => props.theme.primary}, ${props => props.theme.secondary});
    margin-bottom: 60px;
    .banner{
        display:flex;
        justify-content: space-between;
        align-items: center;

        &-content{
        max-width: 400px;
        color: white;
        }

        &-heading{
            font-size: 36px;
            margin-bottom: 30px;
        }
        &-desc{
            line-height: 1.75;
            margin-bottom: 40px;
        }
        &-button {
            max-width: 300px;
        }
    }
    @media screen and (max-width: 1023.98px) {
        .banner {
        flex-direction: column;
        min-height: unset;
        &-heading {
            font-size: 30px;
            margin-bottom: 10px;
        }
        &-desc {
            font-size: 14px;
            margin-bottom: 20px;
        }
        &-image {
            margin-top: 25px;
        }
        &-button {
            font-size: 14px;
            height: auto;
            padding: 15px;
        }
        }
    }
`;

const HomeBanner = () => {
    return (
        <HomeBannerStyles>
            <div className='container'>
                <div className='banner'>
                    <div className='banner-content'>
                        <h1 className='banner-heading'>Monkey Blogging</h1>
                        <p className='banner-desc'>
                            loreme loreme lore loreme loreme loreme loreme loreme loreme loreme loreme
                        </p>
                        <Button to="/sign-up" kind="secondary" className="banner-button">
                            Get started
                        </Button>    
                    </div>
                    <div className='banner-image'>
                        <img src='/images/img-banner.png' alt='banner'/>
                    </div>
                </div>
            </div>
        </HomeBannerStyles>
    ); 
};

export default HomeBanner;