"use client"
import React, { ReactElement, useState } from 'react';
import './style.scss';
import { BsFileMinusFill, BsFilePlusFill } from 'react-icons/bs';
import Select from 'react-tailwindcss-select';
import ToggleState from "./ToggleState";
import { AiFillPlusCircle } from "react-icons/ai";
import { BsFillTrashFill } from "react-icons/bs";
const ServiceSingleNew = () => {
    // const [items, setItems] = useState<ReactElement[]>([]);

    // const handleAddItem = () => {
    //     const newItem = (
    //         <div key={items.length} className="mb-4.5 flex flex-col gap-6 xl:flex-row">
    //             <div className="w-full xl:w-1/2">
    //                 <label className="mb-3 block text-sm font-medium text-black dark:text-white">
    //                     Price
    //                 </label>
    //                 <input
    //                     type="text"
    //                     placeholder="Price"
    //                     className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
    //                 />
    //             </div>
    //             <div className="w-full xl:w-1/2">
    //                 <label className="mb-3 block text-sm font-medium text-black dark:text-white">
    //                     Service Length
    //                 </label>
    //                 <div className='flex items-center'>
    //                     <input
    //                         type="text"
    //                         placeholder="Service Length"
    //                         className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
    //                     />
    //                     <button onClick={() => handleRemoveItem(items.length)} className="ml-2 flex items-center justify-center h-full">
    //                         <BsFileMinusFill
    //                             className="text-black dark:text-white"
    //                             style={{ transform: 'translateY(10%)', fontSize: '2rem' }}
    //                         />
    //                     </button>
    //                 </div>
    //             </div>
    //         </div>
    //     );

    //     setItems([...items, newItem]);
    // };
    // const handleRemoveItem = (indexToRemove: any) => {
    //     const updatedItems = items.filter((item, index) => index !== indexToRemove);
    //     setItems(updatedItems);
    // };
    const [showDialog, setShowDialog] = useState(false);

    const toggleDialog = () => {
        setShowDialog(!showDialog);
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
    
    const [numOptions, setNumOptions] = useState(1);

    const addPricingOption = () => {
        setNumOptions(prevNumOptions => prevNumOptions + 1);
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
                        <div className="p-6.5 border-basic-info">
                            <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                                <b>Basic Info</b>
                            </label>
                            <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                                <div className="w-full xl:w-1/2">
                                    <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                                        Service Name
                                    </label>
                                    <input
                                    type="text"
                                    placeholder="Enter single name"
                                    className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-1.5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
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
                                <div className="w-full">
                                    <textarea
                                        className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                    ></textarea>
                                </div>
                            </div>
                        </div>
                        <div className="p-6.5 boder-toggle">
                            <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                                <b>Online Booking</b>
                            </label>
                            <ToggleState />
                        </div>
                        <div className="p-6.5 boder-assistant" style={{ maxHeight: '300px', overflowY: 'auto' }}>
                            <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                                <b>Assistant</b>
                            </label>
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
                        </div>
                        <div className="p-6.5 boder-assistant">
                            <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                                <div className='flex flex-col'>
                                    <b>Pricing and Duration</b>
                                    <span>Add the pricing options and duration of the service.</span>
                                </div>
                            </label>
                            {[...Array(numOptions)].map((_, index) => (
                                <div key={index} className='boder-option'>
                                    <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                                        <div className="w-full xl:w-1/2">
                                            <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                                                <b>Pricing option {index + 1}</b>
                                            </label>
                                        </div>
                                        <div className="w-full xl:w-1/2 flex justify-end items-center">
                                            <div className="ml-auto">
                                                <button className="flex items-center bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                                                    <span><BsFillTrashFill /></span>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                                        <div className="w-full xl:w-1/3">
                                            <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                                                Duration <span className="text-meta-1">*</span>
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
                                            <input
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
                                            <input
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
                            ))}
                            <div className="px-3">
                                <label className="flex items-center block text-sm font-medium text-blue-500 dark:text-blue-500" onClick={addPricingOption}>
                                    <AiFillPlusCircle />
                                    Add pricing option
                                </label>
                            </div>

                            {showDialog && (
                                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50" >
                                    <div className="bg-white rounded-lg shadow-lg w-10/12 md:w-9/12 lg:w-8/12 xl:w-7/12 mx-auto">
                                        <div className="mb-4.5 mt-4.5 flex flex-col gap-1 xl:flex-row px-5">
                                            <div className="w-full xl:w-1/3">
                                                <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                                                    Duration <span className="text-meta-1">*</span>
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
                                                <input
                                                    type="text"
                                                    placeholder="$0.00"
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
                                                        Trần Kim That
                                                    </label>
                                                </div>
                                                <div className="w-full xl:w-1/4">
                                                    <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                                                        Duration <span className="text-meta-1">*</span>
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
                            )}
                        </div>
                        <div className="mb-4.5 flex justify-center">
                            <a className="inline-flex items-center justify-center rounded-md bg-black px-10 py-4 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10" href="#">Created</a>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}
export default ServiceSingleNew;