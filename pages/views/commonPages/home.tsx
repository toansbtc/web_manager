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
    const [formData, setFormData] = useState({ name: '', numberPhone: '', feedback: '', title: '' })

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
        if (dataFatherIntro) {
            console.log("data redux change dataFatherIntro")
            setInforList(dataFatherIntro)
        }
    }, [dataDescription, dataFatherIntro])



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
                        // console.log("introduct", result.data.introduct)
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

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    }

    const handleSendFeedback = async (e) => {
        e.preventDefault()
        setIsLoading(true)
        try {
            const regexNmberPhone = /^(03|07|08|09|01[2-9])\d{8,9}$/
            if (formData.feedback !== '' && formData.name !== '' && formData.title !== '' && formData.numberPhone !== '')
                if (formData.numberPhone.match(regexNmberPhone)) {

                    if (formData.feedback.length > 50) {
                        alert("Ý kiến đóng góp ít nhất 50 ký tự!")
                        return
                    }

                    // const resultFeedback = await axios.post('/api/DB/MongoDB/CRUDmongoDB', { "action": actionDB.GETDATA })
                    // console.log(resultFeedback.data)
                    const resultFeedback = await axios.post('/api/DB/MongoDB/CRUDmongoDB',
                        {
                            "action": actionDB.CREATE,
                            "data": formData
                        })
                    if (resultFeedback.status === 200) {
                        alert("Đã gửi ý kiến của bạn thành công!")
                        setFormData({
                            ...formData,
                            feedback: '',
                            title: ''
                        })
                    }
                    else {
                        alert("Hòm thư đã đầy xin vui lòng gửi ý kiến lại sau!")
                    }
                }
                else
                    alert("Số điện thoại không đúng định dạng!!")
        } catch (error) {
            console.error(error)
        }
        finally {
            setIsLoading(false)
        }
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




            <footer style={{ backgroundColor: 'rgb(85 99 133 / 88%)' }} className="text-light py-5">
                <form onSubmit={handleSendFeedback} className="container-lg">
                    <div className="row">

                        {/* Left Column - Google Map */}
                        <div className="col-md-6 ">
                            <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d7834.569468380444!2d106.74253537617194!3d10.941850921179594!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3174d9e99a667a11%3A0x1bb8144e920377c7!2zTmjDoCBUaOG7nSBHacOhbyB44bupIEFuIFBow7o!5e0!3m2!1svi!2s!4v1741401938501!5m2!1svi!2s"
                                width="100%" height="100%"
                                style={{ border: 0 }}
                                allowFullScreen loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade">
                            </iframe>
                        </div>


                        <div className="col-md-6 text-center mt-3 mb-1 ">

                            <div className="needs-validation border border-light rounded p-2">
                                <div className='w-100 text-center text-info '><h4>Ý kiến đóng góp</h4></div>
                                <div className="row">
                                    <div className="col">
                                        <input
                                            type="text"
                                            className="form-control mb-2"
                                            placeholder="Họ tên"
                                            name='name'
                                            value={formData.name}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                    <div className="col">
                                        <input
                                            type="tel"
                                            className="form-control mb-2"
                                            placeholder="Điện thoại liên hệ"
                                            name="numberPhone"
                                            value={formData.numberPhone}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                </div>

                                <input
                                    type="text"
                                    className="form-control mb-2"
                                    placeholder="Tiêu đề - tóm tắt nội dung ý kiến"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleChange}
                                    required
                                />

                                <textarea
                                    className="form-control mb-2"
                                    placeholder="Ý kiến của bạn"
                                    name="feedback"
                                    value={formData.feedback}
                                    onChange={handleChange}
                                    required
                                ></textarea>

                                <button type='submit' className="btn btn-dark w-100">
                                    Gửi ý kiến
                                </button>
                            </div>
                            <div className="text-center mt-4">
                                <p className="text-light">© {new Date().getFullYear()} My Website. All rights reserved.</p>
                            </div>
                        </div>
                    </div>

                    {/* Footer Bottom */}

                </form>

            </footer>
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
        paddingBottom: '20px',
        background: "linear-gradient(152deg, #458bd5f5, #95ff5f26, #ccebe0ad, #fff8fe7d, #13d0e3bf)",
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

