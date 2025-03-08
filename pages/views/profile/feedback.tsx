import actionDB from '@/pages/api/DB/actionDB';
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import getItemSession from '../Function/sessionFunction';
import { useRouter } from 'next/router';
import returnError from '../Function/alert_FB_Login_failed';
import { setInterval } from 'timers';

export default function feedback() {
    const [feedbacks, setFeedbacks] = useState([])
    const [contentFeedback, setContentFeedback] = useState('')
    const [title, settitle] = useState('')
    const [selectionFather, setSelectionFather] = useState(0)
    const [selectionChild, setSelectionChild] = useState(0)
    const [listID, setListID] = useState([])
    const router = useRouter()

    const [maxHeight, setMaxHeight] = useState<"large" | "small">("small");






    useEffect(() => {
        if (getItemSession() !== 'undefined')
            handleLoadData();
        else
            router.push('/')

        const updateHeight = () => {
            window.innerWidth < 750 ? setMaxHeight("small") : setMaxHeight("large");
        };
        updateHeight();
        window.addEventListener("resize", updateHeight);

        return () => window.removeEventListener("resize", updateHeight);
    }, [])

    useEffect(() => {
        if (feedbacks.length > 0) {
            const data: any = [...feedbacks]
            // console.log(data[].feedback[0])
            setContentFeedback(data[0].feedback[0].feedback)
            settitle(data[0].feedback[0].title)
        }
        else {
            setContentFeedback("")
            settitle("")
        }
    }, [feedbacks])

    const handleLoadData = async () => {
        const resultFeedback = await axios.post('/api/DB/MongoDB/CRUDmongoDB', { "action": actionDB.GETDATA })
        console.log(resultFeedback.data)
        if (resultFeedback.status === 200) {
            setFeedbacks(resultFeedback.data)
        }
    }
    function hadReadFeedback(e, id) {

        if (e.target.checked) {
            setListID((pre) => {
                const list = [...pre]
                list.push(id)
                return list
            })
        }
        else
            setListID((pre) => {
                return pre.filter((value) => value !== id)
            })

    }

    const deleteAll = async () => {
        try {
            const confirmDeleteAll = confirm("Bạn có chắc chắn muốn xóa hết tất cả ý kiến?")
            if (confirmDeleteAll) {
                const list: string[] = []
                feedbacks.map(feedback => {
                    feedback.feedback.map(infor => {
                        list.push(infor.id)
                    })
                })
                console.log(list)
                const status = await deleteDataFeedback(list)
                if (status === 200)
                    alert("Đã xóa hết ý kiến đóng góp!")
                setFeedbacks([])
            }
        } catch (error) {
            console.error(error)
        }

    }
    const deleteChoose = async () => {
        const confirmDeleteChoose = confirm("Bạn có chắc chắn muốn xóa ý kiến đã chọn?")
        if (confirmDeleteChoose) {
            const status = await deleteDataFeedback(listID)
            if (status === 200) {
                setFeedbacks(prevFeedbacks =>
                    prevFeedbacks.map(feedback => ({
                        ...feedback,
                        feedback: feedback.feedback.filter(infor => !listID.includes(infor.id))
                    })).filter(feedback => feedback.feedback.length > 0)
                );
                alert("Xóa thành công ý kiến đã chọn!!!")
            }
        }
    }

    const deleteDataFeedback = async (list) => {
        const resultFeedback = await axios.post('/api/DB/MongoDB/CRUDmongoDB', { "action": actionDB.DELETE, "data": { "listData": list } })
        return resultFeedback.status
    }

    return (
        <div className="container-lg w-100 vh-100 d-flex flex-column align-items-center py-4">
            <div className="row w-100">

                {/* Feedback List */}
                <div className="col-md-6 col-lg-6 col-sm-12">
                    <h4 className="text-center mb-3">Danh sách ý kiến - Đóng góp</h4>
                    <div className='col d-flex justify-content-between align-content-between pb-1'>
                        <button style={{ backgroundColor: 'red', color: 'white' }} className='btn' onClick={deleteAll}>Xóa tất cả ý kiến</button>
                        <button style={{ backgroundColor: '#c95100', color: 'white' }} className='btn' onClick={deleteChoose}>Xóa ý kiến đã chọn</button>

                    </div>
                    <div className="list-group overflow-y-scroll" style={maxHeight === "small" ? { maxHeight: "calc(55vh)" } : { height: '90%' }}>
                        {feedbacks.map((feedback, key) => (
                            <div key={key} className=" border-info border-2  border rounded mb-2 shadow-lg ">
                                {feedback.feedback.map((infor, index) => (
                                    <div style={{ backgroundColor: (selectionChild === index && selectionFather === key) ? '#c1ed8ed4' : 'white' }} className='position-relative border-1 border-dark' key={index}>
                                        <div

                                            className="p-2 rounded border  cursor-pointer hover-effect row"
                                            onClick={() => { setContentFeedback(infor.feedback); settitle(infor.title), setSelectionChild(index), setSelectionFather(key) }}
                                        >
                                            {/* <span>{key}-{selectionFather}-{index}{selectionChild}</span> */}
                                            <span className="fw-semibold d-block">📌 Tiêu đề: <span className='fw-bold text-danger'>{infor.title}</span></span>
                                            <span className="text-muted">👤 {infor.userName}</span>
                                            <span>
                                                <a href={`tel:${feedback._id}`} className="text-primary text-decoration-none d-inline-block">📞 {feedback._id}</a>
                                            </span>
                                        </div>
                                        <div className='position-absolute top-0 end-0'>
                                            <input type="checkbox" name="checkReading" id="checkReading" onChange={(e) => hadReadFeedback(e, infor.id)} />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Display Selected Feedback */}
                <div className="col-md-6 col-lg-6 col-sm-12" style={maxHeight === "small" ? { marginTop: 20 } : {}}>
                    <h5 className="text-center mb-3">{title}</h5>
                    <div style={maxHeight === "small" ? { maxHeight: "calc(40vh)" } : { height: '90%' }} className="border rounded p-4 bg-light text-black shadow-sm  overflow-y-scroll">
                        {contentFeedback ? (
                            <p className="text-secondary">{contentFeedback}</p>
                        ) : (
                            <p className="text-muted text-center">Hiện không có ý kiến nào.</p>
                        )}
                    </div>
                </div>
            </div>

            {/* Extra Styling for Hover Effect */}
            <style>
                {`.hover-effect:hover {
            background-color: #c1ed8ed4;
            transform: scale(1.02);
            transition: all 0.2s ease-in-out;
            cursor: pointer;
          }`}
            </style>
        </div>
    );
}