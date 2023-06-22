import React from "react";
import style from "./style.module.css";
import { useState, useLayoutEffect } from "react";
import axios from "axios";
import { stock } from "../../endpoints/constant";
import Loading from "../../components/loader/Loading";
import Grid from "../../components/Grid/Grid"
const Stock = () => {
  const {
    stock_container,
    searchbar,
    combo,
    title,
    pre_btn,
    next_btn,
    disable,
  } = style;
  const [data, setdata] = useState([]);
  const [search, setsearch] = useState("");
  const [select, setselect] = useState("all");
  const [page, setpage] = useState(1);
  const [loading, setloading] = useState(true);
  let saleprice = 0;
  let arr = [];

  const fetchApi = async () => {
    const json = axios.get(stock);
    json
      .then((res) => {
        setdata(res.data.recordset);
        setloading(false);
      })
      .catch((err) => {
        // alert(err)
      });
    console.log(json.data.recordset);
  };
  useLayoutEffect(() => {
    fetchApi();
  }, []);

  //////////searbar////
  const searchhandle = (e) => {
    setsearch(e.target.value);
  };

  ///////////combo///////
  const selecthandle = (e) => {
    setselect(e.target.value);
  };
  let combofilter = data.map((val) => {
    return val.Category;
  });

  ////////pagination//////////
  const selectpagehandle = (selectpage) => {
    if (
      (selectpage) =>
        1 && selectpage <= Math.floor(data.length / 10) && selectpage !== page
    ) {
      setpage(selectpage);
    }
  };

  if (loading) {
    return <Loading />;
  }

  const column = [
    { field: "Sno", headerName: "Sno", width: 150 },
    { field: "Item_Name", headerName: "Item", width: 150 },
    { field: "SalePrice", headerName: "Sale Price", width: 150 },
    { field: "PurchasePrice", headerName: "Purchase Price", width: 150 },
    { field: "Qty", headerName: "Quantity", width: 150 },
  ];
  const row = data
    .filter((item) => {
      return item.Item_Name.toLowerCase().includes(search);
    })
    .filter((category, index) => {
      return select === category.Category || select === "all" ? category : null;
    })
    .map((item, index) => {
      return {
        ...item,
        id: index,
        Sno: index + 1,
      };
    });

  console.log(data);
  // console.log(data)

  return (
    <>
      <div className={stock_container}>
        <div className={title}>
          <h1 className="heading ms-2 my-n2">Stock </h1>
        </div>
        <div className="d-flex justify-content-evenly mt-3 mb-3">
          <select
            id="select"
            className={["form-select", combo].join(" ")}
            onChange={selecthandle}
          >
            <option value="all">All category</option>
            {[...new Set(combofilter)].map((val, id) => {
              return (
                <option value={val} key={id}>
                  {val}
                </option>
              );
            })}
          </select>
          <form>
            <div className="form-group row mt-2 ">
              <div className="col-sm-12 ">
                <input
                  type="text"
                  onChange={searchhandle}
                  placeholder="Search"
                  className={["form-control", searchbar].join(" ")}
                  id="inputPassword"
                />
              </div>
            </div>
          </form>
        </div>

        {/* 
        <table className="table align-top  table-hover  table-bordered table-sm">
          <thead>
            <tr>
              <th scope="col">Sno</th>
              <th scope="col">Item</th>
              <th scope="col">Sale Price</th>
              <th scope="col">purchase Price</th>
              <th scope="col">Quantity</th>
            </tr>
          </thead>
          <tbody>
            {data
              .sort((a, b) => {
                if (a.Item_Name.at(0) < b.Item_Name.at(0)) {
                  return -1;
                } else if (a.Item_Name > b.Item_Name) {
                  return 1;
                } else {
                  return 0;
                }
              })
              .filter((item) => {
                return item.Item_Name.toLowerCase().includes(search);
              })

              .filter((category, index) => {
                return select === category.Category || select === "all"
                  ? category
                  : null;
              })
              .slice(page * 10 - 10, page * 10)
              .map((val, index) => {
                arr.push(val);
                saleprice += val.SalePrice * val.Qty;
                return (
                  <>
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>{val.Item_Name}</td>
                      <td>{val.SalePrice}</td>
                      <td>{val.PurchasePrice}</td>
                      <td>{val.Qty}</td>
                    </tr>
                  </>
                );
              })}
          </tbody>
        </table>
        {data.length > 0 && (
          <ul
            className="d-flex justify-content-evenly w-20"
            style={{ width: "50%", margin: "auto" }}
          >
            <li
              className={[page > 1 ? "" : disable, pre_btn].join(" ")}
              onClick={() => selectpagehandle(page - 1)}
            >
              Pre
            </li>
            {[...Array(Math.floor(data.length / 10))].map((_, i) => {
              i = i;
              // return <li className={page ==i+1 && "pagination_selector"} onClick={()=>selectpagehandle(i+1)} style={{border:"2px solid red",padding:"3px" ,cursor:"pointer"}}>{i+1}</li>
            })}
            <li style={{ listStyle: "none" }}>
              {page} / {Math.floor(data.length / 10)}
            </li>
            <li
              className={[
                page >= Math.floor(data.length / 10) && disable,
                next_btn,
              ].join(" ")}
              onClick={() => selectpagehandle(page + 1)}
              style={{ cursor: "pointer", fontWeight: "bolder", fontSize: "" }}
            >
              Next
            </li>
          </ul>
        )} */}
        <Grid {...{ row, column }} />
      </div>
    </>
  );
};


export default Stock;
