import React, { useEffect, useRef, useState } from 'react'
import Image from 'next/image';
import axios from 'axios';
import addFatherModal from '../modals/addFatherModal';
import AddFatherModal from '../modals/addFatherModal';
import actionDB from "../../api/DB/actionDB"
import Quill_editor from '../components/quill_editor';
import 'react-quill/dist/quill.snow.css';
import { useLoading } from "../loadingPages/loadingContext"
import { useDispatch, useSelector } from 'react-redux';
import { appDispatch, rootState } from '../../api/redux/store';
import { fetchHomeData, handleHomeFatherIntro_Delete } from '../../api/redux/homeDataSlice';
import getDrivePath, { deleteDriveImage } from '../Function/getDrivePath';
import getItemSession from '../Function/sessionFunction';




export default function home() {

    const { setIsLoading } = useLoading();
    const dispatch = useDispatch<appDispatch>();
    const { dataDescription, dataFatherIntro, dataImagePath, loading, error } = useSelector((state: rootState) => state.homedata)


    const [modalAddFarther, setmodalAddFarther] = useState(false)
    const [description, setDescription] = useState<any>(null)
    const [inforlist, setInforList] = useState([])
    const [fatherInfor, setFatherInfor] = useState({})
    const [editInfor, setEditInfor] = useState(false)
    const [user, setUser] = useState({ "role": 1000, "username": "anonimous" });

    useEffect(() => {
        if (getItemSession() !== 'undefined') {
            const user = JSON.parse(getItemSession());
            setUser(user)
        }
    }, [])


    useEffect(() => {
        if (dataDescription) {
            console.log("data redux change datadescription")
            setDescription(dataDescription)
        }
    }, [dataDescription])


    useEffect(() => {
        if (dataFatherIntro) {
            console.log("data redux change dataFatherIntro")
            setInforList(dataFatherIntro)
        }
    }, [dataFatherIntro])


    function formatTime(time: string) {
        try {
            if (time) {
                const dateTime = time.split("T")[0]
                return `${dateTime.split("-")[2]}/${dateTime.split("-")[1]}/${dateTime.split("-")[0]}`
            }
            else
                return "Không xác định"
        } catch (error) {
            console.log("error when format time", error)
        }
    }



    // const { setIsLoading } = useLoading();

    // useEffect(() => {
    // const getIntroSQL = "delete FROM intro_home "
    // axios.post('/api/DB/CRUDintroHome', { "action": actionDB.NATIVESQL, "data": { "sql": getIntroSQL } })

    //     loadDataFatherInforList();
    //     loadDataIntroduct();

    // }, [])

    const loadData = (data) => {

        setDescription(data)
    }

    const loadDataIntroduct = async () => {
        try {
            // setIsLoading(true)
            // const getIntroSQL = "SELECT * FROM intro_home where type = 'introduct'  LIMIT 1"
            await axios.post('/api/DB/CRUDintroHome', { "action": actionDB.GETDATA, "data": { "type": "introduct" } })
                .then((result) => {
                    if (result.status === 200)
                        console.log("introduct", result.data.introduct)
                    setDescription(result.data ? result.data : { "introduct": '' })
                })

        } catch (error) {
            console.log(error)
        }
        finally {
            // setIsLoading(false)
        }

    }

    const loadDataFatherInforList = () => {
        axios.post('/api/DB/CRUDfatherInfor', { "action": actionDB.GETLISTDATA })
            .then((result) => {
                if (result.status === 200) {
                    const data = result.data;
                    const fatherinfor = []
                    Array.from(data).map((value: any, index) => {

                        fatherinfor.push({
                            "image_path": value.image_path.image_path,
                            "name": value.name,
                            "office": value.office,
                            "time_start": new Date(value.time_start).toISOString().split('T')[0],
                            "introduction": value.introduction,
                            "id": value.id
                        })
                    })
                    setInforList(fatherinfor);
                    setFatherInfor({})
                }
            })
    }

    const openCloseAddFather = (option) => {
        setmodalAddFarther(option)
        setFatherInfor({})
    }
    const openCloseQuill = (option) => {
        setEditInfor(option);
        setFatherInfor({})
    }



    return (
        <div style={styles.pageContainer}>
            <div style={styles.mainContainer}>

                {user.role == 0 && (<Image style={{ position: 'fixed', top: 0, right: 0 }} src={"/pen_icon_edit.png"} alt='icon pen' width={30} height={30} onClick={() => setEditInfor(true)} />)}
                {
                    editInfor ?
                        (
                            <Quill_editor data={description} openCloseQuill={openCloseQuill} loadData={loadData} type={"introduct"} />
                        )
                        :
                        (
                            <div id='innerHTML' dangerouslySetInnerHTML={{ __html: description ? description.introduct : '' }}></div>
                        )
                }

            </div>

            {/* main content */}
            <div style={styles.gridContainer} >
                {inforlist.map((item, index) =>

                (
                    <div key={index}>
                        <div className="card mx-auto shadow" style={{ maxWidth: 450 }}>

                            <Image
                                unoptimized
                                src={getDrivePath(item.image_path.image_path)}
                                alt={"image " + index}
                                width={300}
                                height={200}
                                style={styles.gridImage}
                                className="card-img-top"
                            />
                            <div className="card-body text-start bg-primary-subtle">
                                <h4 className='card-text text-center'><strong>{item.name}</strong></h4>
                                <p></p>
                                <h5 className='card-text'>Chức vụ: {item.office}</h5>
                                <h5 className='card-text'>Thời gian bắt đầu: {formatTime(item.time_start)}</h5>
                                <h5 className='card-text'>Giới thiệu chung:
                                    <pre style={{ whiteSpace: "pre-wrap", wordWrap: "break-word", width: "100%", height: 100, margin: 0 }}>
                                        {item.introduction}
                                    </pre>
                                </h5>

                                {user.role == 0 && (
                                    <div className='row text-center'>
                                        {/* update data infor  */}
                                        <div style={{ width: '100%', backgroundColor: 'rgb(33 179 110)' }} onClick={() => {
                                            setFatherInfor(item)
                                            setmodalAddFarther(true)
                                        }}>
                                            <span>Update</span>
                                        </div>

                                        {/* delete father infor */}
                                        <div style={{ width: '100%', backgroundColor: '#b33421', marginTop: 5 }} onClick={async () => {
                                            const isConfirmed = confirm("Are you sure you want to delete this item?");

                                            if (isConfirmed) {
                                                setIsLoading(true)
                                                await axios.post('/api/DB/CRUDfatherInfor', { "action": actionDB.DELETE, "data": { "id": item.id } });
                                                deleteDriveImage(item.image_path).then((result) => {
                                                    alert(result)
                                                })
                                                alert("data deleted!")

                                                await dispatch(
                                                    handleHomeFatherIntro_Delete(item)
                                                );
                                                setIsLoading(false)
                                                // loadDataFatherInforList()
                                            } else {
                                                console.log("Delete canceled");
                                            }
                                        }}>
                                            <span>Delete</span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )
                )}
                {user.role == 0 && (
                    <div className='text-center'>
                        <button className='btn btn-success text-center'
                            onClick={() => { setmodalAddFarther(true); setFatherInfor({}) }}>
                            +
                        </button>
                    </div>
                )}
            </div>

            {modalAddFarther && (<div style={{ position: 'fixed', justifyContent: 'center', alignContent: 'center' }}><AddFatherModal controlModal={openCloseAddFather} loadList={() => { }} fatherIntro={fatherInfor} /></div>)}
        </div>
    )
};

// CSS-in-JS styles
const styles = {
    mainContainer: {
        padding: "5px",
        minHeight: "100px",
        margin: '0 auto',
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(272deg, #eee5ee8c, #82fffa69, #dadbdb33)",
        color: "#050202",

    },
    pageContainer: {

        minHeight: "100vh",
        backgroundColor: "white",
        // padding: "10px",
        borderRadius: "10px",
        boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)",
        with: '100%',
    },
    mainImage: {
        borderRadius: '10px',
        width: '100%',
        height: '400px',
    },
    mainDescription: {
        // marginTop: '20px',
        flex: 1,
        fontSize: '1.2em',
        color: '#555',
        with: '100%',
        height: '500px'
    },
    gridContainer: {
        // textAlign: 'center',

        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '20px',
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: '20px',
        background: "linear-gradient(152deg, #5f88fff5, #d509c67d, #df1c1ccc)",
    },
    gridItem: {
        textAlign: 'center',
        padding: '5px',
        backgroundColor: '#f9f9f9',
        borderRadius: '10px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    },
    gridImage: {
        borderRadius: '8px',
        width: '100%',
        height: 'auto',
    },
    gridDescription: {
        marginTop: '5px',
        fontSize: '1em',
        color: '#444',
    },
};

