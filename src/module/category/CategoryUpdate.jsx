import React from 'react';
import { useSearchParams } from 'react-router-dom';
import DashboardHeading from '../dashboard/DashboardHeading';
import { Field, FieldCheckboxes } from '../../components/field';
import { Label } from '../../components/label';
import { Radio } from '../../components/checkbox';
import { Button } from '../../components/button';
import { useForm } from 'react-hook-form';
import { categoryStatus } from '../../utils/constants';
import { Input } from '../../components/input';

const CategoryUpdate = () => {
    const {control, watch, formState: {isSubmitting, isValid}} = useForm({
        model: 'onChange',
        defaultValues: {
            status: 1
        }
    });
    const watchStatus = +watch('status');
    const [params] = useSearchParams();
    const categoryId = params.get('id');
    if(!categoryId) return null;
    return (
        <div>
            <DashboardHeading title='Update category' desc={`Update your category id: ${categoryId}`}></DashboardHeading>
            <form>
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