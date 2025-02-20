import axios from 'axios'
import React from 'react'

export default function upload_video() {
    const uloadFileVideo = () => {
        const result = axios.post
    }
    return (
        <div className='container-fluid justify-content-center'>
            <form onSubmit={upload_video}>
                <input type='file' accept='video/*' />
                <input type='submit' className='btn btn-success'>upload</input>
            </form>
        </div>
    )
}
