import styled from "styled-components";
import { useRouter } from "next/router";
import client from "shopify/shopify";
import { Typography, List, Card, Col, Row } from "antd";
import Link from "next/link";
const { Title, Paragraph, Text } = Typography;

const ImageWrapper = styled(Row)`
  width: 100%;
  height: 240px;
  background-color: #E3EDEA;
  padding: 10px;
  align-items: center;
  transition: box-shadow 0.3s ease-in-out;
  &:hover{
    box-shadow: 0 5px 15px rgba(0,0,0,0.3);
  }
`;

const ProductImage = styled.img`
  width: 100%;
`;

const CollectionPage = ({ collection }) => {
  const router = useRouter();
  const { slug } = router.query;
  // console.log(collection);
  return (
    <div>
      <Title>{collection.title}</Title>
      <List
        grid={{ gutter: 16, column: 4 }}
        dataSource={collection.products}
        renderItem={(item) => (
          <List.Item>
            <Link href={`/product/${item.handle}`}>
                <ImageWrapper>
                  <ProductImage src={item.images[0].src}/>
                </ImageWrapper>
            </Link>
              <Row justify="space-between" style={{paddingTop:10}}>
                <Paragraph>{item.title} </Paragraph>
                <Paragraph>{item.variants[0].priceV2.currencyCode} {item.variants[0].priceV2.amount}</Paragraph>
              </Row>
          </List.Item>
        )}
      />
    </div>
  );
};
export async function getServerSideProps(context) {
  const { slug } = context.params;
  const collection = await client.collection.fetchByHandle(slug);

  return {
    props: {
      collection: JSON.parse(JSON.stringify(collection)),
    },
  };
}
export default CollectionPage;
