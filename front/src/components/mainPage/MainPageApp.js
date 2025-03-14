import { BrowserRouter as Router, Routes, Route, BrowserRouter, useLocation } from "react-router-dom";
import HomePage from "../login/HomePage";
import React from "react";
import MainPageNews from "./MainPageNews";
import "./MainPage.css"
import BannerSlider from "./BannerSlider";


function MainPageApp() {

    return (
      <div>
        <BannerSlider/>
        <div className="main_content_02">
          <MainPageNews/>

          <div className="main-right-wrap">
            <HomePage/>
            <div className="main-right-banner1">
              <a href="http://localhost:3000/donate" target="_blank">
              <img src="images/donate.png"></img></a>
            </div>
            <div className="main-right-banner2">
              <a href="http://192.168.16.4:3000/" target="_blank">
              <img src="images/logo_red2.png" style={{width:'500px', height:'90px'}}></img></a>
            </div>
            <div className="main-right-banner3">
              <a href="http://192.168.16.23:3000/" target="_blank">
              <img src="images/marry.png"></img></a>
            </div>
          </div>
        </div>
      </div>
    );
}



export default MainPageApp;
