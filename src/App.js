import React, { Component } from 'react';
import './App.css';

var wisdoms = [
  "Semper Ubi Sub Ubi. (Always wear underwear.)",
  "Floss your teeth every day.",
  "You will pay for your sins. If you have already paid, please disregard this message.",
  "Today is a day for firm decisions!! Or is it?",
  "Caution: Keep out of reach of children.",
  "You're growing out of some of your problems, but there are others that you're growing into.",
  "Every cloud engenders not a storm."
]


class App extends Component {
  constructor(props) {
    super(props);
    
    var index = Math.floor(Math.random() * wisdoms.length);
    
    this.state = {
      wisdom: wisdoms[index]
    };
    
    this.setRandomWisdom = this.setRandomWisdom.bind(this);
    this.addWisdom = this.addWisdom.bind(this);
  }
  
  setRandomWisdom() {
    var index = Math.floor(Math.random() * wisdoms.length);
    
    this.setState({
      wisdom: wisdoms[index]
    });
  }
  
  addWisdom() {
    wisdoms.push(prompt("What new wisdom do you offer?"));
  }
  
  removeCurrentWisdom() {
    var index = wisdoms.indexOf(this.state.wisdom);
    wisdoms.splice(index, 1);
  }
  
  render() {
    return (
      <div className="App">
        {this.state.wisdom}
        <button className="more" onClick={this.setRandomWisdom}>Another</button>
      </div>
    );
  }
}

export default App;
