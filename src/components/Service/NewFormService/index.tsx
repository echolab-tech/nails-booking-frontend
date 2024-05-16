"use client"
import React, { useEffect, useState } from 'react';
import './style.scss';
import Select from 'react-tailwindcss-select';
import ToggleState from './ToggleState';
import { Formik, Field, Form, ErrorMessage, FieldArray, FormikHelpers } from 'formik';
import * as Yup from 'yup';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { service } from '@/services/service.service';
import { getCategories } from '@/services/categories.service';
import { CATEGORYESHOW } from '@/types/CategoryEdit';
import { getAssistants } from '@/services/assistants.service';
import { BsFillTrashFill } from 'react-icons/bs';
import { AiFillPlusCircle } from "react-icons/ai";
import CustomInput from './CustomInput';
import { serviceTypeNew } from '@/types/ServiceNew';

import { GrFormClose } from "react-icons/gr";

const ServiceSingleNew = () => {
    const [selectedOption, setSelectedOption] = useState(null);
    const [categoryData, setCategoryData] = useState<CATEGORYESHOW[]>([]);
    const [assistantData, setAssistantData] = useState([]);

    const handleChange = (selectedOption: any) => {
        setSelectedOption(selectedOption);
    };
    const handleChangAssistant = (assistantData: any) => {
        setCategoryData(assistantData);
    };

    const [selectedOptionCategory, setSelectedOptionCategory] = useState(null);

    const ChangeSelectedCategory = (selectedOptionCategory: any) => {
        setSelectedOptionCategory(selectedOptionCategory);
    };

    const [selectedAssistants, setSelectedAssistants] = useState([]);
    const ChangeSelectedAssistant = (selectedAssistants: any) => {
    setSelectedAssistants(selectedAssistants);
    };

    useEffect(() => {
        fetchCategories(1);
        fetchAssistant(1);
    }, []);

    const options = [
        { value: '1', label: ' min' },
        { value: '30', label: ' min' },
        { value: '2h', label: '2h' },
    ];
    const optionTime = [
        { value: '15', label: '15 min' },
        { value: '30', label: '30 min' },
        { value: '45', label: '45 min' },
        { value: '60', label: '60 min' },
        { value: '1h15', label: '1h15 min' },
        { value: '1h30', label: '1h30 min' },
        { value: '1h45', label: '1h45 min' },
        { value: '2h', label: '2h' },
        { value: '2h15', label: '2h15 min' },
        { value: '2h30', label: '2h30 min' },
        { value: '2h45', label: '2h45 min' },
        { value: '3h', label: '3h' },
        { value: '3h15', label: '3h15 min' },
        { value: '3h30', label: '3h30 min' },
        { value: '3h45', label: '3h45 min' },
        { value: '4h', label: '4h' },
        { value: '4h15', label: '4h15 min' },
        { value: '4h30', label: '4h30 min' },
        { value: '4h45', label: '4h45 min' },
        { value: '5h', label: '5h' },
    ];

    const fetchAssistant = async (page: number) => {
        try {
            const response = await getAssistants(page);
            setAssistantData(response.data.data);
        } catch (error) {
            console.error('Error fetching assistant:', error);
        }
    };

    const fetchCategories = async (page: number) => {
        try {
            const response = await getCategories(page);
            setCategoryData(response.data.data);
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };


    const CreatedService = Yup.object().shape({
        // name: Yup.string().min(2).max(50).required(),
    });

    const [showDialog, setShowDialog] = useState(false);

    const toggleDialog = () => {
        setShowDialog(!showDialog);
    };

    const removeFromList = (i, values, setValues) => {
        const serviceOption = [...values.serviceOption];
        serviceOption.splice(i, 1);
        setValues({ ...values, serviceOption });       
    };

    const updateForm = (values, setValues) => {

        const serviceOption = [...values.serviceOption];
        serviceOption.push({
            id: '',
            name: '',
            time: '',
            price: ''
        });
        setValues({ ...values, serviceOption });
    };

    const [selectedOptionTime, setSelectedOptionTime] = useState(null);
    const ChangeSelectedTime = (selectedOptionTime: any) => {
        setSelectedOptionTime(selectedOptionTime);
    };

    const handleSubmit = (values, { resetForm }) => {
        values.service_category_id = selectedOptionCategory?.id || '';
        values.serviceOption.forEach((option, index) => {
            values.serviceOption[index]['time'] = selectedOptionTime?.value || '';
        });

        service(values)
            .then((data) => {
            toast.success("You created it successfully.");
            resetForm();
        })
        .catch((error) => {
            toast.error("You failed to create a new one.");
        });
    };
    return (
        <div className="grid grid-cols-1 gap-12">
            <div className="flex flex-col gap-9">
                <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                    <div className="border-b border-stroke px-6.5 py-4 dark:border-strokedark">
                        <h3 className="font-medium text-black dark:text-white">Service single New</h3>
                    </div>
                    <Formik
                        initialValues={{
                            name: '',
                            description: '',
                            service_category_id: '',
                            is_booking_online: 0,
                            assistantServices: [],
                            serviceOption: [
                                {
                                    id: '',
                                    name: '',
                                    time: '',
                                    price: '',
                                    serviceOptionAssistants: [
                                        {
                                            id: '',
                                            name: '',
                                            time: '',
                                            price: '',
                                            assistant_id: '',
                                            service_option_id: ''
                                        }
                                    ]
                                }
                            ],
                        }}

                        onSubmit={handleSubmit}
                    >
                        {({ values, setValues }) => (
                            <Form>
                                <div className="p-6.5 border-basic-info">
                                    <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                                        <b>Basic Info</b>
                                    </label>
                                    <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                                        <div className="w-full xl:w-1/2">
                                            <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                                                Service Name
                                            </label>
                                            <Field
                                                type="text"
                                                placeholder="Name"
                                                name="name"
                                                className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-1.5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                            />
                                            <ErrorMessage name="name" component="div" className="text-red-500" />
                                        </div>
                                        <div className="w-full xl:w-1/2">
                                            <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                                                Category <span className="text-meta-1">*</span>
                                            </label>
                                            <Select
                                                value={selectedOptionCategory}
                                                onChange={ChangeSelectedCategory}
                                                options={categoryData.map((item) => ({
                                                    id: item.id,
                                                    value: item.name,
                                                    label: item.name,
                                                }))}
                                                isSearchable={true}
                                                placeholder="Search..."
                                                primaryColor=""
                                            />
                                        </div>
                                    </div>
                                    <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                                        <div className="w-full">
                                            <Field
                                                as="textarea"
                                                placeholder="Description"
                                                name="description"
                                                className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="p-6.5 border-toggle">
                                    <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                                        <b>Online Booking</b>
                                    </label>
                                    <ToggleState />
                                </div>
                                <div className="p-6.5 border-assistant" style={{ maxHeight: '300px', overflowY: 'auto' }} >
                                    <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                                        <b>Assistant</b>
                                    </label>
                                    <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                                        <FieldArray name="assistantServices">
                                            {({ push, remove }) => (
                                                <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                                                    {assistantData.map((assistant, index) => {
                                                        const isChecked = values.assistantServices.includes(assistant.id);
                                                        return (
                                                            <div key={index} className="w-full xl:w-1/3 rounded-box">
                                                                <label className="checkbox-container">
                                                                    {assistant.name}
                                                                    <Field
                                                                        name="assistantServices"
                                                                        type="checkbox"
                                                                        value={assistant.id}
                                                                        checked={isChecked}
                                                                        onChange={(e) => {
                                                                            if (e.target.checked) {
                                                                                push(assistant.id);
                                                                            } else {
                                                                                const idx = values.assistantServices.indexOf(assistant.id);
                                                                                if (idx >= 0) remove(idx);
                                                                            }
                                                                        }}
                                                                    />
                                                                    <span className="checkmark"></span>
                                                                </label>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            )}
                                        </FieldArray>
                                    </div>
                                </div>
                                <div className="p-6.5 boder-assistant">
                                    <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                                        <div className='flex flex-col'>
                                            <b>Pricing and Time</b>
                                            <span>Add the pricing options and Time of the service.</span>
                                        </div>
                                    </label>
                                    <FieldArray name="serviceOption">
                                        {() =>
                                            values.serviceOption.map((item, i) => {
                                                return (
                                                    <div key={i} className='boder-option'>
                                                        {values.serviceOption.length > 1 && (
                                                            <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                                                                <div className="w-full xl:w-1/2">
                                                                    <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                                                                        <b>Pricing option {i + 1}</b>
                                                                    </label>
                                                                </div>
                                                                <div className="w-full xl:w-1/2 flex justify-end items-center">
                                                                    <div className="ml-auto">
                                                                        <button
                                                                            onClick={() => removeFromList(i, values, setValues)}>
                                                                            <span><BsFillTrashFill /></span>
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        )}
                                                        <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                                                            <div className="w-full xl:w-1/3">
                                                                <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                                                                    Time <span className="text-meta-1">*</span>
                                                                </label>
                                                                <Select
                                                                    value={selectedOptionTime}
                                                                    onChange={ChangeSelectedTime}
                                                                    options={optionTime}
                                                                    isSearchable={true}
                                                                    name={`serviceOption.${i}.time`}                                                                name={`serviceOption.${i}.time`}
                                                                    placeholder="Search..." primaryColor={''} />
                                                            </div>
                                                            <div className="w-full xl:w-1/3">
                                                                <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                                                                    Price type <span className="text-meta-1">*</span>
                                                                </label>
                                                                <Select
                                                                    value={selectedOption}
                                                                    onChange={handleChange}
                                                                    options={categoryData.map((item) => ({
                                                                        value: item.name,
                                                                        label: item.name,
                                                                    }))}
                                                                    isSearchable={true}
                                                                    placeholder="Search..." primaryColor={''} />
                                                            </div>
                                                             <div className="w-full xl:w-1/3">
                                                                <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                                                                    Price <span className="text-meta-1">*</span>
                                                                </label>
                                                                <CustomInput
                                                                    name={`serviceOption.${i}.price`}
                                                                    type="text"
                                                                    placeholder="$0.00"
                                                                    className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-1.5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                                                            <div className="w-full">
                                                                <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                                                                    Pricing name (Optional)
                                                                </label>
                                                                <CustomInput
                                                                    name={`serviceOption.${i}.name`}
                                                                    type="text"
                                                                    placeholder="Eg: Long hair"
                                                                    className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-1.5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="flex flex-col gap-6 xl:flex-row">
                                                            <div className="w-full xl:w-1/2">
                                                                <label className="block text-sm font-medium text-blue-500 dark:text-blue-500" onClick={toggleDialog}>
                                                                    Advanced pricing options
                                                                </label>
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            })
                                        }
                                        
                                    </FieldArray>
                                    <button
                                        className="flex items-center block text-sm font-medium text-blue-500 dark:text-blue-500"
                                        type="button"
                                        onClick={(e) => updateForm(values, setValues)}
                                    >
                                        Add pricing option
                                        <AiFillPlusCircle/>
                                    </button>
                                    {showDialog && (
                                        <FieldArray name="serviceOptionAssistants">
                                            {({ push, remove }) => (
                                                <div>
                                                    {values.assistantServices.map((assistant, index) => {
                                                        return (
                                                            <div key={index} className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50" >
                                                                <div className="bg-white rounded-lg shadow-lg w-10/12 md:w-9/12 lg:w-8/12 xl:w-7/12 mx-auto">
                                                                    <div className="mb-4.5 mt-4.5 flex flex-col gap-1 xl:flex-row px-5">
                                                                        <div className="w-full xl:w-1/3">
                                                                            <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                                                                                Time <span className="text-meta-1">*</span>
                                                                            </label>
                                                                            <Select
                                                                                value={selectedOption}
                                                                                onChange={handleChange}
                                                                                options={options}
                                                                                isSearchable={true}
                                                                                placeholder="Search..." primaryColor={''} />
                                                                        </div>
                                                                        <div className="w-full xl:w-1/3">
                                                                            <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                                                                                Price type <span className="text-meta-1">*</span>
                                                                            </label>
                                                                            <Select
                                                                                value={selectedOption}
                                                                                onChange={handleChange}
                                                                                options={options}
                                                                                isSearchable={true}
                                                                                placeholder="Search..." primaryColor={''} />
                                                                        </div>
                                                                        <div className="w-full xl:w-1/3">
                                                                            <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                                                                                Price <span className="text-meta-1">*</span>
                                                                            </label>
                                                                            <Field
                                                                                type="text"
                                                                                placeholder="$0.00"
                                                                                name="price"
                                                                                className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-1.5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                    <div className="mb-4.5 flex flex-col gap-6 xl:flex-row px-5">
                                                                        <div className="w-full">
                                                                            <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                                                                                Pricing name (Optional)
                                                                            </label>
                                                                            <input
                                                                                type="text"
                                                                                placeholder="Eg: Long hair"
                                                                                className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-1.5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                    <div className="flex flex-col gap-6 px-5 w-full" style={{ maxHeight: '300px', overflowY: 'auto' }}>
                                                                        <div className="flex flex-col gap-6 xl:flex-row">
                                                                            <div className="w-full xl:w-1/4 flex mt-5 flex items-center">
                                                                                <img src="https://didongviet.vn/dchannel/wp-content/uploads/2023/08/hinh-nen-3d-hinh-nen-iphone-dep-3d-didongviet@2x-576x1024.jpg" alt="" className="rounded-full w-16 h-16 mr-3"/>
                                                                                <label className="block text-sm font-medium text-black dark:text-white">
                                                                                    {assistant.name}
                                                                                </label>
                                                                            </div>
                                                                            <div className="w-full xl:w-1/4">
                                                                                <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                                                                                    Time <span className="text-meta-1">*</span>
                                                                                </label>
                                                                                <Select
                                                                                    value={selectedOption}
                                                                                    onChange={handleChange}
                                                                                    options={options}
                                                                                    isSearchable={true}
                                                                                    placeholder="Search..." primaryColor={''} />
                                                                            </div>
                                                                            <div className="w-full xl:w-1/4">
                                                                                <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                                                                                    Price type <span className="text-meta-1">*</span>
                                                                                </label>
                                                                                <Select
                                                                                    value={selectedOption}
                                                                                    onChange={handleChange}
                                                                                    options={options}
                                                                                    isSearchable={true}
                                                                                    placeholder="Search..." primaryColor={''} />
                                                                            </div>
                                                                            <div className="w-full xl:w-1/4">
                                                                                <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                                                                                    Price <span className="text-meta-1">*</span>
                                                                                </label>
                                                                                <input
                                                                                    type="text"
                                                                                    placeholder="$0.00"
                                                                                    className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-1.5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                                                                />
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    <div className="mb-4.5 flex flex-col gap-6 xl:flex-row justify-end px-5">
                                                                        <button className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600" onClick={toggleDialog}>
                                                                            Close
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            )}
                                        </FieldArray>
                                    )}
                                </div>
                                <div className="mb-4.5 flex justify-center">
                                    <button type="submit" className="inline-flex items-center justify-center rounded-md bg-black px-10 py-2 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10">
                                        Created
                                    </button>
                                </div>
                            </Form>
                        )}
                    </Formik>
                    <ToastContainer />
                </div>
            </div>
        </div>
    );
};

export default ServiceSingleNew;
