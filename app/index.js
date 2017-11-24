import React, {Component} from 'react';
import PropTypes from 'prop-types';
import ReactDOM, { render } from 'react-dom';
import { clearInterval } from 'timers';

//markdown
import Remarkable from 'remarkable'
import $ from 'jquery'

const TodoList = (props) => (
    <ul>
        {
            props.items.map((item) => (
                <li key={item.id}>{item.text}-{item.id}</li>
            ))
        }
    </ul>
)

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            seconds: 0,
            items: [],
            text: '',
            value: 'Type some *markdown* here!',
            username: '',
            githubUrl: '',
            avatarUrl: '',
        };
        this.tick = this.tick.bind(this);
    }

    onChange(e) {
        // console.log(e.target.value)
        this.setState({
            text: e.target.value
        })
    }

    handleSubmit(e) {
        e.preventDefault();
        if (this.state.text === '') {
            return
        } else {
            const nextItems = this.state.items.concat([{text: this.state.text, id: Date.now()}]);
            const nextText = '';
            this.setState({
                items: nextItems,
                text: nextText
            })
        }
    }

    //时间过去了多少秒
    tick () {
        this.setState({
            seconds: this.state.seconds + 1
        })
    }

    //将使用者输入的markdown语法parse成html放入dom中，react通常使用virtual DOM作为DOM沟通的中介，不建议直接操作DOM，故使用时的属性为dangerousSetInnerHTML
    rawMarkUp() {
        const md = new Remarkable();
        return {__html: md.render(this.state.value)}
    }
    //markdown内容
    markdownChange() {
        this.setState({
            value: this.refs.textarea.value
        })
    }

    componentDidMount() {
        this.interval = setInterval(this.tick, 1000);
        $.get(this.props.source, (result) => {
            console.log(result);
            const data = result;
            if (data) {
                this.setState({
                    username: data.name,
                    githubUrl: data.html_url,
                    avatarUrl: data.avatar_url,
                })
            }
        })
    }

    componentWillUnmount() {
        clearInterval(this.interval);
    }

    render() {
        return (
            <div>
                <h1 style={this.props.style}>Hello world!</h1>
                <input type="button" disabled={true} defaultValue={this.props.defaultValue} />
                <span>Hello {this.props.name}</span>
                <br/>
                <span>{this.state.seconds}</span>
                <div>
                    <h2>TODO</h2>
                    <form onSubmit={this.handleSubmit.bind(this)}>
                        <input onChange={this.onChange.bind(this)} value={this.state.text} />
                        <button>{'Add #' + (this.state.items.length + 1)}</button>
                    </form>
                    <TodoList items={this.state.items} />
                </div>
                <div className="MarkdownEditor">
                    <h3>Input</h3>
                    <textarea onChange={this.markdownChange.bind(this)} ref="textarea" defaultValue={this.state.value} />
                    <h3>Output</h3>
                    <div className="content" dangerouslySetInnerHTML={this.rawMarkUp()}></div>
                </div>
                <div>
                    <h3>{this.state.username}</h3>
                    <img src={this.state.avatarUrl} />
                    <a href={this.state.githubUrl}>Github Link</a>
                </div>
            </div>
        );
    }
}

//proptype验证，若传入的props type不是string显示错误
App.PropTypes = {
    name: PropTypes.string.isRequired
}

//prop预设值，若对应props没传入值，将会使用default值
App.defaultProps = {
    name: 'Linling'
}

var props = {
    style: {
        background: 'red'
    },
    defaultValue: "11111",
}
var n = 4

ReactDOM.render(
    <App {...props} defaultValue="2222" name={n} source="https://api.github.com/users/torvalds" />,
    document.getElementById('app')
);