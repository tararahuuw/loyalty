import React from "react";
import RadioButtonComponent from "../../../RadioButtonComponent/RadioButtonComponent";
import ToolTip from "prezent/ToolTip";

const RewardAssignmentMethodSection = ({ formik }) => {
  return (
    <div className="flex flex-col gap-3 bg-neutral20 rounded-lg p-6">
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <p className="text-lg font-semibold leading-6 text-left">Reward Assignment Method</p>
          <ToolTip
            id="reward-assignment-method"
            message="Choose how vouchers are assigned to Customers —either randomly from the selected vouchers or specifically assigned per Customer."
          />
        </div>

        <div className="bg-white rounded-lg flex items-center gap-4 p-4">
          <RadioButtonComponent
            onChange={() => formik.setFieldValue("rewardAssignmentMethod", "random")}
            checked={formik.values.rewardAssignmentMethod === "random"}
            value="random"
            title="Random Reward"
            description="Assign vouchers to Customers randomly based on the selected reward vouchers and the order of the recipient list."
          />

          <RadioButtonComponent
            onChange={() => formik.setFieldValue("rewardAssignmentMethod", "specific")}
            checked={formik.values.rewardAssignmentMethod === "specific"}
            value="specific"
            title="Specific Reward"
            description="Assign a specific voucher to each Customer, ensuring they receive the exact voucher you have selected for them."
          />
        </div>
      </div>
    </div>
  );
};

export default RewardAssignmentMethodSection;
