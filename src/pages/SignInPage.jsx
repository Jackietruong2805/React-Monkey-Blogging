import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '../components/button';
import { Field } from '../components/field';
import { Input } from '../components/input';
import { Label } from '../components/label';
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import AuthenticationPage from './AuthenticationPage';
import { toast } from 'react-toastify';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { NavLink, useNavigate } from 'react-router-dom';
import { auth } from '../firebase/firebase-config';
import InputTogglePassword from '../components/input/InputTogglePassword';

const schema = yup.object().shape({
    email: yup.string().email("Your Email is inValid").required("Please enter your Email address"),
    password: yup.string().min(8, "Your password must be at least 8 characters").required("Please enter your Password"),
});

const SignInPage = () => {
    const {control, handleSubmit, formState: {isSubmitting, isValid, errors}} = useForm({
        resolver: yupResolver(schema),
        mode: "onBlur", // validate khi input bị focus rồi mất focus
    });
    const navigate = useNavigate();
    useEffect(() =>{
        document.title = 'Login Page';
        // if(!userInfo?.email) navigate("/");
        // 
    }, []); 
    const handleSignIn = async (values) =>{
        if(!isValid) return;
        await signInWithEmailAndPassword(auth, values.email, values.password);
        navigate("/");
    }
    useEffect(()=>{
        const arrayError = Object.values(errors);
        if(arrayError.length > 0){
            toast.error(arrayError[0]?.message);
        }
    }, [errors])
    return (
        <AuthenticationPage>
            <form className='form' onSubmit={handleSubmit(handleSignIn)} autoComplete="off">
                <Field>
                    <Label htmlFor='email'>Email address</Label>
                    <Input type='email' name="email" id="email" placeholder="Enter your email address" control={control}></Input>
                </Field>
                <Field>
                    <Label htmlFor='password'>Password</Label>
                    <InputTogglePassword control={control}></InputTogglePassword>
                </Field>
                <div className='have-account'>
                    You have not an account? <NavLink to={'/sign-up'}>Register an account</NavLink>
                </div>
                <Button type="submit" disabled={isSubmitting} isLoading={isSubmitting}>Sign In</Button>
            </form>
        </AuthenticationPage>
    );
};

export default SignInPage;