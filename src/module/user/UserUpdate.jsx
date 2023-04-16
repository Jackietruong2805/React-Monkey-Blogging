import useFirebaseImage from '../../hooks/useFirebaseImage';
import React from 'react';
import ImageUpload from '../../components/image/ImageUpload';
import DashboardHeading from '../dashboard/DashboardHeading';
import { useSearchParams } from 'react-router-dom';
import { userRole, userStatus } from '../../utils/constants';
import { useForm } from 'react-hook-form';
import { useEffect } from 'react';
import { toast } from 'react-toastify';
import { Radio } from '../../components/checkbox';
import { Label } from '../../components/label';
import { Input } from '../../components/input';
import { Field, FieldCheckboxes } from '../../components/field';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase/firebase-config';
import { Button } from '../../components/button';
import { Textarea } from '../../components/textarea';

const UserUpdate = () => {
    const {control, handleSubmit, watch, getValues, setValue, reset, formState: {isValid, isSubmitting}} = useForm({
        mode: 'onChange'
    });
    const [params] = useSearchParams();
    const userId = params.get('id');
    const watchStatus = +watch('status');
    const watchRole = +watch('role');
    const imageUrl = getValues("avatar");
    const imageRegex = /%2F(\S+)\?/gm.exec(imageUrl);
    const image_name = imageRegex?.length > 0 ? imageRegex[1] : "";
    const {
      image,
      setImage,
      progress,
      handleDeleteImage,
      handleSelectImage,
    } = useFirebaseImage(getValues, setValue, image_name, deleteAvatar);
    const handleUpdateUser = async (values)=>{
        console.log("values", values);
        if(!isValid) return;
        try{
            const colRef = doc(db, 'users', userId);
            await updateDoc(colRef, {
                ...values,
                avatar: image
            })
            toast.success("Update user information successfully!");
        }catch(error){
            console.log(error);
            toast.error("Update user failed!")
        }
    }
   
   async function deleteAvatar(){
      const colRef = doc(db, "users", userId);
      await updateDoc(colRef, {
        avatar: ""
      })
    }

    useEffect(()=>{
      setImage(imageUrl);
    },[imageUrl, setImage])

    useEffect(()=>{
        async function fetchData(){
            if(!userId) return;
            const colRef = doc(db, 'users', userId);
            const docData = await getDoc(colRef);
            reset(docData && docData.data());
        }

        fetchData()
    }, [userId, reset]);

    
    if(!userId) return null;    
    return (
        <div>
      <DashboardHeading
        title="New user"
        desc="Add new user to system"
      ></DashboardHeading>
      <form onSubmit={handleSubmit(handleUpdateUser)}>
        <div className="w-[200px] h-[200px] rounded-full mx-auto mb-10">
          <ImageUpload
            className="!rounded-full h-full"
            handleDeleteImage={handleDeleteImage}
            name="image"
            onChange={handleSelectImage}
            progress={progress}
            image={image}
          ></ImageUpload>
        </div>
        <div className="form-layout">
          <Field>
            <Label>Fullname</Label>
            <Input
              name="fullname"
              placeholder="Enter your fullname"
              control={control}
            ></Input>
          </Field>
          <Field>
            <Label>Username</Label>
            <Input
              name="username"
              placeholder="Enter your username"
              control={control}
            ></Input>
          </Field>
        </div>
        <div className="form-layout">
          <Field>
            <Label>Email</Label>
            <Input
              name="email"
              placeholder="Enter your email"
              control={control}
              type="email"
            ></Input>
          </Field>
          <Field>
            <Label>Password</Label>
            <Input
              name="password"
              placeholder="Enter your password"
              control={control}
              type="password"
            ></Input>
          </Field>
        </div>
        <div className="form-layout">
          <Field>
            <Label>Status</Label>
            <FieldCheckboxes>
              <Radio
                name="status"
                control={control}
                checked={watchStatus === userStatus.ACTIVE}
                value={userStatus.ACTIVE}
              >
                Active
              </Radio>
              <Radio
                name="status"
                control={control}
                checked={watchStatus === userStatus.PENDING}
                value={userStatus.PENDING}
              >
                Pending
              </Radio>
              <Radio
                name="status"
                control={control}
                checked={watchStatus === userStatus.BAN}
                value={userStatus.BAN}
              >
                Banned
              </Radio>
            </FieldCheckboxes>
          </Field>
          <Field>
            <Label>Role</Label>
            <FieldCheckboxes>
              <Radio
                name="role"
                control={control}
                checked={watchRole === userRole.ADMIN}
                value={userRole.ADMIN}
              >
                Admin
              </Radio>
              <Radio
                name="role"
                control={control}
                checked={watchRole === userRole.MOD}
                value={userRole.MOD}
              >
                Moderator
              </Radio>
              <Radio
                name="role"
                control={control}
                checked={watchRole === userRole.USER}
                value={userRole.USER}
              >
                User
              </Radio>
            </FieldCheckboxes>
          </Field>
        </div>
        <div className='form-layout'>
          <Field>
              <Label>Description</Label>
              <Textarea
                name='description'
                control={control}
              ></Textarea>
          </Field>
        </div>
        <Button
          type="submit"
          kind="primary"
          className="mx-auto w-[200px]"
          isLoading={isSubmitting}
          disabled={isSubmitting}
        >
          Update
        </Button>
      </form>
    </div>
    );
};

export default UserUpdate;