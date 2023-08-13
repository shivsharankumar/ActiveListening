import React, { useState, useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import callAPI from "../utils/callApi";
const initialValues = {
  level: "",
  date: "",
};

/* The `validationSchema` constant is defining the validation rules for the form fields in the `MyForm`
component. It is using the Yup library to create a validation schema object. */
const validationSchema = Yup.object().shape({
  level: Yup.string().required("Level is required"),
  date: Yup.date()
    .required("Date is required")
    .test(
      "is-current-date",
      "You can only select the current date",
      function (value) {
        return new Date(value).toDateString() === new Date().toDateString();
      },
    ),
});

const MyForm = () => {
  const [labelOptions, setLabelOptions] = useState([]);
  const [message, setMessage] = useState(null);

  const resetFormToInitialState = (formik) => {
    formik.resetForm({
      values: initialValues,
    });
  };

  useEffect(() => {
    async function fetchLabelOptions() {
      try {
        const response = await callAPI("GET", "get-label-options/", "");
        console.log(response);
        setLabelOptions(response.label_options);
      } catch (error) {
        console.error("Error fetching label options:", error);
      }
    }

    fetchLabelOptions();
  }, []);

  /**
   * The function `handleDeleteButton` sends a POST request to delete listening levels and handles the
   * response and error messages.
   */
  const handleDeleteButton = async () => {
    const currentDate = new Date();

    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, "0");
    const day = String(currentDate.getDate()).padStart(2, "0");

    const formattedDate = `${year}-${month}-${day}`;
    const value = { date: formattedDate };
    try {
      const response = await callAPI("POST", "delete-listening-levels/", value);
      console.log("response", response);
      setMessage(response);
      resetFormToInitialState();
    } catch (error) {
      console.error("Error:", error.response.data);
      setMessage(error);
    }
  };
  /**
   * The handleSubmit function is an asynchronous function that handles form submission by making a
   * POST request to an API endpoint and updating the message state based on the response or error.
   * @param values - The `values` parameter is an object that contains the form values submitted by the
   * user. It typically includes the input values from the form fields.
   */
  const handleSubmit = async (values, { setSubmitting }) => {
    console.log(`Submit`, values);
    try {
      const response = await callAPI("POST", "save-listening-level/", values);
      setMessage(response);
    } catch (error) {
      console.error("Error:", error.response.data);
      setMessage(error);
    }
    setSubmitting(false);
  };

  return (
    <div className="Home">
      <div className="flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold mb-4">
          Select Your Listening Labels
        </h1>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form className="max-w-md w-full bg-white p-6 rounded-lg shadow-md">
              <div className="mb-4">
                <label
                  htmlFor="level"
                  className="block font-medium text-gray-800"
                >
                  Level
                </label>
                <Field
                  as="select"
                  name="level"
                  className="mt-1 p-2 border rounded-lg w-full"
                >
                  <option value="" label="Select a level" />
                  {labelOptions.map((option) => (
                    <option
                      key={option[0]}
                      value={option[0]}
                      label={option[1]}
                    />
                  ))}
                </Field>
                <ErrorMessage
                  name="level"
                  component="div"
                  className="text-red-600 mt-2"
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="date"
                  className="block font-medium text-gray-800"
                >
                  Date
                </label>
                <Field
                  type="date"
                  name="date"
                  className="mt-1 p-2 border rounded-lg w-full"
                />
                <ErrorMessage
                  name="date"
                  component="div"
                  className="text-red-600 mt-2"
                />
              </div>
              <div>
                <button
                  type="submit"
                  className="bg-[#455964] text-white px-4 py-2 rounded-lg disabled:bg-gray-400"
                  disabled={isSubmitting}
                >
                  Submit
                </button>
                {message && (
                  <div
                    className={`mt-2 text-${
                      message.status === 200 ? "green" : "red"
                    }-600`}
                  >
                    {message.message}
                    {message.status === 201 ? (
                      <div>
                        Do you want to delete Record?{" "}
                        <button
                          type="button"
                          onClick={handleDeleteButton}
                          className="borderborder border-blue-500 hover:border-blue-700 text-blue-500 hover:text-blue-700 font-bold py-2 px-4 rounded text-xs"
                        >
                          Delete Now
                        </button>
                      </div>
                    ) : (
                      ""
                    )}
                  </div>
                )}
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default MyForm;
