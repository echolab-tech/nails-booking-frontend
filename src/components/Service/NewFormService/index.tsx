"use client"
import React, { useEffect, useState } from 'react';
import './style.scss';
import Select from 'react-tailwindcss-select';
import ToggleState from './ToggleState';
import { Formik, Field, Form, ErrorMessage, FieldArray } from 'formik';
import * as Yup from 'yup';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { service } from '@/services/service.service';
import { getCategories } from '@/services/categories.service';
import { CATEGORYESHOW } from '@/types/CategoryEdit';
import { getAssistants } from '@/services/assistants.service';
import { BsFillTrashFill } from 'react-icons/bs';
import { AiFillPlusCircle } from "react-icons/ai";

const ServiceSingleNew = () => {
    const [selectedOption, setSelectedOption] = useState(null);
    const [categoryData, setCategoryData] = useState<CATEGORYESHOW[]>([]);
    const [assistantData, setAssistantData] = useState([]);
    const [selectedOptionPriceType, setselectedOptionPriceType] = useState(null);

    const handleChange = (selectedOption: any) => {
        setSelectedOption(selectedOption);
    };
    const handleChangeOptionPriceType = (selectedOptionPriceType: any) => {
        setselectedOptionPriceType(selectedOptionPriceType);
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

    const optionPriceType = [
        { value: '1', label: 'Fixed' },
        { value: '2', label: 'Type 1' },
        { value: '3', label: 'Type 2' },
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
            setAssistantData(response.data.assistants);
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

    const [showDialog, setShowDialog] = useState(false);

    const toggleDialog = () => {
        setShowDialog(!showDialog);
    };

    const removeFromList = (index, values, setValues) => {
        const updatedServiceOptions = values.serviceOptions.filter((_, i) => i !== index);
        setValues({ ...values, serviceOptions: updatedServiceOptions });
    };

    const updateForm = (values, setValues) => {
        const newServiceOptions = {
            name: null,
            time: null,
            price: null,
            serviceOptionAssistants: [
                {
                    name: null,
                    time: null,
                    price: null,
                    assistant_id: null,
                    service_option_id: null
                }
            ]
        };
        setValues({ ...values, serviceOptions: [...values.serviceOptions, newServiceOptions] });
    };

    const [selectedOptionTime, setSelectedOptionTime] = useState(null);
    const ChangeSelectedTime = (selectedOptionTime: any) => {
        setSelectedOptionTime(selectedOptionTime);
    };

    const CreatedService = Yup.object().shape({
        name: Yup.string().min(2).max(50).required(),
        description: Yup.string().min(2).max(50).required(),
    });

    const handleSubmit = (values, { resetForm }) => {
        values.service_category_id = selectedOptionCategory?.id || '';

       if (Array.isArray(values.serviceOptions) && values.serviceOptions.length > 0) {
            values.serviceOptions.forEach((option, index) => {
                values.serviceOptions[index]['time'] = selectedOptionTime?.value || '';
                values.serviceOptions[index]['price_type'] = selectedOptionPriceType?.value || '';

                if (values.serviceOptions[index].serviceOptionAssistants[0]["name"] == null) {
                    values.serviceOptions[index].serviceOptionAssistants = []
                }
            });
         }

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
                            name: null,
                            description: null,
                            service_category_id: null,
                            is_booking_online: 0,
                            assistantServices: [],
                            serviceOptions: [
                                {
                                    name: null,
                                    time: null,
                                    price: null,
                                    price_type: null,
                                    serviceOptionAssistants: [
                                        {
                                            name: null,
                                            time: null,
                                            price: null,
                                            assistant_id: null,
                                            service_option_id: null,
                                            price_type: null

                                        }
                                    ]
                                }
                            ],
                        }}           
                        validationSchema={CreatedService}


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
                                <div className="p-6.5 border-assistant">
                                    <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                                        <div className='flex flex-col'>
                                            <b>Pricing and Time</b>
                                            <span>Add the pricing options and Time of the service.</span>
                                        </div>
                                    </label>
                                    <FieldArray name="serviceOptions">
                                        {() =>
                                            values.serviceOptions.map((item, i) => (
                                                <div key={i} className='border-option p-6.5 border-basic-info'>
                                                    <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                                                        <div className="w-full xl:w-1/2">
                                                            <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                                                                <b>Pricing option {i + 1}</b>
                                                            </label>
                                                        </div>
                                                        {values.serviceOptions.length > 1 && (
                                                            <div className="w-full xl:w-1/2 flex justify-end items-center">
                                                                <div className="ml-auto">
                                                                    <button onClick={()=> removeFromList(i, values, setValues)}>
                                                                        <span>
                                                                            <BsFillTrashFill />
                                                                        </span>
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                                                        <div className="w-full xl:w-1/3">
                                                            <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                                                                Time <span className="text-meta-1">*</span>
                                                            </label>
                                                            <Select value={selectedOptionTime} onChange={ChangeSelectedTime} options={optionTime}
                                                                isSearchable={true} name={`serviceOptions.${i}.time`} placeholder="Search..."
                                                                primaryColor={''} />
                                                        </div>
                                                        <div className="w-full xl:w-1/3">
                                                            <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                                                                Price type <span className="text-meta-1">*</span>
                                                            </label>
                                                               <Select value={selectedOptionPriceType} onChange={handleChangeOptionPriceType} options={optionPriceType}
                                                                    isSearchable={true} name={`serviceOptions.${i}.price_type`} placeholder="Search..."
                                                                    primaryColor={''} />
                                                        </div>
                                                        <div className="w-full xl:w-1/3">
                                                            <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                                                                Price <span className="text-meta-1">*</span>
                                                            </label>
                                                            <Field name={`serviceOptions.${i}.price`} type="text" placeholder="$0.00"
                                                                className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-1.5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary" />
                                                        </div>
                                                    </div>
                                                    <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                                                        <div className="w-full">
                                                            <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                                                                Pricing name (Optional)
                                                            </label>
                                                            <Field name={`serviceOptions.${i}.name`} type="text" placeholder="Eg: Long hair"
                                                                className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-1.5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary" />
                                                        </div>
                                                    </div>
                                                    <div className="flex flex-col gap-6 xl:flex-row">
                                                        <div className="w-full xl:w-1/2">
                                                            <button className="block text-sm font-medium text-blue-500 dark:text-blue-500"
                                                                onClick={toggleDialog} type="button">
                                                                Advanced pricing options
                                                            </button>
                                                        </div>
                                                    </div>



                                                    {showDialog && (
                                                    <FieldArray name={`serviceOptions.${i}.serviceOptionAssistants`}>
                                                        {({ push, remove }) => (
                                                            <div>
                                                                {item.serviceOptionAssistants.map((assistant, index) => (
                                                                    <div key={index}
                                                                        className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                                                                        <div className="bg-white py-6 px-6 rounded-lg shadow-lg w-10/12 md:w-9/12 lg:w-8/12 xl:w-7/12 mx-auto">
                                                                           <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                                                                                <div className="w-full xl:w-1/3">
                                                                                    <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                                                                                        Time <span className="text-meta-1">*</span>
                                                                                    </label>
                                                                                    <Select value={selectedOptionTime} onChange={ChangeSelectedTime} options={optionTime}
                                                                                        isSearchable={true} name={`serviceOptions.${i}.time`} placeholder="Search..."
                                                                                        primaryColor={''} />
                                                                                </div>
                                                                                <div className="w-full xl:w-1/3">
                                                                                    <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                                                                                        Price type <span className="text-meta-1">*</span>
                                                                                    </label>
                                                                                    <Select value={selectedOptionPriceType} onChange={handleChangeOptionPriceType} options={optionTime}
                                                                                        isSearchable={true}
                                                                                        name={`serviceOptions.${i}.price_type`}
                                                                                        placeholder="Search..." primaryColor={''} />
                                                                                </div>
                                                                                <div className="w-full xl:w-1/3">
                                                                                    <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                                                                                        Price <span className="text-meta-1">*</span>
                                                                                    </label>
                                                                                    <Field name={`serviceOptions.${i}.price`} type="text" placeholder="$0.00"
                                                                                        className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-1.5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary" />
                                                                                </div>
                                                                            </div>
                                                                            <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                                                                                <div className="w-full">
                                                                                    <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                                                                                        Pricing name (Optional)
                                                                                    </label>
                                                                                    <Field name={`serviceOption.${i}.name`} type="text" placeholder="Eg: Long hair"
                                                                                        className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-1.5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary" />
                                                                                </div>
                                                                            </div>
                                                                            
                                                                            <div className="flex flex-col gap-6 px-5 w-full" style={{ maxHeight: '300px' ,
                                                                                overflowY: 'auto' }}>
                                                                                <div className="flex flex-col gap-6 xl:flex-row">
                                                                                    <div className="w-full xl:w-1/4 flex mt-5 items-center">
                                                                                        <img src="https://didongviet.vn/dchannel/wp-content/uploads/2023/08/hinh-nen-3d-hinh-nen-iphone-dep-3d-didongviet@2x-576x1024.jpg"
                                                                                            alt="" className="rounded-full w-16 h-16 mr-3" />
                                                                                        <label className="block text-sm font-medium text-black dark:text-white">
                                                                                            {assistant.name}
                                                                                        </label>
                                                                                    </div>
                                                                                    <div className="w-full xl:w-1/4">
                                                                                        <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                                                                                            Time <span className="text-meta-1">*</span>
                                                                                        </label>
                                                                                        <Select value={selectedOption} onChange={handleChange} options={optionTime}
                                                                                            isSearchable={true} placeholder="Search..." primaryColor={''} />
                                                                                    </div>
                                                                                    <div className="w-full xl:w-1/4">
                                                                                        <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                                                                                            Price type <span className="text-meta-1">*</span>
                                                                                        </label>
                                                                                        <Select value={selectedOptionPriceType} onChange={handleChangeOptionPriceType} options={optionPriceType}
                                                                                            isSearchable={true} placeholder="Search..." primaryColor={''} />
                                                                                    </div>
                                                                                    <div className="w-full xl:w-1/4">
                                                                                        <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                                                                                            Price <span className="text-meta-1">*</span>
                                                                                        </label>
                                                                                        <Field type="text" placeholder="$0.00"
                                                                                            className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-1.5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary" />
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                            <div className="mb-4.5 flex flex-col gap-6 xl:flex-row justify-end px-5">
                                                                                <button className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                                                                                    onClick={toggleDialog}>
                                                                                    Close
                                                                                </button>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        )}
                                                    </FieldArray>
                                                    )}
                                                </div>
                                            ))
                                        }
                                    </FieldArray>
                                    <button className="flex items-center text-sm font-medium text-blue-500 dark:text-blue-500" type="button"
                                        onClick={()=> updateForm(values, setValues)}
                                        >
                                        Add pricing option
                                        <AiFillPlusCircle />
                                    </button>
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
