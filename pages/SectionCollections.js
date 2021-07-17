import styled from "styled-components";
import { Row, Col, Typography } from "antd";
import Link from "next/link";
import { useEffect, useState } from "react";
import client from "shopify/shopify";
const { Title, Paragraph } = Typography;

const Section = styled(Row)``;
const LeftBox = styled(Col)`
  background-color: #d4d2da;
  padding: 20px;
  margin-bottom: 20px;
  transition: box-shadow 0.3s ease-in-out;
  &:hover{
    box-shadow: 0 5px 15px rgba(0,0,0,0.3);
  }
`;
const RightBox = styled(Col)`
  background-color: #d4d2da;
  padding: 20px;
  margin-bottom: 20px;
  transition: box-shadow 0.3s ease-in-out;
  &:hover{
    box-shadow: 0 5px 15px rgba(0,0,0,0.3);
  }
`;
const Image = styled.img`
  width: 90%;
`;
function SectionCollections({ collections }) {
  const [newArrival, setNewArrival] = useState({});
  const [sofas, setSofas] = useState({});
  useEffect(() => {
      console.log(collections);
    collections.forEach((collection) => {
      if (collection.title === "New Arrival") {
        setNewArrival(collection);
      }
      if (collection.title === "Sofas") {
        setSofas(collection);
      }
    });
  }, []);
//   console.log({ products, collections });
  // console.log({ sofas, newArrival });
  return (
    <>
      <Section>
        <LeftBox sm={{ span: 24 }} md={{ span: 11 }}>
          <Link href={`/collection/${newArrival.handle}`}>
            <Image src="/products/category-image1.png" />
          </Link>
            <Title level={3}>New Arrival</Title>
          <Paragraph>
            {newArrival.products && newArrival.products.length} items
          </Paragraph>
        </LeftBox>
        <RightBox sm={{ span: 24 }} md={{ span: 11, offset: 2 }}>
          <Link href={`/collection/${sofas.handle}`}>
            <Image src="/products/category-image1.png" />
          </Link>
            <Title level={3}>Sofas</Title>
          <Paragraph>{sofas.products && sofas.products.length} items</Paragraph>
        </RightBox>
      </Section>
    </>
  );
}

export default SectionCollections;
