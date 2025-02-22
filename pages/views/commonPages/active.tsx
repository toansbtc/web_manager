import action from '@/pages/api/DB/actionDB';
import { fetchActiveImage, updateActiveImage } from '@/pages/api/redux/activeDataSlice';
import { appDispatch, rootState } from '@/pages/api/redux/store';
import axios from 'axios';
import { error } from 'console';
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useLoading } from '../loadingPages/loadingContext';
import getItemSession from '../Function/sessionFunction';


export default function active() {

  const dispatch = useDispatch<appDispatch>();
  const { list_image_active, loading } = useSelector((state: rootState) => state.activeData)

  const { setIsLoading } = useLoading()

  const [show, setShow] = useState(false);
  const [loadImage, setLoadImage] = useState(true);
  const [name, setName] = useState("");
  const [files, setFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [data_image, setDataImage] = useState<{ title: string, images: string[], id: number }[]>(null)
  const [expandedSections, setExpandedSections] = useState({});
  const [user, setUser] = useState({ role: null, username: null });
  const [id, setID] = useState<number>(-1);


  useEffect(() => {
    if (getItemSession() !== 'undefined') {
      setUser(JSON.parse(getItemSession()))
    }
  }, [user.username])

  // load image when open page
  useEffect(() => {
    setIsLoading(true)
    dispatch(fetchActiveImage())
    setIsLoading(false)
  }, [dispatch])

  useEffect(() => {
    if (loadImage)
      setIsLoading(true)
    else
      setIsLoading(false)
  }, [loadImage])

  // expand or shrink action image 
  const toggleSection = (title) => {
    setExpandedSections((prev) => ({
      ...prev,
      [title]: !prev[title],
    }));
  };

  // handle image when image list change 
  useEffect(() => {
    const images = [...list_image_active]
    const array_image: { title: string, images: string[], id: number }[] = [];
    images.map((value) => {
      console.log(value, value.list_image)
      array_image.push({ id: value.id, title: value.title, images: value.list_image?.split(',') })
      setExpandedSections((prev) => ({
        ...prev,
        [value.title]: true,
      }));
    })
    setDataImage(array_image)
  }, [list_image_active])



  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(event.target.files);
    setFiles(selectedFiles);

    // Preview images
    const filePreviews = selectedFiles.map((file) =>
      URL.createObjectURL(file)
    );
    setPreviews(filePreviews);
  };


  // handle upload file 
  const handleUpload = async () => {


    if (id === -1 && !name || files.length === 0) {
      alert("Không có dữ liệu để tải ảnh lên!!!");
      return;
    }


    const formData = new FormData();
    files.forEach((file) => formData.append("file", file));
    setIsLoading(true)
    const response = axios.post(`/api/controller/cloudinary`, formData, {
      headers: {
        "Content-Type": "multipart/form-data"
      }
    });

    response.then((data_return) => {
      if (data_return.data.urls.length > 0) {
        if (id === -1) {
          axios.post("/api/DB/CRUDactiveTitle",
            { "action": action.CREATE, "data": { "title": name, "list_image": data_return.data.urls } })
            .then((data) => { alert(`Thêm hoạt động thành công`) })
            .catch((error) => {
              alert("Không thể tải file lên")
              console.log(error)
            })
        }
        else {
          axios.post("/api/DB/CRUDactiveTitle",
            { "action": action.UPDATE, "data": { "id": id, "list_image": data_return.data.urls } })
            .then((result) => {
              console.log(result.data)
              let images = [...list_image_active]
              const index = images.findIndex(value => value.id === id)
              if (index != -1)
                images = images.map((value, i) => i === index ? {
                  ...value, list_image: `${value.list_image},${data_return.data.urls}`
                } : value
                )
              alert("Thêm ảnh thành công")
              dispatch(updateActiveImage(images))

            })
            .catch((error) => {
              alert("Không thể tải file lên")
              console.log(error)
            })
        }
      }
      setIsLoading(false)
    })
      .catch(reason => {
        console.error(reason)
      })
  };



  return (
    <div className="container mt-5">

      {/* Button to Open Modal */}
      {(user.role === 0 || user.role === 1) && <div className='w-100 text-center'>
        <button className="btn btn-success " onClick={() => { setShow(true), setID(-1) }}>
          Thêm mới
        </button>
      </div>}

      {/* Bootstrap Modal */}
      {show && (
        <div className="modal fade show d-block w-100" tabIndex={-1}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Thêm ảnh hoạt động</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShow(false)}
                ></button>
              </div>
              <div className="modal-body">
                {/* Name Input */}
                {id === -1 && <input
                  type="text"
                  className="form-control mb-3"
                  placeholder="Tên hoạt động"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
                }

                {/* File Input */}
                <input
                  type="file"
                  className="form-control mb-3"
                  multiple
                  accept="image/*"
                  onChange={handleFileChange}
                />

                {/* Preview Selected Images */}
                <div className="d-flex flex-wrap">
                  {previews.map((src, index) => (
                    <img
                      key={index}
                      src={src}
                      alt="preview"
                      className="me-2 mb-2"
                      style={{ width: "100px", height: "100px", objectFit: "cover", borderRadius: "5px" }}
                    />
                  ))}
                </div>
              </div>

              {/* Modal Footer */}
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setShow(false)}>
                  Đóng
                </button>
                <button className="btn btn-success" onClick={handleUpload}>
                  Tải ảnh lên
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Display Uploaded Images */}


      <div className="pt-4 pb-4">
        {data_image !== null && data_image?.map((section, index) => (
          <div key={index} className="transition-all duration-300">
            {/* Title (Click to Expand/Collapse) */}
            <div
              className={`w-100 bg-light mt-1
                ${expandedSections[section.title] ? "mb-3" : "mb-0"}`}
              onClick={() => toggleSection(section.title)}
              style={{ backgroundColor: 'rgb(111 237 0)' }}
            >
              <span className="text-lg" style={{ color: 'rgb(27 10 249)' }}>
                <span style={{
                  marginRight: 10,
                  display: "inline-block",
                  transition: "transform 0.3s ease-in-out",
                  transform: expandedSections[section.title] ? "rotate(0deg)" : "rotate(-90deg)"
                }}>▼</span>
                {section.title}</span>
            </div>



            {/* Grid View (Show/Hide based on state) */}
            {expandedSections[section.title] && <div className='text-center justify-content-center align-content-center' style={{
              display: "inline-block",
              transition: "transform 0.3s ease-in-out",
            }}>
              <div className='row text-center'>
                {section?.images.map((value, index) => (
                  <div className="col-md-4 col-sm-6 mb-3" key={index}>
                    <img src={value} className="card-img-top" alt="Image 1" onLoad={() => { setLoadImage(false) }} onError={() => { setLoadImage(false) }} style={{
                      width: 'max(365,30%)',
                      height: 150,
                      objectFit: 'cover',
                      borderRadius: 8
                    }} />
                  </div>
                ))}
                {(user.role === 0 || user.role === 1) && <div className="col-md-4 col-sm-6 mb-3 justify-content-center align-content-center">
                  <button className='btn btn-success' style={{ width: 50, height: 50 }} onClick={() => { setShow(true); setID(section.id) }}>+</button>
                </div>}
              </div>
            </div>
            }
          </div>
        )
        )
        }
      </div>
    </div>
  );
};


