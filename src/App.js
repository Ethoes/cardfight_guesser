import logo from './logo.svg';
import './App.css';
import React, { Component } from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import GuessTheEffect from './GuessTheEffect';
import Home from './home';
import CreateRoom from './createRoom/CreateRoom';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      boosters: [],
    };
  }

  componentDidMount() {
    fetch("/api/v1/sets")
        .then(response => response.json())
        .then(data => {
            // Ensure data is an array
            if (Array.isArray(data?.sets)) {
                this.setState({ boosters: data?.sets });
            } else {
                console.error("Data is not an array:", data);
            }
        })
        .catch(error => {
            console.error(error);
        });
  }

  render() {
    return (
      <Router>
        <div>
          <Link to="/">
            <button>Go Home</button>
          </Link>
          {/* <Link to="/GuessTheEffect">
            <button>Go to Guess The Effect</button>
          </Link> */}
          <Routes>
            <Route path="/" element={<Home/>} />
            <Route path="/GuessTheEffect" element={<GuessTheEffect/>} />
            <Route path="/CreateRoom" element={<CreateRoom boosters={this.state.boosters}/>} />
          </Routes>
        </div>
      </Router>
    );
  }
}

export default App;
