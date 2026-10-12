import { Trash } from "@phosphor-icons/react";
import React from "react";
import { TextInput, PrimaryButton } from "sprint-asia-custom-component";

const MAX_ROWS = 10;

const ModalBasicInformationSection = ({ formik, isAddMode }) => {
  const payments = formik.values.payments || [];

  const handleAddRow = () => {
    if (payments.length < MAX_ROWS) {
      const newPayments = [...payments, { paymentID: "", paymentName: "" }];
      formik.setFieldValue("payments", newPayments);
    }
  };

  const handleRemoveRow = (index) => {
    const newPayments = payments.filter((_, i) => i !== index);
    formik.setFieldValue("payments", newPayments);
  };

  const handleChange = (index, field, value) => {
    // const newPayments = [...payments];
    const newPayments = JSON.parse(JSON.stringify(payments));
    newPayments[index][field] = value;
    formik.setFieldValue("payments", newPayments);
    formik.setFieldTouched(`payments[${index}].${field}`, true, false);
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="text-lg font-semibold leading-6 text-left pb-2 border-b border-neutral40">Basic Information</div>

      {payments.map((row, index) => (
        <div className="grid grid-cols-12 gap-6 items-center" key={index}>
          <div className="col-span-5">
            <TextInput
              title="Payment ID"
              placeholder="Input Payment ID"
              value={row.paymentID}
              isRequired
              onChangeInput={(e) => handleChange(index, "paymentID", e.target.value)}
              footer={
                formik.touched?.payments?.[index]?.paymentID && formik.errors?.payments?.[index]?.paymentID
                  ? formik.errors.payments[index].paymentID
                  : null
              }
              mode={
                formik.touched?.payments?.[index]?.paymentID && formik.errors?.payments?.[index]?.paymentID
                  ? "danger"
                  : "default"
              }
            />
          </div>

          <div className="col-span-5">
            <TextInput
              title="Payment Name"
              placeholder="Input Payment Name"
              value={row.paymentName}
              isRequired
              onChangeInput={(e) => handleChange(index, "paymentName", e.target.value)}
              footer={
                formik.touched?.payments?.[index]?.paymentName && formik.errors?.payments?.[index]?.paymentName
                  ? formik.errors.payments[index].paymentName
                  : null
              }
              mode={
                formik.touched?.payments?.[index]?.paymentName && formik.errors?.payments?.[index]?.paymentName
                  ? "danger"
                  : "default"
              }
            />
          </div>

          <div className="col-span-1 flex justify-center pt-6">
            {payments.length > 1 && (
              <Trash
                size="24"
                variant="Bold"
                className="text-danger500 cursor-pointer"
                onClick={() => handleRemoveRow(index)}
              />
            )}
          </div>
        </div>
      ))}

      {isAddMode && payments.length < MAX_ROWS && (
        <div>
          <div className="w-fit mt-4">
            <PrimaryButton title="+ Add" onClick={handleAddRow} />
          </div>
          <div className="mt-2">
            <span className="text-sm text-neutral300">You can only add max of 10 Payment Methods here, if you want to add more than 10 please use Bulk uploads.</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ModalBasicInformationSection;
