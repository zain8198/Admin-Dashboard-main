import React from "react";
import { useState } from "react";
import style from "./sytle.module.css";
import { DataGrid } from "@mui/x-data-grid";
import {Select, MenuItem } from "@mui/material";
const { order_container } = style;

const Order = () => {
const [item, setitem] = useState("")
const itemhandle=(e)=>{
  console.log(e.target.value)
}
  const colum = [{ id: "Id", headName: "" }];
  const row = [{}];
///////vra////
  return (
    <div className={order_container}>
      <h1>Order</h1>
      <Select  value={item} onChange={itemhandle}>
        <MenuItem value={"one"}>one</MenuItem>
        <MenuItem value={"two"}>two</MenuItem>
        <MenuItem value={"three"}>tfldkdflgfgdhree</MenuItem>
      </Select>
    </div>
  );
};

export default Order;
