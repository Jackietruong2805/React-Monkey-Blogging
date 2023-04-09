import styled from "styled-components";
import React from 'react';
import Layout from '../components/layout/Layout';
import HomeNewest from '../module/home/HomeNewest';
import HomeFeature from '../module/home/HomeFeature';
import HomeBanner from '../module/home/HomeBanner';

const HomePageStyles = styled.div`
    
`;

const HomePage = () => {
    
    return (
        <HomePageStyles>
            <Layout>
                <HomeBanner></HomeBanner>
                <HomeFeature></HomeFeature>
                <HomeNewest></HomeNewest>
            </Layout>
        </HomePageStyles>
    );
};

export default HomePage;