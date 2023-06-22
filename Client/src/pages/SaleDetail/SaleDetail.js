import axios from "axios";
import React, { useLayoutEffect, useState } from "react";
import Button from "@mui/material/Button";
import { saledetail } from "../../endpoints/constant";
import style from "./style.module.css";
import Loading from "../../components/loader/Loading";
import Grid from "../../components/Grid/Grid";

const SaleDetail = () => {
  const {
    sale_detail_container,
    from_date_container,
    to_date_container,
    combos_container,
    category_combo,
    item_combo,
    location_combo,
  } = style;
  const [data, setdata] = useState([]);
  const [select, setselect] = useState("all");
  const [filteritem, setfilteritem] = useState("all");
  const [submitfilteritem, setsubmitfilteritem] = useState("all");
  const [Location, setLocation] = useState("all");
  const [submitLocation, setsubmitLocation] = useState("");
  const [getdate, setgetdate] = useState(new Date().toJSON().slice(0, 10));
  const [getdate1, setgetdate1] = useState(new Date().toJSON().slice(0, 10));
  const [FromDate, setFromDate] = useState();
  const [ToDate, setToData] = useState("");
  const [selectedproduct, setselectedproduct] = useState("");
  const [loading, setloading] = useState(true);
  const [zain, setzain] = useState(true);

  let NetAmount = 0;
  let NetQty = 0;
  let NetSale = 0;
  let NetTax = 0;
  let NetDiscount = 0;
  let NetSaleP = 0;
  let arr = [];
  let hide=false

  const fetchApi = async () => {
    const result = await axios.get(saledetail);
    if (result) {
      setloading(false);
    }
    setdata(result.data.recordset);
    console.log(result.data.recordset);
  };
  useLayoutEffect(() => {
    fetchApi();
  }, []);

  let filter = data.map((val) => {
    return val.Category;
  });
  let filterLocation = data.map((val) => {
    return val.Location;
  });

  const selectcategoryhandle = (e) => {
    setselect(e.target.value);
    console.log(e.target.value);
  };

  const selectfromdatehandle = (e) => {
    const String = new Date(e.target.value).toJSON().slice(0, 10);
    setgetdate(String);
    console.log(String);
  };
  const selectTodatehandle = (e) => {
    const String = new Date(e.target.value).toJSON().slice(0, 10);
    setgetdate1(String);
    console.log(String);
  };
  const selectitemhandle = (e) => {
    setfilteritem(e.target.value);
    console.log(e.target.value);
  };
  const selectLocationhandle = (e) => {
    setLocation(e.target.value);
    console.log(e.target.value);
  };

  const submit = () => {
    if (getdate === "" && getdate1 === "") {
      alert("Please Select Date");
    } else if (getdate === "") {
      alert("Please Select From Date");
    } else if (getdate1 === "") {
      alert("Please Select To Date");
    } else if (getdate > getdate1) {
      alert("from date is greater than to date");
    } else if (select === "") {
      alert("select product");
    } else {
      setFromDate(getdate);
      setToData(getdate1);
      setselectedproduct(select);
      setsubmitfilteritem(filteritem);
      setsubmitLocation(Location);
    }
  };
  if (loading) {
    return <Loading />;
  }
  const column = [
    {
      field: "Location",
      headerName: "Location",
      width: 150,
    },
    {
      field: "Sales_ID",
      headerName: "Tr. Id",
      width: 100,
    },
    {
      field: "zain",
      width: 100,
    },
    {
      field: "Sales_Date",
      headerName: "Date",
      width: 150,
    },
    {
      field: "Category",
      headerName: "Category",
    },
    {
      field: "Item_Name",
      headerName: "Item",
      width: 200,
    },
    {
      field: "Item_Qty",
      headerName: "Qty",
    },
    {
      field: "OrignalSPrice",
      headerName: "Location",
    },
    {
      field: "TaxAmtPerPcs",
      headerName: "Location",
    },
    {
      field: "Discount",
      headerName: "Discount",
    },
    {
      field: "NetSPrice",
      headerName: "Net Sales Price",
    },
    {
      field: "Amount",
      headerName: "Net Amount",
    },
  ];
  const row = data
    .filter((category, index) => {
      return select == category.Category || select == "all" ? category : null;
    })
    .filter((category, index) => {
      return submitLocation == category.Location || select == "all"
        ? category
        : null;
    })
    .filter((val) => {
      return val.Item_Name == submitfilteritem || submitfilteritem == "all"
        ? val
        : null;
    })
    .filter((item) => {
      var date = new Date(item.Sales_Date).toJSON().slice(0, 10);
      if (date >= FromDate && date <= ToDate) {
        return item;
      }
      else{

      }
    })
    .map((item, index) => {
      arr.push(item);
      var months = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ];
      const { Sales_Date } = item;
      NetAmount += item.Item_Qty * item.NetSPrice;
      NetSale += item.NetSPrice;
      NetDiscount += item.Discount;
      NetTax += item.TaxAmtPerPcs;
      NetQty += item.Item_Qty;
      NetSaleP += item.OrignalSPrice;
      const year = new Date(Sales_Date).getFullYear();
      const month = new Date(Sales_Date).getMonth();
      const day = new Date(Sales_Date).getDate();
      if(arr.length>=1){
        return {
            ...item,
        id: index,
        Sales_Date: `${year}-${months[month]}-${day}`,
        zain:"a"
        }
      }
      else {hide=true
         
      }
      return {
        ...item,
        id: index,
        Sales_Date: `${year}-${months[month]}-${day}`,
      }
      ;
    });
  return (
    <>
      <div className={sale_detail_container}>
        <div className="d-flex justify-content-evenly mt-5 mb-3">
          <div className={from_date_container}>
            <h5 className="m-1">Form</h5>
            <input
              type="date"
              value={getdate}
              className="form-control"
              formatDate="yyyy-MM-dd"
              placeholderText={getdate}
              showPopperArrow={false}
              onChange={selectfromdatehandle}
            />
          </div>
          <div className={to_date_container}>
            <h5 className="m-1">To</h5>
            <input
              value={getdate1}
              type="date"
              className="form-control"
              formatDate="MMMM/dd/yyyy"
              placeholderText="Select Date"
              showPopperArrow={false}
              onChange={selectTodatehandle}
            />
          </div>

          <div className="row pl-1 d-flex justify-content-end me-3"></div>
          <Button variant="contained" onClick={submit}>
            Generate
          </Button>
        </div>
        <div className={combos_container}>
          <div className="d-flex">
            <h5 className="pt-3">Catergory</h5>
            <select
              id="select"
              className={["form-select", category_combo].join(" ")}
              onChange={selectcategoryhandle}
            >
              <option value="all">All Catergory</option>
              {[...new Set(filter)].map((val) => {
                return <option value={val}>{val}</option>;
              })}
            </select>
          </div>
          <div className="d-flex ms-n2">
            <h5 className="mt-3">Item</h5>

            <select
              className={["form-select", item_combo].join(" ")}
              onChange={selectitemhandle}
            >
              <option value="all">All Item</option>
              {data
                .filter((category, index) => {
                  return select == category.Category || select == "all"
                    ? category
                    : null;
                })
                .map((val) => {
                  return <option value={val.Item_Name}>{val.Item_Name}</option>;
                })}
            </select>
          </div>
          <div className="d-flex">
            <h5 className="pt-3 ms-4">Location</h5>
            <select
              id="select"
              className={["form-select", location_combo].join(" ")}
              onChange={selectLocationhandle}
            >
              <option value="all">All Location</option>
              {[...new Set(filterLocation)].map((val) => {
                return <option value={val}>{val}</option>;
              })}
            </select>
          </div>
        </div>
        {arr.length >=1 && <Grid {...{ column, row }} /> }
        {hide && <h1>record</h1>}
        <table
          class="table align-top  table-hover  table-bordered table-sm"
          style={{ position: "relative" }}
        >
          <thead>
            <tr>
              <th scope="col">Sno</th>
              <th scope="col">Location</th>
              <th scope="col">Tr. Id</th>
              <th scope="col">Date</th>
              <th scope="col">Category</th>
              <th scope="col">Item</th>
              <th scope="col">Qty</th>
              <th scope="col"> Sale Price</th>
              <th scope="col">Tax</th>
              <th scope="col">Discount</th>
              <th scope="col">Net Sale Price</th>
              <th scope="col">Total Amount</th>
            </tr>
          </thead>
          <tbody>
            {data
              .filter((category, index) => {
                return select == category.Category || select == "all"
                  ? category
                  : null;
              })
              .filter((category, index) => {
                return submitLocation == category.Location || select == "all"
                  ? category
                  : null;
              })
              .filter((val) => {
                return val.Item_Name == submitfilteritem ||
                  submitfilteritem == "all"
                  ? val
                  : null;
              })
              .filter((item) => {
                var date = new Date(item.Sales_Date).toJSON().slice(0, 10);
                if (date >= FromDate && date <= ToDate) {
                  return item;
                }
                // return setzain(null)
              })

              .map((val, index) => {
                arr.push(val);
                var months = [
                  "Jan",
                  "Feb",
                  "Mar",
                  "Apr",
                  "May",
                  "Jun",
                  "Jul",
                  "Aug",
                  "Sep",
                  "Oct",
                  "Nov",
                  "Dec",
                ];

                const { Sales_Date } = val;
                // NetAmount += val.Item_Qty * val.NetSPrice;
                // NetSale += val.NetSPrice;
                // NetDiscount += val.Discount;
                // NetTax += val.TaxAmtPerPcs;
                // NetQty += val.Item_Qty;
                // NetSaleP += val.OrignalSPrice;
                // const year = new Date(Sales_Date).getFullYear();
                // const month = new Date(Sales_Date).getMonth();
                // const day = new Date(Sales_Date).getDate();
                const {
                  Location,
                  Sales_ID,
                  Category,
                  Item_Name,
                  Item_Qty,
                  OrignalSPrice,
                  TaxAmtPerPcs,
                  Discount,
                  NetSPrice,
                  Amount,
                } = val;
                const year = new Date(Sales_Date).getFullYear();
                const month = new Date(Sales_Date).getMonth();
                const day = new Date(Sales_Date).getDate();
                return (
                  <>
                    <tr key={index}>
                      <td style={{ width: "50px" }}>{index}</td>
                      <td>{Location}</td>
                      <td>{Sales_ID}</td>
                      <td>{`${year}-${months[month]}-${day}`}</td>
                      <td>{Category}</td>
                      <td>{Item_Name}</td>
                      <td>{Item_Qty}</td>
                      <td>{OrignalSPrice}</td>
                      <td>{TaxAmtPerPcs}</td>
                      <td>{Discount}</td>
                      <td>{NetSPrice}</td>
                      <td>{Amount}</td>
                    </tr>
                  </>
                );
              })}

            {arr.length >= 1 && (
              <tr>
                <th></th>
                <th></th>
                <th></th>
                <th></th>
                <th></th>
                <th>Net Amount</th>
                <th>{Math.ceil(NetQty)}</th>
                <th>{NetSaleP}</th>
                <th>{NetTax}</th>
                <th>{NetDiscount}</th>
                <th>{NetSale}</th>
                <th>{NetAmount}</th>
              </tr>
            )}
          </tbody>
        </table>
        {!zain && <h1>no data</h1>}
      </div>
    </>
  );
};

export default SaleDetail;
