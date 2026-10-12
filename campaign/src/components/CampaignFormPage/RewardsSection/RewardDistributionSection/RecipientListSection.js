import React, { useEffect, useState } from "react";
import { useDisclosure } from "prezent/useDisclosure";
import { SearchDropdown } from "sprint-asia-custom-component";
import { NotePencilIcon, XCircleIcon, CheckSquareIcon, SquareIcon } from "@phosphor-icons/react";
import AddRecipientButton from "../../../AddRecipientButton/AddRecipientButton";
import AddSingleRecipientModal from "./AddSingleRecipientModal";
import BulkRecipientModal from "../../../BulkRecipientModal";
import SpecificVoucherTableSection from "./SpecificVoucherTableSection";
import RecipientTable from "./RecipientTable";
import TextInput from "prezent/TextInput";
import styles from "./TextInput.module.css";

const RecipientListSection = ({ rewards, method, channels, recipients, formik }) => {
  const [dataSearch, setDataSearch] = useState("");
  const [selectedReward, setSelectedReward] = useState(null);
  const [dataFilterSearch, setDataFilterSearch] = useState({
    option: "Reward Name",
    value: "rewardName",
  });
  const [selectedRecipient, setSelectedRecipient] = useState(null);

  const { isOpen: singleRecipientModalIsOpen, toggle: toggleSingleRecipient } = useDisclosure();
  const { isOpen: bulkRecipientModalIsOpen, toggle: toggleBulkRecipient } = useDisclosure();

  const dataOptions = [{ option: "Reward Name", value: "rewardName" }];

  const handleCloseRecipientForm = () => {
    toggleSingleRecipient();
    setSelectedRecipient(null);
  };

  const handleOpenEditRecipientForm = (recipient) => {
    toggleSingleRecipient();
    setSelectedRecipient(recipient);
  };

  const randomVoucherColumns = [
    {
      header: "Recipient Name",
      assessor: "recipient",
      Cell: (row) => {
        return (
          <div className="flex justify-between w-full">
            <div className="flex flex-col gap-1">
              <p className="font-semibold text-black text-sm">{row.recipientName}</p>
              <p className="font-normal text-neutral300 text-xs">{row.phoneNumber}</p>
              <p className="font-normal text-neutral300 text-xs">{row.email}</p>
            </div>

            <a className="cursor-pointer" onClick={() => handleOpenEditRecipientForm(row)}>
              <NotePencilIcon size={18} className="text-neutral80" />
            </a>
          </div>
        );
      },
    },
    {
      header: "Distribution",
      assessor: "distribution",
      Cell: (row) => {
        return <p>{row.distribution?.join(", ")}</p>;
      },
    },
    {
      header: "Reward",
      assessor: "reward",
      Cell: (row) => {
        return <p>{row.reward}</p>;
      },
    },
    {
      header: "",
      assessor: "action",
      Cell: (row) => {
        return (
          <a className="cursor-pointer" onClick={() => handleRemoveRecipient(row.id)}>
            <XCircleIcon className="text-danger500" size={20} />
          </a>
        );
      },
    },
  ];

  const specificVoucherColumns = [
    {
      header: "Recipient Name",
      tdStyle: { width: "5%" },
      assessor: "recipient",
      Cell: (row, idx) => {
        return (
          <div className="flex justify-between w-full">
            <div className="flex items-start gap-2">
              {row.reward ? (
                <a className="cursor-pointer mt-0.5" onClick={() => handleRemoveItem(idx)}>
                  <CheckSquareIcon size={18} />
                </a>
              ) : (
                <a className="cursor-pointer mt-0.5" onClick={() => handleCheckSingleItem(idx)}>
                  <SquareIcon size={18} />
                </a>
              )}

              <div className="flex flex-col gap-1 overflow-hidden" style={{ maxWidth: "80%" }}>
                <p className="font-semibold text-black text-sm truncate">{row.recipientName}</p>

                <p className="font-normal text-neutral300 text-xs truncate">{row.phoneNumber}</p>
                <p className="font-normal text-neutral300 text-xs truncate">{row.email}</p>
              </div>
            </div>

            <a className="cursor-pointer flex-shrink-0" onClick={() => handleOpenEditRecipientForm(row)}>
              <NotePencilIcon size={18} className="text-neutral80" />
            </a>
          </div>
        );
      },
    },
    {
      header: "Reward",
      assessor: "reward",
      Cell: (row, idx) => {
        return (
          <TextInput
            title=""
            mode={
              (formik.touched.recipients?.[idx]?.rewardId || formik.submitCount > 0) &&
              formik.errors.recipients?.[idx]?.rewardId
                ? "danger"
                : "disabled"
            }
            footer={
              (formik.touched.recipients?.[idx]?.rewardId || formik.submitCount > 0) &&
              formik.errors.recipients?.[idx]?.rewardId
                ? formik.errors.recipients?.[idx]?.rewardId
                : null
            }
            onChangeInput={() => {}}
            value={row.reward || ""}
          />
        );
      },
    },
    {
      header: "Qty",
      assessor: "quantity",
      Cell: (row, idx) => {
        return (
          <div className={styles.customInput}>
            <TextInput
              // className={styles.input}
              title=""
              type="number"
              onChangeInput={(e) => handleChangeRewardQuantity(e, idx)}
              value={row.quantity}
              mode={
                (formik.touched.recipients?.[idx]?.quantity || formik.submitCount > 0) &&
                formik.errors.recipients?.[idx]?.quantity
                  ? "danger"
                  : "default"
              }
              footer={
                (formik.touched.recipients?.[idx]?.quantity || formik.submitCount > 0) &&
                formik.errors.recipients?.[idx]?.quantity
                  ? formik.errors.recipients?.[idx]?.quantity
                  : null
              }
            />
          </div>
        );
      },
    },
    {
      header: "",
      assessor: "action",
      Cell: (row) => {
        return (
          <a className="cursor-pointer" onClick={() => handleRemoveRecipient(row.id)}>
            <XCircleIcon className="text-danger500" size={20} />
          </a>
        );
      },
    },
  ];

  const handleCheckSingleItem = (idx) => {
    if (!selectedReward) return;

    const rewardData = formik.values.rewards.find((item) => item.id === selectedReward.id);

    // Only proceed if reward exists and has stock
    if (rewardData && rewardData.ownedQuantity > 0) {
      const recipients = formik.values.recipients;
      const currentRecipient = recipients[idx];

      if (!currentRecipient.reward || currentRecipient.rewardId === selectedReward.id) {
        // ✅ Update recipients via Formik
        const updatedRecipients = [...recipients];
        updatedRecipients[idx] = {
          ...currentRecipient,
          reward: selectedReward.name,
          rewardId: selectedReward.id,
          quantity: 1,
        };

        formik.setFieldValue("recipients", updatedRecipients, true);

        // ✅ Update rewards via Formik
        const updatedRewards = formik.values.rewards.map((item) =>
          item.id === selectedReward.id ? { ...item, ownedQuantity: item.ownedQuantity - 1 } : item,
        );

        formik.setFieldValue("rewards", updatedRewards);
      }
    }
  };

  const handleRemoveItem = (idx) => {
    const recipients = formik.values.recipients;
    const recipient = recipients[idx];

    // Only proceed if the reward being removed matches the currently selected reward
    if (!recipient || recipient.rewardId !== selectedReward?.id) return;

    // ✅ Reset the recipient’s reward info
    const updatedRecipients = [...recipients];
    updatedRecipients[idx] = {
      ...recipient,
      reward: "",
      rewardId: "",
      quantity: 0,
    };

    formik.setFieldValue("recipients", updatedRecipients, true);

    // ✅ Update rewards inside Formik
    const updatedRewards = formik.values.rewards.map((item) => {
      if (item.id === selectedReward.id) {
        return { ...item, ownedQuantity: item.ownedQuantity + recipient.quantity };
      }
      return item;
    });

    formik.setFieldValue("rewards", updatedRewards);
  };

  const handleSelectAllItem = () => {
    if (!selectedReward) return;

    const recipients = formik.values.recipients;
    const rewards = formik.values.rewards;

    const rewardObj = rewards.find((item) => item.id === selectedReward.id);
    if (!rewardObj) return;

    // Stop if no ownedQuantity left
    if (rewardObj.ownedQuantity <= 0) return;

    let availableStock = rewardObj.ownedQuantity;
    const updatedRecipients = [...recipients];

    // ✅ Assign rewards to unassigned recipients until stock runs out
    for (let i = 0; i < updatedRecipients.length && availableStock > 0; i++) {
      if (!updatedRecipients[i].reward) {
        updatedRecipients[i] = {
          ...updatedRecipients[i],
          reward: selectedReward.name,
          rewardId: selectedReward.id,
          quantity: 1,
        };
        availableStock -= 1;
      }
    }

    // ✅ Update Formik recipients
    formik.setFieldValue("recipients", updatedRecipients);

    // ✅ Update rewards (deduct used stock)
    const availableRecipients = recipients.filter((r) => !r.reward).length;
    const updatedRewards = rewards.map((item) => {
      if (item.id !== selectedReward.id) return item;

      return {
        ...item,
        ownedQuantity: Math.max(0, item.ownedQuantity - Math.min(item.ownedQuantity, availableRecipients)),
      };
    });

    formik.setFieldValue("rewards", updatedRewards);
  };

  const handleChangeRewardQuantity = (e, idx) => {
    const value = e.target.value;
    const newQty = parseInt(value || "0", 10);

    // Only allow numeric input
    if (!/^\d*$/.test(value)) return;

    const recipients = formik.values.recipients;
    const recipient = recipients[idx];
    if (!recipient) return;

    // Determine which reward to use
    const rewardIdToUse = selectedReward?.id || recipient.rewardId;
    if (!rewardIdToUse) return; // no reward selected

    const rewards = formik.values.rewards;
    const rewardObj = rewards.find((item) => item.id === rewardIdToUse);
    if (!rewardObj) return; // reward not found

    const prevQty = recipient.quantity || 0;
    const diff = newQty - prevQty; // positive = increase, negative = decrease

    // ✅ Prevent going below 0 or exceeding available ownedQuantity
    if (diff > 0 && rewardObj.ownedQuantity < diff) return; // not enough stock

    // ✅ Update recipient list immutably
    const updatedRecipients = [...recipients];
    updatedRecipients[idx] = {
      ...recipient,
      reward: rewardObj.name,
      rewardId: rewardIdToUse,
      quantity: newQty,
    };

    // ✅ Update rewards (ownedQuantity adjustment)
    const updatedRewards = rewards.map((item) => {
      if (item.id === rewardIdToUse) {
        return { ...item, ownedQuantity: item.ownedQuantity - diff };
      }
      return item;
    });

    // Commit both updates to Formik
    formik.setFieldValue("recipients", updatedRecipients, true);
    formik.setFieldValue("rewards", updatedRewards);
  };

  const handleRemoveRecipient = (recipientId) => {
    const recipients = formik.values.recipients || [];
    const recipientToRemove = recipients.find((r) => r.id === recipientId);
    if (!recipientToRemove) return;

    // If the recipient has a reward assigned, return the ownedQuantity
    if (recipientToRemove.rewardId) {
      const updatedRewards = formik.values.rewards.map((reward) => {
        if (reward.id === recipientToRemove.rewardId) {
          return {
            ...reward,
            ownedQuantity: reward.ownedQuantity + (recipientToRemove.quantity || 1),
          };
        }
        return reward;
      });
      formik.setFieldValue("rewards", updatedRewards);
    }

    // Remove recipient and update formik
    const updatedRecipients = recipients.filter((r) => r.id !== recipientId);
    formik.setFieldValue("recipients", updatedRecipients);
  };

  const handleClickRow = (id) => {
    const selectedRecipient = recipients.find((recipient) => recipient.id === id);
    // setSelectedReward(() => rewards.find((reward) => reward.id === selectedRecipient.rewardId));
  };

  useEffect(() => {
    formik.validateField("recipients");
  }, [formik.values.recipients]);

  return (
    <div className="bg-white rounded-lg p-4 px-8 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <SearchDropdown
          options={dataOptions}
          placeholderSearch="Search Here"
          filterDropdown={dataFilterSearch}
          setFilterDropdown={setDataFilterSearch}
          onEnterPress={setDataSearch}
        />

        <div className="min-w-max">
          <AddRecipientButton
            disabled={!channels.length || !rewards.length}
            title="Add Recipient"
            addBulkHandler={toggleBulkRecipient}
            addSingleHandler={toggleSingleRecipient}
          />
        </div>
      </div>

      <AddSingleRecipientModal
        mainFormik={formik}
        isOpen={singleRecipientModalIsOpen}
        onClose={handleCloseRecipientForm}
        method={method}
        channels={channels}
        rewards={rewards}
        selectedRecipient={selectedRecipient}
      />

      <BulkRecipientModal
        formik={formik}
        isOpen={bulkRecipientModalIsOpen}
        onClose={toggleBulkRecipient}
        rewards={rewards}
        channels={channels.filter((channel) => channel !== "All")}
        handlePopUpErrorFile={() => {}}
        method={method}
      />

      {method === "random" ? (
        <RecipientTable
          columns={randomVoucherColumns}
          staticData={recipients.filter((recipient) =>
            recipient.reward?.toLowerCase().includes(dataSearch.toLowerCase()),
          )}
          options={{ pagination: false, checkbox: false, isRounded: true }}
          searchKeyword={dataSearch}
          onClickRow={() => {}}
        />
      ) : (
        <SpecificVoucherTableSection
          columns={specificVoucherColumns}
          recipients={recipients.filter(
            (recipient) => !dataSearch || recipient.reward?.toLowerCase().includes(dataSearch.toLowerCase()),
          )}
          setSelectedReward={setSelectedReward}
          selectedReward={selectedReward}
          rewards={rewards}
          checkAllData={handleSelectAllItem}
          onClickRow={(id) => handleClickRow(id)}
        />
      )}
    </div>
  );
};

export default RecipientListSection;
