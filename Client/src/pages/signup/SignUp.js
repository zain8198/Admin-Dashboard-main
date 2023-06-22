import React from 'react'
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import style from "./style.module.css"
const SignUp = () => {
  const { Parent, Form_Box, btn } = style;
    const [InputValue, SetInputValue] = useState({
        database:"",
        server:"",
        username: "",
        password: "",
      });
      const changehandle = (e) => {
        const { name, value } = e.target;
        SetInputValue((OldVal) => {
          return {
            ...OldVal,
            [name]: value,
          };
        });
      };
      const {server,database,username,password}=InputValue
    
      const submit = (e) => {
        // console.log(server, database, username, password);
        console.log(InputValue);
        e.preventDefault();
        //  alert()
         fetch('http://localhost:5000/signup',{
            method:"POST",
            body:JSON.stringify({server,database,username,password}),
            headers:{
              "content-type":"application/json"
            }
         })
         fetch('http://localhost:5000/server',{
          method:"POST",
          body:JSON.stringify({server,database,username,password}),
          headers:{
            "content-type":"application/json"
          }
       })
        //  localStorage.setItem("a","zain")
        // naviagte("/")
      };
  return (
<>
<div className={Parent}>
      <div className={Form_Box}>
        <form>
          <div class="form-group">
            <input
              type="text"
              name="server"
              onChange={changehandle}
              placeholder="Enter server name"
              class="form-control"
            />
          </div>
          <div class="form-group">
            <input
              type="text"
              name="database"
              onChange={changehandle}
              placeholder="Enter Database Name"
              class="form-control"
            />
          </div>
          <div class="form-group">
            <input
              type="text"
              name="username"
              onChange={changehandle}
              placeholder="Enter Username"
              class="form-control"
            />
          </div>
          <div class="form-group">
            <input
              type="password"
              name="password"
              onChange={changehandle}
              placeholder="Enter Password"
              class="form-control"
            />
          </div>
          <div class="form-group form-check">
            <input type="checkbox" class="form-check-input" />
            <label class="form-check-label" for="exampleCheck1">
              Check me out
            </label>
          </div>
          <button type="submit" onClick={submit} class={["btn btn-primary",btn].join(" ")}>
            save
          </button>
        </form>
      </div>
    </div>
 
</>
    )
}

export default SignUp