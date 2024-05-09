"use client"
import React, { useState } from 'react';
import Select from "react-tailwindcss-select";
import './style.scss';

const options = [
    { value: "fox", label: "🦊 Fox" },
    { value: "Butterfly", label: "🦋 Butterfly" },
    { value: "Honeybee", label: "🐝 Honeybee" }
];
const TeamNew = () => {
    const [animal, setAnimal] = useState(null);

    const handleChange = (value: any) => {
        console.log("value:", value);
        setAnimal(value);
    };
    return (
        <div className="grid grid-cols-1 gap-12">
            <div className="flex flex-col gap-9">
                <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                    <div className="border-b border-stroke px-6.5 py-4 dark:border-strokedark">
                    <h3 className="font-medium text-black dark:text-white">
                        Team New
                    </h3>
                    </div>
                    <form action="#">
                        <div className="p-6.5">
                            <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                                <div className="w-full xl:w-1/2">
                                    <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                                        Name
                                    </label>
                                    <input
                                    type="text"
                                    placeholder="Enter your first name"
                                    className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                    />
                                </div>

                                <div className="w-full xl:w-1/2">
                                    <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                                    Email <span className="text-meta-1">*</span>
                                    </label>
                                    <input
                                    type="email"
                                    placeholder="Enter your email address"
                                    className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                    required />
                                </div>
                            </div>

                            <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                                <div className="w-full xl:w-1/2">
                                    <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                                    Phone
                                    </label>
                                    <input
                                    type="text"
                                    placeholder="Enter your phone"
                                    className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                    />
                                </div>

                                <div className="w-full xl:w-1/2">
                                    <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                                    BirthDay <span className="text-meta-1">*</span>
                                    </label>
                                    <input
                                    type="date"
                                    placeholder="Enter your email address"
                                    className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                    required />
                                </div>
                            </div>
                            <div className="mb-4.5">
                                <div className="w-full xl:w-1/2">
                                    <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                                        Service <span className="text-meta-1">*</span>
                                    </label>
                                    <Select
                                        value={animal}
                                        onChange={handleChange}
                                        options={options} primaryColor={''} 
                                        isMultiple={true}
                                        isSearchable={true}
                                    />
                                </div>
                            </div>
                            <div className="mb-4.5 flex justify-center">
                                <a className="inline-flex items-center justify-center rounded-md bg-black px-10 py-4 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10" href="#">Created</a>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}
export default TeamNew;
