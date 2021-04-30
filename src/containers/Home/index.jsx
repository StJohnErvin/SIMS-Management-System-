import React from "react";
import "./index.css";
import Login from "../Login";
 import { Image } from "antd";
import { useTranslation } from 'react-i18next';

import { Typography } from "antd";

const { Text, Title } = Typography;

const Home = ({
  email,
  setEmail,
  password,
  isEmailSend,
  setIsEmailSend,
  setPassword,
  handleLogin,
  handleResetPassword,
  hasPassword,
  setHasPassword,
  emailError,
  passwordError,
  clearInputs
}) => {
  const {t} = useTranslation();

  return (
    <div className="home">
      <div className="hero-text">
      <Image
        width={150}
        src={require("./image/Logo.png")}
        alt="Logo"
      />
        {/* <Title>Hola Amigos</Title> */}
        <Title level={4} type="secondary">
         Sales and Inventory Management System
        </Title>
          <Text> {t("home.text0")}</Text>
        <Login
          email={email}
          setEmail={setEmail}
          password={password}
          setPassword={setPassword}
          handleLogin={handleLogin}
          handleResetPassword={handleResetPassword}
          hasPassword={hasPassword}
          setHasPassword={setHasPassword}
          emailError={emailError}
          passwordError={passwordError}
          isEmailSend={isEmailSend}
          clearInputs={clearInputs}
        />
        <Text type="secondary">
         {t("home.text1")}
        </Text>
      </div>

    
    </div>
  );
};
export default Home;
