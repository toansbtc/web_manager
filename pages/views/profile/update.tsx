import axios from 'axios'
import React, { useEffect, useState } from 'react'
import actionDB from "@/pages/api/DB/actionDB"
import { useRouter } from 'next/router';
import getItemSession from '../Function/sessionFunction';
import Image from 'next/image';
import getDrivePath, { createDriveImage } from '../Function/getDrivePath';
import { useDispatch, useSelector } from 'react-redux';
import { rootState } from '@/pages/api/redux/store';
import { updateinfor } from '@/pages/api/redux/youngDataSlide';
import { useLoading } from '../loadingPages/loadingContext';



type infor = {
    user_token: "",
    role: -1,
    infor: {
        name: "",
        birth_day: "",
        address: "",
        job: "",
        number_phone: "",
        self_introduc: "",
        situation: "",
        image_path: {
            image_path: ""
        }
    }
}


export default function update() {

    const [imagePreview, setImagePreview] = useState(null);
    const [imageFile, setImageFile] = useState(null);
    const { setIsLoading } = useLoading();



    const { infor } = useSelector((state: rootState) => state.youngData)
    const dispath = useDispatch();


    const [formData, setFormData] = useState({
        image_path: infor?.infor?.image_path?.image_path || "",
        birth_day: infor?.infor?.birth_day || "",
        name: infor?.infor?.name || "",
        number_phone: infor?.infor?.number_phone || "",
        address: infor?.infor?.address || "",
        situation: infor?.infor?.situation || "abandon",
        job: infor?.infor?.job || "",
        self_introduc: infor?.infor?.self_introduc || "",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setImageFile(file);
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };


    async function validateForm() {


        if (formData.number_phone.length < 10 || formData.number_phone.length > 12) {

            alert('Số điện thoại không đúng định dạng\n');
            return false
        }

        else
            return true

    }

    async function handleSubmit(e) {
        e.preventDefault();

        try {
            if (validateForm()) {
                setIsLoading(true)
                let data = formData

                if (imageFile) {

                    await createDriveImage(imageFile, "Father").then((fileID) => {
                        // console.log("fileID", fileID)
                        data = { ...data, image_path: fileID }
                    })
                    console.log("data update", data)
                }

                axios.post("/api/DB/CRUDinfor", { "action": actionDB.UPDATE, "data": { "update": data, "user_token": infor.user_token } })
                    .then((result) => {

                        dispath(updateinfor(result.data))
                        alert('Cập nhật thành công!')
                    })
                    .catch((error) => {
                        console.log("error update infor account_role", error)
                    })
                setIsLoading(false)

            }


        } catch (error) {
            console.log(error)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="container p-3 border rounded shadow-sm bg-light">
            <div className='row justify-content-center align-content-center text-center mb-5'>
                <div className="mb-6 col-md-6">
                    <Image src={formData.image_path !== "" ? getDrivePath(formData.image_path) : imagePreview !== null ? imagePreview : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQm3RFDZM21teuCMFYx_AROjt-AzUwDBROFww&s"} unoptimized width={100} height={100} alt='AVATA IMAGE' className='rounded-circle' />
                    <input
                        type="file"
                        id="image"
                        name="image"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="form-control w-100"
                    />
                </div>
            </div>

            <div className="row mb-3">
                <div className="col-md-6">
                    <label htmlFor="birth_day" className="form-label">Ngày tháng năm sinh:</label>
                    <input
                        type="date"
                        className="form-control"
                        id="birth_day"
                        name="birth_day"
                        max={new Date().toISOString().split("T")[0]}
                        value={formData.birth_day}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="col-md-6">
                    <label htmlFor="name" className="form-label">Tên thành viên:</label>
                    <input
                        type="text"
                        className="form-control"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                    />
                </div>
            </div>

            <div className="row mb-3">
                <div className="col-md-6">
                    <label htmlFor="number_phone" className="form-label">SĐT đã đăng ký zalo:</label>
                    <input
                        type="number"
                        className="form-control"
                        id="number_phone"
                        name="number_phone"
                        value={formData.number_phone}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="col-md-6">
                    <label htmlFor="address" className="form-label">Địa chỉ nhà/phòng:</label>
                    <input
                        type="text"
                        className="form-control"
                        id="address"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                    />
                </div>
            </div>

            <div className="row mb-3">
                <div className="col-md-6">
                    <label htmlFor="situation" className="form-label">Mối quan hệ:</label>
                    <select
                        className="form-select"
                        id="situation"
                        name="situation"
                        value={formData.situation}
                        onChange={handleChange}
                        required
                    >
                        <option value="single">Độc thân </option>
                        <option value="crush">Có người yêu</option>
                        <option value="married">Có gia đình</option>
                        <option value="abandon">Bị Crush bỏ</option>
                    </select>
                </div>
                <div className="col-md-6">
                    <label htmlFor="job" className="form-label">Công việc hiện tại:</label>
                    <input
                        type="text"
                        className="form-control"
                        id="job"
                        name="job"
                        value={formData.job}
                        onChange={handleChange}
                        required
                    />
                </div>
            </div>

            <div className="row mb-3">

                <div className="col-md-12">
                    <label htmlFor="self_introduc" className="form-label">Vài triệu từ giới thiệu bản thân:</label>
                    <textarea
                        placeholder='Viết càng hay Crush càng dễ kiếm'
                        className="form-control"
                        id="self_introduc"
                        name="self_introduc"
                        value={formData.self_introduc}
                        onChange={handleChange}
                        rows={10}
                        required
                    />
                </div>
            </div>

            <button type="submit" className="btn btn-primary">Cập nhật</button>
        </form>
    );
}