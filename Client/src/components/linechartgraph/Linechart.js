import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import Chart from "chart.js/auto";
import { graph } from "../../endpoints/constant";
import { Spinner } from "react-bootstrap";
const Linechart = (props) => {
    const [date, setdate] = useState(props.user);
    const labels = [
      "Sat",
      "Sun",
      "Mon",
      "Tues",
      "Wed",
      "Thurs",
      "Fri",
      "Sat",
      "Sun",
      "Mon",
      "Tues",
      "Wed",
      "Thurs",
      "Fri",
      "Sat",
      "Sun",
      "Mon",
      "Tues",
      "Wed",
      "Thurs",
      "Fri",
      "Sat",
      "Sun",
      "Mon",
      "Tues",
      "Wed",
      "Thurs",
      "Fri",
      "Sat",
      "Sun",
    ];
  
    const data = {
      labels: labels,
      datasets: [
        {
          label: "30 Days Sales Record",
          backgroundColor: "rgb(255, 99, 132)",
          borderColor: "rgb(255, 99, 132)",
          // data:[577831, 74430, 341300, 144668, 113044, 1644485, 569775, 810964, 31370, 418920, 72080],
          data: props.user,
        },
      ],
    };
  return (
    <>
        <div
      style={{
        backgroundColor: "white",
        color: "red",
        marginBottom: "50px",
        borderRadius: "3px",
        borderBottom: "3px solid #42bcf5",
        paddingBottom: "20px",
      }}
    >
      <Line data={data} />
    </div>
    </>
  )
}

export default Linechart