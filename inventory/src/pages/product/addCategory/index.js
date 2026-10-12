import React, { useState, useEffect } from "react";
import DropDownSearch from "../../../components/category/DropDownSearch";
import CategoryInput from "../../../components/category/CategoryInput";
import { X, CaretRight } from "@phosphor-icons/react";
import { useFetch } from "prezent/useFetch";
import { useDisclosure } from "prezent/useDisclosure";
import {
  CreateCategoryTree,
  GetFirstCategoryList,
  GetTreeByID,
} from "../../../service/inventoryManagement/endpoint/category";
import { Footer } from "sprint-asia-custom-component";
import LoadingModal from "prezent/LoadingModal";
import ResultModal from "prezent/ResultModal";
import { useNavigate } from "react-router-dom";

const AddCategory = ({ handleSetCategory, category, corporateId, setTitleHeader }) => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [second, setSecond] = useState(null);
  const [third, setThird] = useState(null);
  const [fourth, setFourth] = useState(null);
  const [firstCategoryError, setFirstCategoryError] = useState("");
  const [secondCategoryError, setSecondCategoryError] = useState("");
  const [thirdCategoryError, setThirdCategoryError] = useState("");
  const [fourthCategoryError, setFourthCategoryError] = useState("");
  const [fifthCategoryError, setFifthCategoryError] = useState("");
  const [options, setOptions] = useState([]);
  const [secondOptions, setSecondOptions] = useState([]);
  const [thirdOptions, setThirdOptions] = useState([]);
  const [fourthOptions, setFourthOptions] = useState([]);
  const [flagResult, setFlagResult] = useState("success");
  const [dataSubtitleModal, setDataSubtitleModal] = useState("");
  const { data: firstCategories } = useFetch(GetFirstCategoryList, "first-category", [], {});
  const { data: categoryTree, isLoading: categoryTreeIsLoading } = useFetch(
    selectedCategory?.value && GetTreeByID,
    "category-tree",
    [],
    selectedCategory?.value
  );
  const { isOpen: loadingModalIsOpen, open: openLoading, close: closeLoading } = useDisclosure();
  const { isOpen: resultModalIsOpen, open: openResult, close: closeResult } = useDisclosure();

  const handleOpenModalResult = (type, subtitle) => {
    setTimeout(() => {
      setFlagResult(type);
      setDataSubtitleModal(subtitle);
      openResult();
      setTimeout(() => {
        closeResult();
      }, 3500);
    }, 250);
  };

  const injectCorporateID = (category, corporateId) => {
    if (!category) return null;

    return {
      ...category,
      companyId: corporateId,
      children: (category.children || []).map((child) => injectCorporateID(child, corporateId)),
    };
  };

  const handleSubmitCategory = async () => {
    try {
      openLoading();

      const payloadWithLoyaltyID = injectCorporateID(categories, corporateId);

      const response = await CreateCategoryTree(payloadWithLoyaltyID);
      handleSetCategory({ option: response?.data?.name, value: response?.data?.id });
      closeLoading();

      setTimeout(() => {
        handleOpenModalResult("success", "Category has been successfully updated");
        setTimeout(() => {
          navigate("/prezent/loyalty-setting/inventory/category");
        }, 4000);
      }, 250);
    } catch (error) {
      closeLoading();
      handleOpenModalResult("failed", "Sorry, unable to update Category at the moment. Please try again");
    }
  };

  const handleAddNewCategory = (value) => {
    const firstCategoriesDup = [...options];

    const trimmedValue = value.trim();

    if (trimmedValue.length < 1) {
      setFirstCategoryError("Minimum 1 and maximum 150 characters allowed.");
      return;
    }

    if (trimmedValue.length > 150) {
      setFirstCategoryError("Minimum 1 and maximum 150 characters allowed.");
      return;
    }

    const hasSpecialChars = /[^a-zA-Z0-9\s]/.test(value);

    if (hasSpecialChars) {
      setFirstCategoryError("Special characters are not allowed.");
      return;
    }

    const exists = firstCategoriesDup.some(
      (category) => category.name.trim().toLowerCase() === value.trim().toLowerCase()
    );

    if (exists) {
      setFirstCategoryError("This category already exists.");
      return;
    }

    const newCategory = {
      name: value,
      id: value,
    };

    const newCategoriesArray = [...firstCategoriesDup, newCategory];

    setSelectedCategory({ option: value, value: value });
    setOptions(newCategoriesArray);
    setFirstCategoryError("");
  };

  const handleAddSecondCategory = (value) => {
    setCategories((prev) => {
      if (!prev || Object.keys(prev).length === 0) return prev;

      const parent = { ...prev };

      const exists = parent.children?.some((child) => child.name.trim().toLowerCase() === value.trim().toLowerCase());

      const trimmedValue = value.trim();

      if (trimmedValue.length < 1) {
        setSecondCategoryError("Minimum 1 and maximum 150 characters allowed.");
        return;
      }

      if (trimmedValue.length > 150) {
        setSecondCategoryError("Minimum 1 and maximum 150 characters allowed.");
        return;
      }

      const hasSpecialChars = /[^a-zA-Z0-9\s]/.test(value);

      if (exists) {
        setSecondCategoryError("This category already exists.");
        return prev;
      }

      if (hasSpecialChars) {
        setSecondCategoryError("Special characters are not allowed.");
        return prev;
      }

      setSecondCategoryError("");

      const newChild = {
        parentId: parent.id,
        temporaryID: crypto.randomUUID(),
        id: "",
        name: value,
        level: 2,
        children: [],
      };

      setSecond(newChild);
      setThird(null);
      setFourth(null);
      setSecondOptions([...(parent.children || []), newChild]);

      return {
        ...parent,
        children: [...(parent.children || []), newChild],
      };
    });
  };

  const handleSelectSecondCategory = (item) => {
    setCategories((prev) => {
      if (!prev || Object.keys(prev).length === 0) return prev;

      const parent = { ...prev };
      const identifier = item.id || item.temporaryID;

      const alreadyExists = (parent.children || []).some(
        (child) => (child.id && child.id === identifier) || (!child.id && child.temporaryID === identifier)
      );

      if (alreadyExists) return parent; // don't add duplicate

      return {
        ...parent,
        children: [...(parent.children || []), item],
      };
    });
    setSecond(item);
    setThird(null);
    setFourth(null);
  };

  const handleAddThirdCategory = (value) => {
    const trimmedValue = value.trim();

    if (trimmedValue.length < 1) {
      setThirdCategoryError("Minimum 1 and maximum 150 characters allowed.");
      return;
    }

    if (trimmedValue.length > 150) {
      setThirdCategoryError("Minimum 1 and maximum 150 characters allowed.");
      return;
    }

    const hasSpecialChars = /[^a-zA-Z0-9\s]/.test(value);

    if (hasSpecialChars) {
      setThirdCategoryError("Special characters are not allowed.");
      return;
    }

    setCategories((prev) => {
      if (!prev || !prev.children) return prev;

      const updatedChildren = prev.children.map((level2) => {
        const isMatch = second?.id ? level2.id === second?.id : level2?.temporaryID === second?.temporaryID;

        if (isMatch) {
          const exists = level2.children?.some(
            (child) => child.name.trim().toLowerCase() === value.trim().toLowerCase()
          );

          if (exists) {
            setThirdCategoryError("This category already exists.");
            return level2;
          }

          setThirdCategoryError("");

          const newChild = {
            parentId: level2.id,
            parentTemporaryID: level2?.temporaryID,
            temporaryID: crypto.randomUUID(),
            id: "",
            name: value,
            level: 3,
            children: [],
          };

          setThird(newChild);
          setFourth(null);
          setThirdOptions([...(level2.children || []), newChild]);

          return {
            ...level2,
            children: [...(level2.children || []), newChild],
          };
        }

        return level2;
      });

      return {
        ...prev,
        children: updatedChildren,
      };
    });
  };

  const handleSelectThirdCategory = (item) => {
    setCategories((prev) => {
      if (!prev || Object.keys(prev).length === 0) return prev;

      const identifier = item.id || item.temporaryID;

      const parent = { ...prev };
      const secondLevelId = second?.id || second?.temporaryID;

      const updatedChildren = parent.children?.map((secondItem) => {
        const secondItemId = secondItem.id || secondItem.temporaryID;

        if (secondItemId !== secondLevelId) return secondItem;

        // Check for duplicate
        const alreadyExists = (secondItem.children || []).some(
          (child) => (child.id && child.id === identifier) || (!child.id && child.temporaryID === identifier)
        );

        if (alreadyExists) return secondItem;

        return {
          ...secondItem,
          children: [...(secondItem.children || []), item],
        };
      });

      return {
        ...parent,
        children: updatedChildren,
      };
    });

    setThird(item);
    setFourth(null);
  };

  const handleAddFourthCategory = (value) => {
    const trimmedValue = value.trim();

    if (trimmedValue.length < 1) {
      setFourthCategoryError("Minimum 1 and maximum 150 characters allowed.");
      return;
    }

    if (trimmedValue.length > 150) {
      setFourthCategoryError("Minimum 1 and maximum 150 characters allowed.");
      return;
    }

    const hasSpecialChars = /[^a-zA-Z0-9\s]/.test(value);

    if (hasSpecialChars) {
      setFourthCategoryError("Special characters are not allowed.");
      return;
    }

    setCategories((prev) => {
      if (!prev || !prev.children) return prev;

      const updatedLevel2 = prev.children.map((level2) => {
        const updatedLevel3 = level2.children.map((level3) => {
          const isMatch = third?.id ? level3.id === third?.id : level3?.temporaryID === third?.temporaryID;

          if (isMatch) {
            const exists = level3.children?.some(
              (child) => child.name.trim().toLowerCase() === value.trim().toLowerCase()
            );

            if (exists) {
              setFourthCategoryError("This category already exists.");
              return level3;
            }

            setFourthCategoryError("");

            const newChild = {
              parentId: level3.id,
              parentTemporaryID: level3?.temporaryID,
              temporaryID: crypto.randomUUID(),
              id: "",
              name: value,
              level: 4,
              children: [],
            };

            setFourth(newChild);
            setFourthOptions([...(level3.children || []), newChild]);

            return {
              ...level3,
              children: [...(level3.children || []), newChild],
            };
          }

          return level3;
        });

        return {
          ...level2,
          children: updatedLevel3,
        };
      });

      return {
        ...prev,
        children: updatedLevel2,
      };
    });
  };

  const handleSelectFourthCategory = (item) => {
    setCategories((prev) => {
      if (!prev || Object.keys(prev).length === 0) return prev;

      const identifier = item.id || item.temporaryID;
      const secondID = second?.id || second?.temporaryID;
      const thirdID = third?.id || third?.temporaryID;

      const parent = { ...prev };

      const updatedChildren = parent.children?.map((secondItem) => {
        const secondItemID = secondItem.id || secondItem.temporaryID;
        if (secondItemID !== secondID) return secondItem;

        const updatedThirdLevel = secondItem.children?.map((thirdItem) => {
          const thirdItemID = thirdItem.id || thirdItem.temporaryID;
          if (thirdItemID !== thirdID) return thirdItem;

          // Prevent duplicate fourth item
          const alreadyExists = (thirdItem.children || []).some(
            (child) => (child.id && child.id === identifier) || (!child.id && child.temporaryID === identifier)
          );

          if (alreadyExists) return thirdItem;

          return {
            ...thirdItem,
            children: [...(thirdItem.children || []), item],
          };
        });

        return {
          ...secondItem,
          children: updatedThirdLevel,
        };
      });

      return {
        ...parent,
        children: updatedChildren,
      };
    });

    setFourth(item);
  };

  const handleAddFifthCategory = (value) => {
    const trimmedValue = value.trim();

    if (trimmedValue.length < 1) {
      setFifthCategoryError("Minimum 1 and maximum 150 characters allowed.");
      return;
    }

    if (trimmedValue.length > 150) {
      setFifthCategoryError("Minimum 1 and maximum 150 characters allowed.");
      return;
    }

    const hasSpecialChars = /[^a-zA-Z0-9\s]/.test(value);

    if (hasSpecialChars) {
      setFifthCategoryError("Special characters are not allowed.");
      return;
    }

    setCategories((prev) => {
      if (!prev || !prev.children) return prev;

      const updatedLevel2 = prev.children.map((level2) => {
        const updatedLevel3 = level2.children.map((level3) => {
          const updatedLevel4 = level3.children.map((level4) => {
            const isMatch = fourth?.id ? level4.id === fourth?.id : level4?.temporaryID === fourth?.temporaryID;

            if (isMatch) {
              const exists = level4.children?.some(
                (child) => child.name.trim().toLowerCase() === value.trim().toLowerCase()
              );

              if (exists) {
                setFifthCategoryError("This category already exists.");
                return level4;
              }

              setFifthCategoryError("");

              return {
                ...level4,
                children: [
                  ...(level4.children || []),
                  {
                    parentId: level4.id,
                    parentTemporaryID: level4?.temporaryID,
                    temporaryID: crypto.randomUUID(),
                    id: "",
                    name: value,
                    level: 5,
                    children: [],
                  },
                ],
              };
            }

            return level4;
          });

          return {
            ...level3,
            children: updatedLevel4,
          };
        });

        return {
          ...level2,
          children: updatedLevel3,
        };
      });

      return {
        ...prev,
        children: updatedLevel2,
      };
    });
  };

  const deleteCategoryById = (categoryObj, idToDelete) => {
    if (!categoryObj) return categoryObj;

    const isMatch = categoryObj.temporaryID === idToDelete || (categoryObj.id && categoryObj.id === idToDelete);

    if (isMatch) {
      return null;
    }

    const updatedChildren = categoryObj.children?.map((child) => deleteCategoryById(child, idToDelete)).filter(Boolean); // remove nulls

    return {
      ...categoryObj,
      children: updatedChildren,
    };
  };

  const handleDeleteCategory = (idToDelete) => {
    setCategories((prevCategory) => {
      const result = deleteCategoryById(prevCategory, idToDelete);
      return result || {};
    });
  };

  useEffect(() => {
    if (firstCategories?.data?.length) {
      setOptions(firstCategories?.data);
      if (category) {
        setSelectedCategory(category);
      } else {
        setSelectedCategory({ option: firstCategories?.data[0]?.name, value: firstCategories?.data[0]?.id });
      }
    }
  }, [firstCategories, category]);

  useEffect(() => {
    if (categoryTree?.data) {
      const level1 = categoryTree.data;
      const level2 = level1.children || [];
      const level3 = level2[0]?.children || [];
      const level4 = level3[0]?.children || [];

      setCategories({
        id: level1.id,
        name: level1.name,
        level: 1,
        children: level2,
      });

      setSecondOptions(level2);
      setThirdOptions(level3);
      setFourthOptions(level4);
    } else {
      setCategories({
        id: "",
        name: selectedCategory?.option,
        level: 1,
        children: [],
      });

      setSecondOptions([]);
      setThirdOptions([]);
      setFourthOptions([]);
    }

    setSecond(null);
    setThird(null);
    setFourth(null);
  }, [categoryTree, selectedCategory]);

  useEffect(() => {
    setTitleHeader("Add Category");
  }, []);

  return (
    <div className="flex-1 overflow-y-auto bg-neutral20 py-6 px-8 h-full mb-4">
      <div className="bg-white rounded-lg shadow-md h-full p-8">
        <div className="flex h-full">
          {/* CATEGORY 1 */}
          <div className="h-full flex-1">
            <div className="border border-neutral40 text-neutral500 text-xs font-semibold rounded-tl-md bg-neutral20 flex p-4">
              <p>CATEGORY LEVEL 1</p>
              <p className="text-danger500">*</p>
            </div>

            <div className="border border-t-0 border-neutral40 p-4 overflow-y-auto" style={{ height: "450px" }}>
              <DropDownSearch
                currentOption={selectedCategory?.value}
                placeholder="Choose or Add"
                onSelect={(item) => {
                  setSelectedCategory(item);
                  setFirstCategoryError("");
                  handleSetCategory(item);
                }}
                onAddNewCategory={handleAddNewCategory}
                options={options?.map(({ name, id }) => ({ option: name, value: id }))}
                error={firstCategoryError}
              />
            </div>
          </div>

          {/* CATEGORY 2 */}
          <div className="h-full flex-1">
            <div className="border border-l-0 border-neutral40 text-neutral500 text-xs font-semibold bg-neutral20 flex p-4">
              <p>CATEGORY LEVEL 2</p>
              <p className="text-danger500">*</p>
            </div>

            <div
              className="border border-t-0 border-l-0 border-neutral40 overflow-y-auto p-4 flex flex-col gap-2"
              style={{ height: "450px" }}
            >
              {categories?.name && (
                <DropDownSearch
                  currentOption={second?.id || second?.temporaryID}
                  placeholder="Choose or Add"
                  onSelect={(item) => {
                    const filtered = categories?.children?.filter(
                      (val) => (val.id && val.id === item.value) || (!val.id && val.temporaryID === item.value)
                    );
                    setSecond(filtered[0]);
                    setSecondCategoryError("");
                    handleSelectSecondCategory(item);
                  }}
                  onAddNewCategory={handleAddSecondCategory}
                  options={secondOptions?.map((opt) => ({
                    option: opt.name,
                    value: opt.id || opt.temporaryID,
                    ...opt,
                  }))}
                  error={secondCategoryError}
                />
              )}

              {categories?.children?.map((item, idx) => (
                <a
                  key={idx}
                  className={`px-4 py-3 border rounded-md flex justify-between items-center cursor-pointer ${
                    second &&
                    ((second.id && second.id === item.id) || (!second.id && second.temporaryID === item.temporaryID)) &&
                    "border-primary500 ring-2 ring-primary100 ring-offset-1 ring-offset-primary100"
                  }`}
                  onClick={() => {
                    setSecond(item);
                    setThird(null);
                    setFourth(null);
                  }}
                >
                  {item?.name}

                  {second &&
                  ((second.id && second.id === item?.id) ||
                    (!second.id && second.temporaryID === item?.temporaryID)) ? (
                    <CaretRight className="cursor-pointer" />
                  ) : (
                    <X
                      className="cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation();

                        const identifier = item?.id || item?.temporaryID;

                        handleDeleteCategory(identifier);
                      }}
                    />
                  )}
                </a>
              ))}
            </div>
          </div>

          {/* CATEGORY 3 */}
          <div className="h-full flex-1">
            <div className="border border-l-0 border-neutral40 text-neutral500 text-xs font-semibold bg-neutral20 flex p-4">
              <p>CATEGORY LEVEL 3</p>
            </div>

            <div
              className="border border-t-0 border-l-0 border-neutral40 overflow-y-auto p-4 flex flex-col gap-2"
              style={{ height: "450px" }}
            >
              {second && (
                <DropDownSearch
                  currentOption={third?.id || third?.temporaryID}
                  placeholder="Choose or Add"
                  onSelect={(item) => {
                    const filtered = categories?.children?.map((secondItem) =>
                      secondItem?.children?.filter(
                        (val) => (val.id && val.id === item.value) || (!val.id && val.temporaryID === item.value)
                      )
                    );
                    setThird(filtered[0][0]);
                    setThirdCategoryError("");
                    handleSelectThirdCategory(item);
                  }}
                  onAddNewCategory={handleAddThirdCategory}
                  options={thirdOptions
                    ?.filter(({ parentId, parentTemporaryID }) =>
                      second?.id ? parentId === second.id : parentTemporaryID === second?.temporaryID
                    )
                    .map((opt) => ({
                      option: opt.name,
                      value: opt.id || opt.temporaryID,
                      ...opt,
                    }))}
                  error={thirdCategoryError}
                />
              )}

              {second &&
                categories?.children?.map((secondItem) =>
                  secondItem?.children?.map((thirdItem, idx) => {
                    const isMatchingParent = second?.id
                      ? thirdItem.parentId === second.id
                      : thirdItem.parentTemporaryID === second?.temporaryID;

                    if (!isMatchingParent) return null;

                    const isActive =
                      third &&
                      ((third.id && third.id === thirdItem.id) ||
                        (!third.id && third.temporaryID === thirdItem.temporaryID));

                    return (
                      <a
                        key={idx}
                        className={`px-4 py-3 border rounded-md flex justify-between items-center cursor-pointer ${
                          isActive && "border-primary500 ring-2 ring-primary100 ring-offset-1 ring-offset-primary100"
                        }`}
                        onClick={() => {
                          setThird(thirdItem);
                          setFourth(null);
                        }}
                      >
                        {thirdItem.name}

                        {isActive ? (
                          <CaretRight className="cursor-pointer" />
                        ) : (
                          <X
                            className="cursor-pointer"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteCategory(thirdItem.id || thirdItem.temporaryID);
                            }}
                          />
                        )}
                      </a>
                    );
                  })
                )}
            </div>
          </div>

          {/* CATEGORY 4 */}
          <div className="h-full flex-1">
            <div className="border border-l-0 border-neutral40 text-neutral500 text-xs font-semibold bg-neutral20 flex p-4">
              <p>CATEGORY LEVEL 4</p>
            </div>

            <div
              className="border border-t-0 border-l-0 border-neutral40 overflow-y-auto p-4 flex flex-col gap-2"
              style={{ height: "450px" }}
            >
              {third && (
                <DropDownSearch
                  currentOption={fourth?.id || fourth?.temporaryID}
                  placeholder="Choose or Add"
                  onSelect={(item) => {
                    const filtered = categories?.children?.map((secondItem) =>
                      secondItem?.children?.map((thirdItem) =>
                        thirdItem?.children?.filter(
                          (val) => (val.id && val.id === item.value) || (!val.id && val.temporaryID === item.value)
                        )
                      )
                    );
                    setFourth(filtered[0][0][0]);
                    handleSelectFourthCategory(item);
                    setFourthCategoryError("");
                  }}
                  onAddNewCategory={handleAddFourthCategory}
                  options={fourthOptions
                    ?.filter(({ parentId, parentTemporaryID }) =>
                      third?.id ? parentId === third.id : parentTemporaryID === third?.temporaryID
                    )
                    .map((opt) => ({
                      option: opt.name,
                      value: opt.id || opt.temporaryID,
                      ...opt,
                    }))}
                  error={fourthCategoryError}
                />
              )}

              {third &&
                categories?.children?.map((secondItem) =>
                  secondItem?.children?.map((thirdItem) =>
                    thirdItem?.children?.map((fourthItem, idx) => {
                      const isMatchingParent = third?.id
                        ? fourthItem.parentId === third.id
                        : fourthItem.parentTemporaryID === third?.temporaryID;

                      if (!isMatchingParent) return null;

                      const isActive =
                        fourth &&
                        ((fourth.id && fourth.id === fourthItem.id) ||
                          (!fourth.id && fourth.temporaryID === fourthItem.temporaryID));

                      return (
                        <a
                          key={idx}
                          className={`px-4 py-3 border rounded-md flex justify-between items-center cursor-pointer ${
                            isActive && "border-primary500 ring-2 ring-primary100 ring-offset-1 ring-offset-primary100"
                          }`}
                          onClick={() => setFourth(fourthItem)}
                        >
                          {fourthItem.name}

                          {isActive ? (
                            <CaretRight className="cursor-pointer" />
                          ) : (
                            <X
                              className="cursor-pointer"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteCategory(fourthItem.id || fourthItem.temporaryID);
                              }}
                            />
                          )}
                        </a>
                      );
                    })
                  )
                )}
            </div>
          </div>

          {/* CATEGORY 5 */}
          <div className="h-full flex-1">
            <div className="border border-l-0 rounded-tr-md border-neutral40 text-neutral500 text-xs font-semibold bg-neutral20 flex p-4">
              <p>CATEGORY LEVEL 5</p>
            </div>

            <div
              className="border border-t-0 border-l-0 border-neutral40 overflow-y-auto p-4 flex flex-col gap-2"
              style={{ height: "450px" }}
            >
              {fourth ? (
                <CategoryInput onChange={(value) => handleAddFifthCategory(value)} error={fifthCategoryError} />
              ) : null}

              {fourth &&
                categories?.children?.map((secondItem) =>
                  secondItem?.children?.map((thirdItem) =>
                    thirdItem?.children?.map((fourthItem) =>
                      fourthItem?.children?.map((fifthItem, idx) => {
                        const isMatchingParent = fourth?.id
                          ? fifthItem.parentId === fourth.id
                          : fifthItem.parentTemporaryID === fourth?.temporaryID;

                        if (!isMatchingParent) return null;

                        return (
                          <a
                            key={idx}
                            className="p-4 border rounded-md flex justify-between items-center cursor-pointer"
                          >
                            {fifthItem.name}

                            <X
                              className="cursor-pointer"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteCategory(fifthItem.id || fifthItem.temporaryID);
                              }}
                            />
                          </a>
                        );
                      })
                    )
                  )
                )}
            </div>
          </div>
        </div>
      </div>

      <Footer
        modeLeftButton="outline"
        modeRightButton="primary"
        titleLeftButton="Cancel"
        titleRightButton="Submit"
        isActive={!!categories?.name && Array.isArray(categories?.children) && categories.children.length > 0}
        isActiveLeftButton
        isActiveRightButton
        onClickLeftButton={() => navigate("/prezent/loyalty-setting/inventory/category")}
        onClickRightButton={handleSubmitCategory}
      />

      <LoadingModal
        title="Loading..."
        subtitle="Please wait a moment"
        isOpen={loadingModalIsOpen || categoryTreeIsLoading}
        onClose={() => {}}
      />

      <ResultModal subtitle={dataSubtitleModal} type={flagResult} isOpen={resultModalIsOpen} onClose={() => {}} />
    </div>
  );
};

export default AddCategory;
