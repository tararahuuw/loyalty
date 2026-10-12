import React, { useEffect } from "react";
import { DropdownText } from "sprint-asia-custom-component";
import ContentItem from "./ContentItem/ContentItem";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import AddContentButton from "./AddContentButton/AddContentButton";
import RedeemButton from "./RedeemButton/RedeemButton";

const RedeemInformationSection = ({
  category,
  contents = [],
  setContents,
  formik,
  editable,
  voucherId,
  setRedeemInformationIsError,
}) => {
  // Validate field contents when user press Add Content button
  const triggerValidation = (trigger) => {
    if (typeof trigger === "function") {
      trigger();
    }
  };

  const digitalTypes = [
    { option: "Choose Type", value: "" },
    { option: "Default", value: "default" },
    { option: "Store Code", value: "store_code" },
    { option: "Address", value: "address" },
    { option: "Custom", value: "custom" },
  ];

  const ppobTypes = [
    { option: "Choose Type", value: "" },
    { option: "PPOB", value: "ppob" },
  ];

  const onDragEnd = (result) => {
    const { source, destination } = result;

    // If there's no destination (e.g., dropped outside a valid droppable area), return early
    if (!destination) return;

    // If the item is dropped in the same place, return early
    if (source.index === destination.index) return;

    // Create a copy of the contents array to manipulate
    const updatedContents = Array.from(contents);

    // Remove the dragged item from the source index
    const [removed] = updatedContents.splice(source.index, 1);

    // Insert the dragged item at the new destination index
    updatedContents.splice(destination.index, 0, removed);

    // Update sequence numbers based on the new order
    const reorderedContents = updatedContents.map((item, idx) => ({
      ...item,
      sequence: idx + 1, // Reassign sequence based on the new order (1-based index)
    }));

    // Set the updated contents with the new order and sequence
    setContents(reorderedContents);
  };

  const onChangeRedeemType = (type) => {
    if (type === "ppob") {
      if (category === "2.1" || category === "2.2" || category === "2.4") {
        setContents([
          {
            type: "Short Answer",
            category: "phone number",
            label: "Phone number",
            instruction: "Input phone number",
            sequence: 1,
            disabled: true,
            actions: false,
            isRequired: true,
          },
        ]);
      } else if (category === "2.3") {
        setContents([
          {
            type: "Short Answer",
            category: "meter number",
            label: "Meter number",
            instruction: "Input meter number",
            sequence: 1,
            disabled: true,
            actions: false,
            isRequired: true,
          },
        ]);
      } else {
        setContents([]);
      }
    } else if (type === "store_code") {
      setContents([
        {
          type: "Store Code",
          category: "number",
          label: "Store code",
          instruction: "Input store code",
          sequence: 1,
          disabled: true,
          actions: false,
          isRequired: true,
        },
      ]);
    } else if (type === "address") {
      setContents([
        {
          type: "Address",
          category: "address",
          label: [
            "Province, City, District, Postal Code",
            "Street Name, Building, House No.",
            "Other Details (e.g Block / Unit No, Landmarks)",
          ],
          sequence: 1,
          disabled: true,
          actions: false,
          isRequired: true,
        },
      ]);
    } else if (type === "default" || type === "custom") {
      setContents([]);
    }

    formik.setFieldValue("redeemType", type);
    formik.setFieldTouched("redeemType", true, false);
  };

  // If there changes in voucher category, inject proper custom fields
  useEffect(() => {
    if (formik.values.voucherType === "2") {
      onChangeRedeemType("ppob");
    }
  }, [category]);

  return (
    <div className="flex flex-col gap-5 bg-white rounded-lg border border-neutral40 shadow-md p-6">
      <div className="text-lg font-semibold leading-6 text-left pb-2 border-b border-neutral40">Redeem Information</div>

      <DropdownText
        className="max-w-sm"
        title="Redeem Type"
        placeholder="Choose redeem type"
        options={formik.values.voucherType === "1" ? digitalTypes : ppobTypes}
        isRequired
        onSelect={(e) => onChangeRedeemType(e.value)}
        currentOption={formik.values.redeemType}
        footer={
          (formik.touched.redeemType || formik.submitCount > 0) && formik.errors.redeemType
            ? formik.errors.redeemType
            : null
        }
        mode={(formik.touched.redeemType || formik.submitCount > 0) && formik.errors.redeemType ? "danger" : "default"}
        isEdited={!editable && !voucherId}
      />

      {formik.values.redeemType ? (
        <div className="flex flex-col">
          <p className="font-semibold text-sm">Field Content</p>
          <div className="flex flex-col gap-2 py-4">
            <DragDropContext
              onDragEnd={(result) => {
                onDragEnd(result);
              }}
            >
              <Droppable droppableId="1">
                {(provided) => {
                  return (
                    <div {...provided.droppableProps} ref={provided.innerRef} className="flex flex-col gap-2">
                      {contents
                        ?.sort((a, b) => a.sequence - b.sequence) // Sort contents by sequence
                        ?.map((content, idx) => {
                          return (
                            <Draggable key={content.sequence} draggableId={`${content.sequence}`} index={idx}>
                              {(provided) => {
                                return (
                                  <div
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                    ref={provided.innerRef}
                                  >
                                    <ContentItem
                                      key={content.sequence}
                                      sequence={content.sequence}
                                      type={content.type}
                                      category={content.category}
                                      label={content.label}
                                      instruction={content.instruction}
                                      disabled={content.disabled}
                                      actions={content.actions}
                                      isRequired={content.isRequired}
                                      options={content.options}
                                      contents={contents}
                                      setContents={setContents}
                                      voucherId={voucherId}
                                      triggerValidation={triggerValidation}
                                      setRedeemInformationIsError={setRedeemInformationIsError}
                                    />
                                  </div>
                                );
                              }}
                            </Draggable>
                          );
                        })}
                      {provided.placeholder}
                    </div>
                  );
                }}
              </Droppable>
            </DragDropContext>

            <RedeemButton />
          </div>
        </div>
      ) : null}

      {formik.values.redeemType && formik.values.redeemType !== "default" && !voucherId && (
        <AddContentButton setContents={setContents} triggerValidation={triggerValidation} />
      )}
    </div>
  );
};

export default RedeemInformationSection;
