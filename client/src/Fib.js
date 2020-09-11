import React from 'react';
// axios is used to do HTTP requests
import axios from 'axios';

class Fib extends Component {
    state = {
        seenIndexes: [],
        values: {},  
        index: ''     
    };

    componentDidMount(){
        this.fetchValues();
        this.fetchIndexes();
    }

    async fetchValues() {
        // calls API and retrieves all values previously calculated
        const values = await axios.get('/api/values/current');
        // set values retrieved via API to this class
        this.setState({values: values.data});
    }

    async fetchIndexes() {
        // calls API and retrieves all indexes previously requested
        const indexes = await axios.get('/api/values/all');
        // set index retrieved via API to this class
        this.setState({
            seenIndexes: seenIndexes.data
        })
    }
}