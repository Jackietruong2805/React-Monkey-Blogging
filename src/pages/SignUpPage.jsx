import slugify from 'slugify';
import React, { useEffect, useState } from 'react';
import InputTogglePassword from '../components/input/InputTogglePassword';
import AuthenticationPage from './AuthenticationPage';
import * as yup from "yup";
import {createUserWithEmailAndPassword, updateProfile} from 'firebase/auth';
import {auth, db} from "../firebase/firebase-config";
import { yupResolver } from "@hookform/resolvers/yup";
import { userRole, userStatus } from '../utils/constants';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { NavLink, useNavigate } from 'react-router-dom';
import { Label } from '../components/label';
import { Input } from '../components/input';
import { Field } from '../components/field';
import { Button } from '../components/button';
import { addDoc, collection, doc, serverTimestamp, setDoc } from 'firebase/firestore';

const schema = yup.object().shape({
    fullname: yup.string().required("Please enter your Fullname"),
    email: yup.string().email("Your Email is inValid").required("Please enter your Email address"),
    password: yup.string().min(8, "Your password must be at least 8 characters").required("Please enter your Password"),
});

const SignUpPage = () => {
    const navigate = useNavigate();
    const {control, handleSubmit, formState: {errors, isValid, isSubmitting}, watch} = useForm({
        resolver: yupResolver(schema),
        mode: "onBlur", // validate khi input bị focus rồi mất focus
    });
    
    const handleSignUp = async (values) =>{
        if(!isValid) return;
        await createUserWithEmailAndPassword(auth, values.email, values.password);
        await updateProfile(auth.currentUser, {
            displayName: values.fullname,
            photoURL: "https://images.unsplash.com/photo-1606041008023-472dfb5e530f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=388&q=80"
        })
        const colRef = collection(db, 'users');
        // Tạo và lấy auth.currentUser.uid làm id của user 
        await setDoc(doc(db, "users", auth.currentUser.uid), {
            fullname: values.fullname,
            email: values.email,
            password: values.password,
            username: slugify(values.fullname, {lower: true}),
            avatar: "https://images.unsplash.com/photo-1606041008023-472dfb5e530f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=388&q=80",
            status: userStatus.ACTIVE,
            role: userRole.USER,
            createdAt: serverTimestamp()
        })

        // await addDoc(colRef, {
        //     fullname: values.fullname,
        //     email: values.email,
        //     password: values.password
        // })

        toast.success("Create user successfully!!!");
        navigate('/');
    }
    useEffect(()=>{
        const arrayError = Object.values(errors);
        if(arrayError.length > 0){
            toast.error(arrayError[0]?.message);
        }
    }, [errors])
    useEffect(()=>{
        document.title = "Register Page";
    }, []);
    return (
        <AuthenticationPage>
                <form className='form' onSubmit={handleSubmit(handleSignUp)} autoComplete="off">
                    <Field>
                        <Label htmlFor='fullname'>FullName</Label>
                        <Input name='fullname' type="text" placeholder='Enter your fullname' control={control}></Input>
                    </Field>
                    <Field>
                        <Label htmlFor='email'>Email</Label>
                        <Input name='email' type="email" placeholder='Enter your email address' control={control}/>
                    </Field>
                    <Field>
                        <Label htmlFor='password'>Password</Label>
                        <InputTogglePassword control={control}></InputTogglePassword>
                    </Field>
                    <div className='have-account'>
                        You already have an account? <NavLink to={'/sign-in'}>Login</NavLink>
                    </div>
                    <Button type='submit' className='mx-auto' disabled={isSubmitting} isLoading={isSubmitting}>Sign Up</Button>
                </form>
        </AuthenticationPage>
    );
};

export default SignUpPage;