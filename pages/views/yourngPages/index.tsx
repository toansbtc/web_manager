import React, { useEffect, useState } from 'react'
import Quill_editor from '../components/quill_editor';
import Image from 'next/image';
import axios from 'axios';
import action from '@/pages/api/DB/actionDB';
import getItemSession from '../Function/sessionFunction';


export default function index() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [editInfor, setEditInfor] = useState(false);
    const [description, setDescription] = useState<any>({});
    const [user, setUser] = useState({ role: null, username: null });

    useEffect(() => {
        if (getItemSession() !== 'undefined')
            setUser(JSON.parse(getItemSession()))
        axios.post("/api/DB/CRUDintroHome", { "action": action.GETDATA, "data": { "type": "young" } })
            .then((result => {
                if (result.status === 200)
                    console.log("young introduct", result.data)
                setDescription(result.data ? result.data : { "introduct": '' })
            }))
    }, [])

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };
    const openCloseQuill = (option) => {
        setEditInfor(option);
    };
    const loadData = (data) => {
        setDescription(data);
    };



    return (
        <div className='container vh-100'>
            {/* Sidebar */}
            <div
                style={{
                    ...styles.sidebar,
                    paddingTop: '5%',
                    position: 'fixed',
                    transform: isSidebarOpen ? 'translateX(0)' : 'translateX(-100%)',
                }}
            >
                <button onClick={toggleSidebar} style={{ ...styles.closeButton, position: 'absolute' }}>
                    &times;
                </button>
                <div style={styles.sidebarContent}>
                    <ul style={styles.menuList}>
                        <li>Dashboard</li>
                        <li>Profile</li>
                        <li>Settings</li>
                        <li>Logout</li>
                    </ul>
                </div>
            </div>

            {/* Toggle Button */}
            {!isSidebarOpen && (
                <button onClick={toggleSidebar} style={{ ...styles.openButton, position: 'fixed' }}>
                    ☰
                </button>
            )}

            {/* Main Content */}
            <div style={styles.mainContent}>
                {user.role === 0 || user.role === 1 && (<Image style={{ position: 'fixed', top: '12%', right: 0 }} src={"/pen_icon_edit.png"} alt='icon pen' width={30} height={30} onClick={() => setEditInfor(true)} />)}
                {
                    editInfor ?
                        (
                            <Quill_editor data={description} openCloseQuill={openCloseQuill} loadData={loadData} type={"young"} />
                        )
                        :
                        (
                            <div id='innerHTML' dangerouslySetInnerHTML={{ __html: description ? description.introduct : '' }}></div>
                        )
                }
            </div>
        </div>
    );
};

// CSS Styles for components
const styles = {
    sidebar: {
        left: 0,
        top: '10%',
        width: '200px',
        height: '100%',
        backgroundColor: '#333',
        color: 'white',
        padding: '20px',
        boxShadow: '2px 0 5px rgba(0, 0, 0, 0.5)',
        transition: 'transform 0.3s ease-in-out',
        zIndex: 1000,
    },
    sidebarContent: {
        marginTop: '20px',
    },
    menuList: {
        listStyle: 'none',
        padding: 0,
        margin: 0,
    },
    openButton: {

        left: '10px',
        top: '100px',
        fontSize: '24px',
        backgroundColor: '#007bff',
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        padding: '10px',
        cursor: 'pointer',
        zIndex: 1100,
    },
    closeButton: {

        top: '100px',
        right: '10px',
        fontSize: '24px',
        backgroundColor: 'transparent',
        color: 'white',
        border: 'none',
        cursor: 'pointer',
    },
    mainContent: {
        marginLeft: '50px',
        padding: '20px',
        flexGrow: 1,
        transition: 'margin-left 0.3s ease-in-out',
        paddingTop: '100px'
    },
};

