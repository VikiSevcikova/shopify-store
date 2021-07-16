import styled from "styled-components";
import Layout from "components/Layout";
import { Row, Col, Typography, Button } from "antd";

const { Title } = Typography;

const HeaderContainer = styled(Row)`
  margin: 30px 0px;
  background: linear-gradient(138deg, rgba(167,179,184,1) 0%, rgba(49,117,123,1) 100%);
`;
const LeftColumn = styled(Col)`
  padding-left: 30px;
  height: 400px;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;
const RightColumn = styled(Col)`
  margin-bottom: 20px;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  height: auto;
  img {
    width: 80%;
  }
`;
const SubTitleWrapper = styled(Row)`
  border-left: 3px solid black;
  margin-bottom: 20px;
  padding-left: 16px;
`;
const ShopNowBtn = styled(Button)`
  align-self: flex-start;
  color: black !important;
  border-color: black !important;
  margin-bottom: 10px;
  &:hover{
    color: white !important;
    border-color: white !important;
  }
`;
const PriceText = styled(Title)`
  margin-top: 0 !important;
`;
const Circle = styled.div`
  position: absolute;
  top:50%;
  left:50%;
  width: 90%;
  height: 80%;
  transform: translate(-50%,-50%);
  background-color: white;
  border-radius: 50%;
`;

const HeaderImage = styled.img`
  z-index: 1;
`;

const Header = () => {
  return (
    <HeaderContainer>
      <LeftColumn sm={{ span: 24 }} md={{ span: 12 }}>
        <SubTitleWrapper>
          <Title level={5}>
            Sofas <br />
            2021
          </Title>
        </SubTitleWrapper>
        <Title>Mod leather Sofa</Title>
        <PriceText level={4}>From $200</PriceText>
        <ShopNowBtn ghost>Shop Now</ShopNowBtn>
        <Title level={5}>
          Designed By <br />
          Viki
        </Title>
      </LeftColumn>
      <RightColumn sm={{ span: 24 }} md={{ span: 12 }}>
        <Circle></Circle>
        <HeaderImage src="/HomeBanner.png" />
      </RightColumn>
    </HeaderContainer>
  );
};

export default Header;
