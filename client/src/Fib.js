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
        });
    }

    // is async function since function calls backend
    handleSubmit = async (event) => {
        event.preventDefault(); // avoid from attempting to submit itself

        await axios.post('/api/values', {
            index: this.state.index
        });
        // after value was pushed... clean index value again
        this.setState({ index: '' });
    };

    renderSeenIndexes(){
        // loops over every item in map list and returns the each item
        // .join() method added string in between items
        return this.state.seenIndexes.map(({number}) => number).join('; ');
    }

    renderValues(){
        const entries = []
        for (let key in this.state.values){
            entries.push(
                <div key={key}>
                   For index {key} value {this.state.values[key]} was calculated 
                </div>
            );
        }

        return entries;
    }

    render() {
        <div>
            <form onSubmit={this.handleSubmit}>
                <label>Enter your fibonacci index:</label>
                <input
                    // event handler sets this.value if input field is changed
                    value={this.state.index}
                    onChange={event => this.setState({ index: event.target.value })}
                />
                <button>Submit</button>
            </form>

            <h3>Indexes seen before:</h3>
            {this.renderSeenIndexes()}

            <h3>Values calculated before:</h3>
            {this.renderValues()}
        </div>
    }
}

export default Fib