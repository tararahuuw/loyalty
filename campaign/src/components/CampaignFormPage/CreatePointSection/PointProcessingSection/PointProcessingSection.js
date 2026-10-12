import React from "react";
import ToolTip from "prezent/ToolTip";
import RadioButtonComponent from "../../../RadioButtonComponent/RadioButtonComponent";
import PointProcessingDetailModal from "./PointProcessingDetailModal/PointProcessingDetailModal";
import { useDisclosure } from "prezent/useDisclosure";
import { InfoIcon } from "@phosphor-icons/react";

const PointProcessingSection = ({ formik }) => {
  const { isOpen, toggle } = useDisclosure();

  const isError = formik.submitCount && formik.errors.pointProcessingMethod;

  return (
    <div className="flex flex-col gap-3 bg-neutral20 rounded-lg p-6 flex-1">
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <p className="text-lg font-semibold leading-6 text-left">Point Processing</p>
          <ToolTip message="Define how the system will process and distribute the points after they are created. This determines the method used to deliver points to Customers." />
        </div>
      </div>

      {isError ? (
        <div className="flex items-center text-danger500 gap-1">
          <InfoIcon />
          <p className="text-sm">Please select one Point Processing option to continue.</p>
        </div>
      ) : null}

      <div
        className={`rounded-lg flex justify-between gap-8 p-4 ${
          isError ? "border border-danger500 bg-danger50" : "bg-white"
        }`}
      >
        <RadioButtonComponent
          onChange={() => formik.setFieldValue("pointProcessingMethod", "api")}
          checked={formik.values.pointProcessingMethod === "api"}
          value="api"
          title="API"
          description={
            <span>
              Points can be processed automatically in real time by integrating your system via API.{" "}
              <span className="text-primary500 hover:underline cursor-pointer" onClick={toggle}>
                Click Here
              </span>{" "}
              for more details.
            </span>
          }
        />

        <RadioButtonComponent
          onChange={() => formik.setFieldValue("pointProcessingMethod", "upload transaction")}
          checked={formik.values.pointProcessingMethod === "upload transaction"}
          value="upload transaction"
          title="Upload Transaction"
          description={
            <>
              <span>Points can be processed manually by uploading recipient data through the</span>
              <a
                className="text-primary500 hover:underline cursor-pointer"
                href={`${window.location.origin}/prezent/loyalty-setting/engagement/customer/transactions`}
                target="_blank"
              >
                Customer &gt; Upload Transaction menu
              </a>
              <span>after the campaign ends.</span>
            </>
          }
        />

        <RadioButtonComponent
          onChange={() => formik.setFieldValue("pointProcessingMethod", "upload point")}
          checked={formik.values.pointProcessingMethod === "upload point"}
          value="upload point"
          title="Upload Point"
          description={
            <>
              <span>Points can be processed manually by uploading recipient data through the</span>
              <a
                className="text-primary500 hover:underline cursor-pointer"
                href={`${window.location.origin}/prezent/loyalty-setting/engagement/customer/points`}
                target="_blank"
              >
                {" "}
                Customer &gt; Upload Point menu{" "}
              </a>
              <span>after the campaign ends.</span>
            </>
          }
        />
      </div>

      <PointProcessingDetailModal isOpen={isOpen} onClose={toggle} />
    </div>
  );
};

export default PointProcessingSection;
