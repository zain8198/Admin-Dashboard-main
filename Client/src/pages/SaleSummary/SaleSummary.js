import React from "react";
import axios from "axios";
import style from "./style.module.css";
import { useState, useLayoutEffect } from "react";
import { fromdate, toDate, combo, summary } from "../../endpoints/constant";
import Button from "@mui/material/Button";
import Loading from "../../components/loader/Loading";
const SaleSummary = () => {
  const { summary_container, from_date_container, to_date_container } = style;
  const [optfetching, setoptfetching] = useState([]);
  const [data, setdata] = useState([]);
  const [select, setselect] = useState("all");
  const [fromdate, setfromdate] = useState(new Date().toJSON().slice(0, 10));
  const [todate, settodate] = useState(new Date().toJSON().slice(0, 10));
  const [submitselect, setsubmitselect] = useState("");
  const [combofilter, setcombofilter] = useState([]);
  const [loading, setloading] = useState(true);
  var sum = 0;
  let Amount = 0;
  let TotalOtherCharges = 0;
  let TotalBillDiscoun = 0;
  let arr = [];

  const selectcategoryhandle = async (e) => {
    setselect(e.target.value);
    console.log(e.target.value);
  };
  const fetchApi = async () => {
    const json = await axios.get(combo);
    setcombofilter(json.data.recordset);
    console.log(json.data.recordset);
  };
  useLayoutEffect(() => {
    fetchApi();
  }, []);

  const selectfromdatehandle = async (e) => {
    const String = new Date(e.target.value).toISOString().slice(0, 10);
    setfromdate(String);
    fetch(fromdate, {
      method: "POST",
      body: JSON.stringify({ String }),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
      })
      .catch((err) => {
        console.log(err.message);
      });

    console.log(String);
  };
  const selectTodatehandle = (e) => {
    const String = new Date(e.target.value).toISOString().slice(0, 10);

    settodate(String);
    fetch(toDate, {
      method: "POST",
      body: JSON.stringify({ String }),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
      })
      .catch((err) => {
        console.log(err.message);
      });

    const fetchApi = async () => {
      const json = await axios.get(summary);
      await setoptfetching(json.data.recordset.Category);
    };
  };

  const submit = (event) => {
    const fetchApi = async () => {
      const result = await axios.get(summary);
      if (result) {
        setdata(result.data.recordset);
        setloading(false);
      }
      console.log("heheh", result.data.recordset);
    };
    fetchApi();

    setsubmitselect(select);
    if (fromdate === "" && todate === "") {
      alert("Please Select Date");
    } else if (fromdate === "") {
      alert("Please Select From Date");
    } else if (todate === "") {
      alert("please select To date otherwise data will not fetching");
    } else if (fromdate > todate) {
      alert("wrong Formate");
    } else if (select === "") {
      alert("select product");
    } else {
    }
  };
  //  if (loading) {
  //   return (
  //     <Loading/>
  //   );}
  
  console.log(data)
  return (
    <>
      <div className={summary_container}>
        <h1> Sale Summary</h1>
        <div className="date d-flex justify-content-between mt-3 mb-5">
          <div className={from_date_container}>
            <h5 className="mt-2">Form</h5>
            <input
              select={fromdate}
              value={fromdate}
              type="date"
              className="form-control"
              // placeholderText={getdate}
              showPopperArrow={false}
              onChange={selectfromdatehandle}
            />
          </div>
          <div className={to_date_container}>
            <h5 className="mt-2">To</h5>
            <input
              value={todate}
              type="date"
              className="form-control"
              placeholderText="Select Date"
              showPopperArrow={false}
              onChange={selectTodatehandle}
            />
          </div>

          <div className="row pl-1 d-flex justify-content-end me-3">
            <select
              id="select"
              className="form-select h-75 mt-2"
              onChange={selectcategoryhandle}
            >
              <option value="all">All Catergory</option>
              {combofilter.map((val) => {
                return <option value={val.Category}>{val.Category}</option>;
              })}
            </select>
          </div>
          <Button variant="contained" type="submit" onClick={submit}>
            Generate
          </Button>
        </div>

        <table class="table align-top table-hover  table-bordered table-sm">
          <thead>
            <tr>
              <th scope="col">Sno</th>
              <th scope="col">Catergory</th>
              <th scope="col">Item</th>
              <th scope="col">Qty</th>
              <th scope="col" colSpan={3}>
                Sale Price
              </th>
              <th scope="col">Tax</th>
              <th scope="col">Discount</th>
              <th scope="col">Amount</th>
            </tr>
          </thead>
          <tbody>
            {data &&
              data
                .filter((category, index) => {
                  return submitselect == category.Category || select == "all"
                    ? category
                    : null;
                })
                .map((val, index) => {
                  arr.push(val);
                  sum += val.Item_Qty * val.NetSPrice;
                  Amount += val.Amount;
                  TotalOtherCharges += val.TotalOtherCharges;
                  TotalBillDiscoun += val.TotalBillDiscoun;
                  return (
                    <>
                      <tr>
                        <td>{index + 1}</td>
                        <td>{val.Category}</td>
                        <td>{val.Item_Name}</td>
                        <td>{val.Item_Qty}</td>
                        <td colSpan={3}>{val["Sale Price"]}</td>
                        <td>{val.Tax}</td>
                        <td>{val.Discount}</td>
                        <td>{val.Amount}</td>
                      </tr>
                    </>
                  );
                })}
            {arr.length >= 1 && (
              <>
                <tr>
                  <th></th>
                  <th></th>
                  <th></th>
                  <th colSpan={2}></th>
                  <th colSpan={2}></th>
                  <th colSpan={2}> Amount</th>
                  <th>{`+${Amount}`}</th>
                </tr>
                <tr>
                  <th></th>
                  <th></th>
                  <th></th>
                  <th colSpan={2}></th>
                  <th colSpan={2}></th>
                  <th colSpan={2}>Other Charges</th>
                  <th>{`+${TotalOtherCharges}`}</th>
                </tr>
                <tr>
                  <th></th>
                  <th></th>
                  <th></th>
                  <th colSpan={2}></th>
                  <th colSpan={2}> </th>
                  <th colSpan={2}>Bill Discount</th>
                  <th>{`${TotalBillDiscoun}`}</th>
                </tr>
                <tr>
                  <th></th>
                  <th></th>
                  <th></th>
                  <th colSpan={2}></th>
                  <th colSpan={2}></th>
                  <th colSpan={2}>Total Amount</th>
                  <th>{Amount + TotalOtherCharges - TotalBillDiscoun}</th>
                </tr>
              </>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default SaleSummary;
