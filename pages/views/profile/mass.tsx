import { appDispatch, rootState } from '@/pages/api/redux/store';
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import actionDB from '@/pages/api/DB/actionDB';
import { fetchYoungMember, updateMember } from '@/pages/api/redux/youngDataSlide';
import { set } from 'firebase/database';
import sendMessageToUser from '../Function/sendMessageFB';
import { info } from 'console';
import sendMessageToNumberPhone from '../../api/controller/sendMessageToNumberPhone';

export default function mass() {

    const { member } = useSelector((state: rootState) => state.youngData)
    const dispatch = useDispatch<appDispatch>();

    const [memberMass, setMemberMass] = useState(member);

    const [text1, setText1] = useState("");
    const [text2, setText2] = useState("");

    const [MemberRead, setMemberRead] = useState<{ id: string, name: string, read: boolean }[]>([])
    const [MemberNotRead, setMemberNotRead] = useState<{ id: string, name: string, read: boolean }[]>([])

    useEffect(() => {
        setMemberMass(() => {
            return member.filter(value => value.user_token.toLowerCase() !== 'admin')
        })
        const arrayMemberCanRead = []
        const arrayMemberNotRead = []
        member.map(value => {
            if (value?.infor?.can_read === true) {
                arrayMemberCanRead.push({ id: value?.user_token, name: value?.infor.name, read: value.infor.reading })
            }
            else {
                arrayMemberNotRead.push({ id: value?.user_token, name: value?.infor.name, read: value.infor.reading })
            }
        })
        setMemberRead(arrayMemberCanRead)
        setMemberNotRead(arrayMemberNotRead)
    }, [member])




    async function handleSendMessage() {
        if (text1 !== "" && text2 !== "") {

            let data_coppy_member = [...MemberRead]
            const getUniqueRandomMember = new Set()
            // const indexRandomMember: string[] = []

            while (getUniqueRandomMember.size < 3) {
                const randomIndex = Math.floor(Math.random() * data_coppy_member.length);
                getUniqueRandomMember.add(data_coppy_member[randomIndex])
                // indexRandomMember.push(randomIndex.toString())
            }
            const arraySet = Array.from(getUniqueRandomMember) as any[]
            const accept = confirm(`1,${arraySet[0]?.name} \n2,${arraySet[1]?.name}\nLNTH,${arraySet[2]?.name}`)
            // indexRandomMember.forEach(value => {
            //     data_coppy_member[parseInt(value)].infor.reading = true
            // })
            // await dispatch(updateMember({ data_coppy_member }))


            if (accept) {

                try {
                    const accessToken = await axios.post('/api/DB/CRUDaccountRole',
                        {
                            "action": actionDB.NATIVESQL,
                            "data": {
                                "sql": `select page_access_token from token`
                            }
                        })
                    const acess_token = accessToken.data[0].page_access_token;
                    // const read1 = await sendMessageToUser(arraySet[0]?.user_token, `1:\n ${text1}`, acess_token)
                    // const read2 = await sendMessageToUser(arraySet[1]?.user_token, `2:\n ${text2}`, acess_token)
                    // const read3 = await sendMessageToUser(arraySet[2]?.user_token, `LNTH`, acess_token)
                    const read3 = await sendMessageToUser('122151162194399846', `LNTH`, acess_token)
                    // dispatch(fetchYoungMember)
                    let result = null
                    // if (read1.status === 200 && read2.status === 200 && read3.status === 200) {
                    if (read3?.status === 200) {
                        result = await axios.post('/api/DB/CRUDinfor', {
                            "action": actionDB.UPDATEMANY,
                            "data": {
                                "data": arraySet,
                                "actionUpdateMany": "updateReading"
                            }
                        })
                    }
                    if (result?.status === 200)
                        alert("Tin nhắn đã gửi đi")
                    else
                        alert("Lỗi khi gửi tin nhắn")

                } catch (error) {
                    alert("không thể gửi tin nhắn")
                    console.error(error)
                }
            }
        }
        else
            alert("Điền thông tin bài đọc để gửi cho thành viên")
    }


    async function handleSubmit(e) {
        e.preventDefault();
        const unReadingMember = MemberRead.filter(value => value?.read === false && value?.id !== 'admin')
        if (unReadingMember.length >= 3) {
            handleSendMessage()
        }
        else {
            const confirm_reset = confirm("reset")
            if (confirm_reset) {
                const result = await axios.post('/api/DB/CRUDaccountRole', { "action": actionDB.NATIVESQL, "data": { "sql": "update infor set reading=false where user_token_infor!='admin' and can_read==true" } })

                if (result.data) {
                    await dispatch(fetchYoungMember())
                    alert("reset success")
                }

            }
        }
    }

    const changeMemberReading = (action: 'add' | 'delete', object) => {
        switch (action) {
            case 'add':
                setMemberRead((pre) => {
                    const array = [...pre]
                    array.push(object)
                    return array
                })
                setMemberNotRead((value) => {
                    const array = [...value]
                    return array.filter(member => member.id !== object.id)
                })
                break;
            case 'delete':
                setMemberNotRead((pre) => {
                    const array = [...pre]
                    array.push(object)
                    return array
                })
                setMemberRead((value) => {
                    const array = [...value]
                    return array.filter(member => member.id !== object.id)
                })
                break;
            default:
                break;
        }

    }


    const saveChangeMemberReading = async () => {
        let listIdNotRead: string = "("
        MemberNotRead.map(value => {
            listIdNotRead += "'" + value.id + "'"
        })
        listIdNotRead += ")"
        let sql = '';
        if (listIdNotRead.length > 2)
            sql = "update infor set reading=false,can_read=false where user_token_infor in " + listIdNotRead
        const resultUpdateInfor = await axios.post("/api/DB/CRUDinfor", {
            "action": actionDB.UPDATEMANY, "data": {
                "actionUpdateMany": "editReadingMember",
                "sql": sql,
                "data": MemberRead
            }
        })
        if (resultUpdateInfor.status == 200) {
            MemberNotRead.forEach(value => {
                const index = memberMass.findIndex(mem => mem.user_token === value.id)
                if (index !== -1) {
                    memberMass[index] = {
                        ...memberMass[index], infor: {
                            ...memberMass[index].infor, reading: false, can_read: false
                        }
                    }
                }
            })
            MemberRead.forEach(value => {
                const index = memberMass.findIndex(mem => mem.user_token === value.id)
                if (index !== -1) {
                    memberMass[index] = {
                        ...memberMass[index], infor: {
                            ...memberMass[index].infor, reading: value.read, can_read: true
                        }
                    }
                }
            })
            console.log("MemberRead", memberMass)
            dispatch(updateMember(memberMass))
            // await dispatch(fetchYoungMember())
            alert('Lưu thay đổi thành công')
        }

    }

    return (
        <div className="container ">





            <div className="row ">

                {/* Left Section */}
                <div className="p-3 border-4 rounded-4 shadow-lg col-lg-6 col-md-6 col-sm-12">
                    <h4 className="text-primary text-center fw-bold">left </h4>
                    <div style={{ maxHeight: 500 }} className=" overflow-y-scroll">
                        {MemberRead.map((item, key) => (
                            <div key={key} className="d-flex justify-content-between align-items-center border-bottom ">
                                <span className="fw-bold w-75">{item.name}</span>
                                <input type='checkbox' checked={item.read} onChange={() => {
                                    setMemberRead((pre) => {
                                        let memberReadChange = [...pre]
                                        const index = memberReadChange.findIndex(value => value.id === item.id)
                                        if (index !== -1) {
                                            memberReadChange[index] = { ...memberReadChange[index], read: !item.read }
                                        }
                                        return memberReadChange
                                    })
                                }} />
                                <i onClick={() => changeMemberReading("delete", item)} >-</i>
                            </div>
                        ))}
                    </div>
                </div>
                {/* Right Section */}
                <div className=" p-3 border-5 rounded-4 shadow-sm col-lg-6 col-md-6 col-sm-12">
                    <h4 className="text-success text-center fw-bold">right</h4>
                    <div style={{ maxHeight: 500 }} className=" overflow-y-scroll">
                        {MemberNotRead.map((item, key) => (
                            <div key={key} className="d-flex justify-content-between align-items-center border-bottom p-2">
                                <span className="fw-bold">{item.name}</span>
                                <i onClick={() => changeMemberReading("add", item)}>+</i>
                            </div>
                        ))}
                    </div>
                </div>
                <div className='d-flex justify-content-end align-content-center mt-3'>
                    <button className='bg-warning border-0' onClick={saveChangeMemberReading}>Lưu thay đổi</button>
                    {/* axios.post('/api/controller/sendMessageToNumberPhone', { "recivedNumberPhone": '+84327580849', "message": "xin chào" }) */}
                </div>

            </div>




            <div className="border-5  shadow-lg p-3 mt-4" style={{ width: "100%" }}>
                <h4 className="text-center text-primary mb-3">TL</h4>

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