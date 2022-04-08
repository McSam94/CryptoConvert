import * as React from "react";
import classnames from "classnames";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import emailjs from "@emailjs/browser";
import Icon from "@components/Icon";
import Modal from "@components/Modal";

const ReportIssue: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = React.useState<boolean>(false);

  const [isSubmitting, setIsSubmitting] = React.useState<boolean>(false);
  const [errorMessage, setErrorMessage] = React.useState<string>("");
  const [isSubmitted, setIsSubmitted] = React.useState<boolean>(false);

  const contactSchema = React.useMemo(
    () =>
      yup.object().shape({
        name: yup.string().required("Please enter your name"),
        email: yup
          .string()
          .email("Invalid email format")
          .required("I need your email to get back to you"),
        message: yup.string().required("No issue?"),
      }),
    []
  );

  const {
    handleSubmit,
    register,
    reset,
    formState: { errors, isValid },
  } = useForm({
    mode: "onChange",
    resolver: yupResolver(contactSchema),
  });

  const shouldShowErrorMessage = React.useMemo(
    () => !isValid && Object.keys(errors).length > 0,
    [isValid, errors]
  );

  const toggleModal = React.useCallback(
    () => setIsModalOpen((prevState) => !prevState),
    []
  );

  const reportIssue = React.useCallback(
    async (data) => {
      setIsSubmitting(true);
      emailjs
        .send(
          "default_service",
          "template_7bdhymp",
          data,
          "user_NsNgWASzmF3ENY3FkbsvW"
        )
        .then(
          () => {
            setErrorMessage("");
            setIsSubmitted(true);
          },
          () => {
            setErrorMessage("Something went wrong. Please try again later.");
          }
        )
        .finally(() => {
          setIsSubmitting(false);
          reset();
        });
    },
    [reset]
  );

  return (
    <>
      <div
        className="flex flex-row items-center justify-center cursor-pointer space-x-2 p-2"
        onClick={() => setIsModalOpen(true)}
      >
        <Icon name="report" color="white" />
        <div className="text-xs font-semibold">Report an issue.</div>
      </div>
      <Modal isOpen={isModalOpen} toggleModal={toggleModal}>
        <div className="flex flex-col space-y-4 p-6">
          <div className="text-xl font-semibold">Report Issue</div>
          <form
            className="flex flex-col space-y-8 w-full h-full items-center"
            onSubmit={handleSubmit(reportIssue)}
          >
            <input
              className={classnames(
                "p-4 border rounded-lg basis-1/2 text-black w-full",
                {
                  "border-red-400": !!errors.name,
                }
              )}
              placeholder="Your name"
              {...register("name")}
            />
            <input
              className={classnames(
                "p-4 border rounded-lg basis-1/2 text-black w-full",
                {
                  "border-red-400": !!errors.email,
                }
              )}
              placeholder="Your email"
              {...register("email")}
            />
            <textarea
              className={classnames("p-4 border rounded-lg w-full text-black", {
                "border-red-400": !!errors.message,
              })}
              rows={10}
              placeholder="Describe what's the issue"
              {...register("message")}
            />
            {shouldShowErrorMessage ? (
              <div className="p-4 bg-red-300 border border-red-500 flex flex-col space-y-1 w-full rounded-lg">
                {Object.values(errors).map((error, idx) => (
                  <div key={idx} className="text-red-500">
                    {`> ${error.message}`}
                  </div>
                ))}
              </div>
            ) : null}
            {errorMessage ? (
              <div className="p-4 bg-red-300 border border-red-500 flex flex-col space-y-1 w-full rounded-lg">
                {"Oh no! Something went wrong :("}
              </div>
            ) : null}
            <button
              type="submit"
              disabled={!isValid || isSubmitting || isSubmitted}
              className={classnames(
                "py-4 text-base bg-gray-900 rounded-lg text-white disabled:bg-gray-900 w-full",
                {
                  "cursor-not-allowed": !isValid,
                }
              )}
            >
              {isSubmitted ? "✅ Reported" : "Report"}
            </button>
          </form>
        </div>
      </Modal>
    </>
  );
};

export default ReportIssue;
