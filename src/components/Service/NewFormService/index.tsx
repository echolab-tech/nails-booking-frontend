"use client"
import React, { ReactElement, useState } from 'react';
import './style.scss';
import { BsFileMinusFill, BsFilePlusFill } from 'react-icons/bs';
import Select from 'react-tailwindcss-select';
const ServiceSingleNew = () => {
    const [items, setItems] = useState<ReactElement[]>([]);;

    const handleAddItem = () => {
        const newItem = (
            <div key={items.length} className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                <div className="w-full xl:w-1/2">
                    <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                        Price
                    </label>
                    <input
                        type="text"
                        placeholder="Price"
                        className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    />
                </div>
                <div className="w-full xl:w-1/2">
                    <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                        Service Length
                    </label>
                    <div className='flex items-center'>
                        <input
                            type="text"
                            placeholder="Service Length"
                            className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                        />
                        <button onClick={() => handleRemoveItem(items.length)} className="ml-2 flex items-center justify-center h-full">
                            <BsFileMinusFill
                                className="text-black dark:text-white"
                                style={{ transform: 'translateY(10%)', fontSize: '2rem' }}
                            />
                        </button>
                    </div>
                </div>
            </div>
        );

        setItems([...items, newItem]);
    };
    const handleRemoveItem = (indexToRemove: any) => {
        const updatedItems = items.filter((item, index) => index !== indexToRemove);
        setItems(updatedItems);
    };

    const options = [
        { value: 'option1', label: 'Option 1' },
        { value: 'option2', label: 'Option 2' },
        { value: 'option3', label: 'Option 3' }
    ];
    const [selectedOption, setSelectedOption] = useState(null);

    const handleChange = (selectedOption: any) => {
        setSelectedOption(selectedOption);
    };
    

    return (
        <div className="grid grid-cols-1 gap-12">
            <div className="flex flex-col gap-9">
                <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                    <div className="border-b border-stroke px-6.5 py-4 dark:border-strokedark">
                    <h3 className="font-medium text-black dark:text-white">
                        Service single New
                    </h3>
                    </div>
                    <form action="#">
                        <div className="p-6.5">
                            <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                                <div className="w-full xl:w-1/2">
                                    <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                                        Service Name
                                    </label>
                                    <input
                                    type="text"
                                    placeholder="Enter single name"
                                    className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                    />
                                </div>

                                <div className="w-full xl:w-1/2">
                                    <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                                    Category <span className="text-meta-1">*</span>
                                    </label>
                                    <Select
                                        value={selectedOption}
                                        onChange={handleChange}
                                        options={options}
                                        isSearchable={true}
                                        placeholder="Search..." primaryColor={''} />
                                </div>
                            </div>

                            <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                                <div className="w-full xl:w-1/2">
                                <textarea
                                    className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                ></textarea>
                                </div>
                            </div>
                            <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                                <div className="mb-4.5 flex flex-col gap-6 xl:flex-row ">
                                    <div className="w-full xl:w-1/2">
                                        <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                                            Price
                                        </label>
                                        <input
                                        type="text"
                                        placeholder="Price"
                                        className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                        />
                                    </div>
                                    <div className="w-full xl:w-1/2">
                                        <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                                            Service Lenght
                                        </label>
                                        <div className='flex items-center'>
                                        <input
                                            type="text"
                                            placeholder="Service Length"
                                            className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                        />
                                        <button type="button" onClick={handleAddItem} className="ml-2 flex items-center justify-center h-full">
                                            <BsFilePlusFill
                                                className="text-black dark:text-white"
                                                style={{ transform: 'translateY(10%)', fontSize: '2rem' }}
                                            />
                                        </button>
                                        </div>
                                    </div>
                                </div>
                                {items.map((item, index) => (
                                    <div key={index}>{item}</div>
                                ))}
                            </div>
                            <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                                <div className="w-full xl:w-1/3 rounded-box">
                                    <label className="checkbox-container">
                                        Option 1
                                        <input type="checkbox" />
                                        <span className="checkmark"></span>
                                    </label>
                                </div>
                                <div className="w-full xl:w-1/3 rounded-box">
                                    <label className="checkbox-container">
                                        Option 2
                                        <input type="checkbox" />
                                        <span className="checkmark"></span>
                                    </label>
                                </div>
                                <div className="w-full xl:w-1/3 rounded-box">
                                    <label className="checkbox-container">
                                        Option 3
                                        <input type="checkbox" />
                                        <span className="checkmark"></span>
                                    </label>
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
export default ServiceSingleNew;