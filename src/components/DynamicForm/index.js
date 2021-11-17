import React from 'react';
import './form.css';


export default class DynamicForm extends React.Component {
    state = {
        count: 100,
    }

    onSubmit = (e) =>{ /*call parent on submit*/
        e.preventDefault();

        if (this.state.count === 0){
            if(this.props.onSubmit) this.props.onSubmit(this.state);
        }else{
            alert("Please distribute points correctly")
        }

    }
    
    //onChange handler
    onChange =(e,key) =>{
        const arr = [] //keys array
        var sum = 0
        //get allkeys
        for (const i in this.props.model){
            arr.push(this.props.model[i].key)
        }
        this.setState({
            [key]: this[key].value
        })
        
        //get updated values and sum them up
        for (const j in arr){
            sum = sum += Number(this[arr[j]].value)
        }
        console.log(sum)
        this.setState({
            //append array
            //temp: [...this.state.temp,[key,this[key].value]],
            count: 100 - sum 
        })
        
    }

    renderForm = () =>{
        
        //loop through model data
        let model = this.props.model; //get model from credit system 
        //console.log(model)
        let formUI = model.map((m) => {
            console.log(m)
            let key = m.key;
            let type = m.type || "text";
            let props = m.props || {};
            
            return(
                <div key={key} className="form-group">
                        <label className="form-label"
                            key={"l" + m.key}
                            htmlFor={m.key}>
                            {m.label}
                        </label>
                       
                        
                            <input {...props}
                                //reference all input element this.name, bla blla
                                ref={(key) => { this[m.key] = key; } }
                                className="form-input"
                                type={type}
                                key={"i" + m.key}
                                onChange={(e) => { this.onChange(e, key,m); } } />
                    
                    </div>

                    
                    
                               );
        } ); 
        return formUI
    }

    render(){
        let title = this.props.title || "Dynamic Form";
        return(
            <div className = {this.props.className}>
                <h3>{title}</h3>
                <h4> Remaining points to distribute: {this.state.count} </h4>
                <h5>Submitting honest reviews will help you and other classmates in selecting a team mate with a good fit.</h5>
                
                <form className = "dynamic-form" onSubmit ={(e)=>{this.onSubmit(e)}}>
                    {this.renderForm()}
                    <div className = "form-group">
                        <button type = "submit">submit</button>
                    </div>
                </form>
            </div>
        )
    }
}