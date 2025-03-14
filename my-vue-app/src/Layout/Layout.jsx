import React, { useEffect } from 'react'
import '../Css/Layout.css'
import { useState } from 'react';
import { Tabs } from 'antd';


const { TabPane } = Tabs;


const Layout = () => {
    const [activeKey, setActiveKey] = useState('1'); // Chỉ định tab mặc định là "Completed"

    const onChange = (key) => {
        setActiveKey(key);
    };
    const [data, setData] = useState([]);
    const handleApi = async () => {
        try {
            const data = await (await fetch('http://localhost:3000/task')).json()
            console.log(data)
            setData(data)
        } catch (error) {
            console.log(error)
        }
    }
    useEffect(() => {
        handleApi();
        return () => { };
    }, []);

    /* tính năng add*/
    const [contents, setContents] = useState('');
    const handleOnChange = (e) => {
        setContents(e.target.value);
    }
    const handleAdd = async () => {
        try {
            if (!contents.trim()) return; // Đảm bảo rằng không thêm task nếu input rỗng
            await fetch('http://localhost:3000/task', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    content: contents, // Dùng contents thay vì content
                    statusID: 1,
                    id: Math.floor(Math.random() * 1000)
                })
            });
            handleApi();
        } catch (error) {
            console.log(error)
        }
    }
    /* tính năng check box*/
    const handleCheck = async (a, b, c, d) => {
        try {
            const newStatusID = b === 1 ? 2 : 1;
            await fetch(`http://localhost:3000/task/${a}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    statusID: newStatusID,
                    id: a,
                    content: c,
                    checked: !d
                })
            });
            handleApi();
        } catch (error) {
            console.log(error)
        }
    }
    /*  tính năng xóa */
    const handleDelete = async (id) => {
        try {
            await fetch(`http://localhost:3000/task/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({})
            });
            handleApi();
        } catch (error) {
            console.log(error)
        }
        /* tính năng xóa hết */
    }

    const DeleteAll = () => {
        const new_data = data.filter((task) => task.statusID !== 2);
        setData(new_data)
    }
    return (
        <div className='Layout'>
            <div className='Header'>
                <h1>#Todo</h1>
                <Tabs activeKey={activeKey} onChange={onChange} type="line" className="custom-tabs">
                    <TabPane tab="All" key="1">
                        {activeKey === "1" &&
                            <div className='all'>
                                <div className='Search'>
                                    <input type="text" placeholder='add task' onChange={handleOnChange} value={contents} />
                                    <button onClick={handleAdd}>Add</button>
                                </div>
                                <div className='content'>
                                    {data.map((task) => {

                                        if (task.statusID === 1) {
                                            return (
                                                <div className='Task' key={task.id}>
                                                    <span >
                                                        <input type="checkbox" checked={task.checked} onChange={() => handleCheck(task.id, task.statusID, task.content, task.checked)} />
                                                        {task.content}
                                                    </span>
                                                </div>
                                            );
                                        } else {
                                            return (
                                                <div className='Task' key={task.id}>
                                                    <span style={{ textDecoration: 'line-through' }} >
                                                        <input onChange={() => handleCheck(task.id, task.statusID, task.content, task.checked)} type="checkbox" checked={task.checked} readOnly />
                                                        {task.content}
                                                    </span>

                                                </div>
                                            );
                                        }
                                    })}
                                </div>
                            </div>} {/* Nội dung của tab All */}
                    </TabPane>
                    <TabPane tab="Active" key="2">
                        {activeKey === "2" &&
                            <div className='active'>
                                <div className='Search'>
                                    <input type="text" placeholder='Search' onChange={handleOnChange} value={contents} />
                                    <button onClick={handleAdd}>Add</button>
                                </div>
                                <div className='content'>
                                    {data.map((task) => {
                                        // Kiểm tra nếu task.statusID là 1 thì hiển thị
                                        if (task.statusID === 1) {
                                            return (
                                                <div className='Task' key={task.id}>

                                                    <span >
                                                        <input onChange={() => handleCheck(task.id, task.statusID, task.content, task.checked)} type="checkbox" checked={task.checked} />
                                                        {task.content}
                                                    </span>
                                                </div>
                                            );
                                        }
                                    })}
                                </div>
                            </div>} {/* Nội dung của tab Active */}
                    </TabPane>
                    <TabPane tab="Completed" key="3">
                        {activeKey === "3" &&
                            <div className='completed'>
                                <div className='content'>
                                    {data.map((task) => {
                                        // Kiểm tra nếu task.statusID là 2 thì hiển thị
                                        if (task.statusID === 2) {
                                            return (
                                                <div className='TaskCom' key={task.id}>
                                                    <span className='comdelete' style={{ textDecoration: 'line-through' }}>
                                                        <input type="checkbox" checked={task.checked} readOnly />
                                                        {task.content}
                                                    </span>
                                                    <button onClick={() => handleDelete(task.id)}>🗑️</button>
                                                </div>
                                            );
                                        }
                                    })}
                                </div>
                                <button className='delete' onClick = {DeleteAll}>Delete</button>
                            </div>} {/* Nội dung của tab Completed */}
                    </TabPane>
                </Tabs>
            </div>
        </div>
    )
}

export default Layout
