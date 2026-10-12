import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import SomethingWentWrong from "../../components/Retry/SomethingWentWrong/SomethingWentWrong";
import Failed3Times from "../../components/Retry/Failed3Times/Failed3Times";
import { useFetch } from "prezent/useFetch";
import { GetGeneratedDetail } from "../../service/redeempage/endpoint";

const RetryPage = ({ handleResetUserInput }) => {
  const navigate = useNavigate();
  const { redeemId } = useParams();
  const { data: redeem, refetch } = useFetch(GetGeneratedDetail, "redeem", [], redeemId);

  useEffect(() => {
    if (redeem?.data?.status === "voucher has expired") {
      navigate(`/redeem-voucher/expired`);
    }
  }, [redeem]);
  return (
    <div className="flex items-center justify-center bg-white sm:py-6 py-0 h-screen">
      {redeem?.data?.retryCount >= 3 ? (
        <Failed3Times redeemId={redeemId} />
      ) : (
        <SomethingWentWrong
          refetch={refetch}
          redeem={redeem}
          redeemId={redeemId}
          reffId={redeem?.data?.reffId}
          redeemType={redeem?.data?.redeemType}
          handleResetUserInput={handleResetUserInput}
        />
      )}
    </div>
  );
};

export default RetryPage;
