import React from "react";
import { DescriptionFile } from "sprint-asia-custom-component";
import {formatPrefixPhoneNumber} from "../../../../utils/index"

const InformationSection = ({ division, projectBrief, optionalDocument1, optionalDocument2 }) => {
  return (
    <div className="flex flex-col gap-6 bg-white rounded-lg shadow-md border border-neutral40 p-6">
      <section>
        <div className="text-lg font-semibold leading-6 text-left pb-2 border-b border-neutral40">
          Basic Information
        </div>

        <div className="pt-4 pb-4 pr-4">
          <div className="grid grid-cols-3 gap-3">
            <div>
              <p className="text-neutral500 font-normal text-sm mt-1">Division Name</p>
              <p className="text-black font-semibold text-base">{division?.name}</p>
              <p className="text-neutral500 font-normal text-sm mt-4">Gender</p>
              <p className="text-black font-semibold text-base">{division?.picGender}</p>
            </div>

            <div className="ml-4">
              <p className="text-neutral500 font-normal text-sm mt-1">PIC Name</p>
              <p className="text-black font-semibold text-base">{division?.picName}</p>
              <p className="text-neutral500 font-normal text-sm mt-4">Position</p>
              <p className="text-black font-semibold text-base">{division?.picPosition}</p>
            </div>

            <div className="ml-4">
              <p className="text-neutral500 font-normal text-sm mt-1">PIC Email</p>
              <p className="text-black font-semibold text-base">{division?.picEmail}</p>
              <p className="text-neutral500 font-normal text-sm mt-1">Phone Number</p>
              <p className="text-black font-semibold text-base">{formatPrefixPhoneNumber(division?.picPhoneNumber)}</p>
            </div>
          </div>
        </div>
      </section>

      <section>
        <div className="text-lg font-semibold leading-6 text-left pb-2 border-b border-neutral40">
          Address Information
        </div>

        <div className="pt-4 pb-4 pr-4">
          <div className="grid grid-cols-3 gap-3">
            <div>
              <p className="text-neutral500 font-normal text-sm mt-1">Province</p>
              <p className="text-black font-semibold text-base">{division?.provinceName}</p>
              <p className="text-neutral500 font-normal text-sm mt-4">Detail Address</p>
              <p className="text-black font-semibold text-base">{division?.detailAddress}</p>
            </div>
            <div className="ml-4">
              <p className="text-neutral500 font-normal text-sm mt-1">City</p>
              <p className="text-black font-semibold text-base">{division?.cityName}</p>
            </div>
            <div className="ml-4">
              <p className="text-neutral500 font-normal text-sm mt-1">District</p>
              <p className="text-black font-semibold text-base">{division?.districtName}</p>
              <p className="text-neutral500 font-normal text-sm mt-4">Postal Code</p>
              <p className="text-black font-semibold text-base">{division?.postalCode}</p>
            </div>
          </div>
        </div>
      </section>

      <section>
        <div className="text-lg font-semibold leading-6 text-left pb-2 border-b border-neutral40">
          Billing Information
        </div>

        <div className="pt-4 pb-4 pr-4">
          <div className="grid grid-cols-3 gap-3">
            <div>
              <p className="text-neutral500 font-normal text-sm mt-1">Bank Name</p>
              <p className="text-black font-semibold text-base">{division?.bankName}</p>
              <p className="text-neutral500 font-normal text-sm mt-4">Tax Registration Number</p>
              <p className="text-black font-semibold text-base">{division?.taxRegistrationNumber}</p>
            </div>
            <div className="ml-4">
              <p className="text-neutral500 font-normal text-sm mt-1">Account Name</p>
              <p className="text-black font-semibold text-base">{division?.accountName}</p>
              <p className="text-neutral500 font-normal text-sm mt-4">Billing Type</p>
              <p className="text-black font-semibold text-base">{division?.billingType}</p>
            </div>
            <div className="ml-4">
              <p className="text-neutral500 font-normal text-sm mt-1">Account Number</p>
              <p className="text-black font-semibold text-base">{division?.accountNumber}</p>
              <p className="text-neutral500 font-normal text-sm mt-4">Admin Fee</p>
              <p className="text-black font-semibold text-base">{division?.adminFee} %</p>
              {!!division?.limitAmount && (
                <>
                  <p className="text-neutral500 font-normal text-sm mt-4">Limit Amount</p>
                  <p className="text-black font-semibold text-base">{division?.limitAmount}</p>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      <section>
        <div className="text-lg font-semibold leading-6 text-left pb-2 border-b border-neutral40">Document</div>

        <div className="pt-2 pb-2 pr-2"> </div>
        <div className="grid grid-cols-3 gap-3">
          <DescriptionFile title="Project Brief" fileName={division?.projectBrief} link={projectBrief} />

          {optionalDocument1 && (
            <DescriptionFile
              title="Optional Document"
              fileName={division?.optionalDocument1}
              link={optionalDocument1}
            />
          )}

          {optionalDocument2 && (
            <DescriptionFile
              title="Optional Document"
              fileName={division?.optionalDocument2}
              link={optionalDocument2}
            />
          )}
        </div>
      </section>
    </div>
  );
};

export default InformationSection;
