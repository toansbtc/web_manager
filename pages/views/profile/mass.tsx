import { appDispatch, rootState } from '@/pages/api/redux/store';
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import actionDB from '@/pages/api/DB/actionDB';
import { fetchYoungMember, updateMember } from '@/pages/api/redux/youngDataSlide';
import { set } from 'firebase/database';
import sendMessageToUser from '../Function/sendMessageFB';

export default function mass() {

    const { member } = useSelector((state: rootState) => state.youngData)
    const dispatch = useDispatch<appDispatch>();

    const [memberMass, setMemberMass] = useState(member);

    const [text1, setText1] = useState("");
    const [text2, setText2] = useState("");

    useEffect(() => { setMemberMass(member) }, [member])


    async function handleSendMessage() {
        if (text1 !== "" && text2 !== "") {

            let data_coppy_member = [...memberMass]
            const getUniqueRandomMember = new Set()
            // const indexRandomMember: string[] = []

            while (getUniqueRandomMember.size < 2) {
                const randomIndex = Math.floor(Math.random() * data_coppy_member.length);
                getUniqueRandomMember.add(data_coppy_member[randomIndex])
                // indexRandomMember.push(randomIndex.toString())
            }
            const arraySet = Array.from(getUniqueRandomMember) as any[]
            const accept = confirm(`1,${arraySet[0]?.infor?.name} \n2,${arraySet[1]?.infor?.name}`)
            // indexRandomMember.forEach(value => {
            //     data_coppy_member[parseInt(value)].infor.reading = true
            // })
            // await dispatch(updateMember({ data_coppy_member }))


            if (accept) {
                const result = await axios.post('/api/DB/CRUDinfor', {
                    "action": actionDB.UPDATEMANY,
                    "data": arraySet
                })
                if (result.data) {
                    try {
                        sendMessageToUser(arraySet[0]?.user_token, `1:\n ${text1}`)
                        sendMessageToUser(arraySet[1]?.user_token, `2:\n ${text2}`)
                        // sendMessageToUser(arraySet[2]?.user_token, `LNTH`)
                        dispatch(fetchYoungMember)
                        alert("tin nhắn đã gửi đi")
                    } catch (error) {
                        alert("không thể gửi tin nhắn")
                        console.error(error)
                    }

                }
            }
        }
        else
            alert("Điền thông tin bài đọc để gửi cho thành viên")
    }


    async function handleSubmit(e) {
        e.preventDefault();
        const unReadingMember = memberMass.filter(value => value?.infor?.reading === false && value?.role !== 0)
        if (unReadingMember.length >= 3) {
            handleSendMessage()
        }
        else {
            const confirm_reset = confirm("reset")
            if (confirm_reset) {
                const result = await axios.post('/api/DB/CRUDaccountRole', { "action": actionDB.NATIVESQL, "data": { "sql": "update infor set reading=false where user_token_infor!='admin'" } })

                if (result.data) {
                    await dispatch(fetchYoungMember())
                    alert("reset success")
                }

            }
        }
    }

    return (
        <div className="container d-flex flex-column align-items-center justify-content-center h-100">
            <div className="card shadow-none p-4" style={{ width: "100%" }}>
                <h4 className="text-center text-primary mb-3">Beautiful Text Area</h4>

                {/* Textarea */}
                <form onSubmit={handleSubmit}>
                    <textarea
                        className="form-control mb-3"
                        rows={4}
                        placeholder="Bài 1"
                        required={true}
                        value={text1}
                        onChange={(e) => setText1(e.target.value)}
                    />
                    <textarea
                        className="form-control mb-3"
                        rows={4}
                        placeholder="Bài 2"
                        required={true}
                        value={text2}
                        onChange={(e) => setText2(e.target.value)}
                    />

                    <div className='w-100 d-flex justify-content-between'>
                        <button type='submit' className="btn btn-success " onClick={handleSubmit}>
                            Gửi
                        </button>
                    </div>
                </form>


            </div>
        </div>
    );
}