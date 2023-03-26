import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import slugify from "slugify";
import styled from "styled-components";
import { Button } from "../../components/button";
import { Radio } from "../../components/checkbox";
import { Field } from "../../components/field";
import { Input } from "../../components/input";
import { Label } from "../../components/label";
import {Dropdown} from "../../components/dropdown";
import { postStatus } from "../../utils/constants";
import ImageUpload from "../../components/image/ImageUpload";
import useFirebaseImage from "../../hooks/useFirebaseImage";
import Toggle from "../../components/toggle/Toggle";
import { addDoc, collection, getDocs, query, where } from "firebase/firestore";
import {db} from "../../firebase/firebase-config";
import { useAuth } from "../../contexts/auth-context";
import { toast } from "react-toastify";
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
      const {image, progress, handleDeleteImage, handleSelectImage} = useFirebaseImage(getValues, setValue);

      const [categories, setCategories] = useState([]);
      const [selectCategory, setSelectCategory] = useState("");

      const addPostHandler = async (values)=>{
        let cloneValues = {...values}
        cloneValues.slug = slugify(cloneValues.slug || cloneValues.title, {lowercase: true});
        cloneValues.status = +cloneValues.status
        console.log('cloneValues', cloneValues);
        const colRef = collection(db, "posts");
        await addDoc(colRef, {
          ...cloneValues,
          image,
          userId: userInfo.uid
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
        setSelectCategory({});
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

const handleClickOption = (item) =>{
    setValue("categoryId", item.id);
    setSelectCategory(item);

}

  return (
    <PostAddNewStyles>
      <h1 className="dashboard-heading">Add new post</h1>
      <form onSubmit={handleSubmit(addPostHandler)}>
        <div className="grid grid-cols-2 gap-x-10 mb-10">
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
        <div className="grid grid-cols-2 gap-x-10 mb-10">
          <Field>
              <Label>Image</Label>
              <ImageUpload handleDeleteImage={handleDeleteImage} name='image' onChange={handleSelectImage} progress={progress} image={image}></ImageUpload>
          </Field>
          <Field>
            <Label>Status</Label>
            <div className="flex items-center gap-x-5">
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
            </div>
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
        <div className="grid grid-cols-2 gap-x-10 mb-10">
          <Field>
            <Label>Feature posts</Label>
            <Toggle on={watchHot ===  true} onClick={() => setValue("hot", !watchHot)}></Toggle>
          </Field>
        </div>
        <Button type="submit" className="mx-auto max-w-xs">
          Add new post
        </Button>
      </form>
    </PostAddNewStyles>
  );
};

export default PostAddNew;