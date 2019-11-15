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
        fetch("/logout", { method: "POST" })//bugfix
        this.props.dispatch({ type: "logout" })
    }
    regret = () => {
        fetch("/instant-regret", { method: "POST" })
    }
    kickout = () => {
        let username = window.prompt("who?")
        let data = new FormData()
        data.append("name", username)
        fetch("/kickout", { method: "POST", body: data })
    }
    render = () => {
        return (
            <div>
                <form onSubmit={this.handleSubmit}>
                    <input onChange={this.handleMessageChange} type="text" />
                    <input type="submit" />
                </form>
                <button onClick={this.regret}>delete my messages</button>

                <button onClick={this.logout}>logout</button>
                <button onClick={this.kickout}>kickout</button>
            </div>)
    }
}
let ChatForm = connect()(UnconnectedChatForm)
export default ChatForm