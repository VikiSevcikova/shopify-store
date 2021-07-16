import { useContext } from "react";
import Head from "next/head";
import Link from "next/link";
import styled from "styled-components";
import { Badge } from "antd";
import { ShoppingCartOutlined } from "@ant-design/icons";
import { Context } from "context/Context";

const Container = styled.div`
  max-width: ${(props) => props.theme.maxWidth}px;
  width: 100%;
  padding: 0 20px;
  margin: auto;
`;
const TopNav = styled.div`
  margin-top: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Logo = styled.span`
  font-size: 30px;
  font-family: 'Caveat', cursive;
`;

const Menu = styled.ul`
  display: flex;
  flex-direction: row;
  margin-bottom: 0;
`;
const MenuItem = styled.li`
  list-style-type: none;
  margin: 0 10px;
`;

const Layout = ({ children }) => {
  const context = useContext(Context);
  const {items} = context;
  console.log('items',items);
  return (
    <Container>
      <Head>
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&family=Caveat&display=swap"
          rel="stylesheet"
        />
      </Head>
      <TopNav>
        <Logo>Sofas Store</Logo>
        <Menu>
          {NAV_CONSTANT.map((item, index) => {
            return (
              <MenuItem key={index}>
                <Link href={item.url}>{item.text}</Link>
              </MenuItem>
            );
          })}
        </Menu>
        <Menu>
          <Link href="/cart">
            <Badge count={items} size="small">
                <ShoppingCartOutlined />
            </Badge>
          </Link>
        </Menu>
      </TopNav>
      {children}
    </Container>
  );
};
const NAV_CONSTANT = [
  { url: "/", text: "Home" },
  { url: "/collection/new-arrival", text: "New Arrival" },
  { url: "/collection/sofas", text: "Sofas" },
  { url: "/aboutus", text: "About us" },
];

export default Layout;
