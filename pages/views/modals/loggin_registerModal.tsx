import Head from "next/head";
import { Inter } from "next/font/google";
import { useState, useEffect, use } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import { onAuthStateChanged, signInWithPopup, deleteUser, FacebookAuthProvider, signInWithPhoneNumber, RecaptchaVerifier } from "firebase/auth";
import { auth, faceBookProvider, googleprovider, user, } from "../../api/config/fireBase"
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
  const [numberPhone, setNumberPhone] = useState(null);
  const [ShowOTP, setShowOTP] = useState(false);
  const [confirmResult, setconfirmResult] = useState(null);
  const [confirmOTP, setconfirmOTP] = useState(null);
  const [recaptchaVerifier, setRecaptchaVerifier] = useState<RecaptchaVerifier | null>(null);


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

  // useEffect(() => {
  //   if (!recaptchaVerifier) {
  //     const verifier = new RecaptchaVerifier(
  //       auth,
  //       "recaptcha-container",
  //       {
  //         size: "invisible",
  //         callback: (response: any) => {
  //           console.log("reCAPTCHA verified:", response);
  //         },
  //         "expired-callback": () => {
  //           console.error("reCAPTCHA expired");
  //         }
  //       }
  //     );
  //     setRecaptchaVerifier(verifier);
  //   }
  // }, [auth, recaptchaVerifier]);



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
      { "action": "LOGIN", "data": { "user_token": formData.email, "password": formData.password } })

    const user_data = response.data;

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
      // faceBookProvider.addScope("email")
      // faceBookProvider.addScope("pages_messaging")
      // faceBookProvider.addScope("public_profile");
      // const result = await signInWithPopup(auth, faceBookProvider)
      // const user = result.user

      // const fbUserID = user.providerData.find((data) => data.providerId === "facebook.com").uid
      // console.log(user)

      // await axios.post('/api/DB/CRUDaccountRole', { "action": actionDB.GETDATA, "data": { "user_token": fbUserID } })
      //   .then((data) => {
      //     // console.log(data)
      //   })

      // const credential=FacebookAuthProvider.credentialFromResult(result);
      // const access_token=credential.accessToken;


      // check user had regiter befor login

      const loggin = () => window.FB.login(
        function (res: any) {
          if (res.authResponse) {
            console.log(res)
            const fbUserID = res.authResponse.userID
            axios.post('/api/DB/CRUDaccountRole', { "action": actionDB.GETDATA, "data": { "user_token": fbUserID } })
              .then((data) => {
                if (data.data.user_token) {
                  console.log(data.data)
                  setItemSession(key_user, { "username": data.data.user_token, "role": data.data.role })
                  router.push("/")
                }
                else {
                  alert("Tài khoản của bạn không trong Giới Trẻ")
                }
              })
          }
        }
      )

      return await loggin();
      // if (user.metadata.creationTime === user.metadata.lastSignInTime) {
      //   user.delete();
      //   alert("Bạn phải đăng ký tài khoản bằng FB trước khi đăng nhập!!!")
      // }
      // else {
      // const fbUserID = user.providerData.find((data) => data.providerId === "facebook.com").uid
      // await axios.post('/api/DB/CRUDaccountRole', { "action": actionDB.GETDATA, "data": { "user_token": fbUserID } })
      //   .then((data) => {
      //     console.log(data.data)
      //     setItemSession(key_user, { "username": data.data.user_token, "role": data.data.role })
      //     router.push("/")
      //   })
      // }

    } catch (error) {
      returnError(error.code)
      console.log(error)
    }
    finally {
      setIsLoading(false)
    }
  }
  const fb_Register = async () => {
    if (typeof window !== "undefined" && window.FB)
      try {
        setIsLoading(true)
        axios.post('/api/DB/CRUBcapchaCode', { "action": actionDB.GETDATA })
          .then(async (data) => {
            // console.log(data.data)
            if (data.data.capcha_code === capchaCode) {
              window.FB.login(
                function (res: any) {
                  if (res.authResponse) {
                    console.log(res)
                    const fbUserID = res.authResponse.userID
                    if (fbUserID) {
                      axios.post('/api/DB/CRUDaccountRole', { "action": actionDB.GETDATA, "data": { "user_token": fbUserID } })
                        .then(async (data) => {
                          if (data.data?.user_token !== null) {
                            setItemSession(key_user, { "username": data.data.user_token, "role": data.data.role })
                            router.push("/")

                          }
                          else {
                            const save_user_regist_fb = await axios.post('/api/DB/CRUDaccountRole', {
                              "action": actionDB.CREATE,
                              "data": { "user_token": fbUserID, "role": 3, "is_active": true }
                            })
                            // console.log(sigin_fb.user)
                            if (save_user_regist_fb.status === 200) {
                              setItemSession(key_user, { "username": save_user_regist_fb.data.user_token, "role": save_user_regist_fb.data.role })
                              router.push("/")
                            }
                          }
                        }
                        )
                    }
                  }
                }
              )
            }

            //   const sigin_fb = await signInWithPopup(auth, faceBookProvider)
            //   const user = sigin_fb.user

            //   const fbUserID = user.providerData.find((data) => data.providerId === "facebook.com").uid
            //   if (fbUserID) {
            //     await axios.post('/api/DB/CRUDaccountRole', { "action": actionDB.GETDATA, "data": { "user_token": fbUserID } })
            //       .then(async (data) => {
            //         if (data.data?.user_token !== null) {
            //           setItemSession(key_user, { "username": data.data.user_token, "role": data.data.role })
            //           router.push("/")

            //         }
            //         else {
            //           const save_user_regist_fb = await axios.post('/api/DB/CRUDaccountRole', {
            //             "action": actionDB.CREATE,
            //             "data": { "user_token": fbUserID, "role": 3, "is_active": true }
            //           })
            //           console.log(sigin_fb.user)
            //           if (save_user_regist_fb.status === 200) {
            //             setItemSession(key_user, { "username": save_user_regist_fb.data.user_token, "role": save_user_regist_fb.data.role })
            //             router.push("/")
            //           }
            //         }
            //       }
            //       )
            //   }
            // }
            else {
              alert("capcha code dont exist or used!\n please contact with admin to get valid capcha code ")
            }
          }
          )
      }
      catch (e) {
        console.error(e)
      }
      finally {
        setIsLoading(false)
      }
    else
      alert("Bạn không chạy trên windows")


  }


  const zalo_Login = async () => {

  }





  // const handleSigninPhoneNumber = async (e) => {
  //   // const form = new FormData(e.currentTarget)
  //   // const numberPhone = form.get("numberPhone") as string;
  //   if (!numberPhone) {
  //     alert("Please enter a phone number");
  //     return;
  //   }

  //   if (!recaptchaVerifier) {
  //     console.error("reCAPTCHA is not ready yet.");
  //     return;
  //   }
  //   try {
  //     setIsLoading(true)


  //     axios.post('/api/DB/CRUBcapchaCode', { "action": actionDB.GETDATA })
  //       .then(async (data) => {
  //         // console.log(data.data)
  //         if (data.data.capcha_code === capchaCode) {
  //           signInWithPhoneNumber(auth, numberPhone, recaptchaVerifier)
  //             .then((confirmCode) => {
  //               confirmCode.verificationId
  //               setconfirmResult(confirmCode)
  //               alert("Hệ thống đã gửi mã xác thực OTP về số điện thoại:" + numberPhone);
  //               setShowOTP(true);
  //             })
  //         }
  //         else
  //           alert("Mã captcha của bạn không đúng!!\n vui lòng liên hệ Admin để lấy mã")
  //       })
  //   }
  //   catch (e) {
  //     console.log(e)
  //   }
  //   finally {
  //     setIsLoading(false)
  //   }
  // }

  // function verifyOTP() {
  //   if (confirmResult !== null && confirmOTP !== null) {
  //     confirmResult.confirm(confirmOTP)
  //       .then((result) => {
  //         console.log("User signed in:", result.user);
  //       })
  //       .catch((error) => {
  //         console.error("Error verifying OTP:", error);
  //       });
  //   }
  //   else
  //     alert("can't get confirmResult")
  // }

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
                    Đăng nhập
                  </button>
                </form>
                <div className="row mt-2 text-center">
                  {/* <div className="w-50">
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

                  </div> */}
                  <div className="w-100 text-center m-2" style={{ fontWeight: 'bold', color: 'MenuText' }}>
                    <label >-- Thành viên giới trẻ đăng nhập với FB --</label>
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
                <div className="mt-1">
                  <input type="text" className="w-50" placeholder="Captcha code" value={capchaCode} required onChange={(e) => setCapchaCode(e.target.value)} />
                </div>
                <div className="d-flex justify-content-center  align-content-center mt-2 w-100 " onClick={fb_Register}>
                  <span className="bg-light p-1" style={{ fontWeight: 'bold' }}>Đăng ký <i className=" fa-brands fa-facebook" style={{ color: 'blue' }} aria-hidden="true" /></span>
                </div>
              </div>
              // <div className="container mt-4 d-flex justify-content-center align-items-center" style={{ background: "linear-gradient(to right, #8360c3, #2ebf91)" }}>
              // <div className="card p-4 shadow-lg " style={{ backgroundColor: 'transparent', width: "100%", height: '90%', borderRadius: "15px", background: 'linear-gradient(to right, rgb(153 184 223 / 64%), rgb(169 169 150))' }}>
              //   {ShowOTP === false ? <div >
              //     <div className="mb-3">
              //       <label htmlFor="input1" className="form-label">Số điện thoại:</label>
              //       <input type="text" id="input1" onChange={(e) => setNumberPhone(e.target.value)} name="numberPhone" className="form-control" required />
              //     </div>
              //     <div className="mb-3">
              //       <label htmlFor="input2" className="form-label">Admin Captcha Code:</label>
              //       <input type="text" id="input2" name="captcha" onChange={(e) => setCapchaCode(e.target.value)} className="form-control" required />
              //     </div>
              //     <button onClick={handleSigninPhoneNumber} className="btn btn-primary w-100">Đăng ký</button>
              //   </div> :
              //     <div>
              //       <div className="mb-3">
              //         <label htmlFor="input2" className="form-label">OTP:</label>
              //         <input type="text" id="input2" name="captcha" onChange={(e) => setconfirmOTP(e.target.value)} className="form-control" required />
              //       </div>
              //       <button className="btn btn-primary w-100" onClick={verifyOTP}>Xác thực OTP</button>
              //     </div>
              //   }
              // </div>
              // </div>
            )}
          </div>
        </div>
      </div >

    </>
  );
}


