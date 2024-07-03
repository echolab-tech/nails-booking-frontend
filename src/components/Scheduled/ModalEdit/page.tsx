import { Schedule } from "@/types/Schedule";
import { Form, Formik } from "formik";
import Image from "next/image";
import { useCallback } from "react";
import * as Yup from "yup";

interface props {
    startTime: string,
    endTime: string
    toggle: (value: string) => void
    handleSaveEdit: (value: any) => void
    setStartTime: (value: any) => void
    setEndTime: (value: any) => void
}

export default function ModalEdit ({startTime, endTime, toggle, handleSaveEdit, setEndTime, setStartTime}:props) {

    const ScheduleNewSchema = Yup.object().shape({
        start_time: Yup.string()
    
          .required("Required"),
        end_time: Yup.string()
    
          .required("Required"),
      });

      const handleChangeStartTime = useCallback((text:any) => {
        setStartTime(text.target.value)
      },[])
      const handleChangeEndTime = useCallback((text:any) => {
        setEndTime(text.target.value)
      },[])
    return (
        <>
        <div className="fixed inset-0 z-50 flex  items-center justify-center overflow-y-auto overflow-x-hidden outline-none focus:outline-none">
          <div className="relative mx-auto my-6 w-auto max-w-3xl">
            {/*content*/}
            <div className="relative flex  w-[500px] flex-col rounded-lg border-0 bg-white shadow-lg outline-none focus:outline-none">
              {/*header*/}
              <div className="border-blueGray-200 flex items-start justify-between rounded-t border-b border-solid p-2">
                <button
                  className="float-right ml-auto flex border-0"
                  onClick={() => toggle("")}
                >
                  <span className="flex h-6 w-6 items-center bg-transparent text-3xl text-black  outline-none focus:outline-none">
                    ×
                  </span>
                </button>
              </div>
              {/*body*/}
              <Formik
                enableReinitialize={true}
                initialValues={{
                  start_time: startTime,
                  end_time: endTime,
                }}
                validationSchema={ScheduleNewSchema}
                onSubmit={(
                  values: Schedule,
                  { resetForm },
                ) => {
                  handleSaveEdit(values);
                  resetForm();

                }}
              >
                {({
                  errors,
                  touched,
                  validateField,
                  validateForm,
                  setFieldValue,
                }) => (
                  <Form>
                    <div className="w-full  p-5">
                      <div className="flex items-center gap-5">
                        <div className="w-[50%]">
                          <p className="w-max cursor-pointer text-sm font-semibold text-black dark:text-white">
                            Start time
                          </p>
                          <select
                            className="w-[100%] rounded-xl border"
                            name="start_time"
                            id="frm-whatever"
                            value={startTime}
                            onChange={(text) =>
                              handleChangeStartTime(text)
                            }
                          >
                            
                            <option value="0:00">0:00</option>
                            <option value="1:00">1:00</option>
                            <option value="2:00">2:00</option>
                            <option value="3:00">3:00</option>
                            <option value="4:00">4:00</option>
                            <option value="5:00">5:00</option>
                            <option value="6:00">6:00</option>
                            <option value="7:00">7:00</option>
                            <option value="8:00">8:00</option>
                            <option value="9:00">9:00</option>
                            <option value="10:00">
                              10:00
                            </option>
                            <option value="11:00">
                              11:00
                            </option>
                            <option value="12:00">
                              12:00
                            </option>
                            <option value="13:00">
                              13:00
                            </option>
                            <option value="14:00">
                              14:00
                            </option>
                            <option value="15:00">
                              15:00
                            </option>
                            <option value="16:00">
                              16:00
                            </option>
                            <option value="17:00">
                              17:00
                            </option>
                            <option value="18:00">
                              18:00
                            </option>
                            <option value="19:00">
                              19:00
                            </option>
                            <option value="20:00">
                              20:00
                            </option>
                            <option value="21:00">
                              21:00
                            </option>
                            <option value="22:00">
                              22:00
                            </option>
                            <option value="23:00">
                              23:00
                            </option>
                          </select>
                        </div>
                        <p className="mt-5 w-max cursor-pointer text-xl font-semibold text-black dark:text-white">
                          -
                        </p>
                        <div className="w-[50%]">
                          <p className="w-max cursor-pointer text-sm font-semibold text-black dark:text-white">
                            End time
                          </p>
                          <select
                            className="w-[100%] rounded-xl border"
                            name="end_time"
                            id="frm-whatever"
                            onChange={(text) =>
                              handleChangeEndTime(text)
                            }
                          >
                            <option value="">
                              {endTime}
                            </option>
                            <option value="0:00">0:00</option>
                            <option value="1:00">1:00</option>
                            <option value="2:00">2:00</option>
                            <option value="3:00">3:00</option>
                            <option value="4:00">4:00</option>
                            <option value="5:00">5:00</option>
                            <option value="6:00">6:00</option>
                            <option value="7:00">7:00</option>
                            <option value="8:00">8:00</option>
                            <option value="9:00">9:00</option>
                            <option value="10:00">
                              10:00
                            </option>
                            <option value="11:00">
                              11:00
                            </option>
                            <option value="12:00">
                              12:00
                            </option>
                            <option value="13:00">
                              13:00
                            </option>
                            <option value="14:00">
                              14:00
                            </option>
                            <option value="15:00">
                              15:00
                            </option>
                            <option value="16:00">
                              16:00
                            </option>
                            <option value="17:00">
                              17:00
                            </option>
                            <option value="18:00">
                              18:00
                            </option>
                            <option value="19:00">
                              19:00
                            </option>
                            <option value="20:00">
                              20:00
                            </option>
                            <option value="21:00">
                              21:00
                            </option>
                            <option value="22:00">
                              22:00
                            </option>
                            <option value="23:00">
                              23:00
                            </option>
                          </select>
                        </div>

                        <Image
                          className="mt-5 cursor-pointer"
                          //   onClick={() => deleteHandler(input.id, data.days)}
                          src="/images/scheduled/trash.svg"
                          alt="delete"
                          width={30}
                          height={30}
                        />
                      </div>
                    </div>
                    <div className=" flex items-center justify-center rounded-b  p-6">
                      <button
                        className="text-white bg-bodydark mb-1 mr-10 px-6 py-3 rounded text-sm font-bold uppercase outline-none transition-all duration-150 ease-linear focus:outline-none"
                        type="submit"
                        onClick={() => toggle("")}
                      >
                        Cancel
                      </button>
                      <button
                        className="active:bg-primary-800 mb-1 ml-10 rounded bg-primary px-6 py-3 text-sm font-bold uppercase text-white shadow outline-none transition-all duration-150 ease-linear hover:shadow-lg focus:outline-none"
                        type="submit"

                        // onClick={() => toggle("")}
                      >
                        Save
                      </button>
                    </div>
                  </Form>
                )}
              </Formik>
              {/*footer*/}
            </div>
          </div>
        </div>
        <div className="fixed inset-0 z-40 bg-black bg-opacity-20 opacity-10"></div>
      </>
    )
}