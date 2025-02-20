import React, { useEffect, useState } from 'react'
import router, { useRouter } from 'next/router';
import { signOut } from 'firebase/auth';
import { auth } from '../../api//config/fireBase';
import Image from 'next/image'
import { useDispatch } from 'react-redux';
import { openClose_Login } from '@/pages/api/redux/openClose_logginSlice';
import getItemSession from '../Function/sessionFunction';



export default function navbar({ setLink, style }) {

    const dispath = useDispatch();


    const [user, setUser] = useState(null);


    useEffect(() => {
        if (getItemSession() !== 'undefined') {
            const user = JSON.parse(getItemSession());
            setUser(user)
        }
    }, [])

    const route = useRouter();
    const showElement = (id) => {
        const element = document.getElementById(id)
        if (element.classList.contains('show')) {
            element.classList.remove('show');
        } else {
            element.classList.add('show');
        }
    }
    return (
        <nav className={`navbar navbar-expand-md navbar-dark fixed-top ${style}`}>
            <div className="navbar-brand" >
                <button className='mr-1 btn '
                    onClick={() => route.push('/')}
                >
                    <Image src={'/church.jpeg'} priority width={55} height={50} alt='Home icon' className='rounded-circle m-lg-0' />
                    {/* <span className='text-white' style={{ marginRight: 10 }}>Logo home</span> */}
                </button>
            </div>
            <button className="navbar-toggler" type="button"
                onClick={() => showElement('navbarCollapse')}
            >
                <span className="navbar-toggler-icon"></span>
            </button>
            <div className="navbar-collapse collapse " id="navbarCollapse" >
                <ul className="navbar-nav ms-auto me-auto">
                    <li className="nav-item active">
                        <a className="nav-link" onClick={() => setLink('home')}>Trang chủ</a>
                    </li>
                    <li className="nav-item">
                        <a className="nav-link" onClick={() => setLink('active')}>Hoạt động</a>
                    </li>
                    {/* <li className="nav-item">
                        <a className="nav-link" onClick={() => setLink('young')}>Yourng</a>
                    </li> */}
                </ul>

                <div className="mr-auto justify-content-between" style={{ paddingRight: 10 }}>

                    <div className="dropdown">
                        <span className='text-white' style={{ fontSize: 18, fontFamily: 'cursive' }}>{user !== null ? `${user.username}` : 'Anonymous'}</span>
                        <button
                            className="btn bg-dark dropdown-toggle"
                            style={{ color: 'white' }}
                            type="button"
                            id="userDropdown"
                            data-bs-toggle="dropdown"
                            aria-expanded="false"
                            onClick={() =>
                                showElement('userLogin')}
                        >
                        </button>

                        <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="userDropdown" id="userLogin">
                            {/* <li onClick={() => route.push('/views/yourngPages/authen', '/authen')}> */}
                            {/* <li onClick={() => dispath(openClose_Login(true))}> */}
                            {user === null ?
                                (
                                    <li onClick={() => route.replace('/views/modals/loggin_registerModal', "/authen")}>
                                        Đăng nhập
                                    </li>
                                ) : (
                                    <>
                                        <li onClick={() => {
                                            signOut(auth);
                                            sessionStorage.clear();
                                            router.replace('/authen')
                                        }}>
                                            Đăng xuất
                                        </li>
                                        <li onClick={() => {
                                            router.replace('/profile')
                                        }}>
                                            Hồ sơ
                                        </li>
                                    </>
                                )}

                        </ul>
                    </div>
                </div>

            </div>
        </nav>
    )
}
