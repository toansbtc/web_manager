import axios from 'axios'
import React, { useEffect, useState } from 'react'
import actionDB from "@/pages/api/DB/actionDB"
import getItemSession from '../Function/sessionFunction'
import { useRouter } from 'next/router'
import { useSelector } from 'react-redux'
import { rootState } from '@/pages/api/redux/store'
import getDrivePath from '../Function/getDrivePath'
import Image from 'next/image'


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


const statusMap: Record<string, string> = {
    single: "Độc thân",
    married: "Có gia đình",
    crush: "Có người yêu",
    abandon: "Bị Crush bỏ",
};


export default function overview() {
    const router = useRouter();
    const { infor } = useSelector((state: rootState) => state.youngData)

    // useEffect(() => {
    //     setData(data_user)
    //     console.log("data_user", data_user)
    // }, [])
    return (
        <div
            className="container-fluid min-vh-100 d-flex align-items-center justify-content-center bg-light"
            style={{ padding: "20px" }}
        >

            {infor?.infor !== undefined && (
                <div>

                    {
                        infor.role !== 0 ? (
                            <div className="card shadow-sm" style={{
                                maxWidth: "800px",
                                width: "100%",
                                borderRadius: "15px",
                                overflow: "hidden",
                                backgroundColor: "#fff",
                                margin: "20px auto",
                                padding: "20px",
                            }}>
                                <div className="row g-0">
                                    {/* Left Image Section */}
                                    <div className="col-md-4 d-flex align-items-center justify-content-center">
                                        <Image
                                            src={infor.infor?.image_path?.image_path !== "" ? getDrivePath(infor.infor?.image_path?.image_path) : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQm3RFDZM21teuCMFYx_AROjt-AzUwDBROFww&s"}
                                            unoptimized
                                            width={150}
                                            height={150}
                                            alt='AVATAR IMAGE'
                                            className='rounded-circle img-fluid'
                                            style={{ border: "3px solid #007bff" }}
                                        />
                                    </div>
                                    {/* Right Content Section */}
                                    <div className="col-md-8">
                                        <div className="card-body">
                                            <h4 className="card-title text-primary fw-bold mb-4">
                                                {infor.infor?.name || "No Name Provided"}
                                            </h4>
                                            <div className="mb-3">
                                                <p className="card-text mb-2">
                                                    <strong>Ngày sinh:</strong> {infor.infor?.birth_day || "N/A"}
                                                </p>
                                                <p className="card-text mb-2">
                                                    <strong>Địa chỉ:</strong> {infor.infor?.address || "N/A"}
                                                </p>
                                                <p className="card-text mb-2">
                                                    <strong>Công việc:</strong> {infor.infor?.job || "N/A"}
                                                </p>
                                                <p className="card-text mb-2">
                                                    <strong>SĐT:</strong> {infor.infor?.number_phone || "N/A"}
                                                </p>
                                                <p className="card-text mb-2">
                                                    <strong>Tình trạng:</strong> {statusMap[infor.infor?.situation] || "N/A"}
                                                </p>
                                            </div>
                                            <div className="card-text">
                                                <strong>Giới thiệu bản thân:</strong>{" "}
                                                <p style={{ color: "#555", lineHeight: "1.6" }} dangerouslySetInnerHTML={{ __html: infor.infor?.self_introduc ? infor.infor?.self_introduc.replace(/\n/g, "<br>") : '' }}></p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className='justify-content-center align-content-center'>
                                <h2 className='display-4'>Chào mừng quản trị viên</h2>
                            </div>
                        )
                    }
                </div>
            )}
        </div>
    );
}