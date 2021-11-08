import React,{ useState } from 'react'
import Navbar from './navbar.jsx'
import './credit.css';



const data = [
    { name: "Auejin", points: 0},
    { name: "Yeonsu", points: 0  },
    { name: "Seonghye", points: 0 },
  ]

/*// Creating a custom hook
function useInput(defaultValue) {
    const [value, setValue] = useState(defaultValue);
    function onChange(e) {
      setValue(e.target.value);
    }
    return {
      value,
      onChange,
    };
  }
*/
  
const credit = () =>{
    return(
        <><div>
            <Navbar />
        </div>
        <div>
                <span>Value: 100 </span>
        </div>
        <div className = "credit">
        <table>
        <tr>
          <th>Members</th>
          <th>Points</th>
        </tr>
        {data.map((val, key) => {
          return (
            <tr key={key}>
              <td>{val.name}</td>
              <td><form>
                <label>
                    <input type="number" onChange="" placeholder="0" />
                </label>
                </form>
     </td>
            </tr>
          )
        })}
      </table>
            </div>
            

        <div className="form">
            <form onSubmit={handleSubmit}>
                <button type="submit">Submit</button>
            </form>
        </div>
</>
   );

}

function handleSubmit(e){
    e.preventDefault();
    alert('You clicked submit.');
}


class Form extends React.Component {
    constructor() {
        super();
        this.state = {
            nameValue: '',
            ageValue: ''
        }
    }
    onChangeName(event) {
        this.setState({
            nameValue:event.target.value
        });

    }
    onChangeAge(event) {
        this.setState({
            ageValue: event.target.value
        });
    }
    showValue(){
        alert('name '+ this.state.nameValue + ' age: ' + this.state.ageValue)
    }
    render() {
        return (
            <form>
                <label>Name:
                    <input type="text" onChange={this.onChangeName.bind(this)}/>
                </label>
                <label>Age:
                    <input type="text" onChange={this.onChangeAge.bind(this)}/>
                </label>
                <input type="submit" value="Submit" onClick={this.showValue.bind(this)}/>
            </form>
);
}
}
export default credit