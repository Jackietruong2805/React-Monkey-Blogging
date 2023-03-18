import React, { useState } from "react";
import { useForm } from "react-hook-form";
import slugify from "slugify";
import styled from "styled-components";
import { Button } from "../../components/button";
import { Radio } from "../../components/checkbox";
import { Dropdown } from "../../components/dropdown";
import { Field } from "../../components/field";
import { Input } from "../../components/input";
import { Label } from "../../components/label";
import { postStatus } from "../../utils/constants";
import ImageUpload from "../../components/image/ImageUpload";
import useFirebaseImage from "../../hooks/useFirebaseImage";
const PostAddNewStyles = styled.div``;

const PostAddNew = () => {
    const { control, watch, setValue, handleSubmit, getValues } = useForm({
        mode: "onChange",
        defaultValues: {
          title: "",
          slug: "",
          status: 2,
          category: "",
        },
      });
      const watchStatus = +watch("status");
      const watchCategory = watch("category");
      const addPostHandler = async (values)=>{
        let cloneValues = {...values}
        console.log('cloneValues', cloneValues);
        cloneValues.slug = slugify(cloneValues.slug || cloneValues.title);
        cloneValues.status = +cloneValues.status
        console.log('cloneValues', cloneValues);
      }
      const {image, progress, handleDeleteImage, handleSelectImage} = useFirebaseImage(getValues, setValue);
      

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
        </div>
        <div className="grid grid-cols-2 gap-x-10 mb-10">
          <Field>
            <Label>Category</Label>
            <Dropdown>
              <Dropdown.Option>Knowledge</Dropdown.Option>
              <Dropdown.Option>Blockchain</Dropdown.Option>
              <Dropdown.Option>Setup</Dropdown.Option>
              <Dropdown.Option>Nature</Dropdown.Option>
              <Dropdown.Option>Developer</Dropdown.Option>
            </Dropdown>
          </Field>
          <Field></Field>
        </div>
        <Button type="submit" className="mx-auto max-w-xs">
          Add new post
        </Button>
      </form>
    </PostAddNewStyles>
  );
};

export default PostAddNew;