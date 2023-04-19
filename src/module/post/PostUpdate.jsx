import useFirebaseImage from "../../hooks/useFirebaseImage";
import Toggle from "../../components/toggle/Toggle";
import ReactQuill, {Quill} from 'react-quill';
import React, { useMemo, useState } from "react";
import ImageUploader from 'quill-image-uploader';
import ImageUpload from "../../components/image/ImageUpload";
import DashboardHeading from "../dashboard/DashboardHeading";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useEffect } from "react";
import { toast } from "react-toastify";
import { Radio } from "../../components/checkbox";
import { postStatus } from "../../utils/constants";
import { Label } from "../../components/label";
import { Input } from "../../components/input";
import { Field, FieldCheckboxes } from "../../components/field";
import { Dropdown } from "../../components/dropdown";
import { db } from "../../firebase/firebase-config";
import { collection, doc, getDoc, getDocs, query, updateDoc, where } from "firebase/firestore";
import { Button } from "../../components/button";
import 'react-quill/dist/quill.snow.css';
import { imgbbAPI } from "../../utils/apiConfig";
import axios from "axios";
import slugify from "slugify";
Quill.register('modules/imageUploader', ImageUploader);


const PostUpdate = () => {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const postId = params.get('id');
  const [content, setContent] = useState("");
  const {handleSubmit, control, setValue, watch, reset, getValues, formState: {isValid, isSubmitting}} = useForm({
    model: "onChange",
  });
  const imageUrl = getValues("image");
  const imageName = getValues("image_name"); 
    const {
      image,
      setImage,
      progress,
      handleDeleteImage,
      handleSelectImage,
    } = useFirebaseImage(getValues, setValue, imageName, deletePostImage);
    async function deletePostImage(){
      const colRef = doc(db, "posts", postId);
      await updateDoc(colRef, {
        avatar: ""
      })
    }
    useEffect(()=>{
      setImage(imageUrl);
    },[imageUrl, setImage])
  
  const watchHot = watch("hot");
  const watchStatus = watch("status");
  useEffect(()=>{
    async function fetchData(){
      if(!postId) return;
      const docRef = doc(db, "posts", postId);
      const docSnapshot = await getDoc(docRef);
      if(docSnapshot.data()){
        reset(docSnapshot.data());
        setSelectCategory(docSnapshot.data()?.category || "");
        setContent(docSnapshot.data()?.content || "");
      }
    }
    fetchData();
  }, [postId, reset]);
  const [selectCategory, setSelectCategory] = useState("");
  const [categories, setCategories] = useState([]);
  useEffect(()=>{
    async function getCategoriesData(){
      const colRef = collection(db, "categories");
      const q = query(colRef, where("status", "==", 1));
      const querySnapshot = await getDocs(q);
      let result = [];
      querySnapshot.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
        result.push({
          id: doc.id,
          ...doc.data()
        })
      });
      setCategories(result);
    }
    getCategoriesData();
  }, []);
  const handleClickOption = async (item) =>{
    const colRef = doc(db, "categories", item.id);
    const docData = await getDoc(colRef);
    setValue("category",{
      id: docData.id,
      ...docData.data()
    });
    setSelectCategory(item);
  }
  const updatePostHandler = async (values) =>{
    if(!isValid) return;
    const docRef = doc(db, "posts", postId);
    values.status = Number(values.status);
    values.slug = slugify(values.slug || values.title, {lower: true});
    await updateDoc(docRef, {
      ...values,
      image,
      content,
    });
    toast.success("Update post successfully!");
    navigate("/manage/posts");
  }

  const modules = useMemo( () => ({
    toolbar: [
      ['bold', 'italic', 'underline', 'strike'],
      ['blockquote'],
      [{ header: 1 }, { header: 2 }], // custom button values
      [{ list: 'ordered' }, { list: 'bullet' }],
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      ['link', 'image']
    ],
    imageUploader: {
      upload: async (file) => {
        const bodyFormData = new FormData();
        bodyFormData.append("image", file);
        const response = await axios({
          method: "post",
          url: imgbbAPI,
          data: bodyFormData,
          headers: {
            "Content-Type": "multipart/form-data"
          }
        });
        return response.data.data.url;
      }
    },
  }), []);

  if(!postId) return null;
  return <>
    <DashboardHeading title="Update post" desc="Update post content"></DashboardHeading>
    <form onSubmit={handleSubmit(updatePostHandler)}>
        <div className="form-layout">
          <Field>
            <Label>Title</Label>
            <Input
              control={control}
              placeholder="Enter your title"
              name="title"
              required
            ></Input>
          </Field>
          <Field>
            <Label>Slug</Label>
            <Input
              control={control}
              placeholder="Enter your slug"
              name="slug"
            ></Input>
          </Field>
        </div>
        <div className="form-layout">
          <Field>
              <Label>Image</Label>
              <ImageUpload handleDeleteImage={handleDeleteImage} name='image' onChange={handleSelectImage} progress={progress} image={image}></ImageUpload>
          </Field>
          <Field>
            <Label>Status</Label>
            <FieldCheckboxes>
              <Radio
                name="status"
                control={control}
                checked={watchStatus === postStatus.APPROVED}
                value={postStatus.APPROVED}
              >
                Approved
              </Radio>
              <Radio
                name="status"
                control={control}
                checked={watchStatus === postStatus.PENDING}
                onClick={() => setValue("status", "pending")}
                value={postStatus.PENDING}
              >
                Pending
              </Radio>
              <Radio
                name="status"
                control={control}
                checked={watchStatus === postStatus.REJECTED}
                onClick={() => setValue("status", "reject")}
                value={postStatus.REJECTED}
              >
                Reject
              </Radio>
            </FieldCheckboxes>
          </Field>
          <Field>
            <Label>Author</Label>
            <Input control={control} name='author' placeholder="Find the author" ></Input>
          </Field>
          <Field>
            <Label>Category</Label>
            <Dropdown>
              <Dropdown.Select placeholder='Select the category'></Dropdown.Select>
              <Dropdown.List>
                {categories.length > 0 && categories.map((item) => (
                  <Dropdown.Option key={item.id} onClick={() => handleClickOption(item)}>{item.name}</Dropdown.Option>
                ))}
              </Dropdown.List>
            </Dropdown>
            {selectCategory?.name && <span className="inline-block bg-green-50 text-green-600 p-3 rounded-lg text-sm font-medium">
                  {selectCategory?.name}
            </span>}
          </Field>
        </div>
        <div className="mb-10">
          <Field>
            <Label>Content</Label>
            <div className="w-full entry-content">
              <ReactQuill modules={modules} theme="snow" value={content} onChange={setContent} />
            </div>
          </Field>
        </div>
        <div className="form-layout">
          <Field>
            <Label>Feature posts</Label>
            <Toggle on={watchHot ===  true} onClick={() => setValue("hot", !watchHot)}></Toggle>
          </Field>
        </div>
        <Button type="submit" className="mx-auto max-w-xs w-[300px]" isLoading={isSubmitting} disabled={isSubmitting}>
          Update post
        </Button>
      </form>
  </>;
};

export default PostUpdate;