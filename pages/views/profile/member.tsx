import { appDispatch, rootState } from '@/pages/api/redux/store';
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
// import excell_export_members from '../Function/excell_export_members';
import Image from 'next/image';
import getDrivePath from '../Function/getDrivePath';
import axios from 'axios';
import actionDB from '@/pages/api/DB/actionDB';
// import XLSX from 'xlsx'
import { updateMember as updateMembers } from '@/pages/api/redux/youngDataSlide';

const statusMap: Record<string, string> = {
    single: "Độc thân",
    married: "Có gia đình",
    crush: "Có người yêu",
    abandon: "Bị Crush bỏ",
};


export default function member() {
    const { member, infor } = useSelector((state: rootState) => state.youngData)
    const [updateMember, setUpdateMember] = useState(null)
    const [searchData, setSearchData] = useState("")
    const [showInfor, setShowInfor] = useState(false)
    const [inforMember, setinforMember] = useState(null)

    const dispatch = useDispatch<appDispatch>()

    useEffect(() => {
        setUpdateMember(member)
        // console.log(member)
    }, [member])

    useEffect(() => {
        if (searchData === "")
            setUpdateMember(member)
    }, [searchData === ""])

    const changeRoleMember = (user_token, role) => {

        setUpdateMember((prevMember) => {
            const newMember = [...prevMember];
            const index = newMember.findIndex((value) => value.user_token === user_token)
            if (index !== -1)
                newMember[index] = { ...newMember[index], role: Number(role) };
            return newMember
        })
    }

    const lockAccount = (user_token, action) => {


        setUpdateMember((prevMember) => {
            const newMember = [...prevMember];
            const index = newMember.findIndex((value) => value.user_token === user_token)
            if (index !== -1)
                newMember[index] = { ...newMember[index], is_active: action };
            // console.log(newMember)
            return newMember
        })

    }

    const export_excell = async () => {
        let XLSX: typeof import('xlsx') | undefined = undefined;

        if (typeof window !== 'undefined') {
            import('xlsx').then((mod) => {
                XLSX = mod;
            });

            if (!XLSX) XLSX = await import('xlsx');

            const array_excell_member: any[][] = []
            const array_member: any[] = [...member]
            array_excell_member.push(['Họ Tên', 'Chức vụ', 'Ngày sinh', 'SĐT', 'Công việc', 'Địa chỉ'])
            Array.from(array_member).map((value) => {
                array_excell_member.push([value.infor?.name, value?.role === 1 ? 'Trưởng nhóm' : value?.role === 2 ? 'Phó nhóm' : 'Thành viên',
                value.infor?.birth_day, value.infor?.number_phone, value.infor?.job, value.infor?.address])
            })
            const workbook = XLSX.utils.book_new();
            // console.log(array_excell_member)
            const workSheet = XLSX.utils.aoa_to_sheet(array_excell_member)
            XLSX.utils.book_append_sheet(workbook, workSheet, 'Thông tin')
            const workbookBlob = new Blob([XLSX.write(workbook, { bookType: 'xlsx', type: 'array' })], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

            // const array_member: any[] = member
            // const workbookBlob = await excell_export_members(array_member)
            const url = URL.createObjectURL(workbookBlob)
            const link = document.createElement('a')
            link.href = url
            link.download = 'Thông tin thành viên.xlsx'
            document.body.appendChild(link)
            link.click();
            document.body.removeChild(link)
        }
        else {
            alert("Bạn không chạy trên máy tính windows")
        }
    }

    const handleSearch = () => {
        if (searchData !== "")
            setUpdateMember((preMember) => {
                const newMember = [...preMember];
                const data = newMember.filter((value) => value.infor?.name.toLowerCase().includes(searchData.toLowerCase()))
                // console.log(newMember, searchData, data)
                if (data.length > 0)
                    return data
                else
                    return newMember
            })
        else
            setUpdateMember(member)
    }

    async function handleSaveChangeMember() {
        const checkLeaderGroup = updateMember.filter((value) => value.role === 1)
        const checkDeputyGroup = updateMember.filter((value) => value.role === 2)
        try {


            if (checkLeaderGroup.length > 1) {
                alert("Không thể nhiều hơn 1 trưởng nhóm nha!!!!")
                setUpdateMember(member)
                return;
            }
            if (checkLeaderGroup.length === 0) {
                alert("Bạn chỉnh sửa thiếu trưởng nhóm rùi!!!!")
                setUpdateMember(member)
                return;
            }
            // console.log("account leader", updateMember.filter((value) => value.role === 1 && value.is_active === false))
            if (checkLeaderGroup.length === 1 && updateMember.filter((value) => value.role === 1 && value.is_active === false).length === 1) {
                alert("Bạn đang khóa tài khoản trưởng nhóm!!!!")
                setUpdateMember(member)
                return;
            }
            if (checkDeputyGroup.length > 5) {
                alert("Không thể nhiều hơn 5 phó nhóm nha!!!!")
                setUpdateMember(member)
                return;
            }
            if (checkDeputyGroup.length < 5) {
                const agreeDeputy = confirm(`Số lượng phó nhóm hiện tại là: ${checkDeputyGroup.length}/5 \nBạn có chắc cập nhật số lượng hiện tại`)
                if (!agreeDeputy) {
                    setUpdateMember(member)
                    return
                }
            }

            const array_data_role = [];
            updateMember.map((value) => {
                array_data_role.push({ "user_token": value.user_token, "role": value.role, "active": value.is_active })
            })
            if (array_data_role.length > 0) {
                const result = await axios.post("/api/DB/CRUDaccountRole", { "action": actionDB.UPDATEMANY, "data": array_data_role })
                if (result.status === 200 && result.data) {
                    // console.log(result.data)

                    setUpdateMember((pre) => {
                        const newMember = [...pre];
                        result.data.map(value => {
                            const index = newMember.findIndex((user) => { user.user_token === value.user_token })
                            if (index !== -1)
                                newMember[index] = { ...newMember[index], role: value.role };
                        })
                        return newMember
                    })
                    // dispatch(updateMembers({ newMember }))
                    // console.log(newMember)
                    alert("Cập nhật thành công")
                }
            }
        } catch (error) {
            console.error(error)
        }
    }

    async function deleteMember(id, name) {
        const confirmDelete = confirm(`Bạn chắc chắn muốn xóa ${name}`)
        if (confirmDelete) {
            try {
                const resultDelete = await axios.post('/api/DB/CRUDaccountRole', { "action": actionDB.DELETE, "data": { "user_token": id } })
                if (resultDelete.status === 200) {
                    const afterDeleteMember = updateMember.filter(data => data.user_token !== id)
                    dispatch(updateMembers(afterDeleteMember))
                    alert("Đã xóa thành công thành viên: " + name)
                }
                else {
                    alert("Xóa không thành công")
                }
            } catch (error) {
                console.log(error)
            }
        }
    }

    return (
        <div className="container ">
            <div className='text-center mb-4 '>
                {/* <h2 className=" text-uppercase text-bg-info text-danger ">Thành viên </h2> */}
                <div className="position-relative w-100">
                    <input
                        type="text"
                        placeholder="Tên thành viên"
                        className="form-control"
                        value={searchData}
                        onChange={(e) => setSearchData(e.target.value)}
                    />
                    <div className="position-absolute end-0" style={{ top: 0, marginTop: 5, zIndex: 1, backgroundColor: 'var(--bs-body-bg)' }} onClick={handleSearch}>
                        <Image
                            unoptimized
                            src="https://cdn-icons-png.flaticon.com/128/18905/18905906.png"
                            width={30}
                            height={30}
                            alt="icon search"
                        />
                    </div>
                </div>
                {
                    infor?.role === 0 && (
                        <div >
                            <button className='btn btn-success m-2' onClick={handleSaveChangeMember}>Lưu thay đổi</button>
                            <button className='btn btn-danger m-2' onClick={() => setUpdateMember(member)}>Hủy thay đổi</button>
                            <button className='btn btn-primary m-2' onClick={() => export_excell()}>Xuất file excell</button>
                        </div>
                    )
                }
            </div>


            <div className={`modal fade w-100 ${showInfor ? "show d-block" : "d-none"}`} tabIndex={-1} >
                <div className="modal-dialog">
                    <div className="modal-content w-100">
                        <div className="modal-header text-center">
                            <h5>Giới thiệu bản thân {inforMember?.infor?.name}</h5>
                            <button type="button" className="btn-close" onClick={() => setShowInfor(false)}></button>
                        </div>
                        <div className="modal-body ">
                            <p style={{ color: "#555", lineHeight: "1.6" }} dangerouslySetInnerHTML={{ __html: inforMember?.infor?.self_introduc ? inforMember?.infor?.self_introduc.replace(/\n/g, "<br>") : '' }}></p>
                        </div>
                        {/* <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" onClick={() => setShowInfor(false)}>Đóng</button>
                        </div> */}
                    </div>
                </div>
            </div>




            <div className="row">
                {updateMember?.map((member, index) => (
                    <div key={index} className="col-lg-4 col-md-6 col-sm-12 mb-4">
                        <div className={`card shadow-sm h-100 ${member.is_active === true ? "bg-danger-subtle" : "bg-gradient-subtle"}`}>


                            {(infor?.role === 0 || infor?.role === 1 || infor?.role === 2) && <div className=" form-switch position-absolute top-0 end-0 p-0" >
                                <input
                                    className="form-check-input col-md-2"
                                    type="checkbox"
                                    role="switch"
                                    id="flexSwitchCheck"
                                    checked={member.is_active}
                                    onChange={(e) => lockAccount(member.user_token, !member.is_active)}
                                />
                                {/* <label className="form-check-label col-md-6" htmlFor="flexSwitchCheck">
                                        {!member.active ? "Hoạt động" : "Đã khóa"}
                                    </label> */}
                            </div>}



                            <div className='text-center' onClick={() => { setShowInfor(true), setinforMember(member) }} >






                                <Image src={(member.infor?.image_path?.image_path !== "" || member.infor?.image_path === undefined) ? getDrivePath(member.infor?.image_path?.image_path) : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQm3RFDZM21teuCMFYx_AROjt-AzUwDBROFww&s"} unoptimized width={100} height={100} alt={member.infor?.name} className='rounded-circle' />


                                <div className="card-body">
                                    <div className='w-100 justify-content-center align-content-center text-center mb-4'>
                                        <h4 className="card-title fw-bold justify-content-center align-content-center align-self-center">{member.infor?.name || "No Name"}</h4>
                                        <i>{`(${member.role === 1 ? 'Trưởng nhóm' : member.role === 2 ? 'Phó nhóm' : 'Thành viên'})`}</i>
                                    </div>
                                    <div className='align-content-lg-start'>
                                        <p className="card-text"><strong>Ngày sinh:</strong> {member.infor?.birth_day || "N/A"}</p>
                                        <p className="card-text"><strong>Công việc:</strong> {member.infor?.job || "N/A"}</p>
                                        <p className="card-text"><strong>SĐT:</strong> {member.infor?.number_phone || "N/A"}</p>
                                        <p className="card-text"><strong>Tình trạng:</strong> {statusMap[member.infor?.situation] || "N/A"}</p>
                                        <p className="card-text"><strong>Địa chỉ:</strong> {member.infor?.address || "N/A"}</p>
                                    </div>
                                </div>

                            </div>
                            {(infor?.role === 0 || infor?.role === 1 || infor?.role === 2) && (
                                <div>
                                    {
                                        infor?.role === 0 &&
                                        <select
                                            className="form-select bg-success col-8"
                                            id="situation"
                                            name="situation"
                                            value={member?.role}
                                            onChange={(e) => changeRoleMember(member.user_token, e.target.value)}
                                            required
                                        >
                                            <option value="1">Trưởng nhóm</option>
                                            <option value="2">Phó nhóm</option>
                                            <option value="3">Thành viên</option>
                                        </select>
                                    }
                                    {/* <div className='col-md-12 sp d-flex align-content-center justify-content-start'> */}
                                    <button onClick={() => deleteMember(member.user_token, member?.infor?.name)} className='btn btn-danger w-100'>Xóa thành viên</button>
                                    {/* <button className={`btn  col-md-5 mx-2 ${member.active !== true ? "btn-light" : "btn-dark"}`} onClick={() => lockAccount(member.user_token, member.active)}>{member.active === true ? "Khóa tài khoản" : "Mở tài khoản"}</button> */}

                                    {/* </div> */}

                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div >
    );
}
