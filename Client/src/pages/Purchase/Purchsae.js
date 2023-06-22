import React, { useState, useEffect } from "react";
import axios from "axios";
import Button from "@mui/material/Button";
import { purchaseregister } from "../../endpoints/constant";
import style from "./style.module.css";
import Loading from "../../components/loader/Loading";

const Purchsae = () => {
  const {
    purchase_container,
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
  const [fromdate, setfromdate] = useState(new Date().toJSON().slice(0, 10));
  const [todate, settodate] = useState(new Date().toJSON().slice(0, 10));
  const [submitfromdate, setsubmitfromdate] = useState();
  const [submitTodate, setsubmitTodate] = useState("");
  const [Net, setNet] = useState("");
  const [selectedproduct, setselectedproduct] = useState("");
  const [loading, setloading] = useState(true);
  let qty = 0;
  let itemprice = 0;
  let priceinctax = 0;
  let saleprice = 0;
  let arr = [];

  ///////filter category for category combo//////
  let filter = data.map((val) => {
    return val.Category;
  });

  ///////filter supplier for supplier combo//////
  let filtersupplier = data.map((val) => {
    return val.Supplier;
  });

  const fetchApi = async () => {
    const result = await axios.get(purchaseregister);
    if (result) {
      setloading(false);
    }
    setdata(result.data.recordset);
    console.log(result)
  };

  useEffect(() => {
    fetchApi();
  }, []);

  const selectfromdate = (e) => {
    const String = new Date(e.target.value).toJSON().slice(0, 10);
    setfromdate(String);
    console.log(String);
  };
  const selectTodate = (e) => {
    const String = new Date(e.target.value).toJSON().slice(0, 10);
    settodate(String);
    console.log(String);
  };

  const selectcategoryhandle = (e) => {
    setselect(e.target.value);
    console.log(e.target.value);
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
    if (fromdate === "" && todate === "") {
      alert("Please Select Date");
    } else if (fromdate === "") {
      alert("Please Select From Date");
    } else if (todate === "") {
      alert("Please Select To Date");
    } else if (fromdate > todate) {
      alert("from date is greater than to date");
    } else if (select === "") {
      alert("select product");
    } else {
      setsubmitfromdate(fromdate);
      setsubmitTodate(todate);
      setselectedproduct(select);
      setsubmitfilteritem(filteritem);
      setNet(filteritem);
      setsubmitLocation(Location);
    }
  };
  if (loading) {
    return <Loading />;
  }

  return (
    <div className={purchase_container}>
      <div className="date d-flex justify-content-evenly mt-4 mb-3">
        <div className={from_date_container}>
          <h5 className="1px">Form</h5>
          <input
            type="date"
            value={fromdate}
            className="form-control"
            formatDate="yyyy-MM-dd"
            placeholderText={fromdate}
            showPopperArrow={false}
            onChange={selectfromdate}
          />
        </div>
        <div className={to_date_container}>
          <h5 className="m-1">To</h5>
          <input
            value={todate}
            type="date"
            className="form-control"
            formatDate="MMM/dd/yyyy"
            placeholderText="Select Date"
            showPopperArrow={false}
            onChange={selectTodate}
          />
        </div>

        <div className="row pl-1 d-flex justify-content-end me-1"></div>
        <Button variant="contained" onClick={submit}>
          Generate
        </Button>
      </div>
      <div className={combos_container}>
        <div className="d-flex">
          <h5 className="mt-3">Catergory</h5>
          <select
            id="select"
            className={["form-select", category_combo].join(" ")}
            onChange={selectcategoryhandle}
            // aria-label="Default select example"
          >
            <option value="all">All Catergory</option>
            {[...new Set(filter)].map((val) => {
              return <option value={val}>{val}</option>;
            })}
          </select>
        </div>
        <div className="d-flex ms-2">
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
                return (
                  <option style={{ width: "" }} value={val.Item_Name}>
                    {val.Item_Name}
                  </option>
                );
              })}
          </select>
        </div>
        <div className="d-flex">
          <h5 className="mt-3 ms-2">Supplier</h5>

          <select
            id="select"
            className={["form-select", location_combo].join(" ")}
            onChange={selectLocationhandle}
          >
            <option value="all">All Supplier</option>
            {[...new Set([...filtersupplier])].map((val) => {
              return <option value={val}>{val}</option>;
            })}
          </select>
        </div>
      </div>

      <table class="table align-top  table-hover  table-bordered table-sm">
        <thead>
          <tr>
            <th scope="col">Sno</th>
            <th scope="col">Supplier</th>
            <th scope="col">Purchase ID</th>
            <th scope="col">Purchased Date</th>
            <th scope="col">Category</th>
            <th scope="col">Item Name</th>
            <th scope="col">QTY</th>
            <th scope="col">Item Price</th>
            <th scope="col">Price Including Tax</th>
            <th scope="col">Sale Price</th>
            {/* <th scope="col">Net Sale Price</th>
            <th scope="col">Total Amount</th> */}
          </tr>
        </thead>
        <tbody>
          {data
            .filter((category, index) => {
              return select == category.Category || select == "all"
                ? category
                : null;
            })
            .filter((Supplier) => {
              return submitLocation == Supplier.Supplier ||
                submitLocation == "all"
                ? Supplier
                : null;
            })

            .filter((val) => {
              return val.Item_Name == submitfilteritem ||
                submitfilteritem == "all"
                ? val
                : null;
            })
            .filter((item) => {
              var date = new Date(item.Purchased_Date).toJSON().slice(0, 10);
              if (date >= submitfromdate && date <= submitTodate) {
                return item;
              }
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

              const {
                Supplier,
                Purchase_ID,
                Category,
                Item_Name,
                Item_QTY,
                Item_Price,
                PriceIncTax,
                SalePrice,
                NetSPrice,
                Amount,
              } = val;
              const { Purchased_Date } = val;
              const year = new Date(Purchased_Date).getFullYear();
              const month = new Date(Purchased_Date).getMonth();
              const day = new Date(Purchased_Date).getDate();
              qty += val.Item_QTY;
              itemprice += val.Item_Price;
              priceinctax += val.PriceIncTax;
              saleprice += val.SalePrice;
              return (
                <>
                  <tr key={index}>
                    <td style={{ width: "50px" }}>{index}</td>
                    <td>{Supplier}</td>
                    <td>{Purchase_ID}</td>
                    <td>{`${year}-${months[month]}-${day}`}</td>
                    <td>{Category}</td>
                    <td>{Item_Name}</td>
                    <td>{Item_QTY}</td>
                    <td>{Item_Price}</td>
                    <td>{PriceIncTax}</td>
                    <td>{SalePrice}</td>
                    {/* <td>{NetSPrice}</td>
                    <td>{Amount}</td> */}
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
              <th>{qty}</th>
              <th>{itemprice.toFixed(2)}</th>
              <th>{priceinctax.toFixed(2)}</th>
              <th>{saleprice.toFixed(2)}</th>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Purchsae;
