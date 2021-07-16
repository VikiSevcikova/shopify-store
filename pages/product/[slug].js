import {useEffect, useState, useContext} from "react";
import styled from "styled-components";
import { Typography, Row, Col, Input, Button } from "antd";
import client from "shopify/shopify";
import {getDataFromStorage, setDataToStorage} from "utils";
import { Context } from "context/Context";

const { Title, Paragraph, Text } = Typography;

const RightSection = styled(Col)`
  background-color: #E3EDEA;
  padding: 20px;
`;

const LeftSection = styled(Col)`
  padding-left: 10px !important;
`;

const ProductImage = styled.img`
  width: 100%;
  height: auto;
`;

const AmountText = styled(Text)`
  font-size: 15px;
  margin-right: 10px;
`;

const IconDiv = styled.div`
  border: 1px solid grey;
  font-size: 20px;
  padding: 0 10px;
  cursor: pointer;
`;

const AmountInput = styled(Input)`
  width: 50px;
  font-size: 15px;
  border: 1px solid grey;
  border-radius: 0;
  &:hover{
    border: 1px solid grey;
  }
  &:focus{
    border: 1px solid grey;
  }
`;

const AddToCartBtn = styled(Button)`
  color: black;
  border-color: black;
  margin-top: 20px;
  width: 100%;
  :hover{
    color: gray;
  }
`;
const reg = /^-?\d*(\.\d*)?$/;

const ProductPage = ({ product }) => {
  const context = useContext(Context);
  const {setItems} = context;

  const [amount, setAmount] = useState(1);
  const [checkout, setCheckout] = useState(null);
  const [checkoutHasItem, setCheckoutHasItem] = useState(false);
  const variant = product.variants[0];

  useEffect(()=>{
    if(typeof window != 'undefined'){
      const tempCheckout = getDataFromStorage('checkout');
      if(tempCheckout){
        tempCheckout.lineItems && 
        tempCheckout.lineItems.forEach(lineItem => {
          if(lineItem.title === product.title){
            setCheckoutHasItem(true);
          }
        })
        setCheckout(tempCheckout)
        console.log("this is useEffect log ==>", tempCheckout)
      }
    }
  },[]);

  useEffect(()=>{
    if(checkout && checkout.lineItems) setItems(checkout.lineItems.length);
  },[checkout]);

  const onInputChange = (e) => {
    const { value } = e.target;
    if ((!isNaN(value) && !reg.test(value)) && value !== '' && value !== '-') {
      setAmount(value);
    }
  }

  const addToCart = async () => {
    if((isNaN(amount) || reg.test(amount) || amount === '' || amount === '-')) return;
    console.log('add')
    try{
      let checkoutTemp = null;
      if(getDataFromStorage('checkout')){
        checkoutTemp = getDataFromStorage('checkout')
      }else{
        checkoutTemp = await client.checkout.create();
      }
      let checkout = JSON.parse(JSON.stringify(checkoutTemp));
      const checkoutId = checkout.id; // ID of an existing checkout
      const lineItemsToAdd = [
        {
          variantId: variant.id,
          quantity: amount,
          customAttributes: []
        }
      ];
       
      // Add an item to the checkout
      checkout = await client.checkout.addLineItems(checkoutId, lineItemsToAdd);
      console.log(JSON.parse(JSON.stringify(checkout)));
      setCheckout(JSON.parse(JSON.stringify(checkout)));
      setDataToStorage('checkout', checkout);
      setCheckoutHasItem(true);
    }catch(error){
      console.error(error);
    }
  }

  const updateCheckout = async () => {
    console.log('update checkout')
    try{
      const [lineItem] = checkout.lineItems.filter(lineItem => lineItem.title === product.title);
      const checkoutId = checkout.id;
      const lineItemToUpdate = [
        {
          id: lineItem.id,
          quantity: lineItem.quantity + amount
        }
      ];
      console.log(lineItemToUpdate, checkoutId);
      const tempCheckout = await client.checkout.updateLineItems(checkoutId, lineItemToUpdate);
      setDataToStorage('checkout', tempCheckout);
    }catch(error){
      console.error(error);
    }
  }

  return (
    <>
      <Row style={{marginTop:30}}>
        <RightSection xs={{ span: 24 }} md={{ span: 12 }}>
          <Row align="middle" style={{height:"100%"}}>
            <ProductImage src={product.images[0].src} />
          </Row>
        </RightSection>
        <LeftSection xs={{ span: 24 }} md={{ span: 12 }}>
          <Title level={2}>{product.title}</Title>
          <Paragraph>{product.description}</Paragraph>
          <Paragraph strong>{variant.priceV2.amount} {variant.priceV2.currencyCode}</Paragraph>
          <Row align="middle">
            <AmountText>Quantity: </AmountText>
            <IconDiv onClick={()=>amount > 0 ? setAmount(amount-1) : ''}>
              -
            </IconDiv>
            <AmountInput
              onChange={onInputChange}
              value={amount}
            />
            <IconDiv onClick={()=>setAmount(amount+1)}>
              +
            </IconDiv>
          </Row>
          <AddToCartBtn ghost onClick={!checkoutHasItem ? addToCart : updateCheckout}>
            ADD TO CART
          </AddToCartBtn>
        </LeftSection>
      </Row>
    </>
  );
};

export async function getServerSideProps(context) {
  const { slug } = context.params;
  const product = await client.product.fetchByHandle(slug);
  return {
    props: {
      product: JSON.parse(JSON.stringify(product)),
    },
  };
}
export default ProductPage;
