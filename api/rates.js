/**
 * GET /api/rates
 * Endpoint for getting currency rates HUF from MNB by SOAP
 * @param {Request} req
 * @param {Response} res
 */

export default async function handler(req, res) {
    console.log("GET (/api/rates) req.method", req?.method);
    
    const {method = "GET"} = req

    switch (req.method) {
        case 'GET':
            //Callout to MNB by SOAP API
            const endpoint = `http://www.mnb.hu/arfolyamok.asmx`
            const reqBodyXML = `<?xml version="1.0" encoding="UTF-8"?>
                                    <soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
                                        <soap:Body>
                                            <GetCurrentExchangeRates xmlns="http://www.mnb.hu/webservices/"></GetCurrentExchangeRates>
                                        </soap:Body>
                                    </soap:Envelope>`
            const soapRes = await fetch(endpoint, {
                method: "POST",
                headers: {
                    "Content-Type": "text/xml",
                    "SOAPAction": '"http://www.mnb.hu/webservices/MNBArfolyamServiceSoap/GetCurrentExchangeRates"'
                }
            })
            console.log('soapRes', soapRes);
            
            if (!soapRes.ok) return res.status(soapRes.status).json({error: soapRes.statusText})
            
            const resXML = await soapRes.text()
            console.log("resXML: ", resXML);
            

            const rates = []
            return res.status(200).json({rates})
    
        default:
            return res.status(405).json({error: "Method not allowed!"});
    }
    return res.status(404).json({error: "Not found!"})
}