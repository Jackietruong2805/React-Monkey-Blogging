import slugify from "slugify";
import React from "react";
import DashboardHeading from "../dashboard/DashboardHeading";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { Radio } from "../../components/checkbox";
import { Label } from "../../components/label";
import { Input } from "../../components/input";
import { Field, FieldCheckboxes } from "../../components/field";
import { db } from "../../firebase/firebase-config";
import { categoryStatus } from "../../utils/constants";
import { Button } from "../../components/button";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";

const CategoryAddNew = () => {
  const {
    control, handleSubmit, watch, reset, formState: {isValid, isSubmitting}
  } = useForm({
    mode: "onChange",
    defaultValues:{
        name: "",
        slug: "",
        status: 1,
        createdAt: new Date(),
    }
  });
  const handleAddNewCategory = async (values)=>{
    if(!isValid) return;
    const newValues = {...values};
    newValues.slug = slugify(newValues.slug || newValues.name, {lower: true});
    newValues.status = +newValues.status;
    const colRef = collection(db, "categories");
    try{
      await addDoc(colRef, {
        ...newValues,
        createdAt: serverTimestamp()
      })
      toast.success("Create new category successfully");
    }catch(error){
      toast.error(error.message);
    }finally{
      reset({
        name: "",
        slug: "",
        status: 1,
        createdAt: new Date(),
      });
    }
  };

  const watchStatus = +watch("status");
  return (
    <div>
      <DashboardHeading
        title="New category"
        desc="Add new category"
      ></DashboardHeading>
      <form onSubmit={handleSubmit(handleAddNewCategory)} autoComplete="off">
        <div className="form-layout">
          <Field>
            <Label>Name</Label>
            <Input
              control={control}
              name="name"
              placeholder="Enter your category name"
            ></Input>
          </Field>
          <Field>
            <Label>Slug</Label>
            <Input
              control={control}
              name="slug"
              placeholder="Enter your slug"
            ></Input>
          </Field>
        </div>
        <div className="form-layout">
          <Field>
            <Label>Status</Label>
            <FieldCheckboxes>
              <Radio name="status" control={control} checked={watchStatus === categoryStatus.APPROVED} value={categoryStatus.APPROVED}>
                Approved
              </Radio>
              <Radio name="status" control={control} checked={watchStatus === categoryStatus.UNAPPROVED} value={categoryStatus.UNAPPROVED}>
                Unapproved
              </Radio>
            </FieldCheckboxes>
          </Field>
        </div>
        <Button kind="primary" className="mx-auto w-[200px]" type='submit' disabled={isSubmitting} isLoading={isSubmitting}>
          Add new category
        </Button>
      </form>
    </div>
  );
};

export default CategoryAddNew;