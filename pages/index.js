import styled from "styled-components";
import { Row, Col, Typography } from "antd";
import Header from "components/Header";
import Link from "next/link";
import { useEffect, useState } from "react";
import client from "shopify/shopify";
import SectionCollections from "./SectionCollections";
const { Title, Paragraph, Text } = Typography;

const TrendingSection = styled(Row)`
  width: 100%;
  margin: 50px 0;
`;

const TrendingProducts = styled(Row)`
  width: 100%;
  margin-bottom: 50px;
  justify-content: space-between;
`;

const TrendingProduct = styled(Col)`
  background-color: #E3EDEA;
  padding: 20px !important;
  margin-bottom: 20px;
  transition: box-shadow 0.3s ease-in-out;
  &:hover{
    box-shadow: 0 5px 15px rgba(0,0,0,0.3);
  }
`;

const ImageWrapper = styled.div`
  height: 100px;
  padding: 10px;
  text-align: center;
`;

const TrendingProductImage = styled.img`
  width: 90%;
  height: 90%;
  object-fit: contain;
`;

function Home({ collections }) {
  return (
    <>
      <Header />
      <SectionCollections collections={collections}/>

      <TrendingSection>
        <Col span={24} style={{ textAlign: "center" }}>
          <Title>Trending Now</Title>
          <Paragraph>
            Find the perfect piece or accesory to finish off your favourite room
            in the house.
          </Paragraph>
        </Col>
        <TrendingProducts>
          {collections.map((collection) => {
            return collection.title === "New Arrival" ? (
              collection.products.slice(0,2).map(p => (
                <TrendingProduct key={collection.title + p.id} xs={{ span: 10 }} md={{ span: 5}}>
                  <ImageWrapper>
                    <Link href={`/product/${p.handle}`}>
                      <TrendingProductImage src={p.images[0].src} />
                    </Link>
                  </ImageWrapper>
                    <Paragraph strong style={{marginBottom:0}}>{p.title}</Paragraph>
                  <Paragraph style={{marginBottom:0}}>{collection.title}</Paragraph>
              </TrendingProduct>
              ))
             
            ) : (
              ""
            );
          })}
          {collections.map((collection) => {
            return collection.title === "Sofas" ? (
              collection.products.slice(0,2).map(p => (
                <TrendingProduct key={collection.title + p.id} xs={{ span: 10 }} md={{ span: 5}}>
                  <ImageWrapper>
                    <Link href={`/product/${p.handle}`}>
                      <TrendingProductImage src={p.images[0].src} />
                    </Link>
                  </ImageWrapper>
                    <Paragraph strong style={{marginBottom:0}}>{p.title}</Paragraph>
                  <Paragraph>{collection.title}</Paragraph>
              </TrendingProduct>
              ))
             
            ) : (
              ""
            );
          })}
        </TrendingProducts>
      </TrendingSection>
    </>
  );
}
export async function getServerSideProps() {
  const collections = await client.collection.fetchAllWithProducts();
  return {
    props: {
      collections: JSON.parse(JSON.stringify(collections)),
    }, // will be passed to the page component as props
  };
}
export default Home;
