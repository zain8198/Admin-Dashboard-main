const sql = require("mssql/msnodesqlv8");
const express = require("express");
const app = express();
require("dotenv").config();
const cors = require("cors");
const bodyParser = require("body-parser");
app.use(bodyParser.json());

app.use(
  cors({
    origin: "*",
  })
);
app.use(bodyParser.json());
var conn = new sql.ConnectionPool({
  server: `${process.env.SERVER}`,
  database: `${process.env.DATABASE}`,
  driver: "msnodesqlv8",
  pool: {
    idleTimeoutMillis: 100000,
  },

  options: {
    trustServerCertificate: true,
    trustedConnection: true,
  },
});

app.get("/combo", (req, res) => {
  conn.connect().then((result) => {
    if (result.connecting) {
      console.log("connecting");
    }
    if (result.connected) {
      result
        .request()
        .query(
          `select Item_Name As Category from TBL_Category_Item_File where Item_BarCode is Null`,
          (err, result) => {
            if (err) {
              res.send(err);
            }
            res.send(result);
          }
        );
    }
  });
});
app.post("/signup", async (req, res) => {
  const { server, database, username, password } = req.body;
  const request = connection.request();
  request.input("fname", sql.VarChar(49), server);
  request.input("lname", sql.VarChar(49), database);
  request.input("email", sql.VarChar(49), username);
  request.input("password", sql.VarChar(49), password);
  const q = `insert into [${process.env.DATABASE}].[dbo].[TBL_Users](Username,UserPass) values (@email,@password)`;
  const result = await request.query(q);
});

app.get("/give", (req, res) => {
  conn.connect().then((result) => {
    if (result.connected) {
      result
        .request()
        .query(
          `SELECT TOP 1000 [User_ID] ,[Username],[UserPass],[lastname],[firstname] ,[contact],[UserGroupID],[LinkAgent],[InActive],[CashOutLimit],[DiscountAllow],[DiscountPercentLimit],[DiscountNoOfInvLimit],[DiscountAmountLimit],[AllowAllLocation],[IsReturnExchangeAllow],[IsGiftSaleAllow],[AllowVoidSales],[AllowInActiveDraftSale],[AllowRePrintOldReceipt],[AllowOnlyForwardCounter],[AccessCode],[IsAllowReportingApp] ,[AllowItemDisc]FROM [${process.env.DATABASE}].[dbo].[TBL_Users]`,
          (err, result) => {
            if (err) {
              res.send(err);
            }
            res.send(result);
          }
        );
    }
  });
});
app.get("/api", (req, res) => {
  conn.connect().then((result) => {
    if (result.connected) {
      result
        .request()
        .query(
          `SELECT PARENT AS Category,Item_Name,PrUOM,[Pur Price] as PurchasePrice,[Sale Price] as SalePrice,[Available Stock] as Qty FROM VWStockMonitoring`,
          (err, result) => {
            if (err) {
              res.send(err);
            }
            res.send(result);
          }
        );
    }
  });
});

let FromDate = "2023-01-02";
let ToDate = "2023-04-14";

app.post("/fromdate", async (req, res) => {
  FromDate = req.body.String;
  console.log(FromDate);
});
app.post("/todate", async (req, res) => {
  ToDate = req.body.String;
});

app.get("/summary", (req, res) => {
  conn.connect().then((result) => {
    if (result.connected) {
      result.request().query(
        `SELECT TOP (100) PERCENT Item.Item_Name, SUM(dbo.TBL_Sales_Sold_Detail.Item_Qty * dbo.TBL_Sales_Sold_Detail.ConvFactor) AS Item_Qty, SUM(dbo.TBL_Sales_Sold_Detail.OrignalSPrice) AS [Sale Price],SUM(dbo.TBL_Sales_Sold_Detail.TaxAmtPerPcs * dbo.TBL_Sales_Sold_Detail.Item_Qty) AS Tax, SUM(dbo.TBL_Sales_Sold_Detail.Discount * dbo.TBL_Sales_Sold_Detail.Item_Qty) AS Discount, SUM(dbo.TBL_Sales_Sold_Detail.Amount) AS Amount, Category.Item_Name AS Category,(SELECT SUM(OtherCharges) AS OtherCharges FROM dbo.TBL_Sales_Sold WHERE (Sales_Date BETWEEN '${FromDate}' AND '${ToDate}') AND (Sales_ID NOT IN (SELECT Sales_ID FROM dbo.TBL_Sales_Void))) AS TotalOtherCharges,(SELECT SUM(BillDiscount) AS OtherCharges FROM dbo.TBL_Sales_Sold AS TBL_Sales_Sold_2 WHERE (Sales_Date BETWEEN '${FromDate}' AND '${ToDate}') AND (Sales_ID NOT IN(SELECT Sales_ID FROM dbo.TBL_Sales_Void AS TBL_Sales_Void_2))) AS TotalBillDiscoun FROM dbo.Tbl_UtilityDetail AS Location INNER JOIN dbo.TBL_Sales_Sold AS TBL_Sales_Sold_1 INNER JOIN dbo.TBL_Sales_Sold_Detail ON TBL_Sales_Sold_1.Sales_ID = dbo.TBL_Sales_Sold_Detail.Sales_ID INNER JOIN dbo.TBL_Category_Item_File AS Item ON dbo.TBL_Sales_Sold_Detail.Item_ID = Item.Item_ID ON Location.UtilityDetID = TBL_Sales_Sold_1.BUID INNER JOIN dbo.TBL_Users ON TBL_Sales_Sold_1.User_ID = dbo.TBL_Users.User_ID INNER JOIN dbo.TBL_Category_Item_File AS Category ON Item.Parent_ID = Category.Item_ID LEFT OUTER JOIN dbo.TBL_Global_Setup ON TBL_Sales_Sold_1.SegmentID = dbo.TBL_Global_Setup.GlobalSetupID WHERE (TBL_Sales_Sold_1.Sales_ID NOT IN (SELECT Sales_ID FROM dbo.TBL_Sales_Void AS TBL_Sales_Void_1)) GROUP BY Item.Item_Name, TBL_Sales_Sold_1.Sales_Date, Category.Item_Name HAVING (TBL_Sales_Sold_1.Sales_Date BETWEEN '${FromDate}' AND '${ToDate}')
          `,
        (err, result) => {
          if (err) {
            res.send(err);
          }
          res.send(result);
        }
      );
    }
  });
});
app.get("/saledetail", (req, res) => {
  conn.connect().then((result) => {
    if (result.connected) {
      result.request().query(
        `SELECT dbo.Tbl_UtilityDetail.UtilityDetValue AS Location, dbo.TBL_Sales_Sold.Sales_ID, dbo.TBL_Sales_Sold.Sales_Date, TBL_Category_Item_File_1.Item_Name AS Category, dbo.TBL_Category_Item_File.Item_Name,  dbo.TBL_Sales_Sold_Detail.Item_Qty, dbo.TBL_Sales_Sold_Detail.OrignalSPrice, dbo.TBL_Sales_Sold_Detail.TaxAmtPerPcs, dbo.TBL_Sales_Sold_Detail.Discount, dbo.TBL_Sales_Sold_Detail.NetSPrice,  dbo.TBL_Sales_Sold_Detail.Amount, dbo.Tbl_SystemUtilityDetail.SystemUtilityDetValue AS [Pay Type] FROM dbo.TBL_Category_Item_File INNER JOIN dbo.TBL_Sales_Sold_Detail ON dbo.TBL_Category_Item_File.Item_ID = dbo.TBL_Sales_Sold_Detail.Item_ID INNER JOIN dbo.TBL_Sales_Sold ON dbo.TBL_Sales_Sold_Detail.Sales_ID = dbo.TBL_Sales_Sold.Sales_ID INNER JOIN dbo.Tbl_SystemUtilityDetail ON dbo.TBL_Sales_Sold.PaymentTypeID = dbo.Tbl_SystemUtilityDetail.SystemUtilityDetID INNER JOIN dbo.TBL_Category_Item_File AS TBL_Category_Item_File_1 ON dbo.TBL_Category_Item_File.Parent_ID = TBL_Category_Item_File_1.Item_ID INNER JOIN dbo.Tbl_UtilityDetail ON dbo.TBL_Sales_Sold.BUID = dbo.Tbl_UtilityDetail.UtilityDetID LEFT OUTER JOIN dbo.TBL_Party ON dbo.TBL_Sales_Sold.CustomerID = dbo.TBL_Party.PartyID
            `,
        (err, result) => {
          if (err) {
            res.send(err);
          }
          res.send(result);
        }
      );
    }
  });
});

app.use(express.json());
app.get("/purchaseregister", (req, res) => {
  conn.connect().then((result) => {
    if (result.connecting) {
      console.log("connecting");
    }
    if (result.connected) {
      result.request().query(
        `SELECT dbo.TBL_Party.PartyName AS Supplier, dbo.TBL_Purchase_Order.Purchase_ID, dbo.TBL_Purchase_Order.Purchased_Date, dbo.TBL_Category_Item_File.Item_Name, dbo.TBL_Purchase_Detail.Item_QTY, 
        dbo.TBL_Purchase_Detail.Item_Price, dbo.TBL_Purchase_Detail.PriceIncTax, CAtegory.Item_Name AS Category, dbo.TBL_Category_Item_File.Item_Org_Price AS SalePrice, dbo.TBL_Unit_Measure.Description AS UOM 
FROM dbo.TBL_Purchase_Order INNER JOIN
        dbo.TBL_Purchase_Detail ON dbo.TBL_Purchase_Order.Purchase_ID = dbo.TBL_Purchase_Detail.Purchase_ID INNER JOIN
        dbo.TBL_Category_Item_File ON dbo.TBL_Purchase_Detail.Item_ID = dbo.TBL_Category_Item_File.Item_ID LEFT OUTER JOIN
        dbo.TBL_Unit_Measure ON dbo.TBL_Purchase_Detail.TrUomID = dbo.TBL_Unit_Measure.ID LEFT OUTER JOIN
        dbo.TBL_Category_Item_File AS CAtegory ON dbo.TBL_Category_Item_File.Parent_ID = CAtegory.Item_ID LEFT OUTER JOIN
        dbo.TBL_Party ON dbo.TBL_Purchase_Order.Supp_ID = dbo.TBL_Party.PartyID
            `,
        (err, result) => {
          if (err) {
            res.send(err);
          }
          res.send(result);
        }
      );
    }
  });
});

///////////////////////contact////////////////
app.get("/contact", (req, res) => {
  conn.connect().then((result) => {
    if (result.connected) {
      result
        .request()
        .query(
          `SELECT dbo.TBL_Users.User_ID, dbo.TBL_Users.Username, dbo.TBL_Users.UserPass, dbo.TBL_Users.firstname + ' ' + dbo.TBL_Users.lastname AS [User Name], dbo.TBL_Users.contact,dbo.TBL_User_Group.UserGroupName AS [User Group] FROM dbo.TBL_Users INNER JOIN dbo.TBL_User_Group ON dbo.TBL_Users.UserGroupID = dbo.TBL_User_Group.UserGroupID`,
          (err, result) => {
            if (err) {
              res.send(err);
            }
            res.send(result);
          }
        );
    }
  });
});

app.get("/partytype", (req, res) => {
  conn.connect().then((result) => {
    if (result.connected) {
      result
        .request()
        .query(
          `SELECT PartyTypeId, PartyType FROM TBL_Party_Type`,
          (err, result) => {
            if (err) {
              res.send(err);
            }
            res.send(result);
          }
        );
    }
  });
});

app.get("/party", (req, res) => {
  conn.connect().then((result) => {
    if (result.connected) {
      result
        .request()
        .query(
          `select PartyTypeID,PartyID,PartyName from TBL_Party`,
          (err, result) => {
            if (err) {
              res.send(err);
            }
            res.send(result);
          }
        );
    }
  });
});
let openingdate;
app.post("/openingdate", async (req, res) => {
  openingdate = req.body.String;
});

app.get("/bankdetail", (req, res) => {
  conn.connect().then((result) => {
    if (result.connected) {
      result.request().query(
        `select   partyid, TrId, TrDate, PartyName, CASE WHEN Amount < 0 THEN amount*-1 else 0 END AS Debit, CASE WHEN Amount > 0 THEN amount else  0 END AS Credit, Remarks, PartyTypeID,BUID from (  SELECT dbo.TBL_PettyCash.againstpartyid as partyid,dbo.TBL_PettyCash.TrId, dbo.TBL_PettyCash.TrDate, dbo.TBL_Party.PartyName, dbo.TBL_PettyCash.Amount * dbo.TBL_PettyCash.PaymentType AS Amount, dbo.TBL_PettyCash.Narration AS Remarks,dbo.TBL_Party.PartyTypeID,dbo.TBL_PettyCash.BUID FROM dbo.TBL_Party RIGHT OUTER JOIN dbo.TBL_PettyCash ON dbo.TBL_Party.PartyID = dbo.TBL_PettyCash.AgainstPartyID Union All SELECT     dbo.TBL_Purchase_Order.Supp_ID AS partyid, dbo.TBL_Purchase_Order.Purchase_ID, dbo.TBL_Purchase_Order.Received_Date, TBL_Party_2.PartyName,       SUM(dbo.TBL_Purchase_Detail.Item_QTY * dbo.TBL_Purchase_Detail.Item_Price) AS Amount, CASE WHEN SUM(dbo.TBL_Purchase_Detail.Item_QTY) < 0 THEN 'Purchase Return' ELSE 'Purchase: ' + MAX(dbo.TBL_Purchase_Order.Delivery_Term) END AS Remarks, TBL_Party_2.PartyTypeID, dbo.TBL_Purchase_Order.BUID  FROM         dbo.TBL_Purchase_Order INNER JOIN      dbo.TBL_Party AS TBL_Party_2 ON dbo.TBL_Purchase_Order.Supp_ID = TBL_Party_2.PartyID INNER JOIN   dbo.TBL_Purchase_Detail ON dbo.TBL_Purchase_Order.Purchase_ID = dbo.TBL_Purchase_Detail.Purchase_ID  WHERE (dbo.TBL_Purchase_Order.Form_ID = 5 or dbo.TBL_Purchase_Order.Form_ID = 6) AND (TBL_Party_2.InActive <> 1) GROUP BY dbo.TBL_Purchase_Order.Supp_ID, dbo.TBL_Purchase_Order.Purchase_ID, dbo.TBL_Purchase_Order.Received_Date, TBL_Party_2.PartyName, TBL_Party_2.PartyTypeID, dbo.TBL_Purchase_Order.BUID union All SELECT     dbo.Tbl_Salary.EmpID AS PartyID, dbo.Tbl_Salary.TrId AS TrID, dbo.Tbl_Salary.TrDate, dbo.TBL_Party.PartyName, dbo.Tbl_Salary.NetSalary AS Amount, 'Salary Generated' AS Remarks,   dbo.TBL_Party.PartyTypeID, dbo.Tbl_Salary.BuID FROM         dbo.Tbl_Salary INNER JOIN  dbo.TBL_Party ON dbo.Tbl_Salary.EmpID = dbo.TBL_Party.PartyID WHERE     (dbo.Tbl_Salary.IsPost = 1) union All SELECT     dbo.TBL_Party.PartyID, dbo.TBL_Sales_Sold.Sales_ID AS TrID, dbo.TBL_Sales_Sold.Sales_Date AS TrDate, dbo.TBL_Party.PartyName, dbo.TBL_Sales_Sold.NetAmount * - 1 AS Amount,  'Delivered Order#' + CAST(dbo.TBL_Sales_Sold.Order_No AS varchar(50)) AS Remarks, dbo.TBL_Party.PartyTypeID, dbo.TBL_Sales_Sold.BUID FROM         dbo.Tbl_Sales_SoldPayment INNER JOIN   dbo.TBL_Sales_Sold ON dbo.Tbl_Sales_SoldPayment.SalesID = dbo.TBL_Sales_Sold.Sales_ID LEFT OUTER JOIN       dbo.TBL_Party ON dbo.TBL_Sales_Sold.CustomerID = dbo.TBL_Party.PartyID WHERE     (dbo.TBL_Sales_Sold.Sales_ID NOT IN     (SELECT     Sales_ID        FROM          dbo.TBL_Sales_Void)) AND (dbo.TBL_Sales_Sold.Order_No > 0) union All SELECT     dbo.TBL_Party.PartyID, dbo.TBL_Sales_Sold.Sales_ID AS TrID, dbo.TBL_Sales_Sold.Sales_Date AS TrDate, dbo.TBL_Party.PartyName, dbo.TBL_Sales_Sold.ReceivedAmount - dbo.TBL_Sales_Sold.ReturnAmount AS Amount, 'Payment Against Order#' + CAST(dbo.TBL_Sales_Sold.Order_No AS varchar(50)) AS Remarks, dbo.TBL_Party.PartyTypeID, dbo.TBL_Sales_Sold.BUID FROM         dbo.Tbl_Sales_SoldPayment INNER JOIN   dbo.TBL_Sales_Sold ON dbo.Tbl_Sales_SoldPayment.SalesID = dbo.TBL_Sales_Sold.Sales_ID LEFT OUTER JOIN       dbo.TBL_Party ON dbo.TBL_Sales_Sold.CustomerID = dbo.TBL_Party.PartyID WHERE     (dbo.TBL_Sales_Sold.Sales_ID NOT IN     (SELECT     Sales_ID        FROM          dbo.TBL_Sales_Void)) AND (dbo.TBL_Sales_Sold.Order_No > 0) AND (dbo.Tbl_Sales_SoldPayment.PaymentTypeID <> 28 AND dbo.Tbl_Sales_SoldPayment.PaymentTypeID <> 30) 
union All 
SELECT dbo.TBL_Party.PartyID, dbo.TBL_Sales_Sold.Sales_ID AS TrID, dbo.TBL_Sales_Sold.Sales_Date AS TrDate, dbo.TBL_Party.PartyName,dbo.Tbl_Sales_SoldPayment.Value * - 1 as Amount,   CASE WHEN dbo.TBL_Sales_Sold.Remarks <> '' THEN dbo.TBL_Sales_Sold.Remarks ELSE  CASE WHEN dbo.Tbl_Sales_SoldPayment.Value > 0 THEN 'Credit Sales' ELSE 'Sales Return' END End AS Remarks,dbo.TBL_Party.PartyTypeID, dbo.TBL_Sales_Sold.BUID FROM     dbo.Tbl_Sales_SoldPayment INNER JOIN    dbo.TBL_Sales_Sold ON dbo.Tbl_Sales_SoldPayment.SalesID = dbo.TBL_Sales_Sold.Sales_ID LEFT OUTER JOIN  dbo.TBL_Party ON dbo.TBL_Sales_Sold.CustomerID = dbo.TBL_Party.PartyID WHERE     (dbo.TBL_Sales_Sold.Sales_ID NOT IN (SELECT Sales_ID FROM dbo.TBL_Sales_Void)) AND (dbo.Tbl_Sales_SoldPayment.PaymentTypeID = 14 or dbo.Tbl_Sales_SoldPayment.PaymentTypeID = 28)  AND (dbo.TBL_Sales_Sold.Order_No IS NULL OR dbo.TBL_Sales_Sold.Order_No= 0) 
union All 
SELECT dbo.TBL_Party.PartyID, dbo.TBL_Sales_Sold.Sales_ID AS TrID, dbo.TBL_Sales_Sold.Sales_Date AS TrDate, dbo.TBL_Party.PartyName,dbo.Tbl_Sales_SoldPayment.Value * - 1 as Amount,   CASE WHEN dbo.TBL_Sales_Sold.Remarks <> '' THEN dbo.TBL_Sales_Sold.Remarks ELSE  CASE WHEN dbo.Tbl_Sales_SoldPayment.Value > 0 THEN 'Cash Sales' ELSE 'Cash Sales Return' END End AS Remarks,dbo.TBL_Party.PartyTypeID, dbo.TBL_Sales_Sold.BUID FROM     dbo.Tbl_Sales_SoldPayment INNER JOIN    dbo.TBL_Sales_Sold ON dbo.Tbl_Sales_SoldPayment.SalesID = dbo.TBL_Sales_Sold.Sales_ID LEFT OUTER JOIN  dbo.TBL_Party ON dbo.TBL_Sales_Sold.CustomerID = dbo.TBL_Party.PartyID WHERE     (dbo.TBL_Sales_Sold.Sales_ID NOT IN (SELECT Sales_ID FROM dbo.TBL_Sales_Void)) AND (dbo.Tbl_Sales_SoldPayment.PaymentTypeID = 25 or dbo.Tbl_Sales_SoldPayment.PaymentTypeID = 31 Or dbo.Tbl_Sales_SoldPayment.PaymentTypeID = 13) AND (dbo.TBL_Sales_Sold.Order_No IS NULL OR dbo.TBL_Sales_Sold.Order_No= 0) union All SELECT dbo.TBL_Party.PartyID, dbo.TBL_Sales_Sold.Sales_ID AS TrID, dbo.TBL_Sales_Sold.Sales_Date AS TrDate, dbo.TBL_Party.PartyName,dbo.Tbl_Sales_SoldPayment.Value as Amount,   CASE WHEN dbo.TBL_Sales_Sold.Remarks <> '' THEN dbo.TBL_Sales_Sold.Remarks ELSE  CASE WHEN dbo.Tbl_Sales_SoldPayment.Value > 0 THEN 'Cash Rec against Inv No ' + Cast(dbo.TBL_Sales_Sold.Sales_ID As varchar) ELSE 'Cash Return against Inv No ' + Cast(dbo.TBL_Sales_Sold.Sales_ID As varchar) END End AS Remarks,dbo.TBL_Party.PartyTypeID, dbo.TBL_Sales_Sold.BUID FROM     dbo.Tbl_Sales_SoldPayment INNER JOIN    dbo.TBL_Sales_Sold ON dbo.Tbl_Sales_SoldPayment.SalesID = dbo.TBL_Sales_Sold.Sales_ID LEFT OUTER JOIN  dbo.TBL_Party ON dbo.TBL_Sales_Sold.CustomerID = dbo.TBL_Party.PartyID WHERE     (dbo.TBL_Sales_Sold.Sales_ID NOT IN (SELECT Sales_ID FROM dbo.TBL_Sales_Void)) AND (dbo.Tbl_Sales_SoldPayment.PaymentTypeID = 25 or dbo.Tbl_Sales_SoldPayment.PaymentTypeID = 31 Or dbo.Tbl_Sales_SoldPayment.PaymentTypeID = 13) AND (dbo.TBL_Sales_Sold.Order_No IS NULL OR dbo.TBL_Sales_Sold.Order_No= 0)  And dbo.TBL_Sales_Sold.Sales_ID  Not IN (SELECT SalesID FROM Tbl_Installment ) ) DrvTbl where (BUID =1) 
Union All 
SELECT     partyid, 0 AS TrId, '1900-01-01' AS TrDate, PartyName, CASE WHEN SUM(Amount) < 0 THEN SUM(amount)*-1 ELSE 0 END AS Debit, CASE WHEN SUM(Amount) > 0 THEN SUM(amount)    ELSE 0 END AS Credit, 'Opening Balance' AS Remarks, PartyTypeID,BUID from (  SELECT dbo.TBL_PettyCash.againstpartyid as partyid,dbo.TBL_PettyCash.TrId, dbo.TBL_PettyCash.TrDate, dbo.TBL_Party.PartyName, dbo.TBL_PettyCash.Amount * dbo.TBL_PettyCash.PaymentType AS Amount, dbo.TBL_PettyCash.Narration AS Remarks,dbo.TBL_Party.PartyTypeID,dbo.TBL_PettyCash.BUID FROM dbo.TBL_Party RIGHT OUTER JOIN dbo.TBL_PettyCash ON dbo.TBL_Party.PartyID = dbo.TBL_PettyCash.AgainstPartyID 
Union All 
SELECT     dbo.TBL_Purchase_Order.Supp_ID AS partyid, dbo.TBL_Purchase_Order.Purchase_ID, dbo.TBL_Purchase_Order.Received_Date, TBL_Party_2.PartyName,       SUM(dbo.TBL_Purchase_Detail.Item_QTY * dbo.TBL_Purchase_Detail.Item_Price) AS Amount, CASE WHEN SUM(dbo.TBL_Purchase_Detail.Item_QTY) < 0 THEN 'Purchase Return' ELSE 'Purchase: ' + MAX(dbo.TBL_Purchase_Order.Delivery_Term) END AS Remarks, TBL_Party_2.PartyTypeID, dbo.TBL_Purchase_Order.BUID  FROM         dbo.TBL_Purchase_Order INNER JOIN      dbo.TBL_Party AS TBL_Party_2 ON dbo.TBL_Purchase_Order.Supp_ID = TBL_Party_2.PartyID INNER JOIN   dbo.TBL_Purchase_Detail ON dbo.TBL_Purchase_Order.Purchase_ID = dbo.TBL_Purchase_Detail.Purchase_ID  WHERE (dbo.TBL_Purchase_Order.Form_ID = 5 or dbo.TBL_Purchase_Order.Form_ID = 6) AND (TBL_Party_2.InActive <> 1) 
GROUP BY dbo.TBL_Purchase_Order.Supp_ID, dbo.TBL_Purchase_Order.Purchase_ID, dbo.TBL_Purchase_Order.Received_Date, TBL_Party_2.PartyName, TBL_Party_2.PartyTypeID, dbo.TBL_Purchase_Order.BUID 
union All 
SELECT     dbo.Tbl_Salary.EmpID AS PartyID, dbo.Tbl_Salary.TrId AS TrID, dbo.Tbl_Salary.TrDate, dbo.TBL_Party.PartyName, dbo.Tbl_Salary.NetSalary AS Amount, 'Salary Generated' AS Remarks,   dbo.TBL_Party.PartyTypeID, dbo.Tbl_Salary.BuID FROM         dbo.Tbl_Salary INNER JOIN  dbo.TBL_Party ON dbo.Tbl_Salary.EmpID = dbo.TBL_Party.PartyID WHERE     (dbo.Tbl_Salary.IsPost = 1) union All SELECT     dbo.TBL_Party.PartyID, dbo.TBL_Sales_Sold.Sales_ID AS TrID, dbo.TBL_Sales_Sold.Sales_Date AS TrDate, dbo.TBL_Party.PartyName, dbo.TBL_Sales_Sold.NetAmount * - 1 AS Amount,  'Delivered Order#' + CAST(dbo.TBL_Sales_Sold.Order_No AS varchar(50)) AS Remarks, dbo.TBL_Party.PartyTypeID, dbo.TBL_Sales_Sold.BUID FROM         dbo.Tbl_Sales_SoldPayment INNER JOIN   dbo.TBL_Sales_Sold ON dbo.Tbl_Sales_SoldPayment.SalesID = dbo.TBL_Sales_Sold.Sales_ID LEFT OUTER JOIN       dbo.TBL_Party ON dbo.TBL_Sales_Sold.CustomerID = dbo.TBL_Party.PartyID WHERE     (dbo.TBL_Sales_Sold.Sales_ID NOT IN     (SELECT     Sales_ID        FROM          dbo.TBL_Sales_Void)) AND (dbo.TBL_Sales_Sold.Order_No > 0) union All SELECT     dbo.TBL_Party.PartyID, dbo.TBL_Sales_Sold.Sales_ID AS TrID, dbo.TBL_Sales_Sold.Sales_Date AS TrDate, dbo.TBL_Party.PartyName, dbo.TBL_Sales_Sold.ReceivedAmount - dbo.TBL_Sales_Sold.ReturnAmount AS Amount, 'Payment Against Order#' + CAST(dbo.TBL_Sales_Sold.Order_No AS varchar(50)) AS Remarks, dbo.TBL_Party.PartyTypeID, dbo.TBL_Sales_Sold.BUID FROM         dbo.Tbl_Sales_SoldPayment INNER JOIN   dbo.TBL_Sales_Sold ON dbo.Tbl_Sales_SoldPayment.SalesID = dbo.TBL_Sales_Sold.Sales_ID LEFT OUTER JOIN       dbo.TBL_Party ON dbo.TBL_Sales_Sold.CustomerID = dbo.TBL_Party.PartyID WHERE     (dbo.TBL_Sales_Sold.Sales_ID NOT IN     (SELECT     Sales_ID        FROM          dbo.TBL_Sales_Void)) AND (dbo.TBL_Sales_Sold.Order_No > 0) AND (dbo.Tbl_Sales_SoldPayment.PaymentTypeID <> 28 AND dbo.Tbl_Sales_SoldPayment.PaymentTypeID <> 30) union All SELECT dbo.TBL_Party.PartyID, dbo.TBL_Sales_Sold.Sales_ID AS TrID, dbo.TBL_Sales_Sold.Sales_Date AS TrDate, dbo.TBL_Party.PartyName,dbo.Tbl_Sales_SoldPayment.Value * - 1 as Amount,   CASE WHEN dbo.TBL_Sales_Sold.Remarks <> '' THEN dbo.TBL_Sales_Sold.Remarks ELSE  CASE WHEN dbo.Tbl_Sales_SoldPayment.Value > 0 THEN 'Credit Sales' ELSE 'Sales Return' END End AS Remarks,dbo.TBL_Party.PartyTypeID, dbo.TBL_Sales_Sold.BUID FROM     dbo.Tbl_Sales_SoldPayment INNER JOIN    dbo.TBL_Sales_Sold ON dbo.Tbl_Sales_SoldPayment.SalesID = dbo.TBL_Sales_Sold.Sales_ID LEFT OUTER JOIN  dbo.TBL_Party ON dbo.TBL_Sales_Sold.CustomerID = dbo.TBL_Party.PartyID WHERE     (dbo.TBL_Sales_Sold.Sales_ID NOT IN (SELECT Sales_ID FROM dbo.TBL_Sales_Void)) AND (dbo.Tbl_Sales_SoldPayment.PaymentTypeID = 14 or dbo.Tbl_Sales_SoldPayment.PaymentTypeID = 28)  AND (dbo.TBL_Sales_Sold.Order_No IS NULL OR dbo.TBL_Sales_Sold.Order_No= 0) union All SELECT dbo.TBL_Party.PartyID, dbo.TBL_Sales_Sold.Sales_ID AS TrID, dbo.TBL_Sales_Sold.Sales_Date AS TrDate, dbo.TBL_Party.PartyName,dbo.Tbl_Sales_SoldPayment.Value * - 1 as Amount,   CASE WHEN dbo.TBL_Sales_Sold.Remarks <> '' THEN dbo.TBL_Sales_Sold.Remarks ELSE  CASE WHEN dbo.Tbl_Sales_SoldPayment.Value > 0 THEN 'Cash Sales' ELSE 'Cash Sales Return' END End AS Remarks,dbo.TBL_Party.PartyTypeID, dbo.TBL_Sales_Sold.BUID FROM     dbo.Tbl_Sales_SoldPayment INNER JOIN    dbo.TBL_Sales_Sold ON dbo.Tbl_Sales_SoldPayment.SalesID = dbo.TBL_Sales_Sold.Sales_ID LEFT OUTER JOIN  dbo.TBL_Party ON dbo.TBL_Sales_Sold.CustomerID = dbo.TBL_Party.PartyID WHERE     (dbo.TBL_Sales_Sold.Sales_ID NOT IN (SELECT Sales_ID FROM dbo.TBL_Sales_Void)) AND (dbo.Tbl_Sales_SoldPayment.PaymentTypeID = 25 or dbo.Tbl_Sales_SoldPayment.PaymentTypeID = 31 Or dbo.Tbl_Sales_SoldPayment.PaymentTypeID = 13) AND (dbo.TBL_Sales_Sold.Order_No IS NULL OR dbo.TBL_Sales_Sold.Order_No= 0) union All SELECT dbo.TBL_Party.PartyID, dbo.TBL_Sales_Sold.Sales_ID AS TrID, dbo.TBL_Sales_Sold.Sales_Date AS TrDate, dbo.TBL_Party.PartyName,dbo.Tbl_Sales_SoldPayment.Value as Amount,   CASE WHEN dbo.TBL_Sales_Sold.Remarks <> '' THEN dbo.TBL_Sales_Sold.Remarks ELSE  CASE WHEN dbo.Tbl_Sales_SoldPayment.Value > 0 THEN 'Cash Rec against Inv No ' + Cast(dbo.TBL_Sales_Sold.Sales_ID As varchar) ELSE 'Cash Return against Inv No ' + Cast(dbo.TBL_Sales_Sold.Sales_ID As varchar) END End AS Remarks,dbo.TBL_Party.PartyTypeID, dbo.TBL_Sales_Sold.BUID FROM     dbo.Tbl_Sales_SoldPayment INNER JOIN    dbo.TBL_Sales_Sold ON dbo.Tbl_Sales_SoldPayment.SalesID = dbo.TBL_Sales_Sold.Sales_ID LEFT OUTER JOIN  dbo.TBL_Party ON dbo.TBL_Sales_Sold.CustomerID = dbo.TBL_Party.PartyID WHERE     (dbo.TBL_Sales_Sold.Sales_ID NOT IN (SELECT Sales_ID FROM dbo.TBL_Sales_Void)) AND (dbo.Tbl_Sales_SoldPayment.PaymentTypeID = 25 or dbo.Tbl_Sales_SoldPayment.PaymentTypeID = 31 Or dbo.Tbl_Sales_SoldPayment.PaymentTypeID = 13) AND (dbo.TBL_Sales_Sold.Order_No IS NULL OR dbo.TBL_Sales_Sold.Order_No= 0)  And dbo.TBL_Sales_Sold.Sales_ID  Not IN (SELECT SalesID FROM Tbl_Installment ) )DrvTbl2 where (DrvTbl2.trDate <'${openingdate}')  AND (BUID =1) GROUP BY PartyName, partyid, PartyTypeID,BUID ORDER BY TrDate`,
        (err, result) => {
          if (err) {
            res.send(err);
          }
          res.send(result);
        }
      );
    }
  });
});

app.get("/graph", (req, res) => {
  conn.connect().then((result) => {
    if (result.connected) {
      result.request().query(
        `SELECT        TOP (100) PERCENT Sales_Date, SUM(NetAmount) AS TotalSales
          FROM            dbo.TBL_Sales_Sold
          GROUP BY Sales_Date
          HAVING        (Sales_Date BETWEEN DATEADD(d, - 100, GETDATE()) AND GETDATE())
          ORDER BY Sales_Date`,
        (err, result) => {
          if (err) {
            res.send(err);
          }
          res.send(result);
        }
      );
    }
  });
});

app.get("/Dstock", (req, res) => {
  conn.connect().then((result) => {
    if (result.connected) {
      result.request().query(
        `SELECT 
        SUM(A.Item_QTY * B.Item_Org_Price) AS TOTAL
      FROM TBL_Stocks_Balances A
      INNER JOIN TBL_Category_Item_File B ON A.Item_ID = B.Item_ID`,
        (err, result) => {
          if (err) {
            res.send(err);
          }
          res.send(result);
        }
      );
    }
  });
});

app.get("/Dsales", (req, res) => {
  conn.connect().then((result) => {
    if (result.connected) {
      result
        .request()
        .query(
          `SELECT SUM(NetAmount) as TOTAL FROM TBL_Sales_Sold`,
          (err, result) => {
            if (err) {
              res.send(err);
              console.log("hata", err);
            }
            res.send(result);
          }
        );
    }
  });
});
app.get("/Dpay", (req, res) => {
  conn.connect().then((result) => {
    if (result.connected) {
      result.request().query(
        `select   partyid, TrId, TrDate, PartyName, CASE WHEN Amount < 0 THEN amount*-1 else 0 END AS Debit, CASE WHEN Amount > 0 THEN amount else  0 END AS Credit, Remarks, PartyTypeID,BUID from (  SELECT dbo.TBL_PettyCash.againstpartyid as partyid,dbo.TBL_PettyCash.TrId, dbo.TBL_PettyCash.TrDate, dbo.TBL_Party.PartyName, dbo.TBL_PettyCash.Amount * dbo.TBL_PettyCash.PaymentType AS Amount, dbo.TBL_PettyCash.Narration AS Remarks,dbo.TBL_Party.PartyTypeID,dbo.TBL_PettyCash.BUID FROM dbo.TBL_Party RIGHT OUTER JOIN dbo.TBL_PettyCash ON dbo.TBL_Party.PartyID = dbo.TBL_PettyCash.AgainstPartyID Union All SELECT     dbo.TBL_Purchase_Order.Supp_ID AS partyid, dbo.TBL_Purchase_Order.Purchase_ID, dbo.TBL_Purchase_Order.Received_Date, TBL_Party_2.PartyName,       SUM(dbo.TBL_Purchase_Detail.Item_QTY * dbo.TBL_Purchase_Detail.Item_Price) AS Amount, CASE WHEN SUM(dbo.TBL_Purchase_Detail.Item_QTY) < 0 THEN 'Purchase Return' ELSE 'Purchase: ' + MAX(dbo.TBL_Purchase_Order.Delivery_Term) END AS Remarks, TBL_Party_2.PartyTypeID, dbo.TBL_Purchase_Order.BUID  FROM         dbo.TBL_Purchase_Order INNER JOIN      dbo.TBL_Party AS TBL_Party_2 ON dbo.TBL_Purchase_Order.Supp_ID = TBL_Party_2.PartyID INNER JOIN   dbo.TBL_Purchase_Detail ON dbo.TBL_Purchase_Order.Purchase_ID = dbo.TBL_Purchase_Detail.Purchase_ID  WHERE (dbo.TBL_Purchase_Order.Form_ID = 5 or dbo.TBL_Purchase_Order.Form_ID = 6) AND (TBL_Party_2.InActive <> 1) GROUP BY dbo.TBL_Purchase_Order.Supp_ID, dbo.TBL_Purchase_Order.Purchase_ID, dbo.TBL_Purchase_Order.Received_Date, TBL_Party_2.PartyName, TBL_Party_2.PartyTypeID, dbo.TBL_Purchase_Order.BUID union All SELECT     dbo.Tbl_Salary.EmpID AS PartyID, dbo.Tbl_Salary.TrId AS TrID, dbo.Tbl_Salary.TrDate, dbo.TBL_Party.PartyName, dbo.Tbl_Salary.NetSalary AS Amount, 'Salary Generated' AS Remarks,   dbo.TBL_Party.PartyTypeID, dbo.Tbl_Salary.BuID FROM         dbo.Tbl_Salary INNER JOIN  dbo.TBL_Party ON dbo.Tbl_Salary.EmpID = dbo.TBL_Party.PartyID WHERE     (dbo.Tbl_Salary.IsPost = 1) union All SELECT     dbo.TBL_Party.PartyID, dbo.TBL_Sales_Sold.Sales_ID AS TrID, dbo.TBL_Sales_Sold.Sales_Date AS TrDate, dbo.TBL_Party.PartyName, dbo.TBL_Sales_Sold.NetAmount * - 1 AS Amount,  'Delivered Order#' + CAST(dbo.TBL_Sales_Sold.Order_No AS varchar(50)) AS Remarks, dbo.TBL_Party.PartyTypeID, dbo.TBL_Sales_Sold.BUID FROM         dbo.Tbl_Sales_SoldPayment INNER JOIN   dbo.TBL_Sales_Sold ON dbo.Tbl_Sales_SoldPayment.SalesID = dbo.TBL_Sales_Sold.Sales_ID LEFT OUTER JOIN       dbo.TBL_Party ON dbo.TBL_Sales_Sold.CustomerID = dbo.TBL_Party.PartyID WHERE     (dbo.TBL_Sales_Sold.Sales_ID NOT IN     (SELECT     Sales_ID        FROM          dbo.TBL_Sales_Void)) AND (dbo.TBL_Sales_Sold.Order_No > 0) union All SELECT     dbo.TBL_Party.PartyID, dbo.TBL_Sales_Sold.Sales_ID AS TrID, dbo.TBL_Sales_Sold.Sales_Date AS TrDate, dbo.TBL_Party.PartyName, dbo.TBL_Sales_Sold.ReceivedAmount - dbo.TBL_Sales_Sold.ReturnAmount AS Amount, 'Payment Against Order#' + CAST(dbo.TBL_Sales_Sold.Order_No AS varchar(50)) AS Remarks, dbo.TBL_Party.PartyTypeID, dbo.TBL_Sales_Sold.BUID FROM         dbo.Tbl_Sales_SoldPayment INNER JOIN   dbo.TBL_Sales_Sold ON dbo.Tbl_Sales_SoldPayment.SalesID = dbo.TBL_Sales_Sold.Sales_ID LEFT OUTER JOIN       dbo.TBL_Party ON dbo.TBL_Sales_Sold.CustomerID = dbo.TBL_Party.PartyID WHERE     (dbo.TBL_Sales_Sold.Sales_ID NOT IN     (SELECT     Sales_ID        FROM          dbo.TBL_Sales_Void)) AND (dbo.TBL_Sales_Sold.Order_No > 0) AND (dbo.Tbl_Sales_SoldPayment.PaymentTypeID <> 28 AND dbo.Tbl_Sales_SoldPayment.PaymentTypeID <> 30) union All SELECT dbo.TBL_Party.PartyID, dbo.TBL_Sales_Sold.Sales_ID AS TrID, dbo.TBL_Sales_Sold.Sales_Date AS TrDate, dbo.TBL_Party.PartyName,dbo.Tbl_Sales_SoldPayment.Value * - 1 as Amount,   CASE WHEN dbo.TBL_Sales_Sold.Remarks <> '' THEN dbo.TBL_Sales_Sold.Remarks ELSE  CASE WHEN dbo.Tbl_Sales_SoldPayment.Value > 0 THEN 'Credit Sales' ELSE 'Sales Return' END End AS Remarks,dbo.TBL_Party.PartyTypeID, dbo.TBL_Sales_Sold.BUID FROM     dbo.Tbl_Sales_SoldPayment INNER JOIN    dbo.TBL_Sales_Sold ON dbo.Tbl_Sales_SoldPayment.SalesID = dbo.TBL_Sales_Sold.Sales_ID LEFT OUTER JOIN  dbo.TBL_Party ON dbo.TBL_Sales_Sold.CustomerID = dbo.TBL_Party.PartyID WHERE     (dbo.TBL_Sales_Sold.Sales_ID NOT IN (SELECT Sales_ID FROM dbo.TBL_Sales_Void)) AND (dbo.Tbl_Sales_SoldPayment.PaymentTypeID = 14 or dbo.Tbl_Sales_SoldPayment.PaymentTypeID = 28)  AND (dbo.TBL_Sales_Sold.Order_No IS NULL OR dbo.TBL_Sales_Sold.Order_No= 0) union All SELECT dbo.TBL_Party.PartyID, dbo.TBL_Sales_Sold.Sales_ID AS TrID, dbo.TBL_Sales_Sold.Sales_Date AS TrDate, dbo.TBL_Party.PartyName,dbo.Tbl_Sales_SoldPayment.Value * - 1 as Amount,   CASE WHEN dbo.TBL_Sales_Sold.Remarks <> '' THEN dbo.TBL_Sales_Sold.Remarks ELSE  CASE WHEN dbo.Tbl_Sales_SoldPayment.Value > 0 THEN 'Cash Sales' ELSE 'Cash Sales Return' END End AS Remarks,dbo.TBL_Party.PartyTypeID, dbo.TBL_Sales_Sold.BUID FROM     dbo.Tbl_Sales_SoldPayment INNER JOIN    dbo.TBL_Sales_Sold ON dbo.Tbl_Sales_SoldPayment.SalesID = dbo.TBL_Sales_Sold.Sales_ID LEFT OUTER JOIN  dbo.TBL_Party ON dbo.TBL_Sales_Sold.CustomerID = dbo.TBL_Party.PartyID WHERE     (dbo.TBL_Sales_Sold.Sales_ID NOT IN (SELECT Sales_ID FROM dbo.TBL_Sales_Void)) AND (dbo.Tbl_Sales_SoldPayment.PaymentTypeID = 25 or dbo.Tbl_Sales_SoldPayment.PaymentTypeID = 31 Or dbo.Tbl_Sales_SoldPayment.PaymentTypeID = 13) AND (dbo.TBL_Sales_Sold.Order_No IS NULL OR dbo.TBL_Sales_Sold.Order_No= 0) union All SELECT dbo.TBL_Party.PartyID, dbo.TBL_Sales_Sold.Sales_ID AS TrID, dbo.TBL_Sales_Sold.Sales_Date AS TrDate, dbo.TBL_Party.PartyName,dbo.Tbl_Sales_SoldPayment.Value as Amount,   CASE WHEN dbo.TBL_Sales_Sold.Remarks <> '' THEN dbo.TBL_Sales_Sold.Remarks ELSE  CASE WHEN dbo.Tbl_Sales_SoldPayment.Value > 0 THEN 'Cash Rec against Inv No ' + Cast(dbo.TBL_Sales_Sold.Sales_ID As varchar) ELSE 'Cash Return against Inv No ' + Cast(dbo.TBL_Sales_Sold.Sales_ID As varchar) END End AS Remarks,dbo.TBL_Party.PartyTypeID, dbo.TBL_Sales_Sold.BUID FROM     dbo.Tbl_Sales_SoldPayment INNER JOIN    dbo.TBL_Sales_Sold ON dbo.Tbl_Sales_SoldPayment.SalesID = dbo.TBL_Sales_Sold.Sales_ID LEFT OUTER JOIN  dbo.TBL_Party ON dbo.TBL_Sales_Sold.CustomerID = dbo.TBL_Party.PartyID WHERE     (dbo.TBL_Sales_Sold.Sales_ID NOT IN (SELECT Sales_ID FROM dbo.TBL_Sales_Void)) AND (dbo.Tbl_Sales_SoldPayment.PaymentTypeID = 25 or dbo.Tbl_Sales_SoldPayment.PaymentTypeID = 31 Or dbo.Tbl_Sales_SoldPayment.PaymentTypeID = 13) AND (dbo.TBL_Sales_Sold.Order_No IS NULL OR dbo.TBL_Sales_Sold.Order_No= 0)  And dbo.TBL_Sales_Sold.Sales_ID  Not IN (SELECT SalesID FROM Tbl_Installment ) ) DrvTbl where (DrvTbl.trDate >='04-10-2023' AND DrvTbl.trDate <='04-10-2023') and DrvTbl.partyTypeID=4 AND (BUID =1) Union All SELECT     partyid, 0 AS TrId, '1900-01-01' AS TrDate, PartyName, CASE WHEN SUM(Amount) < 0 THEN SUM(amount)*-1 ELSE 0 END AS Debit, CASE WHEN SUM(Amount) > 0 THEN SUM(amount)    ELSE 0 END AS Credit, 'Opening Balance' AS Remarks, PartyTypeID,BUID from (  SELECT dbo.TBL_PettyCash.againstpartyid as partyid,dbo.TBL_PettyCash.TrId, dbo.TBL_PettyCash.TrDate, dbo.TBL_Party.PartyName, dbo.TBL_PettyCash.Amount * dbo.TBL_PettyCash.PaymentType AS Amount, dbo.TBL_PettyCash.Narration AS Remarks,dbo.TBL_Party.PartyTypeID,dbo.TBL_PettyCash.BUID FROM dbo.TBL_Party RIGHT OUTER JOIN dbo.TBL_PettyCash ON dbo.TBL_Party.PartyID = dbo.TBL_PettyCash.AgainstPartyID Union All SELECT     dbo.TBL_Purchase_Order.Supp_ID AS partyid, dbo.TBL_Purchase_Order.Purchase_ID, dbo.TBL_Purchase_Order.Received_Date, TBL_Party_2.PartyName,       SUM(dbo.TBL_Purchase_Detail.Item_QTY * dbo.TBL_Purchase_Detail.Item_Price) AS Amount, CASE WHEN SUM(dbo.TBL_Purchase_Detail.Item_QTY) < 0 THEN 'Purchase Return' ELSE 'Purchase: ' + MAX(dbo.TBL_Purchase_Order.Delivery_Term) END AS Remarks, TBL_Party_2.PartyTypeID, dbo.TBL_Purchase_Order.BUID  FROM         dbo.TBL_Purchase_Order INNER JOIN      dbo.TBL_Party AS TBL_Party_2 ON dbo.TBL_Purchase_Order.Supp_ID = TBL_Party_2.PartyID INNER JOIN   dbo.TBL_Purchase_Detail ON dbo.TBL_Purchase_Order.Purchase_ID = dbo.TBL_Purchase_Detail.Purchase_ID  WHERE (dbo.TBL_Purchase_Order.Form_ID = 5 or dbo.TBL_Purchase_Order.Form_ID = 6) AND (TBL_Party_2.InActive <> 1) GROUP BY dbo.TBL_Purchase_Order.Supp_ID, dbo.TBL_Purchase_Order.Purchase_ID, dbo.TBL_Purchase_Order.Received_Date, TBL_Party_2.PartyName, TBL_Party_2.PartyTypeID, dbo.TBL_Purchase_Order.BUID union All SELECT     dbo.Tbl_Salary.EmpID AS PartyID, dbo.Tbl_Salary.TrId AS TrID, dbo.Tbl_Salary.TrDate, dbo.TBL_Party.PartyName, dbo.Tbl_Salary.NetSalary AS Amount, 'Salary Generated' AS Remarks,   dbo.TBL_Party.PartyTypeID, dbo.Tbl_Salary.BuID FROM         dbo.Tbl_Salary INNER JOIN  dbo.TBL_Party ON dbo.Tbl_Salary.EmpID = dbo.TBL_Party.PartyID WHERE     (dbo.Tbl_Salary.IsPost = 1) union All SELECT     dbo.TBL_Party.PartyID, dbo.TBL_Sales_Sold.Sales_ID AS TrID, dbo.TBL_Sales_Sold.Sales_Date AS TrDate, dbo.TBL_Party.PartyName, dbo.TBL_Sales_Sold.NetAmount * - 1 AS Amount,  'Delivered Order#' + CAST(dbo.TBL_Sales_Sold.Order_No AS varchar(50)) AS Remarks, dbo.TBL_Party.PartyTypeID, dbo.TBL_Sales_Sold.BUID FROM         dbo.Tbl_Sales_SoldPayment INNER JOIN   dbo.TBL_Sales_Sold ON dbo.Tbl_Sales_SoldPayment.SalesID = dbo.TBL_Sales_Sold.Sales_ID LEFT OUTER JOIN       dbo.TBL_Party ON dbo.TBL_Sales_Sold.CustomerID = dbo.TBL_Party.PartyID WHERE     (dbo.TBL_Sales_Sold.Sales_ID NOT IN     (SELECT     Sales_ID        FROM          dbo.TBL_Sales_Void)) AND (dbo.TBL_Sales_Sold.Order_No > 0) union All SELECT     dbo.TBL_Party.PartyID, dbo.TBL_Sales_Sold.Sales_ID AS TrID, dbo.TBL_Sales_Sold.Sales_Date AS TrDate, dbo.TBL_Party.PartyName, dbo.TBL_Sales_Sold.ReceivedAmount - dbo.TBL_Sales_Sold.ReturnAmount AS Amount, 'Payment Against Order#' + CAST(dbo.TBL_Sales_Sold.Order_No AS varchar(50)) AS Remarks, dbo.TBL_Party.PartyTypeID, dbo.TBL_Sales_Sold.BUID FROM         dbo.Tbl_Sales_SoldPayment INNER JOIN   dbo.TBL_Sales_Sold ON dbo.Tbl_Sales_SoldPayment.SalesID = dbo.TBL_Sales_Sold.Sales_ID LEFT OUTER JOIN       dbo.TBL_Party ON dbo.TBL_Sales_Sold.CustomerID = dbo.TBL_Party.PartyID WHERE     (dbo.TBL_Sales_Sold.Sales_ID NOT IN     (SELECT     Sales_ID        FROM          dbo.TBL_Sales_Void)) AND (dbo.TBL_Sales_Sold.Order_No > 0) AND (dbo.Tbl_Sales_SoldPayment.PaymentTypeID <> 28 AND dbo.Tbl_Sales_SoldPayment.PaymentTypeID <> 30) union All SELECT dbo.TBL_Party.PartyID, dbo.TBL_Sales_Sold.Sales_ID AS TrID, dbo.TBL_Sales_Sold.Sales_Date AS TrDate, dbo.TBL_Party.PartyName,dbo.Tbl_Sales_SoldPayment.Value * - 1 as Amount,   CASE WHEN dbo.TBL_Sales_Sold.Remarks <> '' THEN dbo.TBL_Sales_Sold.Remarks ELSE  CASE WHEN dbo.Tbl_Sales_SoldPayment.Value > 0 THEN 'Credit Sales' ELSE 'Sales Return' END End AS Remarks,dbo.TBL_Party.PartyTypeID, dbo.TBL_Sales_Sold.BUID FROM     dbo.Tbl_Sales_SoldPayment INNER JOIN    dbo.TBL_Sales_Sold ON dbo.Tbl_Sales_SoldPayment.SalesID = dbo.TBL_Sales_Sold.Sales_ID LEFT OUTER JOIN  dbo.TBL_Party ON dbo.TBL_Sales_Sold.CustomerID = dbo.TBL_Party.PartyID WHERE     (dbo.TBL_Sales_Sold.Sales_ID NOT IN (SELECT Sales_ID FROM dbo.TBL_Sales_Void)) AND (dbo.Tbl_Sales_SoldPayment.PaymentTypeID = 14 or dbo.Tbl_Sales_SoldPayment.PaymentTypeID = 28)  AND (dbo.TBL_Sales_Sold.Order_No IS NULL OR dbo.TBL_Sales_Sold.Order_No= 0) union All SELECT dbo.TBL_Party.PartyID, dbo.TBL_Sales_Sold.Sales_ID AS TrID, dbo.TBL_Sales_Sold.Sales_Date AS TrDate, dbo.TBL_Party.PartyName,dbo.Tbl_Sales_SoldPayment.Value * - 1 as Amount,   CASE WHEN dbo.TBL_Sales_Sold.Remarks <> '' THEN dbo.TBL_Sales_Sold.Remarks ELSE  CASE WHEN dbo.Tbl_Sales_SoldPayment.Value > 0 THEN 'Cash Sales' ELSE 'Cash Sales Return' END End AS Remarks,dbo.TBL_Party.PartyTypeID, dbo.TBL_Sales_Sold.BUID FROM     dbo.Tbl_Sales_SoldPayment INNER JOIN    dbo.TBL_Sales_Sold ON dbo.Tbl_Sales_SoldPayment.SalesID = dbo.TBL_Sales_Sold.Sales_ID LEFT OUTER JOIN  dbo.TBL_Party ON dbo.TBL_Sales_Sold.CustomerID = dbo.TBL_Party.PartyID WHERE     (dbo.TBL_Sales_Sold.Sales_ID NOT IN (SELECT Sales_ID FROM dbo.TBL_Sales_Void)) AND (dbo.Tbl_Sales_SoldPayment.PaymentTypeID = 25 or dbo.Tbl_Sales_SoldPayment.PaymentTypeID = 31 Or dbo.Tbl_Sales_SoldPayment.PaymentTypeID = 13) AND (dbo.TBL_Sales_Sold.Order_No IS NULL OR dbo.TBL_Sales_Sold.Order_No= 0) union All SELECT dbo.TBL_Party.PartyID, dbo.TBL_Sales_Sold.Sales_ID AS TrID, dbo.TBL_Sales_Sold.Sales_Date AS TrDate, dbo.TBL_Party.PartyName,dbo.Tbl_Sales_SoldPayment.Value as Amount,   CASE WHEN dbo.TBL_Sales_Sold.Remarks <> '' THEN dbo.TBL_Sales_Sold.Remarks ELSE  CASE WHEN dbo.Tbl_Sales_SoldPayment.Value > 0 THEN 'Cash Rec against Inv No ' + Cast(dbo.TBL_Sales_Sold.Sales_ID As varchar) ELSE 'Cash Return against Inv No ' + Cast(dbo.TBL_Sales_Sold.Sales_ID As varchar) END End AS Remarks,dbo.TBL_Party.PartyTypeID, dbo.TBL_Sales_Sold.BUID FROM     dbo.Tbl_Sales_SoldPayment INNER JOIN    dbo.TBL_Sales_Sold ON dbo.Tbl_Sales_SoldPayment.SalesID = dbo.TBL_Sales_Sold.Sales_ID LEFT OUTER JOIN  dbo.TBL_Party ON dbo.TBL_Sales_Sold.CustomerID = dbo.TBL_Party.PartyID WHERE     (dbo.TBL_Sales_Sold.Sales_ID NOT IN (SELECT Sales_ID FROM dbo.TBL_Sales_Void)) AND (dbo.Tbl_Sales_SoldPayment.PaymentTypeID = 25 or dbo.Tbl_Sales_SoldPayment.PaymentTypeID = 31 Or dbo.Tbl_Sales_SoldPayment.PaymentTypeID = 13) AND (dbo.TBL_Sales_Sold.Order_No IS NULL OR dbo.TBL_Sales_Sold.Order_No= 0)  And dbo.TBL_Sales_Sold.Sales_ID  Not IN (SELECT SalesID FROM Tbl_Installment ) )DrvTbl2 where (DrvTbl2.trDate <'04-10-2023') and DrvTbl2.partyTypeID=4 AND (BUID =1) GROUP BY PartyName, partyid, PartyTypeID,BUID ORDER BY TrDate
`,
        (err, result) => {
          if (err) {
            res.send(err);
          }
          res.send(result);
        }
      );
    }
  });
});

app.get("/Dreceive", (req, res) => {
  conn.connect().then((result) => {
    if (result.connecting) {
      console.log("connecting");
    }
    if (result.connected) {
      result
        .request()
        .query(
          `select   partyid, TrId, TrDate, PartyName, CASE WHEN Amount < 0 THEN amount*-1 else 0 END AS Debit, CASE WHEN Amount > 0 THEN amount else  0 END AS Credit, Remarks, PartyTypeID,BUID from (  SELECT dbo.TBL_PettyCash.againstpartyid as partyid,dbo.TBL_PettyCash.TrId, dbo.TBL_PettyCash.TrDate, dbo.TBL_Party.PartyName, dbo.TBL_PettyCash.Amount * dbo.TBL_PettyCash.PaymentType AS Amount, dbo.TBL_PettyCash.Narration AS Remarks,dbo.TBL_Party.PartyTypeID,dbo.TBL_PettyCash.BUID FROM dbo.TBL_Party RIGHT OUTER JOIN dbo.TBL_PettyCash ON dbo.TBL_Party.PartyID = dbo.TBL_PettyCash.AgainstPartyID Union All SELECT     dbo.TBL_Purchase_Order.Supp_ID AS partyid, dbo.TBL_Purchase_Order.Purchase_ID, dbo.TBL_Purchase_Order.Received_Date, TBL_Party_2.PartyName,       SUM(dbo.TBL_Purchase_Detail.Item_QTY * dbo.TBL_Purchase_Detail.Item_Price) AS Amount, CASE WHEN SUM(dbo.TBL_Purchase_Detail.Item_QTY) < 0 THEN 'Purchase Return' ELSE 'Purchase: ' + MAX(dbo.TBL_Purchase_Order.Delivery_Term) END AS Remarks, TBL_Party_2.PartyTypeID, dbo.TBL_Purchase_Order.BUID  FROM         dbo.TBL_Purchase_Order INNER JOIN      dbo.TBL_Party AS TBL_Party_2 ON dbo.TBL_Purchase_Order.Supp_ID = TBL_Party_2.PartyID INNER JOIN   dbo.TBL_Purchase_Detail ON dbo.TBL_Purchase_Order.Purchase_ID = dbo.TBL_Purchase_Detail.Purchase_ID  WHERE (dbo.TBL_Purchase_Order.Form_ID = 5 or dbo.TBL_Purchase_Order.Form_ID = 6) AND (TBL_Party_2.InActive <> 1) GROUP BY dbo.TBL_Purchase_Order.Supp_ID, dbo.TBL_Purchase_Order.Purchase_ID, dbo.TBL_Purchase_Order.Received_Date, TBL_Party_2.PartyName, TBL_Party_2.PartyTypeID, dbo.TBL_Purchase_Order.BUID union All SELECT     dbo.Tbl_Salary.EmpID AS PartyID, dbo.Tbl_Salary.TrId AS TrID, dbo.Tbl_Salary.TrDate, dbo.TBL_Party.PartyName, dbo.Tbl_Salary.NetSalary AS Amount, 'Salary Generated' AS Remarks,   dbo.TBL_Party.PartyTypeID, dbo.Tbl_Salary.BuID FROM         dbo.Tbl_Salary INNER JOIN  dbo.TBL_Party ON dbo.Tbl_Salary.EmpID = dbo.TBL_Party.PartyID WHERE     (dbo.Tbl_Salary.IsPost = 1) union All SELECT     dbo.TBL_Party.PartyID, dbo.TBL_Sales_Sold.Sales_ID AS TrID, dbo.TBL_Sales_Sold.Sales_Date AS TrDate, dbo.TBL_Party.PartyName, dbo.TBL_Sales_Sold.NetAmount * - 1 AS Amount,  'Delivered Order#' + CAST(dbo.TBL_Sales_Sold.Order_No AS varchar(50)) AS Remarks, dbo.TBL_Party.PartyTypeID, dbo.TBL_Sales_Sold.BUID FROM         dbo.Tbl_Sales_SoldPayment INNER JOIN   dbo.TBL_Sales_Sold ON dbo.Tbl_Sales_SoldPayment.SalesID = dbo.TBL_Sales_Sold.Sales_ID LEFT OUTER JOIN       dbo.TBL_Party ON dbo.TBL_Sales_Sold.CustomerID = dbo.TBL_Party.PartyID WHERE     (dbo.TBL_Sales_Sold.Sales_ID NOT IN     (SELECT     Sales_ID        FROM          dbo.TBL_Sales_Void)) AND (dbo.TBL_Sales_Sold.Order_No > 0) union All SELECT     dbo.TBL_Party.PartyID, dbo.TBL_Sales_Sold.Sales_ID AS TrID, dbo.TBL_Sales_Sold.Sales_Date AS TrDate, dbo.TBL_Party.PartyName, dbo.TBL_Sales_Sold.ReceivedAmount - dbo.TBL_Sales_Sold.ReturnAmount AS Amount, 'Payment Against Order#' + CAST(dbo.TBL_Sales_Sold.Order_No AS varchar(50)) AS Remarks, dbo.TBL_Party.PartyTypeID, dbo.TBL_Sales_Sold.BUID FROM         dbo.Tbl_Sales_SoldPayment INNER JOIN   dbo.TBL_Sales_Sold ON dbo.Tbl_Sales_SoldPayment.SalesID = dbo.TBL_Sales_Sold.Sales_ID LEFT OUTER JOIN       dbo.TBL_Party ON dbo.TBL_Sales_Sold.CustomerID = dbo.TBL_Party.PartyID WHERE     (dbo.TBL_Sales_Sold.Sales_ID NOT IN     (SELECT     Sales_ID        FROM          dbo.TBL_Sales_Void)) AND (dbo.TBL_Sales_Sold.Order_No > 0) AND (dbo.Tbl_Sales_SoldPayment.PaymentTypeID <> 28 AND dbo.Tbl_Sales_SoldPayment.PaymentTypeID <> 30) union All SELECT dbo.TBL_Party.PartyID, dbo.TBL_Sales_Sold.Sales_ID AS TrID, dbo.TBL_Sales_Sold.Sales_Date AS TrDate, dbo.TBL_Party.PartyName,dbo.Tbl_Sales_SoldPayment.Value * - 1 as Amount,   CASE WHEN dbo.TBL_Sales_Sold.Remarks <> '' THEN dbo.TBL_Sales_Sold.Remarks ELSE  CASE WHEN dbo.Tbl_Sales_SoldPayment.Value > 0 THEN 'Credit Sales' ELSE 'Sales Return' END End AS Remarks,dbo.TBL_Party.PartyTypeID, dbo.TBL_Sales_Sold.BUID FROM     dbo.Tbl_Sales_SoldPayment INNER JOIN    dbo.TBL_Sales_Sold ON dbo.Tbl_Sales_SoldPayment.SalesID = dbo.TBL_Sales_Sold.Sales_ID LEFT OUTER JOIN  dbo.TBL_Party ON dbo.TBL_Sales_Sold.CustomerID = dbo.TBL_Party.PartyID WHERE     (dbo.TBL_Sales_Sold.Sales_ID NOT IN (SELECT Sales_ID FROM dbo.TBL_Sales_Void)) AND (dbo.Tbl_Sales_SoldPayment.PaymentTypeID = 14 or dbo.Tbl_Sales_SoldPayment.PaymentTypeID = 28)  AND (dbo.TBL_Sales_Sold.Order_No IS NULL OR dbo.TBL_Sales_Sold.Order_No= 0) union All SELECT dbo.TBL_Party.PartyID, dbo.TBL_Sales_Sold.Sales_ID AS TrID, dbo.TBL_Sales_Sold.Sales_Date AS TrDate, dbo.TBL_Party.PartyName,dbo.Tbl_Sales_SoldPayment.Value * - 1 as Amount,   CASE WHEN dbo.TBL_Sales_Sold.Remarks <> '' THEN dbo.TBL_Sales_Sold.Remarks ELSE  CASE WHEN dbo.Tbl_Sales_SoldPayment.Value > 0 THEN 'Cash Sales' ELSE 'Cash Sales Return' END End AS Remarks,dbo.TBL_Party.PartyTypeID, dbo.TBL_Sales_Sold.BUID FROM     dbo.Tbl_Sales_SoldPayment INNER JOIN    dbo.TBL_Sales_Sold ON dbo.Tbl_Sales_SoldPayment.SalesID = dbo.TBL_Sales_Sold.Sales_ID LEFT OUTER JOIN  dbo.TBL_Party ON dbo.TBL_Sales_Sold.CustomerID = dbo.TBL_Party.PartyID WHERE     (dbo.TBL_Sales_Sold.Sales_ID NOT IN (SELECT Sales_ID FROM dbo.TBL_Sales_Void)) AND (dbo.Tbl_Sales_SoldPayment.PaymentTypeID = 25 or dbo.Tbl_Sales_SoldPayment.PaymentTypeID = 31 Or dbo.Tbl_Sales_SoldPayment.PaymentTypeID = 13) AND (dbo.TBL_Sales_Sold.Order_No IS NULL OR dbo.TBL_Sales_Sold.Order_No= 0) union All SELECT dbo.TBL_Party.PartyID, dbo.TBL_Sales_Sold.Sales_ID AS TrID, dbo.TBL_Sales_Sold.Sales_Date AS TrDate, dbo.TBL_Party.PartyName,dbo.Tbl_Sales_SoldPayment.Value as Amount,   CASE WHEN dbo.TBL_Sales_Sold.Remarks <> '' THEN dbo.TBL_Sales_Sold.Remarks ELSE  CASE WHEN dbo.Tbl_Sales_SoldPayment.Value > 0 THEN 'Cash Rec against Inv No ' + Cast(dbo.TBL_Sales_Sold.Sales_ID As varchar) ELSE 'Cash Return against Inv No ' + Cast(dbo.TBL_Sales_Sold.Sales_ID As varchar) END End AS Remarks,dbo.TBL_Party.PartyTypeID, dbo.TBL_Sales_Sold.BUID FROM     dbo.Tbl_Sales_SoldPayment INNER JOIN    dbo.TBL_Sales_Sold ON dbo.Tbl_Sales_SoldPayment.SalesID = dbo.TBL_Sales_Sold.Sales_ID LEFT OUTER JOIN  dbo.TBL_Party ON dbo.TBL_Sales_Sold.CustomerID = dbo.TBL_Party.PartyID WHERE     (dbo.TBL_Sales_Sold.Sales_ID NOT IN (SELECT Sales_ID FROM dbo.TBL_Sales_Void)) AND (dbo.Tbl_Sales_SoldPayment.PaymentTypeID = 25 or dbo.Tbl_Sales_SoldPayment.PaymentTypeID = 31 Or dbo.Tbl_Sales_SoldPayment.PaymentTypeID = 13) AND (dbo.TBL_Sales_Sold.Order_No IS NULL OR dbo.TBL_Sales_Sold.Order_No= 0)  And dbo.TBL_Sales_Sold.Sales_ID  Not IN (SELECT SalesID FROM Tbl_Installment ) ) DrvTbl where (DrvTbl.trDate >='04-10-2023' AND DrvTbl.trDate <='04-10-2023') and DrvTbl.partyTypeID=1 AND (BUID =1) Union All SELECT     partyid, 0 AS TrId, '1900-01-01' AS TrDate, PartyName, CASE WHEN SUM(Amount) < 0 THEN SUM(amount)*-1 ELSE 0 END AS Debit, CASE WHEN SUM(Amount) > 0 THEN SUM(amount)    ELSE 0 END AS Credit, 'Opening Balance' AS Remarks, PartyTypeID,BUID from (  SELECT dbo.TBL_PettyCash.againstpartyid as partyid,dbo.TBL_PettyCash.TrId, dbo.TBL_PettyCash.TrDate, dbo.TBL_Party.PartyName, dbo.TBL_PettyCash.Amount * dbo.TBL_PettyCash.PaymentType AS Amount, dbo.TBL_PettyCash.Narration AS Remarks,dbo.TBL_Party.PartyTypeID,dbo.TBL_PettyCash.BUID FROM dbo.TBL_Party RIGHT OUTER JOIN dbo.TBL_PettyCash ON dbo.TBL_Party.PartyID = dbo.TBL_PettyCash.AgainstPartyID Union All SELECT     dbo.TBL_Purchase_Order.Supp_ID AS partyid, dbo.TBL_Purchase_Order.Purchase_ID, dbo.TBL_Purchase_Order.Received_Date, TBL_Party_2.PartyName,       SUM(dbo.TBL_Purchase_Detail.Item_QTY * dbo.TBL_Purchase_Detail.Item_Price) AS Amount, CASE WHEN SUM(dbo.TBL_Purchase_Detail.Item_QTY) < 0 THEN 'Purchase Return' ELSE 'Purchase: ' + MAX(dbo.TBL_Purchase_Order.Delivery_Term) END AS Remarks, TBL_Party_2.PartyTypeID, dbo.TBL_Purchase_Order.BUID  FROM         dbo.TBL_Purchase_Order INNER JOIN      dbo.TBL_Party AS TBL_Party_2 ON dbo.TBL_Purchase_Order.Supp_ID = TBL_Party_2.PartyID INNER JOIN   dbo.TBL_Purchase_Detail ON dbo.TBL_Purchase_Order.Purchase_ID = dbo.TBL_Purchase_Detail.Purchase_ID  WHERE (dbo.TBL_Purchase_Order.Form_ID = 5 or dbo.TBL_Purchase_Order.Form_ID = 6) AND (TBL_Party_2.InActive <> 1) GROUP BY dbo.TBL_Purchase_Order.Supp_ID, dbo.TBL_Purchase_Order.Purchase_ID, dbo.TBL_Purchase_Order.Received_Date, TBL_Party_2.PartyName, TBL_Party_2.PartyTypeID, dbo.TBL_Purchase_Order.BUID union All SELECT     dbo.Tbl_Salary.EmpID AS PartyID, dbo.Tbl_Salary.TrId AS TrID, dbo.Tbl_Salary.TrDate, dbo.TBL_Party.PartyName, dbo.Tbl_Salary.NetSalary AS Amount, 'Salary Generated' AS Remarks,   dbo.TBL_Party.PartyTypeID, dbo.Tbl_Salary.BuID FROM         dbo.Tbl_Salary INNER JOIN  dbo.TBL_Party ON dbo.Tbl_Salary.EmpID = dbo.TBL_Party.PartyID WHERE     (dbo.Tbl_Salary.IsPost = 1) union All SELECT     dbo.TBL_Party.PartyID, dbo.TBL_Sales_Sold.Sales_ID AS TrID, dbo.TBL_Sales_Sold.Sales_Date AS TrDate, dbo.TBL_Party.PartyName, dbo.TBL_Sales_Sold.NetAmount * - 1 AS Amount,  'Delivered Order#' + CAST(dbo.TBL_Sales_Sold.Order_No AS varchar(50)) AS Remarks, dbo.TBL_Party.PartyTypeID, dbo.TBL_Sales_Sold.BUID FROM         dbo.Tbl_Sales_SoldPayment INNER JOIN   dbo.TBL_Sales_Sold ON dbo.Tbl_Sales_SoldPayment.SalesID = dbo.TBL_Sales_Sold.Sales_ID LEFT OUTER JOIN       dbo.TBL_Party ON dbo.TBL_Sales_Sold.CustomerID = dbo.TBL_Party.PartyID WHERE     (dbo.TBL_Sales_Sold.Sales_ID NOT IN     (SELECT     Sales_ID        FROM          dbo.TBL_Sales_Void)) AND (dbo.TBL_Sales_Sold.Order_No > 0) union All SELECT     dbo.TBL_Party.PartyID, dbo.TBL_Sales_Sold.Sales_ID AS TrID, dbo.TBL_Sales_Sold.Sales_Date AS TrDate, dbo.TBL_Party.PartyName, dbo.TBL_Sales_Sold.ReceivedAmount - dbo.TBL_Sales_Sold.ReturnAmount AS Amount, 'Payment Against Order#' + CAST(dbo.TBL_Sales_Sold.Order_No AS varchar(50)) AS Remarks, dbo.TBL_Party.PartyTypeID, dbo.TBL_Sales_Sold.BUID FROM         dbo.Tbl_Sales_SoldPayment INNER JOIN   dbo.TBL_Sales_Sold ON dbo.Tbl_Sales_SoldPayment.SalesID = dbo.TBL_Sales_Sold.Sales_ID LEFT OUTER JOIN       dbo.TBL_Party ON dbo.TBL_Sales_Sold.CustomerID = dbo.TBL_Party.PartyID WHERE     (dbo.TBL_Sales_Sold.Sales_ID NOT IN     (SELECT     Sales_ID        FROM          dbo.TBL_Sales_Void)) AND (dbo.TBL_Sales_Sold.Order_No > 0) AND (dbo.Tbl_Sales_SoldPayment.PaymentTypeID <> 28 AND dbo.Tbl_Sales_SoldPayment.PaymentTypeID <> 30) union All SELECT dbo.TBL_Party.PartyID, dbo.TBL_Sales_Sold.Sales_ID AS TrID, dbo.TBL_Sales_Sold.Sales_Date AS TrDate, dbo.TBL_Party.PartyName,dbo.Tbl_Sales_SoldPayment.Value * - 1 as Amount,   CASE WHEN dbo.TBL_Sales_Sold.Remarks <> '' THEN dbo.TBL_Sales_Sold.Remarks ELSE  CASE WHEN dbo.Tbl_Sales_SoldPayment.Value > 0 THEN 'Credit Sales' ELSE 'Sales Return' END End AS Remarks,dbo.TBL_Party.PartyTypeID, dbo.TBL_Sales_Sold.BUID FROM     dbo.Tbl_Sales_SoldPayment INNER JOIN    dbo.TBL_Sales_Sold ON dbo.Tbl_Sales_SoldPayment.SalesID = dbo.TBL_Sales_Sold.Sales_ID LEFT OUTER JOIN  dbo.TBL_Party ON dbo.TBL_Sales_Sold.CustomerID = dbo.TBL_Party.PartyID WHERE     (dbo.TBL_Sales_Sold.Sales_ID NOT IN (SELECT Sales_ID FROM dbo.TBL_Sales_Void)) AND (dbo.Tbl_Sales_SoldPayment.PaymentTypeID = 14 or dbo.Tbl_Sales_SoldPayment.PaymentTypeID = 28)  AND (dbo.TBL_Sales_Sold.Order_No IS NULL OR dbo.TBL_Sales_Sold.Order_No= 0) union All SELECT dbo.TBL_Party.PartyID, dbo.TBL_Sales_Sold.Sales_ID AS TrID, dbo.TBL_Sales_Sold.Sales_Date AS TrDate, dbo.TBL_Party.PartyName,dbo.Tbl_Sales_SoldPayment.Value * - 1 as Amount,   CASE WHEN dbo.TBL_Sales_Sold.Remarks <> '' THEN dbo.TBL_Sales_Sold.Remarks ELSE  CASE WHEN dbo.Tbl_Sales_SoldPayment.Value > 0 THEN 'Cash Sales' ELSE 'Cash Sales Return' END End AS Remarks,dbo.TBL_Party.PartyTypeID, dbo.TBL_Sales_Sold.BUID FROM     dbo.Tbl_Sales_SoldPayment INNER JOIN    dbo.TBL_Sales_Sold ON dbo.Tbl_Sales_SoldPayment.SalesID = dbo.TBL_Sales_Sold.Sales_ID LEFT OUTER JOIN  dbo.TBL_Party ON dbo.TBL_Sales_Sold.CustomerID = dbo.TBL_Party.PartyID WHERE     (dbo.TBL_Sales_Sold.Sales_ID NOT IN (SELECT Sales_ID FROM dbo.TBL_Sales_Void)) AND (dbo.Tbl_Sales_SoldPayment.PaymentTypeID = 25 or dbo.Tbl_Sales_SoldPayment.PaymentTypeID = 31 Or dbo.Tbl_Sales_SoldPayment.PaymentTypeID = 13) AND (dbo.TBL_Sales_Sold.Order_No IS NULL OR dbo.TBL_Sales_Sold.Order_No= 0) union All SELECT dbo.TBL_Party.PartyID, dbo.TBL_Sales_Sold.Sales_ID AS TrID, dbo.TBL_Sales_Sold.Sales_Date AS TrDate, dbo.TBL_Party.PartyName,dbo.Tbl_Sales_SoldPayment.Value as Amount,   CASE WHEN dbo.TBL_Sales_Sold.Remarks <> '' THEN dbo.TBL_Sales_Sold.Remarks ELSE  CASE WHEN dbo.Tbl_Sales_SoldPayment.Value > 0 THEN 'Cash Rec against Inv No ' + Cast(dbo.TBL_Sales_Sold.Sales_ID As varchar) ELSE 'Cash Return against Inv No ' + Cast(dbo.TBL_Sales_Sold.Sales_ID As varchar) END End AS Remarks,dbo.TBL_Party.PartyTypeID, dbo.TBL_Sales_Sold.BUID FROM     dbo.Tbl_Sales_SoldPayment INNER JOIN    dbo.TBL_Sales_Sold ON dbo.Tbl_Sales_SoldPayment.SalesID = dbo.TBL_Sales_Sold.Sales_ID LEFT OUTER JOIN  dbo.TBL_Party ON dbo.TBL_Sales_Sold.CustomerID = dbo.TBL_Party.PartyID WHERE     (dbo.TBL_Sales_Sold.Sales_ID NOT IN (SELECT Sales_ID FROM dbo.TBL_Sales_Void)) AND (dbo.Tbl_Sales_SoldPayment.PaymentTypeID = 25 or dbo.Tbl_Sales_SoldPayment.PaymentTypeID = 31 Or dbo.Tbl_Sales_SoldPayment.PaymentTypeID = 13) AND (dbo.TBL_Sales_Sold.Order_No IS NULL OR dbo.TBL_Sales_Sold.Order_No= 0)  And dbo.TBL_Sales_Sold.Sales_ID  Not IN (SELECT SalesID FROM Tbl_Installment ) )DrvTbl2 where (DrvTbl2.trDate <'04-10-2023') and DrvTbl2.partyTypeID=1 AND (BUID =1) GROUP BY PartyName, partyid, PartyTypeID,BUID ORDER BY TrDate`,
          (err, result) => {
            if (err) {
              res.send(err);
            }
            res.send(result);
          }
        );
    }
  });
});
// GET/////////////////////////////////////
if (process.env.NODE_ENV == "production") {
  app.use(express.static("Client/build"));
}
app.listen(5000, () => {
  console.log("from server side");
});
