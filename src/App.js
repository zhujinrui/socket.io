import React, { Component } from 'react';
import Card from 'antd/lib/card';
import Table from 'antd/lib/table';
import io from 'socket.io-client';

import './App.css';

const socket = io('http://localhost:4001');

class App extends Component {
  constructor(props){
    super(props);
    this.state={

    }
  }
  componentDidMount(){
    socket.on('news',res=>{
      let data= JSON.parse(res);
      console.log(data)
      //连接成功
      // socket.emit('my other event', { my: 'I am user1' });
      this.setState({data: data })
    });
  }
  render() {
    let { data} = this.state;
    const columns = [{
      title: '姓名',
      dataIndex: 'name',
      render: (text, record)=> <span>{`${text}${record.surname}`}</span>,
      key: 'name',
    }, {
      title: '性别',
      dataIndex: 'gender',
      key: 'gender',
      render: (text, record) => <span>{text === 'female'? '女': '男'}</span>
    },{
      title: '国家',
      dataIndex: 'region',
      key: 'region',
    }];
    console.log(data);
    return (
      <div className="App">
        <div style={{ background: '#ECECEC', padding: '30px'}}>
          <Card  title="WebSocket实践(2)" style={{padding:'24px', width: 700, margin: '0 auto'  }}>
            <Table dataSource={data} columns={columns}  />
          </Card>
        </div>
      </div>
    );
  }
}

export default App;
