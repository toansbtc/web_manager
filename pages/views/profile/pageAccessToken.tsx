import axios from 'axios';
import React, { useEffect, useState } from 'react'
import actionDB from '@/pages/api/DB/actionDB';

export default function mass() {


    const [token, setToken] = useState("");


    async function handleUploadToken() {
        if (token !== "") {
            const result = await axios.post('/api/DB/CRUDaccountRole', {
                "action": actionDB.NATIVESQL,
                "data": {
                    "sql": `insert into token (id,page_access_token) values (1,'${token}') 
                 on conflict (id) do update set page_access_token='${token}'`
                }
            })

            if (result.status === 200) {
                alert('upload success')
            }
        }

    }

    return (
        <div className="container d-flex flex-column align-items-center justify-content-center vh-100">
            <div className="card shadow-none p-4" style={{ width: "100%" }}>

                {/* Textarea */}
                <div className='text-center'>
                    <input type='text'
                        className="form-control mb-3"
                        placeholder=""
                        required={true}
                        value={token}
                        onChange={(e) => setToken(e.target.value)}
                    />
                    <input type="submit" className='btn btn-success' onClick={handleUploadToken} />
                </div>


            </div>
        </div>
    );
}