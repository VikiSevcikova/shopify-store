import {getDataFromStorage, setDataToStorage} from "utils";
import {useEffect, useState, useContext} from "react";
import styled from "styled-components";
import { Typography, List, Row, Input, Col } from "antd";
import client from "shopify/shopify";
import Paragraph from "antd/lib/skeleton/Paragraph";
import { DeleteOutlined } from "@ant-design/icons";
import { Context } from "context/Context";

const {Title} = Typography;

const Container = styled.div`
  margin-top: 50px;
`;
const Item = styled.div`
  height: 75px;
  display: flex;
  flex-direction: row;
  align-items: center;
  color: black;
`;

const ItemPrice = styled.p`
  margin-right: 50px;
  font-weight: 600;
`;

const DeleteBtn = styled(DeleteOutlined)`
  margin-left: 10px;
  cursor: 'pointer';
  &:hover{
    color: red;
  }
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

const Cart = () => {
  const context = useContext(Context);
  const {setItems} = context;

  const [checkout, setCheckout] = useState(null);

  useEffect(()=>{
    if(typeof window !== 'undefined'){
      const checkout = getDataFromStorage('checkout');
      console.log(checkout.lineItems);
      if(checkout){
        client.checkout.fetch(checkout.id).then(response => {
          setCheckout(response);
        }).catch((error)=>console.error(error));
      }
    }
  },[]);

  useEffect(()=>{
    if(checkout && checkout.lineItems) setItems(checkout.lineItems.length);
  },[checkout]);

  const removeItemFromCart = async (check, item) => {
    console.log('remove item');
    const checkoutId = check.id;
    const lineItemIdsToRemove = [
      item.id
    ];

    const checkout = await client.checkout.removeLineItems(checkoutId, lineItemIdsToRemove);
    setDataToStorage('checkout', checkout);
    setCheckout(JSON.parse(JSON.stringify(checkout)));
  }

  const updateCheckout = async (checkout, item, quantity) => {
    console.log('update checkout')
    try{
      const [lineItem] = checkout.lineItems.filter(lineItem => lineItem.title === item.title);
      const checkoutId = checkout.id;
      const lineItemToUpdate = [
        {
          id: lineItem.id,
          quantity: quantity
        }
      ];
      console.log(lineItemToUpdate, checkoutId);
      const tempCheckout = await client.checkout.updateLineItems(checkoutId, lineItemToUpdate);
      setDataToStorage('checkout', tempCheckout);
    }catch(error){
      console.error(error);
    }
  }

  const changeQuantity = (check, item, quantity) => {
    const reg = /^-?\d*(\.\d*)?$/;
    if ((isNaN(quantity) && reg.test(quantity)) || quantity === '' || quantity === '-') return;
    if(quantity === 0){
      removeItemFromCart(check, item);
    }else{
      updateCheckout(check, item, quantity);
    }
  }

  return (
    <Container>
      <Title level="1">Your Cart</Title>
      {!checkout ? 
      <>
        <Paragraph> You don't have any item in your cart. </Paragraph>
      </>
      :
      <>
        <List
          dataSource={checkout && checkout.lineItems || []}
          renderItem={item => (
            <List.Item>
              <List.Item.Meta 
                avatar={<img src={item.variant.image.src} style={{marginLeft: 50}} width="100" height="75"/>}
                description={
                  <Item>
                    <Col md={8}><p>{item.title}</p></Col>
                    <Col md={8}>
                      <Row align="middle" justify="center">
                        <IconDiv onClick={()=>changeQuantity(checkout, item, item.quantity - 1)}>
                          -
                        </IconDiv>
                        <AmountInput
                          value={item.quantity}
                          onChange={(e)=>()=>changeQuantity(checkout, item, e.target.value)}
                        />
                        <IconDiv onClick={()=>changeQuantity(checkout, item, item.quantity + 1)}>
                          +
                        </IconDiv>
                      </Row>
                    </Col>
                    <Col md={8}>
                      <Row align="middle" justify="end">
                        <ItemPrice>
                          {item.variant.priceV2.amount * item.quantity} {item.variant.priceV2.currencyCode}
                          <DeleteBtn onClick={()=> removeItemFromCart(checkout, item)}/>
                        </ItemPrice>
                      </Row>
                    </Col>
                  </Item>
                }
              />
            </List.Item>
          )}
        />
        <a href={checkout.webUrl}>Proceed to checkout</a>
      </>
      }
    </Container>
  );
};

export default Cart;
