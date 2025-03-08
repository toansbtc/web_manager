import React, { useState } from 'react'

import dynamic from 'next/dynamic';
import 'react-quill/dist/quill.snow.css';
import axios from 'axios';
import actionDB from "../../api/DB/actionDB"
import { useLoading } from '../loadingPages/loadingContext';



const QuillEditor = dynamic(() => import('react-quill'), { ssr: false });
const quillModules = {
  toolbar: [
    [{ header: [1, 2, 3, false] }],
    ['bold', 'italic', 'underline', 'strike', 'blockquote'],
    [{ list: 'ordered' }, { list: 'bullet' }],
    ['link', 'image'],
    // ["link"],
    [{ align: [] }],
    [{ color: [] }],
    ['code-block'],
    ['clean'],
  ],
};


const quillFormats = [
  'header',
  'bold',
  'italic',
  'underline',
  'strike',
  'blockquote',
  'list',
  'bullet',
  'link',
  'image',
  'align',
  'color',
  'code-block',
];




export default function quill_editor({ data, openCloseQuill, loadData, type }) {
  const { setIsLoading } = useLoading();
  const [content, setContent] = useState(data?.id ? data.introduct : '');
  const [updateData, setUpdateData] = useState({});
  const handleEditorChange = (content, delta, source, editor) => {
    setContent(content);
  };


  const saveInfor = async () => {
    try {
      setIsLoading(true)
      if (data?.id) {
        const result = await axios.post("/api/DB/CRUDintroHome", { "action": actionDB.UPDATE, "data": { "introduct": content, "id": data?.id } });
        if (result.status === 200) {
          alert("Cập nhật thành công !!!")
        }
      }
      else {
        const result = await axios.post("/api/DB/CRUDintroHome", { "action": actionDB.CREATE, "data": { "introduct": content, "type": type } });
        if (result.status === 200) {
          alert("Thêm mới thành công !!!")
        }
      }
    } catch (error) {
      alert("Lỗi khi lưu trữ dữ liệu")
      console.log(error)
    }
    finally {
      setIsLoading(false)
      openCloseQuill(false)
    }


  }


  return (
    <div style={{ flex: 1 }}>

      <QuillEditor

        style={{ height: '100%', flex: 1 }}
        value={content}
        onChange={handleEditorChange}
        modules={quillModules}
        formats={quillFormats}
        className="w-full h-[70%] mt-10 bg-white"
      />
      <div className='justify-content-around align-content-around mt-1'>
        <button style={{ padding: 10 }} type='button' className='btn btn-info'
          onClick={() => { saveInfor(), loadData({ "introduct": content, "id": data?.id }) }}
        >{data?.id ? "Cập nhật" : "Tạo mới"}</button>
        <button style={{ padding: 10, marginLeft: 20 }} type='button' className='btn btn-danger'
          onClick={() => { openCloseQuill(false) }}
        >Hủy bỏ</button>
      </div>
    </div>
  )
}
