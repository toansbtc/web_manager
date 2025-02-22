import Head from "next/head";
import { Inter } from "next/font/google";
import { useState, useEffect, use } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import { onAuthStateChanged, signInWithPopup, deleteUser, FacebookAuthProvider } from "firebase/auth";
import { auth, faceBookProvider, googleprovider, user } from "../../api/config/fireBase"
import { useDispatch, useSelector } from "react-redux";

import { browserLocalPersistence, setPersistence } from 'firebase/auth';
import getItemSession, { key_user, setItemSession } from "../../views/Function/sessionFunction";
import { current } from "@reduxjs/toolkit";
import { rootState } from "@/pages/api/redux/store";
import { useLoading } from "../loadingPages/loadingContext";
import actionDB from "@/pages/api/DB/actionDB";


import returnError from '../Function/alert_FB_Login_failed'
import sendMessageToUser from "../Function/sendMessageFB";

const inter = Inter({ subsets: ["vietnamese"] });

export default function loggin_registerModal() {



  // const [user, setUser] = useState();



  const router = useRouter();
  const { setIsLoading } = useLoading()

  const [rememberMe, setRememberMe] = useState(false);
  const [loginOrRegister, setLoginOrRegister] = useState('login');
  const [capchaCode, setCapchaCode] = useState('');
  // const [loading, setIsLoading] = useState(false);
  // const [adminUser, setAdminUser] = useState('');
  // const [password, setPassword] = useState('');
  // const [checkPassword, setCheckPassword] = useState(true);




  // const handlePersistence = async () => {
  //   try {
  //     await setPersistence(auth, browserLocalPersistence); // Persist session in localStorage
  //   } catch (error) {
  //     console.error('Error setting persistence:', error);
  //   }
  // };handlePersistence();


  useEffect(() => {


    if (getItemSession() !== 'undefined')
      router.replace('/')
    // const unsubscriple = onAuthStateChanged(auth, (currentUser) => {
    //   console.log(currentUser)
    //   if (currentUser && sessionStorage.getItem(user)) {
    //     console.log('odo', currentUser.email, sessionStorage.getItem(user))
    //     router.replace('/home')
    //   }
    // })

    // return () => unsubscriple();
  }, [router])



  const adminLogin = async (e) => {
    e.preventDefault();


    const form = new FormData(e.currentTarget)

    console.log()
    const formData = {
      'email': form.get('email'),
      'password': form.get('password'),
    }
    setIsLoading(true)
    const response = await axios.post('/api/DB/CRUDaccountRole',
      { "action": actionDB.NATIVESQL, "data": { "sql": `select role,user_token as username from account_role where user_token='${formData.email}' and password='${formData.password}'and is_active=true` } })

    const user_data = response.data[0];

    console.log("this is user data", user_data)


    if (user_data) {
      setItemSession(key_user, user_data);
      router.replace('/')
    }
    else
      alert("Tài khoản của bạn không đúng hoặc đang bị khóa\nLiên hệ với ADMIN để được giúp đỡ!")
    setIsLoading(false)

  }

  const fb_Login = async () => {

    try {
      setIsLoading(true)
      faceBookProvider.addScope("email")
      faceBookProvider.addScope("pages_messaging")
      const result = await signInWithPopup(auth, faceBookProvider)
      const user = result.user

      const fbUserID = user.providerData.find((data) => data.providerId === "facebook.com").uid

      await axios.post('/api/DB/CRUDaccountRole', { "action": actionDB.GETDATA, "data": { "user_token": fbUserID } })
        .then((data) => {
          console.log(data)
        })

      // const credential=FacebookAuthProvider.credentialFromResult(result);
      // const access_token=credential.accessToken;



      // check user had regiter befor login
      if (user.metadata.creationTime === user.metadata.lastSignInTime) {
        user.delete();
      }
      else {
        setItemSession(key_user, result.user)
      }

    } catch (error) {
      returnError(error.code)
      console.log(error)
    }
    finally {
      setIsLoading(false)
    }
  }
  const fb_Register = () => {
    try {
      setIsLoading(true)
      axios.post('/api/DB/CRUBcapchaCode', { "action": actionDB.GETDATA }).then(async (data) => {
        console.log(data.data)
        if (data.data.capcha_code === capchaCode) {

          try {
            const result = await signInWithPopup(auth, faceBookProvider)
            setItemSession(key_user, result.user)
          } catch (error) {
            console.log(error.code)
            returnError(error.code)
          }

        }
        else {
          alert("capcha code dont exist or used!\n please contact with admin to get valid capcha code ")
        }
      })
      setCapchaCode("");

    } catch (error) {
      console.log(error.code)
    }
    finally {
      setIsLoading(false)
    }
  }



  return (
    <>
      <Head>
        <title>Authentication</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/church.jpeg" />
      </Head>
      <div className="container-fluid login_background_image" >
        <div className="row justify-content-center align-items-center">


          <div className="card col-lg-4 mt-5">

            <div className="mt-2 mb-3 text-center">
              <ul className="nav nav-tabs">
                <li className={`nav-item`}>
                  <button className={`nav-link ${loginOrRegister === 'login' ? 'active' : ''}`} aria-current="page"
                    onClick={() => {
                      setLoginOrRegister('login')
                    }}
                  >Login</button>
                </li>
                <li className={`nav-item`} >
                  <button className={`nav-link ${loginOrRegister === 'register' ? 'active' : ''}`} aria-current="page"
                    onClick={() => setLoginOrRegister(`register`)}
                  >Register</button>
                </li>
              </ul>
            </div>



            {loginOrRegister === 'login' && (
              <div>
                <form onSubmit={adminLogin}>
                  <div className="form-group mb-3">
                    <input
                      type="text"
                      className="form-control form-control-placeholder opacity-75"
                      name="email"
                      id="loginEmail"
                      placeholder="Admin username"
                      required

                    />
                  </div>
                  <div className="form-group mb-3">
                    <input
                      type="password"
                      className="form-control form-control-placeholder opacity-75"
                      name="password"
                      id="loginPassword"
                      placeholder="Password"
                      required

                    />
                  </div>
                  <button type="submit" className="form-control btn btn-info">
                    Login
                  </button>
                </form>
                <div className="row mt-2 text-center">
                  <div className="w-50">
                    <label >
                      <input type="checkbox" id="chk_remember" style={{ marginRight: '8px' }}
                        checked={rememberMe}
                        onChange={(event) => {
                          setRememberMe(event.target.checked)
                        }} />
                      Remember Me
                    </label>
                  </div>
                  <div className="w-50">

                    <a href="#"  >Forgot Password?</a>

                  </div>
                  <div className="w-100 text-center m-2">
                    <label >-- Login with --</label>
                    <div className="d-flex justify-content-center mt-1">
                      <i style={{ color: "blue", fontSize: 35 }} className=" fa-brands fa-facebook" aria-hidden="true"
                        onClick={fb_Login}></i>
                    </div>
                  </div>

                </div>
              </div>
            )}
            {loginOrRegister === 'register' && (
              <div className="text-center">
                <div className="d-flex justify-content-center align-content-center mt-1">
                  <i style={{ color: "blue", fontSize: 35 }} className=" fa-brands fa-facebook" aria-hidden="true"
                    onClick={fb_Register}></i>
                </div>
                <div>
                  <input type="text" placeholder="capcha code" value={capchaCode} required onChange={(e) => setCapchaCode(e.target.value)} style={{ width: "200px" }} />
                </div>
              </div>
            )}
          </div>
        </div>
      </div >

    </>
  );
}


