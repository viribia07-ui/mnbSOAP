import React from "react";
import "./MNBCurrencyRates.css"

export default class MNBCurrencyRates extends React.Component{
        /**
         * Example on how to calculate currency:
         * EURHUF = 360~
         * USDHUF = 300~
         * EURUSD = EURHUF / USDHUF == 1,2~
         */

    state = {
        date: "",
        rates: [],
        error: null
    }

    async componentDidMount(){
        try{
            //TODO - call GET /api/rates HTTP REST API endpoint
            const res = await fetch("/api/rates") //megjegyezni
            const json = await res.json()
            console.log("MNB comp. json", json);
            
            const {date = new Date(Date.now()), rates = []} = json
            
            //TODO - set state from respone
            this.setState({date, rates, error: null})

        } catch (error){
            console.warn(error);
            this.setState({error, date: "", rates:[]})
        }

    }

    render(){

        const {date="", rates=[], error=null} = this.state
        
        return <section className="mnb">

            {error && <p className="mnb-error">Hiba: error</p>}

            <div className="mnb-layout">
                <div className="mnb-table-wrap">
                    <table className="mnb-table">
                        <thead>
                            <tr>
                                <th>Deviza</th>
                                <th>Egység</th>
                                <th>Árfolyam (HUF)</th>
                            </tr>
                        </thead>
                        <tbody>{JSON.stringify(rates)}</tbody>
                    </table>
                </div>

                <form className="mnb-form" >
                    <h3>Átváltó</h3>
                    <label>
                        Összeg
                        <input type="number" name="amount" min="0" step="any" />
                    </label>
                    <label>
                        Ebből
                        <select name="from" >TODO - fill options</select>
                    </label>
                    {/*TODO - handle button*/}
                    <button type="button"  title="Felcserélés">⇅</button>
                    <label>
                        Ebbe
                        <select name="to" >TODO - fill options</select>
                    </label>
                    <output className="mnb-result"></output>
                </form>
            </div>
        </section>
    }
}