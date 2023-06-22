import React, { useState, useContext } from "react";
import { Navigate, NavLink, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import style from "./style.module.css";

const Login = (prop) => {
  const { Parent, Form_Box, btn } = style;
  const navigate = useNavigate();
  const [data, Setdata] = useState([]);
  const [auth, setauth] = useState(false);
  const [InputValue, SetInputValue] = useState({
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
  useEffect(() => {
    fetch("http://localhost:5000/give")
      .then((response) => response.json())
      .then((result) => {
        Setdata(result.recordset);
        console.log(result.recordset);
      });
  }, []);

  const { username, password } = InputValue;
  const submit = (e) => {
    var flag1 = false;
    var flag2 = false;
    var flag3 = false;
    var flag4 = false;
    e.preventDefault();
    data.map((val) => {
      const { Username, UserPass } = val;
      if (username == Username && password == UserPass) {
        localStorage.setItem("IsAuth", true);
        prop.auth(localStorage.getItem("IsAuth"));
      } else if (!username || !password) {
        flag1 = true;
      } else if (username == Username && password !== UserPass) {
        flag2 = true;
      } else if (username !== Username && password == UserPass) {
        flag3 = true;
      } else if (username !== Username && password !== UserPass) {
        // flag4 = true;
      }
    });
    if (flag1) {
      alert("please fill all required field");
    } else if (flag2) {
      alert("correct your password");
    } else if (flag3) {
      alert("correct your username");
    } else if (flag4) {
      alert("This user does not exist");
    }
  };
  return (
    <>
      <div className={Parent}>
        <div className={Form_Box}>
          <form>
            <div className="form-group">
              <input
                type="text"
                name="username"
                onChange={changehandle}
                placeholder="Enter Username"
                className="form-control mb-3 mt-3"
              />
            </div>
            <div className="form-group">
              <input
                type="password"
                name="password"
                onChange={changehandle}
                placeholder="Enter Password"
                className="form-control mb-3"
              />
            </div>
            <div className="form-group form-check">
              <input type="checkbox" class="form-check-input" />
              <label class="form-check-label" for="exampleCheck1">
                Check me out
              </label>
            </div>
            <button
              type="submit"
              onClick={submit}
              className={["btn btn-primary", btn].join(" ")}
            >
              Login
            </button>
            {/* <button className={["btn btn-primary", btn].join(" ")} onClick={()=>{alert()}} >signup</button> */}
          </form>
        </div>
      </div>
    </>
  );
};

export default Login;
