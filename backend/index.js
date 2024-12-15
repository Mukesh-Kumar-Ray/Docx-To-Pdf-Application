import express from "express";
import dotenv from "dotenv";
import multer from "multer";
import docxToPDF from "docx-pdf";
import path  from "path";
import cors from "cors"


//connect with express and dotenv
const app = express()
dotenv.config()


//get data from dotenv
const port = process.env.Port


// middlewares
app.use(express.json())
app.use(
    cors({
    //   origin: process.env.FRONTEND_URL,
    //   credentials: true,
    //   methods: "GET,POST,PUT,DELETE",
    //   allowedHeaders: ["Content-Type", "Authorization"], // Add other headers you want to allow here.
    })
  );
//connect with database



//routing


//setting the upload storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads')
    },
    filename: function (req, file, cb) {
      cb(null,file.originalname)
    }
  })
  
  const upload = multer({ storage: storage })


  app.post("/convertFile", upload.single("file"), (req, res, next) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                message: "No file  uploaded",
            });
        }
        // Defining output file path
        let outputPath = path.join(
             "x",
            `${req.file.originalname}.pdf`,
        );
        docxToPDF(req.file.path, outputPath, (err, result) => {
            if (err) {
                console.log(err);
                return res.status(500).json({
                    message: "Error converting docx to pdf",
                });
            }
            res.download(outputPath, () => {
                console.log("file downloaded");
            });
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Internal server error",
        });
    }
});

app.listen(port,()=>{
    console.log(`sever is running on ${port}`)
})