import slugify from 'slugify';
import React, { useEffect } from 'react';
import DashboardHeading from '../dashboard/DashboardHeading';
import {doc, getDoc, updateDoc} from 'firebase/firestore';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { Radio } from '../../components/checkbox';
import { Label } from '../../components/label';
import { Input } from '../../components/input';
import { Field, FieldCheckboxes } from '../../components/field';
import { db } from '../../firebase/firebase-config';
import { categoryStatus } from '../../utils/constants';
import { Button } from '../../components/button';

const CategoryUpdate = () => {
    const {control, watch, reset, handleSubmit, formState: {isSubmitting, isValid}} = useForm({
        model: 'onChange',
        defaultValues: {
            status: 1
        }
    });
    const watchStatus = +watch('status');
    const [params] = useSearchParams();
    const categoryId = params.get('id');
    const navigate = useNavigate();
    useEffect(()=>{
        async function fetchData(){
            const colRef = doc(db, "categories", categoryId);
            const singleDoc = await getDoc(colRef);
            reset(singleDoc.data());   
        }
        fetchData();
    }, [categoryId]);
    const handleUpdateCategory = async (values)=>{
        const colRef = doc(db, "categories", categoryId);
        await updateDoc(colRef, {
            name: values.name,
            slug: slugify(values.slug || values.title, {lower: true}),
            status: +values.status
        });
        toast.success("Update category successfully");
        navigate("/manage/category");
    }
    if(!categoryId) return null;
    return (
        <div>
            <DashboardHeading title='Update category' desc={`Update your category id: ${categoryId}`}></DashboardHeading>
            <form onSubmit={handleSubmit(handleUpdateCategory)}>
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
                    Update category
                </Button>
            </form>
        </div>
    );
};

export default CategoryUpdate;