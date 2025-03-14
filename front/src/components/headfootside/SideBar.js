import React from "react";
import { Link } from "react-router-dom";
// import './SideBar.css'; // 사이드바 스타일링

function SideBar() {
    return (
        <div className="sidebar">
            <ul>
                <li><Link to="/submenu1">Submenu 1</Link></li>
                <li><Link to="/submenu2">Submenu 2</Link></li>
                <li><Link to="/submenu3">Submenu 3</Link></li>
            </ul>
        </div>
    );
}

export default SideBar;