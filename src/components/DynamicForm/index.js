import React from 'react';
import ReactDOM from 'react-dom';
import './form.css';


export default class DynamicForm extends React.Component {
    state = {

    }
    constructor(props){
        super(props);
    }

    onSubmit = (e) =>{ /*call parent on submit*/
        e.preventDefault();
        if(this.props.onSubmit) this.props.onSubmit(this.state);
    }
    
    //onChange handler
    onChange =(e,key) =>{
        this.setState({
            [key]: this[key].value
        })
    }

    renderForm = () =>{
        //loop through model data
        let model = this.props.model; //get model from credit system 
        let formUI = model.map((m) => {
            let key = m.key;
            let type = m.type || "text";
            let props = m.props || {};
            
            return(
                <div key = {key} className ="form-group">
                    <label className="form-label"
                        key ={"l + m.key"}
                        htmlFor={m.key}>
                        {m.label}
                    </label>
                    <input {...props} 
                    //reference all input element this.name, bla blla
                        ref ={(key)=>{this[m.key] = key}}
                        className = "form-input"
                        type = {type}
                        key = {"i" + m.key}
                        onChange={(e) => {this.onChange(e,key)}}
                    />
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