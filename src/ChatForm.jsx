import React, { Component } from "react"
import { connect } from 'react-redux'
class UnconnectedChatForm extends Component {
    constructor(props) {
        super(props)
        this.state = { message: "" }
    }
    handleMessageChange = event => {
        console.log("new message", event.target.value)
        this.setState({ message: event.target.value })
    }
    handleSubmit = event => {
        event.preventDefault()
        console.log("form submitted")
        let data = new FormData()
        data.append("msg", this.state.message)
        fetch("/newmessage", {
            method: "POST",
            body: data,
            credentials: "include"
        })
    }
    logout = () => {
        fetch("/logout")
        this.props.dispatch({ type: "logout" })
    }
    render = () => {
        return (
            <div>
                <form onSubmit={this.handleSubmit}>
                    <input onChange={this.handleMessageChange} type="text" />
                    <input type="submit" />
                </form>
                <button onClick={this.logout}>logout</button>
            </div>)
    }
}
let ChatForm = connect()(UnconnectedChatForm)
export default ChatForm