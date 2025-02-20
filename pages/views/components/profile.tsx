import { updateProfile } from 'firebase/auth'
import Image from 'next/image'
import React, { useState } from 'react'
import axios from 'axios'
import { excute_mySQL } from '../../api/config/connect_DB'

export default function profile({ user }) {
    const [displayName, setDisplayName] = useState('')
    const [imageURL, setImageURL] = useState('')
    const [urlImageDrive, setUrlImageDrive] = useState('')
    const [image, setImage] = useState<File | null>(null)


    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setImage(e.target.files[0]);
            const url = URL.createObjectURL(e.target.files[0])
            setImageURL(url)

        }
    };

    const uploadInfor = async (e) => {
        try {
            e.preventDefault();


            const form = new FormData(e.currentTarget)
            const formData = new FormData();
            formData.append('displayName', form.get('displayName'))
            const file = form.get('avatarImage')
            if (file)
                formData.append('file_image', file)

            axios.post('/api/controller/gg_drive', formData).then((response) => {
                console.log(response)
                const url_upload = response.data.url;
                setUrlImageDrive(url_upload);
            })
            // await uploadFileToGoogleDrive(image,image.name);
            // if (urlImageDrive != '')
            //     await updateProfile(user,
            //         {
            //             displayName: displayName,
            //             photoURL: imageURL
            //         }
            //     ).then(() => {
            //         alert('update success');
            //     })
            // else
            //     alert('faile to update');
        } catch (error) {
            console.log(`error ${error}`)
        }
    }
    return (
        <div className="container text-center">
            <form onSubmit={uploadInfor}>
                <div className='form-group mb-3'>

                    <Image src={imageURL} width={50} height={50} alt='' />
                    <input type='file' id='avatarImage' name='avatarImage' accept='image/*' onChange={handleImageChange} />

                </div>
                <div className='form-group mb-3'>

                    <input
                        type="text"
                        className="form-control"
                        id="displayName"
                        name='displayName'
                        placeholder="Display name"
                    />
                </div>
                <button type='submit' className='btn btn-info'>update</button>
            </form >
        </div >
    )
}











