import React from "react";
import { NavLink } from "react-router-dom";
import styled from "styled-components";
import {Button} from "../button";
import { useAuth } from "../../contexts/auth-context";

const menuLinks = [
  {
    url: "/",
    title: "Home",
  },
  {
    url: "/blog",
    title: "Blog",
  },
  {
    url: "/contact",
    title: "Contact",
  },
];

const HeaderStyles = styled.header`
   padding: 20px 0;
  .header-main {
    display: flex;
    align-items: center;
  }
  .logo {
    display: block;
    max-width: 50px;
  }
  .menu {
    display: flex;
    align-items: center;
    gap: 20px;
    margin-left: 40px;
    list-style: none;
    font-weight: 500;
  }

  .search{
    display: flex;
    padding: 15px 25px;
    align-items: center;
    border: 1.7px solid #ccc;
    border-radius: 8px;
    width: 100%;
    max-width: 320px;
    margin-left: auto;
    margin-right: 20px;
    .search-input{
        flex: 1;
        padding-right: 10px;
    }
  }
  @media screen and (max-width: 1023.98px) {
    .logo {
      max-width: 30px;
    }
    .menu,
    .search,
    .header-button,
    .header-auth {
      display: none;
    }
  }
`;

function getLastName(fullname){
  const length = fullname?.split(' ').length;
  return fullname?.split(' ')[length - 1];
}

const Header = () => {
  const {userInfo} = useAuth();
  return (
    <HeaderStyles>
      <div className="container">
        <div className="header-main">
          <NavLink to="/">
            <img
              srcSet="/images/logo.png 2x"
              alt="monkey-blogging"
              className="logo"
            />
          </NavLink>
          <ul className="menu">
            {menuLinks.map((item) => (
              <li className="menu-item" key={item.title}>
                <NavLink to={item.url}>{item.title}</NavLink>
              </li>
            ))}
          </ul>
            <div className="search">
              <input
                type="text"
                className="search-input"
                placeholder="Search posts..."
              />
              <svg
                width="18"
                height="17"
                viewBox="0 0 18 17"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="search-icon"
              >
                <ellipse
                  cx="7.66669"
                  cy="7.05161"
                  rx="6.66669"
                  ry="6.05161"
                  stroke="#999999"
                  strokeWidth="1.5"
                />
                <path
                  d="M17.0001 15.5237L15.2223 13.9099L14.3334 13.103L12.5557 11.4893"
                  stroke="#999999"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
                <path
                  d="M11.6665 12.2964C12.9671 12.1544 13.3706 11.8067 13.4443 10.6826"
                  stroke="#999999"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
            </div>
            {!userInfo ? <Button type='button' to="/sign-up" style={{maxWidth: '12.5rem'}} height="3.54rem">Sign Up</Button>
                      : <div className="header-auth">
                          <span>Welcome back, </span>
                          <strong className="text-primary">{getLastName(userInfo?.displayName)}</strong>
                      </div>
            }
          </div>
        </div>
    </HeaderStyles>
  );
};

export default Header;
