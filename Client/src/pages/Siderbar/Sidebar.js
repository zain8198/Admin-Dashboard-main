import React, { useContext } from "react";
import style from "./style.module.css";
import logo from "../../assets/images/Eyecon-Consultant-165x96.png";
import { Icon } from "@iconify/react";
import { NavLink, useNavigate } from "react-router-dom";
import AppRegistrationIcon from "@mui/icons-material/AppRegistration";
import SignalCellularAltIcon from "@mui/icons-material/SignalCellularAlt";
import LogoutIcon from '@mui/icons-material/Logout';
import { IconButton,Button } from '@mui/material';


import "./custom.css";
import { Auth } from "../../AppRoutes/AppRoutes";
const Sidebar = () => {
  let auth=useContext(Auth)
  let navigate=useNavigate()
  const {
    sidebar_container,
    sidebar_logo,
    menu_container,
    menu_list,
    icon_one,
    icon_two,
    icon_three,
    icon_four,
    icon_five,
    icon_six,
  } = style;
  return (
    <>
      <div className={sidebar_container}>
        <div className={sidebar_logo}>
          <img src={logo} alt="" />
        </div>
        <div className={menu_container}>
          <ul className={menu_list}>
            <li>
              <NavLink to={"/"}>
                <span className="text-danger">
                  <Icon className={icon_one} icon="iconoir:computer" />
                </span>{" "}
                Dash Board
              </NavLink>
            </li>
            <li>
              <NavLink to={"/stock"}>
                <span className="text-warning">
                  <Icon
                    icon="healthicons:stock-out-outline"
                    className={icon_two}
                  />
                </span>
                Stock
              </NavLink>
            </li>
            <li>
              <NavLink to={"/contact"}>
                <span >
                  <Icon
                    icon="mdi:user-arrow-left-outline"
                    className={icon_three}
                  />
                </span>
                Contact
              </NavLink>
            </li>
            {/* <li>
              <NavLink to={"/ledger"}>
                <span className="text-success">
                  <Icon
                    icon="ant-design:login-outlined"
                    className={icon_four}
                  />
                </span>
                ledger
              </NavLink>
            </li> */}
            <li>
              <NavLink to={"/order"}>
                <span className="text-success">
                  <Icon
                    icon="ant-design:login-outlined"
                    className={icon_four}
                  />
                </span>
                order
              </NavLink>
            </li>
            <li>
              <NavLink to={"/purchase"}>
                <span>
                  <AppRegistrationIcon className={icon_five} />
                </span>
                Purchase
              </NavLink>
            </li>
            <li>
              <div class="dropdown">
                <span>
                  <SignalCellularAltIcon className={icon_six} />
                </span>
                <button class="dropbtn">Sales</button>
                <div class="dropdown-content">
                  <NavLink to={"/salesummary"}>Sales Summary</NavLink>
                  <NavLink to={"/saledetail"}>Sales Detail</NavLink>
                </div>
              </div>
            </li>
            <li>
            <Button variant="contained" endIcon={<LogoutIcon/>} onClick={()=>{navigate("/")
             auth(localStorage.removeItem("IsAuth"))}}>Log Out</Button>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
