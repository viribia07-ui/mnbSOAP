import {XMLParser} from 'fast-xml-parser';

const parser = new XMLParser({
    ignoreAttributes: false,   // az attribútumok (curr, unit, date) is kellenek
    attributeNamePrefix: '@_', // attribútum kulcsok: @_curr, @_unit, @_date
    removeNSPrefix: true,      // s:Envelope -> Envelope
    parseTagValue: false,      // a "367,73000" maradjon string
})

function parseRates(resXml) {
    // 1. lépés: SOAP boríték
    const envelope = parser.parse(resXml)
    const innerXml =
        envelope.Envelope.Body.GetCurrentExchangeRatesResponse.GetCurrentExchangeRatesResult

    // 2. lépés: a benne lévő XML string
    const inner = parser.parse(innerXml)
    const day = inner.MNBCurrentExchangeRates.Day

    return {
        date: day['@_date'],
        rates: [].concat(day.Rate).map((r) => ({
            curr: r['@_curr'],
            unit: Number(r['@_unit']),
            value: Number(r['#text'].replace(',', '.')),
        })),
    }
}

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
            
            const parsed = parseRates(resXML)
            console.log("parsed: ", parsed);
            

            const rates = []
            return res.status(200).json({rates})
    
        default:
            return res.status(405).json({error: "Method not allowed!"});
    }
    return res.status(404).json({error: "Not found!"})
}