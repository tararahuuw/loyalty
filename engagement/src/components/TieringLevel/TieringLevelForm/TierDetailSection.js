import React from "react";
import { Info } from "@phosphor-icons/react";
import CheckBox from "prezent/CheckBox";
import { DropdownText, TextInput } from "sprint-asia-custom-component";

const TierDetailSection = ({ formik, level, previousTierDownGrade }) => {
  return (
    <div className="flex flex-col gap-5 bg-white rounded-lg border border-neutral40 shadow-md p-6">
      <div className="text-lg font-semibold leading-6 text-left pb-2 border-b border-neutral40">Tier Detail</div>

      <div className="bg-primary50 px-4 py-3 flex gap-2 rounded-md">
        <div className="flex gap-1">
          <Info className="text-primary500" size={24} />
          <p>
            {level === 1
              ? "Tier Level 1 will not have seasons as it serves as the base level."
              : "The season determination for each user ID will start from the beginning of the year when the user registers for the loyalty program in the app. The season will only appear when tier downgrade activated"}
          </p>
        </div>
      </div>

      {previousTierDownGrade ? (
        <p className="text-success500 font-semibold">Tier downgrade activated in previous tier.</p>
      ) : null}

      {level !== 1 && (
        <>
          {!previousTierDownGrade && (
            <CheckBox
              title="Tier Downgrade"
              description="Once activated, customers may be downgraded if they fail to meet the required criteria to maintain their tier level, based on the inputted nominal amount and quantity."
              value={formik.values.isTierDowngrade}
              checked={formik.values.isTierDowngrade}
              onChange={() => formik.setFieldValue("isTierDowngrade", formik.values.isTierDowngrade ? 0 : 1)}
            />
          )}

          {formik.values.isTierDowngrade ? (
            <>
              <DropdownText
                title="Tier Season Period"
                placeholder="Select Season Period"
                options={[
                  { option: "1 month", value: "1 Month" },
                  { option: "2 months", value: "2 Months" },
                  { option: "3 months", value: "3 Months" },
                  { option: "4 months", value: "4 Months" },
                  { option: "6 months", value: "6 Months" },
                  { option: "1 year", value: "1 Year" },
                ]}
                isRequired
                onSelect={(e) => {
                  formik.setFieldValue("seasonPeriod", e.value);
                  formik.setFieldTouched("seasonPeriod", true, false);
                }}
                footer={(formik.touched.seasonPeriod || formik.submitCount > 0) && formik.errors.seasonPeriod ? formik.errors.seasonPeriod : null}
                mode={(formik.touched.seasonPeriod || formik.submitCount > 0) && formik.errors.seasonPeriod ? "danger" : "default"}  
                currentOption={formik.values.seasonPeriod}
                isEdited={!previousTierDownGrade}
              />

              {level === 2 && (
                <div className="bg-primary50 px-4 py-3 flex gap-2 rounded-md">
                  <div className="flex gap-1">
                    <Info className="text-primary500 mt-0.5" size={20} />
                    <span>This tier season will apply to all subsequent tiers within the division.</span>
                  </div>
                </div>
              )}
            </>
          ) : null}
        </>
      )}

      <div className="flex flex-col">
        <p>Amount Transaction</p>
        <p className="text-neutral300 text-xs">
          The total transaction amount that must be achieved to reach the membership type above or maintain tier level.
        </p>
      </div>

      <TextInput
        title="Target Amount Transaction"
        isRequired
        leftAdornment={<p className="text-xs pl-1">Rp</p>}
        placeholder="Input amount"
        value={formik.values.targetAmount}
        onChangeInput={(e) => {
          formik.setFieldValue("targetAmount", e.target.value);
          formik.setFieldTouched("targetAmount", true, false);
        }}
        footer={(formik.touched.targetAmount || formik.submitCount > 0) && formik.errors.targetAmount ? formik.errors.targetAmount : null}
        mode={level === 1 ? "disable" : (formik.touched.targetAmount || formik.submitCount > 0) && formik.errors.targetAmount ? "danger" : "default"}
        type="number"
      />
    </div>
  );
};

export default TierDetailSection;
