const { Client } = require("pg");
const client = new Client({
  user: "postgres",
  password: "postgres",
  host: "localhost",
  port: "5432",
  database: "uploader-web",
});

client
  .connect()
  .then(() => {
    console.log("connected to postgreSQL database");
  })
  .catch((err) => {
    console.log(err);
    console.error("Error connecting to PostgreSQL database", err);
  });

client.query("SELECT * FROM order", (err, result) => {
  if (err) {
    console.error("Error executing query", err);
  } else {
    console.log("Query result:", result.rows);
  }
});

// client
//   .end()
//   .then(() => {
//     console.log("Connection to PostgreSQL closed");
//   })
//   .catch((err) => {
//     console.error("Error closing connection", err);
//   });

T2_test=('HB','HCT','WBC','PLT','RBC','MCV','MCH','MCHC','RDWSD','RDW','NEU','LYMP','MONO','EOS','BAS','751-8','731-0','742-7','711-2','704-7','MPV','PDW','PCT','ESR','MDT','ABO','AST','ALT','UREA','BUNF','CREA','EGFR','CHOL','HDL','LDLD','TG','UA','GLUN','GLUS','GPOST','HBA1C','GGT','CRPK','WIDAL','SSIGM','VDRL','TPHA','HBSAGR','AHIVR','HCVR','DANS1R','DBIGM','DBIGG','HPSA','COMPLF','COLORF','CONSIF','MUCUSF','BLOODF','ERYF','LEUF','PARF','EGGWF','YEASTF','LMK','AMYLUF','SRTF','COMPLU','COLORU','CLARU','PHU','SGU','GLUU','ALBU','BILU','UROBU','ERESU','KETU','NITU','LESU','ERYU','LEUU','CASTU','EPITU','CRSYTU','BACTU','JAMU','OTHERU','ACR')