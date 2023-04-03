import useFirebaseImage from "../../hooks/useFirebaseImage";
import Toggle from "../../components/toggle/Toggle";
import styled from "styled-components";
import slugify from "slugify";
import React, { useEffect, useState } from "react";
import ImageUpload from "../../components/image/ImageUpload";
import FieldCheckboxes from "../../drafts/FieldCheckboxes";
import DashboardHeading from "../dashboard/DashboardHeading";
import {Dropdown} from "../../components/dropdown";
import {db} from "../../firebase/firebase-config";
import { useForm } from "react-hook-form";
import { useAuth } from "../../contexts/auth-context";
import { toast } from "react-toastify";
import { Radio } from "../../components/checkbox";
import { postStatus } from "../../utils/constants";
import { Label } from "../../components/label";
import { Input } from "../../components/input";
import { Field } from "../../components/field";
import { Button } from "../../components/button";
import { addDoc, collection, getDocs, query, serverTimestamp, where } from "firebase/firestore";
const PostAddNewStyles = styled.div``;

const PostAddNew = () => {
    const {userInfo} = useAuth();
    console.log("userInfo",userInfo);
    const { control, watch, setValue, handleSubmit, getValues, reset } = useForm({
        mode: "onChange",
        defaultValues: {
          title: "",
          slug: "",
          status: 2,
          categoryId: "",
          hot: false
        },
      });
      const watchStatus = +watch("status");
      const watchHot = watch("hot");
      // const watchCategory = watch("category");
      const {image, handleResetUpload, progress, handleDeleteImage, handleSelectImage} = useFirebaseImage(getValues, setValue);

      const [categories, setCategories] = useState([]);
      const [selectCategory, setSelectCategory] = useState("");
      const [loading, setLoading] = useState(false);
      const addPostHandler = async (values)=>{
        try{
          setLoading(true);
          let cloneValues = {...values}
          cloneValues.slug = slugify(cloneValues.slug || cloneValues.title, {lowercase: true});
          cloneValues.status = +cloneValues.status
          console.log('cloneValues', cloneValues);
          const colRef = collection(db, "posts");
          await addDoc(colRef, {
            ...cloneValues,
            image,
            userId: userInfo.uid,
            createdAt: serverTimestamp()
          })
          toast.success("Create new post successfully!");
          reset({
            title: "",
            slug: "",
            status: 2,
            categoryId: "",
            hot: false,
            image: ""
          });
          handleResetUpload();
          setSelectCategory({});
        }catch(error){
          setLoading(false);
          throw new Error(error);
        }finally{
          setLoading(false);
        }
        
      }
      
      useEffect(()=>{
        async function getData(){
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
        getData();
      }, []);

      useEffect(()=>{
        document.title = 'Monkey blogging - Add new posts'
      }, []);

const handleClickOption = (item) =>{
    setValue("categoryId", item.id);
    setSelectCategory(item);

}

  return (
    <PostAddNewStyles>
      <DashboardHeading title="Add post" desc="Add new post"></DashboardHeading>
      <form onSubmit={handleSubmit(addPostHandler)}>
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
                onClick={() => setValue("status", "approved")}
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
        <div className="form-layout">
          <Field>
            <Label>Feature posts</Label>
            <Toggle on={watchHot ===  true} onClick={() => setValue("hot", !watchHot)}></Toggle>
          </Field>
        </div>
        <Button type="submit" className="mx-auto max-w-xs w-[300px]" isLoading={loading} disabled={loading}>
          Add new post
        </Button>
      </form>
    </PostAddNewStyles>
  );
};


export default PostAddNew;