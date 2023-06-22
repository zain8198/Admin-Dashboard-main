import React, { useState, useLayoutEffect } from "react";
import SignalCellularAltIcon from "@mui/icons-material/SignalCellularAlt";
import CurrencyRubleIcon from "@mui/icons-material/CurrencyRuble";
import CallReceivedIcon from "@mui/icons-material/CallReceived";
import style from "./style.module.css";
import { Icon } from "@iconify/react";
import Linechart from "../../components/linechartgraph/Linechart";
import CircularProgress from "@mui/material/CircularProgress";
import {
  bankdetail,
  graph,
  Dstock,
  Dsales,
  Dpay,
  Dreceive,
} from "../../endpoints/constant.js";

const Dashboard = () => {
  let { dashboard_container, title, card_wrapper } = style;
  let [GraphData, SetGraphData] = useState([]);
  let [stock, setstock] = useState();
  let [sales, setsales] = useState();
  let [data, setdata] = useState([]);
  let [debit, setdebit] = useState(0);
  let [credit, setcredit] = useState(0);
  let [rdebit, rsetdebit] = useState(0);
  let [rcredit, rsetcredit] = useState(0);
  let [loading, setloading] = useState(true);

  let filter = GraphData.map((item) => item.TotalSales);

  const fetchingapi = async () => {
    const json = await fetch(graph);
    const result = await json.json();
    if (result) {
      setloading(false);
      SetGraphData(result.recordset);
      setdata(GraphData);
    }
  };

  const Dashboardpay = async () => {
    const json = await fetch(Dpay);
    const result = await json.json();
    if (result) {
      setloading(false);
    }
    result.recordset.forEach((element) => {
      debit += element.Debit;
      credit += element.Credit;
      setdebit(debit + element.Debit);
      setcredit(credit + element.Credit);
    });
  };
  const Dashboardreceive = async () => {
    const json = await fetch(Dreceive);
    const result = await json.json();
    if (result) {
      setloading(false);
    }
    result.recordset.forEach((element) => {
      debit += element.Debit;
      credit += element.Credit;
      rsetdebit(rdebit + element.Debit);
      rsetcredit(rcredit + element.Credit);
    });
  };

  const Dashboardstock = async () => {
    const json = await fetch(Dstock);
    const result = await json.json();
    if (result) {
      setloading(false);
    }
    setstock(result.recordset[0].TOTAL);
  };

  const Dashboardsales = async () => {
    const json = await fetch(Dsales);
    const result = await json.json();
    if (result) {
      setloading(false);
    }
    setsales(result.recordset[0].TOTAL);
  };

  useLayoutEffect(() => {
    fetchingapi();
    Dashboardpay();
    Dashboardreceive();
    Dashboardsales();
    Dashboardstock();
  }, []);

  return (
    <>
      <div
        className={["container-fluid box1", dashboard_container].join(" ")}
        style={{
          backgroundColor: "#deedea",
          width: "82.9%",
          display: "inline-block",
          position: "absolute",
          top: "0px",
          left: "230px",
        }}
      >
        <div
          className="row"
          style={{
            backgroundColor: "#42bcf5",
            height: "400px",
            borderRadius: "3px",
          }}
        ></div>
        <div className="header-body pt-4" style={{ marginTop: "-400px" }}>
          <h1 className="t-sm-center text-white">Dash Board</h1>
          <div className="row mt-5 " style={{ marginBottom: "100px" }}>
            <div className="col-lg-6 col-xl-3">
              <div className="card-stats mb-4 mb-xl-0 card">
                <div className="card-body">
                  <div className="row">
                    <div className="col">
                      <h5 className="text-uppercase text-muted mb-0 card-title">
                        Pay
                      </h5>
                    </div>
                    <div className="col-auto col">
                      <div
                        className="icon icon-shape bg-danger mt-n2 text-white rounded-circle shadow"
                        style={{
                          backgroundColor: "yellow",
                          fontWeight: "bolder",
                          padding: "5px",
                        }}
                      >
                        <CurrencyRubleIcon style={{ fontSize: "2rem" }} />
                      </div>
                    </div>
                    {
                      <span className="h4 font-weight-bold mb-0">
                        {loading ? (
                          <CircularProgress />
                        ) : (
                          <>
                            {Intl.NumberFormat("en", {
                              notation: "compact",
                            }).format(Math.round(debit.toFixed(4) - credit)) ||
                              23232323}
                          </>
                        )}
                      </span>
                    }
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-6 col-xl-3">
              <div className="card-stats mb-4 mb-xl-0 card">
                <div className="card-body">
                  <div className="row">
                    <div className="col">
                      <h5 className="text-uppercase text-muted mb-0 card-title">
                        Stock value
                      </h5>
                    </div>
                    <div className="col-auto col">
                      <div
                        className="icon icon-shape mt-n2 bg-warning text-white rounded-circle shadow"
                        style={{
                          backgroundColor: "yellow",
                          fontWeight: "bolder",
                          padding: "5px",
                        }}
                      >
                        <Icon
                          icon="healthicons:stock-out"
                          style={{ fontSize: "2rem" }}
                        />
                      </div>
                    </div>

                    <span className="h4 font-weight-bold mb-0">
                      {loading ? (
                        <CircularProgress />
                      ) : (
                        <>
                          {Intl.NumberFormat("en", {
                            notation: "compact",
                          }).format(Math.round(stock)) || 3473467}
                        </>
                      )}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-6 col-xl-3">
              <div className="card-stats mb-4 mb-xl-0 card">
                <div className="card-body">
                  <div className="row">
                    <div className="col">
                      <h5 className="text-uppercase text-muted mb-0 card-title">
                        Sales
                      </h5>
                    </div>
                    <div className="col-auto col">
                      <div
                        className="icon icon-shape mt-n2 bg-yellow text-white rounded-circle shadow"
                        style={{
                          backgroundColor: "yellow",
                          fontWeight: "bolder",
                          padding: "5px",
                        }}
                      >
                        <SignalCellularAltIcon style={{ fontSize: "2rem" }} />
                      </div>
                    </div>
                    <span className="h4 font-weight-bold mb-0">
                      {loading ? (
                        <CircularProgress />
                      ) : (
                        <>
                          {" "}
                          {Intl.NumberFormat("en", {
                            notation: "compact",
                          }).format(Math.round(sales)) || 4273467}
                        </>
                      )}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-6 col-xl-3">
              <div className="card-stats mb-4 mb-xl-0 card">
                <div className="card-body">
                  <div className="row">
                    <div className="col">
                      <h5 className="text-uppercase text-muted mb-0 card-title">
                        Receive
                      </h5>
                    </div>
                    <div className="col-auto col">
                      <i class="fa-solid fa-percent"></i>
                      <div
                        className="icon icon-shape bg-info mt-n2 text-white rounded-circle shadow"
                        style={{
                          backgroundColor: "yellow",
                          fontWeight: "bolder",
                          padding: "5px",
                        }}
                      >
                        <CallReceivedIcon
                          className=""
                          style={{ fontSize: "2rem" }}
                        />
                      </div>
                    </div>
                    <span className="h4 font-weight-bold mb-0">
                      {loading ? (
                        <CircularProgress />
                      ) : (
                        <>
                          {Intl.NumberFormat("en", {
                            notation: "compact",
                          }).format(Math.round(rdebit - rcredit)) || 3847938}
                        </>
                      )}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {<Linechart loading={loading} user={filter} />}
      </div>
    </>
  );
};

export default Dashboard;
