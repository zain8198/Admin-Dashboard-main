import React, { useEffect } from "react";
import { useState, useLayoutEffect } from "react";
import style from "./style.module.css";
import {
  party,
  partytype,
  bankdetail,
  openingdate,
} from "../../endpoints/constant";
import Loading from "../../components/loader/Loading";

const Ledger = () => {
  const {
    ledger_container,
    from_date_container,
    to_date_container,
    party_type_combo,
    party_name_combo,
  } = style;
  const [partycategory, setpartycategry] = useState([]);
  const [partyname, setpartyname] = useState([]);
  const [userdetail, setuserdetail] = useState([]);
  const [selectparty, setselectparty] = useState("all");
  const [selectuser, setselectuser] = useState("all");
  const [submitselectuser, setsubmitselectuser] = useState("all");
  const [partytypefilter, setpartytypefilter] = useState("all");
  const [fromdate, setfromdate] = useState(new Date().toJSON().slice(0, 10));
  const [todate, settodate] = useState(new Date().toJSON().slice(0, 10));
  const [submitfromdate, setsubmitfromdate] = useState();
  const [submittodate, setsubmittodate] = useState();
  const [Net, setNet] = useState("");
  const [loading, setloading] = useState(true);
  let debit = 0;
  let credit = 0;
  let arr = [];

  /////////party type combo filler by database///////
  const fetchapifrompartype = async () => {
    const json = await fetch(partytype);
    const result = await json.json();
    if (result) {
      setpartycategry(result.recordset);
      setloading(false);
    }
  };

  /////////party name combo filler by database///////
  const fetchapifrompartname = async () => {
    const json = await fetch(party);
    const result = await json.json();
    setpartyname(result.recordset);
  };

  useLayoutEffect(() => {
    fetchapifrompartype();
    fetchapifrompartname();
  }, []);

  const selectpartytypehandle = async (e) => {
    setpartytypefilter(e.target.value);
  };
  const slectpartynamehandle = async (e) => {
    setselectuser(e.target.value);
  };

  const selectfromdate = (e) => {
    setfromdate(e.target.value);
    const String = new Date(e.target.value).toISOString().slice(0, 10);
    setfromdate(String);
    fetch(openingdate, {
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

    console.log("post", String);
    console.log(e.target.value);
  };
  const selectTodate = (e) => {
    settodate(e.target.value);
    console.log(e.target.value);
  };
  const submit = () => {
    setsubmitfromdate(fromdate);
    setsubmittodate(todate);
    setselectparty(partytypefilter);
    setsubmitselectuser(selectuser);
  };
  const fetch2 = async () => {
    const json = await fetch(bankdetail);
    const result = await json.json();
    setuserdetail(result.recordset);
    console.log(result);
  };
  useEffect(() => {
    fetch2();
  }, []);
  if (loading) {
    return <Loading />;
  }

  return (
    <>
      <div className={ledger_container}>
        <div className="date d-flex justify-content-evenly mt-4 mb-4">
          <div className={from_date_container}>
            <h5 className="m-1">Form</h5>
            <input
              select={fromdate}
              value={fromdate}
              type="date"
              className="form-control"
              placeholderText={""}
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
              selected={""}
              placeholderText="Select Date"
              showPopperArrow={false}
              onChange={selectTodate}
            />
          </div>
        </div>
        <div className="row d-flex justify-content-evenly mb-4">
          <div className="col-4">
            <div className="row pl-1 d-flex justify-content-end me-4">
              <select
                id="select"
                className={["form-select", party_type_combo].join(" ")}
                onChange={selectpartytypehandle}
              >
                <option value="all">Party Type</option>
                {partycategory.map((category, index) => {
                  return (
                    <option key={index} value={category.PartyTypeId}>
                      {category.PartyType}
                    </option>
                  );
                })}
              </select>
            </div>
          </div>
          <div className="col-4">
            <div className="row pl-1 d-flex justify-content-end me-4">
              <select
                id="select"
                className={["form-select", party_name_combo].join(" ")}
                onChange={slectpartynamehandle}
              >
                <option value="all">All</option>
                {partyname
                  .filter((item) => {
                    return partytypefilter == item.PartyTypeID ||
                      partytypefilter == "all"
                      ? item
                      : null;
                  })
                  .map((category) => {
                    return (
                      <option value={category.PartyName}>
                        {category.PartyName}
                      </option>
                    );
                  })}
                <h1>{partytypefilter}</h1>
              </select>
            </div>
          </div>
          <div className="col-2 ">
            <button className="btn btn-primary" onClick={submit}>
              Generate
            </button>
          </div>
        </div>
        <table className="table table-hover  table-bordered table-sm">
          <thead>
            <tr>
              <th scope="col">Sno</th>
              <th scope="col" colSpan={2}>
                Date
              </th>
              <th scope="col" colSpan={3}>
                Party Name
              </th>
              <th scope="col">Debit</th>
              <th scope="col">Credit</th>
              <th scope="col">Balance</th>
              <th scope="col">Remarks</th>
            </tr>
          </thead>
          <tbody>
            { userdetail
                  .filter((item) => {
                    var userdate = new Date(item.TrDate).toJSON().slice(0, 10);
                    return (
                      userdate >= submitfromdate &&
                      userdate <= submittodate &&
                      item
                    );
                  })
                  .filter((item) => {
                    return selectparty == item.PartyTypeID ||
                      selectparty == "all"
                      ? item
                      : null;
                  })
                  .filter((item) => {
                    return submitselectuser == item.PartyName ||
                      submitselectuser == "all"
                      ? item
                      : null;
                  })
                  .map((item, index) => {
                    arr.push(item);
                    var userdate = new Date(item.TrDate).toJSON().slice(0, 10);
                    const { TrDate, PartyName, Remarks, Credit, Debit } = item;
                    debit += Debit;
                    credit += Credit;
                    console.log(TrDate);
                    return (
                      <>
                        <tr key={index}>
                          <td>{index + 1}</td>
                          <td colSpan={2}>{userdate}</td>
                          <td colSpan={3}>{PartyName}</td>
                          <td>{Debit}</td>
                          <td>{Credit}</td>
                          <td>{Credit - Debit}</td>
                          <td>{Remarks.slice(0, 50)}</td>
                        </tr>
                      </>
                    );
                  })
            
                }
            {arr.length >= 1 && (
              <>
                <tr>
                  <th></th>
                  <th colSpan={2}></th>
                  <th colSpan={3}>Total Summary</th>
                  <td>{debit}</td>
                  <td>{credit}</td>
                </tr>
                <tr>
                  <th></th>
                  <th colSpan={2}></th>
                  <th colSpan={3}>Total Balance</th>
                  <th>{debit - credit}</th>
                </tr>
              </>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default Ledger;
