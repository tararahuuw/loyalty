import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { Footer } from "sprint-asia-custom-component";

import StatusSection from "../../../components/DetailVoucher/StatusSection/StatusSection";
import InformationSection from "../../../components/DetailVoucher/InformationSection/InformationSection";
import DetailSection from "../../../components/DetailVoucher/DetailSection/DetailSection";
import PhotoSection from "../../../components/DetailVoucher/PhotoSection/PhotoSection";
import HistorySection from "../../../components/DetailVoucher/HistorySection";
import DetailActivitySection from "../../../components/DetailVoucher/DetailActivitySection/DetailActivitySection";
import { useFetch } from "prezent/useFetch";
import { GetVoucherById } from "../../../service/voucherManagement/endpoint/voucherManagement";
import moment from "moment";
import PPNSection from "../../../components/DetailVoucher/PPNSection/PPNSection";
import SpecificVoucherPhotoSection from "../../../components/DetailVoucher/SpecificVoucherPhotoSection/SpecificVoucherPhotoSection";
import LandingPagePreviewSection from "../../../components/DetailVoucher/LandingPagePreviewSection/LandingPagePreviewSection";
import { NotePencil } from "@phosphor-icons/react";

const DetailVoucher = ({ roleAccess, setTitleHeader }) => {
  const { id } = useParams();
  const navigateTo = useNavigate();

  const { data } = useFetch(GetVoucherById, "voucher", [], { roleAccess, voucherId: id });

  const navigateToEditVoucher = () => {
    navigateTo(`/prezent/reward/voucher/edit/${id}`);
  };

  const filterPhotoByRoleAccess = () => {
    let photo;
    if (
      ["Business Administrator", "Business Support", "System Administrator", "Ops Administrator", "Reconcile"].includes(
        roleAccess
      )
    ) {
      photo = data?.data?.voucherPhoto;
    } else {
      if (data?.data?.specificVoucherPhotos) {
        photo = data?.data?.specificVoucherPhotos[0]?.specificVoucherPhotoUrl;
      } else {
        photo = data?.data?.voucherPhoto;
      }
    }

    return photo;
  };

  useEffect(() => {
    setTitleHeader("Detail Voucher");
  }, []);

  return (
    <>
      <div>
        <div className="grid grid-cols-6 gap-6 bg-neutral20 mt-8 px-8 mb-16">
          <div className="col-span-4 space-y-6">
            <StatusSection status={data?.data?.isActive ? "Active" : "Inactive"} />

            <InformationSection
              name={data?.data?.voucherName}
              type={data?.data?.voucherType}
              category={data?.data?.voucherCategory}
            />

            <DetailSection
              denom={data?.data?.denom}
              description={data?.data?.description}
              howTo={data?.data?.howToRedeem}
              name={data?.data?.productName}
              period={`${moment.utc(data?.data?.validityStartDate).format("DD MMM YYYY HH:mm")} ➜ ${moment
                .utc(data?.data?.validityEndDate)
                .format("DD MMM YYYY HH:mm")}`}
              price={data?.data?.price}
              stock={data?.data?.stock}
              term={data?.data?.termAndConditions}
            />

            <PPNSection tax={data?.data?.tax} />

            <PhotoSection image={filterPhotoByRoleAccess()} />

            {["Business Administrator", "Business Support", "System Administrator"].includes(roleAccess) && (
              <SpecificVoucherPhotoSection specificPhotos={data?.data?.specificVoucherPhotos} />
            )}
          </div>

          <div className="col-span-2">
            <LandingPagePreviewSection
              contents={data?.data?.customField && JSON.parse(data?.data?.customField)}
              type={data?.data?.redeemType}
              description={data?.data?.description}
              endDate={data?.data?.validityEndDate}
              voucherName={data?.data?.voucherName}
              voucherPhoto={data?.data?.voucherPhoto}
              howToRedeem={data?.data?.howToRedeem}
              termAndConditions={data?.data?.termAndConditions}
            />
          </div>

          <div className="col-span-6 space-y-6">
            <HistorySection roleAccess={roleAccess} voucherId={id} />

            <DetailActivitySection
              createDate={moment(data?.data?.createdAt).format("DD MMM YYYY, HH:mm")}
              createdBy={data?.data?.createdBy}
              editDate={moment(data?.data?.updatedAt).format("DD MMM YYYY, HH:mm")}
              editedBy={data?.data?.updatedBy}
            />
          </div>
        </div>
        {["Business Administrator", "Business Support", "System Administrator"].includes(roleAccess) && (
          <Footer
            modeRightButton="outline"
            titleRightButton={
              <div className="flex items-center gap-1">
                <NotePencil />
                <span>Edit</span>
              </div>
            }
            isActiveLeftButton={false}
            isActiveRightButton
            onClickRightButton={navigateToEditVoucher}
          />
        )}
      </div>
    </>
  );
};

export default DetailVoucher;
