"use client";

import React, { ChangeEvent, useEffect, useState } from "react";
import styled from "styled-components";
import Image from "next/image";
import logo from "../img/pokemonlogo_nukki.png";
import searchicon from "../img/searchicon.png";
import usericon from "../img/usericon.png";
import { useSearchStore } from "@/zustand/useSearchStore";
import { useAuthStore } from "@/zustand/authStore"; // Assuming you have this store to manage authentication
import { useRouter, usePathname } from "next/navigation"; // Assuming you have a hook for getting the current pathname

const Header = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 20px;
  background-color: #e5e7eb;
`;

const LogoContainer = styled.div`
  display: flex;
  align-items: center;
  height: 60px;
  cursor: pointer;
`;

const SearchContainer = styled.div`
  display: flex;
  align-items: center;
  background-color: white;
  padding: 5px;
  border-radius: 5px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  width: 400px;
`;

const SearchInput = styled.input`
  border: none;
  outline: none;
  padding: 5px;
  margin-right: 5px;
  flex-grow: 1;
`;

const SearchButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const UserContainer = styled.div`
  display: flex;
  align-items: center;
`;

const UserIconWrapper = styled.div`
  cursor: pointer;
`;

const Divider = styled.div`
  height: 24px;
  width: 2px;
  background-color: #374151;
  margin: 0 10px;
`;

const SignUpButton = styled.button`
  background-color: #374151;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  width: 144px;
  height: 40px;
`;

const HeaderComponent: React.FC = () => {
  const setSearchTerm = useSearchStore((state) => state.setSearchTerm);
  const { isAuthenticated } = useAuthStore(); // Get authentication status
  const router = useRouter();
  const pathname = usePathname(); // Get current pathname
  const [isClient, setIsClient] = useState(false);

  const handleSearch = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  useEffect(() => {
    setIsClient(true);
  }, []);

  const goToList = () => {
    if (isClient) {
      router.push("/pokemonList");
    }
  };

  const goToMyPage = () => {
    if (isClient) {
      router.push("/myPage");
    }
  };

  const isDetailPage = pathname.includes("/pokemonList/");

  return (
    <Header>
      <LogoContainer onClick={goToList}>
        <Image
          src={logo}
          alt="Pokemon Logo"
          layout="intrinsic"
          width={160}
          height={60}
        />
      </LogoContainer>
      {!isDetailPage && (
        <SearchContainer>
          <SearchInput
            type="text"
            placeholder="Search..."
            onChange={handleSearch}
          />
          <SearchButton>
            <Image src={searchicon} alt="Search Icon" width={24} height={24} />
          </SearchButton>
        </SearchContainer>
      )}
      <UserContainer onClick={goToMyPage}>
        <UserIconWrapper>
          <Image src={usericon} alt="User Icon" width={40} height={40} />
        </UserIconWrapper>
        <Divider />
        {!isAuthenticated && <SignUpButton>Sign up</SignUpButton>}
      </UserContainer>
    </Header>
  );
};

export default HeaderComponent;
