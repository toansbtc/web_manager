// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { NextApiRequest, NextApiResponse } from "next";
import { executeData } from "../config/connect_DB";
import { auth, get_error_code } from "../config/fireBase";
import { createUserWithEmailAndPassword, sendEmailVerification, signInWithEmailAndPassword, verifyBeforeUpdateEmail } from "firebase/auth";
import data_return from "../../views/decladeInterface/authenInterface";
import { useEffect, useState } from "react";



export default async function authen(req: NextApiRequest, res: NextApiResponse) {

  const { type, email, password } = req.body

  res.status(200).send(await handle_authen(email, password, res, type));


}

async function handle_authen(email, password, res, type) {

  let dataReturn: data_return = { code: null, user: null };
  let credential;
  try {

    if (type === 'login')
      credential = await signInWithEmailAndPassword(auth, email, password);
    else {
      credential = await createUserWithEmailAndPassword(auth, email, password);
      await sendEmailVerification(credential.user);
    }
    dataReturn.code = 200
    dataReturn.user = credential;

  } catch (error) {
    const errorCode = error.code;
    dataReturn.code = get_error_code(errorCode);
  }

  return dataReturn;
}


