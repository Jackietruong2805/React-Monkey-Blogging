import React from "react";
import Heading from "../../components/layout/Heading";
import PostFeatureItem from "../post/PostFeatureItem";
import styled from "styled-components";
const HomeFeatureStyles = styled.div``;

const HomeFeature = () => {
  return (
    <HomeFeatureStyles className="home-block">
      <div className="container">
        <Heading>Bài viết nổi bật</Heading>
        <div className="grid-layout">
          <PostFeatureItem></PostFeatureItem>
          <PostFeatureItem></PostFeatureItem>
          <PostFeatureItem></PostFeatureItem>
        </div>
      </div>
    </HomeFeatureStyles>
  );
};

export default HomeFeature;