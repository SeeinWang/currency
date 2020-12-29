import React, {Component }from 'react';
import styled from 'styled-components';
import axios from 'axios';
import {countryData } from './countryData';
import { Dropdown , Input, Button} from 'semantic-ui-react';
import cc from 'currency-codes';


class App extends Component{
    state = {
        countries:[],
        source:'',
        destination:'',
        sourceChoices:[],
        sourceCurrency:'',
        destinationChoices:[],
        destinationCurrency:'',
        amount:null,
        convertTable:[],
        resultRate:null,
        resultAmount:null
    }

    componentDidMount(){
        const countries = [];
        countryData.forEach(item => {
            const data = {
                key:item.code,
                value:item.description,
                text:item.description
            };
            countries.push(data);
        })
        this.setState({
            countries
        })
        const url = 'http://data.fixer.io/api/latest?access_key=d402425809216b18397aacbb8d410ab6';
        axios(url, {
            method: 'GET'
          }).then((res) => {
           this.setState({
               convertTable:res.data.rates
           })
        }).catch((err) => {
            console.log('error')
        })
        
    }

    handleSourceChange = (e,{value}) => {
       const sourceCurrency = cc.country(value);
       const sourceChoices = [];
       sourceCurrency.forEach(item => {
           const data = {
               key:item.code,
               value:item.code,
               text:`${item.currency}(${item.code})`
           }
           sourceChoices.push(data);
       })
       this.setState({
           source:value,
           sourceChoices,
           sourceCurrency:''
       });
    }

    handleDestinationChange = (e,{value}) => {
        const destinationCurrency = cc.country(value);
        const destinationChoices = [];
        destinationCurrency.forEach(item => {
            const data = {
                key:item.code,
                value:item.code,
                text:`${item.currency}(${item.code})`
            }
            destinationChoices.push(data);
        });
        this.setState({
            destination:value,
            destinationChoices,
            destinationCurrency:''
        });
    }

    handleSourceCurrencyChange = (e, {value}) => {
        this.setState({
            sourceCurrency:value
        })
    }
    handleDestinationCurrencyChange =(e,{value})=> {
        this.setState({
            destinationCurrency:value
        })
    }

    enterAmount = (e, {value}) => {
        this.setState({
            amount:parseInt(value)
        })
    }

    getResult = () => {
        const {destinationCurrency, sourceCurrency, amount, convertTable } = this.state;
        if(destinationCurrency !== ''  && sourceCurrency !== '' && amount !== null){
            const sourceRate = convertTable[sourceCurrency];
            const destinationRate = convertTable[destinationCurrency];
            const resultRate = (destinationRate/sourceRate).toFixed(2);
            const resultAmount = (amount * resultRate).toFixed(2);
            this.setState({
               resultAmount,
               resultRate
           })
        }
    }

    

    render(){
        //console.log(cc.country('China'));
       const {countries, sourceChoices, destinationChoices, resultRate, resultAmount} = this.state;
    return (
       <Container>
           <SelectContainer>
           <Source>
           <Text>Source Country:</Text>
            <Dropdown
                style={{ minWidth: '12em', marginRight:'2em', height:'36px'}}
                placeholder="Select source country"
                selection
                search
                options={countries}
                onChange={this.handleSourceChange}
            />
            {    
                sourceChoices.length !== 0 && 
                <Source>
                    <Text>Source Country Currency:</Text>
                    <Dropdown
                    style={{ minWidth: '12em' }}
                    placeholder="Select currency"
                    selection
                    search
                    options={sourceChoices}
                    onChange={this.handleSourceCurrencyChange}
                    />
                </Source>
            }
            </Source>
            </SelectContainer>
            <SelectContainer>
                <Source>
                <Text>Destination Country:</Text>
                    <Dropdown
                        style={{ minWidth: '12em', marginRight:'2em', height:'36px'}}
                        placeholder="Select destination country"
                        selection
                        search
                        options={countries}
                        onChange={this.handleDestinationChange}
                    />
                    {    
                        destinationChoices.length !== 0 && 
                        <Source>
                            <Text>Select Country Currency:</Text>
                            <Dropdown
                            style={{ minWidth: '12em' }}
                            placeholder="select currency"
                            selection
                            search
                            options={destinationChoices}
                            onChange={this.handleDestinationCurrencyChange}
                            />
                        </Source>
                    }
                    </Source>
            </SelectContainer>
            <AmountContainer>
                <Text>Amount to convert:</Text>
                <Input placeholder='Enter amount' type='number' onChange={this.enterAmount} />
                <Button primary style={{marginLeft:'2em'}} onClick={this.getResult}>Convert</Button>
            </AmountContainer>
            <Result>
            <SelectContainer>
            <div style={{display:'flex'}}> 
            <Text>Convert Rate:</Text> 
            {
                resultRate !== null && 
                <Text>{resultRate}</Text> 
            }
            </div>
            <div style={{display:'flex'}}>
            <Text>Convert Amount:</Text> 
            {
                resultRate !== null && 
                <Text>{resultAmount}</Text> 
            }
            </div>
            </SelectContainer>
            </Result>
       </Container>
      
    );
  } 
  }

const SelectContainer = styled.div`
display:flex;
justify-content:space-around;
`;

const AmountContainer = styled.div`
display:flex;
justify-content: center; 
margin-bottom:1.5em;
`;

const Source = styled.div`
display:flex;
margin-bottom:1.5em;
`;

const Text = styled.div`
color:rgba(0, 0, 0, 0.45);
margin-right:1em;
height:36px;
line-height:36px;
`;

const Result = styled.div`
margin-top:8em;
`;

  const Container = styled.div`
  margin:3em 10%;
  padding:3em 2em;
  height:500px;
  border-radius: 0.28571429rem;
  border: 1px solid rgba(34, 36, 38, 0.15);
  box-shadow: 0 1px 2px 0 rgba(34, 36, 38, 0.15);
  `;
  export default App;