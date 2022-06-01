import express from "express";
import { config } from "./config.js";
import { postReceipt } from "./service.js";
import bodyParser from 'body-parser'

export function getApp() {
    const app = express()
    app.use(bodyParser.json());
    app.post(config.version + "/postReceipt", async function(request, response) {
        let ipfsHash = await postReceipt(request.body)
        response.status(200).send(ipfsHash)
    })
    app.use( (req, resp, next) => {
        resp.status(404)
        // res.
    })

    app.listen(config.port, function() {
        console.log("Authenticate and routing service listening on port ", config.port)
    })
}


