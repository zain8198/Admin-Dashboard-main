import React, { useLayoutEffect, useState } from "react";
import { contact } from "../../endpoints/constant";
import style from "./style.module.css";
import Loading from "../../components/loader/Loading";
import { DataGrid, GridRowsProp, GridColDef } from "@mui/x-data-grid";
import Grid from "../../components/Grid/Grid";

const Contact = () => {
  const { contact_container, title, searchbar } = style;
  const [data, setdata] = useState([]);
  const [search, setsearch] = useState("");
  const [loading, setloading] = useState(true);

  //////fetching data////
  const fetchingdata = async () => {
    const jsondata = await fetch(contact);
    const result = await jsondata.json();
    if (result) {
      setloading(false);
    }
    setdata(result.recordset);
    console.log(result.recordset);
  };
  useLayoutEffect(() => {
    fetchingdata();
  }, []);

  const change = (e) => {
    setsearch(e.target.value);
  };
  if (loading) {
    return <Loading />;
  }

  const column = [
    {
      field: "Sno",
      headerName: "Sno",
      width: 150,
    },
    {
      field: "User_ID",
      headerName: "User Id",
      width: 150,
    },
    {
      field: "User Name",
      headerName: "User Name",
      width: 150,
    },
    {
      field: "UserPass",
      headerName: "User Password",
      width: 150,
    },
    {
      field: "contact",
      headerName: "Contact",
      width: 150,
    },
    {
      field: "User Group",
      headerName: "User Group",
      width: 150,
    },
  ];
  const row = data
    .filter((item) => {
      return search.toLowerCase() === ""
        ? item
        : item["User Name"].toLowerCase().includes(search) ||
            item.UserPass.toLowerCase().includes(search) ||
            item.contact.toLowerCase().includes(search);
    })
    .map((item, index) => {
      return {
        ...item,
        id: index,
        Sno: index + 1,
      };
    });
  console.log(data);
  return (
    <>
      <div className={contact_container}>
        <div className={title}>
          <h1 className="heading ms-2 my-n2">Users </h1>
        </div>
        <form>
          <div className="form-group row mt-2 ">
            <div className="col-sm-12">
              <input
                type="text"
                onChange={change}
                placeholder="Search..."
                className={["form-control", searchbar].join(" ")}
                id="inputPassword"
              />
            </div>
          </div>
        </form>

        <Grid {...{ column, row }} />
{/* 
        <table className="table align-top  table-hover  table-bordered table-sm usertable mt-n4 ">
          <thead>
            <tr>
              <th scope="col">SNO.</th>
              <th scope="col">User Id</th>
              <th scope="col">User Name</th>
              <th scope="col">User Password</th>
              <th scope="col">contact</th>
              <th scope="col">User Group</th>
            </tr>
          </thead>
          {
            <tbody>
              {data ? (
                data
                  .filter((item) => {
                    return search.toLowerCase() === ""
                      ? item
                      : item["User Name"].toLowerCase().includes(search) ||
                          item.UserPass.toLowerCase().includes(search) ||
                          item.contact.toLowerCase().includes(search);
                  })
                  .sort((a, b) => {
                    if (a["User Name"].at(0) < b["User Name"].at(0)) {
                      return -1;
                    } else if (a["User Name"] > b["User Name"]) {
                      return 1;
                    } else {
                      return 0;
                    }
                  })
                  .map((val, index) => {
                    return (
                      <tr>
                        <td>{index + 1}</td>
                        <td>{val.User_ID}</td>
                        <td>{val["User Name"]}</td>
                        <td>{val.UserPass}</td>
                        <td>{val.contact}</td>
                        <td>{val["User Group"]}</td>
                      </tr>
                    );
                  })
              ) : (
                <h1>no data</h1>
              )}
            </tbody>
          }
        </table> */}
      </div>
    </>
  );
};

export default Contact;
