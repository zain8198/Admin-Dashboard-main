import React from 'react'
import style from "./style.module.css"
const DashboardCard = ({icon}) => {
    const {container}=style
  return (
    <>
     <div className={container}>
     <div className='mb-3'>
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
                        {icon}
                      {/* <CurrencyRubleIcon style={{ fontSize: "2rem" }} /> */}
                    </div>
                  </div>
                  <span className="h4 font-weight-bold mb-0">
                    
                  </span>
                </div>
              </div>
            </div>
          </div>
          </div>
   
     </div>
         </>
  )
}

export default DashboardCard



