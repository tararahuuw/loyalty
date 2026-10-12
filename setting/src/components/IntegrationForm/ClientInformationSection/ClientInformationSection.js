import React from "react";
import { DropdownText } from "sprint-asia-custom-component";

const ClientInformationSection = ({
  formik,
  clients,
  currentClient,
  divisions,
  currentDivision,
  ipAddresses,
  toggleConfirmation,
  setSelectedClient,
  setSelectedDivision,
  setDivisionIsChanged,
  roleAccess,
}) => {
  return (
    <div className="flex flex-col gap-5 bg-white rounded-lg border border-neutral40 shadow-md p-6">
      <div className="text-lg font-semibold leading-6 text-left pb-2 border-b border-neutral40">Client Information</div>

      <div className="flex flex-row items-center gap-4">
        {roleAccess !== "Client Administrator" && (
          <DropdownText
            title="Client Name"
            placeholder="Choose Client"
            options={[
              ...(currentClient && !clients?.data?.some(({ id }) => id === currentClient?.data?.id)
                ? [
                    {
                      option: currentClient?.data?.name,
                      value: currentClient?.data?.id,
                    },
                  ]
                : []),
              ...(clients?.data?.map(({ name, id }) => ({
                option: name,
                value: id,
              })) || []),
            ]}
            isRequired
            onSelect={(e) => {
              if (ipAddresses.length) {
                toggleConfirmation();
                setSelectedClient(e.value);
              } else {
                formik.setFieldValue("clientId", e.value);
                formik.setFieldTouched("clientId", true, false);
              }
            }}
            footer={(formik.touched.clientId || formik.submitCount > 0) && formik.errors.clientId ? formik.errors.clientId : null}
            mode={(formik.touched.clientId || formik.submitCount > 0) && formik.errors.clientId ? "danger" : "default"}  
            currentOption={formik.values.clientId}
            className="max-w-sm"
          />
        )}

        <DropdownText
          title="Division Name"
          placeholder="Choose Division"
          options={[
            currentDivision && {
              option: currentDivision?.data?.name,
              value: currentDivision?.data?.id,
            },
            ...(divisions?.data?.map(({ name, divisionId }) => ({
              option: name,
              value: divisionId,
            })) || []),
          ].filter(Boolean)}
          isRequired
          onSelect={(e) => {
            if (ipAddresses.length && formik.values.divisionId !== e.value) {
              toggleConfirmation();
              setDivisionIsChanged(true);
              setSelectedDivision(e.value);
            } else {
              formik.setFieldValue("divisionId", e.value);
              formik.setFieldTouched("divisionId", true, false);
            }
          }}
          footer={(formik.touched.divisionId || formik.submitCount > 0) && formik.errors.divisionId ? formik.errors.divisionId : null}
          mode={(formik.touched.divisionId || formik.submitCount > 0) && formik.errors.divisionId ? "danger" : "default"}  
          currentOption={formik.values.divisionId}
          className="max-w-sm"
        />
      </div>
    </div>
  );
};

export default ClientInformationSection;
