import { Modal, TextInput } from "flowbite-react";
import React, { useState, useEffect } from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getCategoryUpdate } from "@/services/categories.service";
import { CATEGORYESHOW } from "@/types/CategoryEdit";
import { CATEGORY } from "@/types/Category";

const UpdateCategorySchema = Yup.object().shape({
  name: Yup.string()
    .min(2, "Category name must be at least 2 characters")
    .max(50, "Category name is too long")
    .required("Category name is required"),
});

interface DialogEditProps {
  onClose: () => void;
  show: boolean;
  category: CATEGORYESHOW | null;
  updateCategoryList: () => void;
}

const DialogEdit: React.FC<DialogEditProps> = (props) => {
  const [id, setId] = useState<number | null>(null);

  useEffect(() => {
    if (props.category) {
      setId(props.category.id);
    }
  }, [props.category]);

  if (!props.category) return null;

  const handleSubmit = async (values: CATEGORY) => {
    if (id === null) return;

    try {
      await getCategoryUpdate(values, id);
      toast.success("Category updated successfully.");
      props.onClose();
      props.updateCategoryList();
    } catch (error) {
      toast.error("Failed to update category.");
    }
  };

  return (
    <Modal
      show={props.show}
      size="md"
      popup
      onClose={props.onClose}
      className="z-1"
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        minWidth: "50%",
      }}
    >
      <Modal.Header>
        <div className="text-xl font-medium text-gray-900 dark:text-white">
          Category Edit
        </div>
      </Modal.Header>
      <Modal.Body>
        <Formik
          initialValues={{ id: props.category.id, name: props.category.name }}
          validationSchema={UpdateCategorySchema}
          onSubmit={handleSubmit}
        >
          {({ errors, touched, values, handleChange, handleBlur }) => (
            <Form>
              <div className="space-y-6">
                <div className="mb-2 block">
                  <label htmlFor="name">Category Name</label>
                  <Field
                    id="name"
                    type="text"
                    placeholder="Category Name"
                    name="name"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.name}
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  />
                  {errors.name && touched.name && (
                    <span className="text-red-500 ml-1 mt-1 flex items-center text-xs font-medium tracking-wide">
                      {errors.name}
                    </span>
                  )}
                </div>
                <div className="mb-4.5 flex justify-center">
                  <button
                    type="submit"
                    className="w-full cursor-pointer rounded-lg border border-primary bg-primary p-4 text-white transition hover:bg-opacity-90"
                  >
                    Update
                  </button>
                </div>
              </div>
            </Form>
          )}
        </Formik>
      </Modal.Body>
    </Modal>
  );
};

export default DialogEdit;
