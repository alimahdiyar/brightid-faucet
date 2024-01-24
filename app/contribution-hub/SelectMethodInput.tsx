import Icon from "@/components/ui/Icon";
import { useOutsideClick } from "@/utils/hooks/dom";
import React, { useEffect, useRef, useState } from "react";

export enum SelectMethod {
  Minimum = "Minimum",
  Maximum = "Maximum",
}

interface MethodProp {
  minimum: string;
  maximum: string;
}

interface Prop {
  setRequirementParamsList: (e: any) => void;
  requirementParamsList: any;
  isNft: boolean;
}

const SelectMethodInput = ({
  setRequirementParamsList,
  requirementParamsList,
  isNft,
}: Prop) => {
  const [selectedMethod, setSelectedMethod] = useState<string | undefined>();
  const [showItems, setShowItems] = useState<boolean>(false);

  const handleSelectMethod = () => {
    setSelectedMethod("Minimum Amount");
    setShowItems(false);
  };

  const [methodValues, setMethodValues] = useState<MethodProp>({
    minimum: "",
    maximum: "",
  });

  const ref = useRef<HTMLDivElement>(null);

  useOutsideClick(ref, () => {
    if (showItems) setShowItems(false);
  });

  const handleChangeMethodValues = (e: string) => {
    const value =
      e === "increase"
        ? Number(methodValues.minimum!) + 1
        : Math.max(0, Number(methodValues.minimum) - 1);

    setMethodValues({
      ...methodValues,
      minimum: value.toString(),
    });

    setRequirementParamsList({ ...requirementParamsList, ["MINIMUM"]: value });
  };

  useEffect(() => {
    if (!requirementParamsList) return;
    if (!requirementParamsList.MINIMUM) return;
    handleSelectMethod();
    setMethodValues({
      ...methodValues,
      minimum: requirementParamsList.MINIMUM,
    });
  }, [requirementParamsList]);

  return (
    <div ref={ref} className="relative ">
      <div
        onClick={() => setShowItems(!showItems)}
        className="flex w-full items-center justify-between bored border-gray50 bg-gray40 rounded-xl px-3 h-[43px] cursor-pointer"
      >
        <div
          className={`${
            selectedMethod ? "text-white" : "text-gray80"
          }  text-sm`}
        >
          {selectedMethod ? selectedMethod : "Select Method"}
        </div>
        <Icon
          iconSrc="/assets/images/fund/arrow-down.png"
          width="14px"
          height="8px"
        />
      </div>
      {showItems && (
        <div className="absolute w-full top-12 bg-gray40 rounded-xl border border-gray50 overflow-y-scroll">
          <div
            onClick={handleSelectMethod}
            className="flex pl-3 cursor-pointer items-center hover:bg-gray70 text-white rounded-lg h-[45px]"
          >
            Minimum
          </div>
        </div>
      )}

      {selectedMethod && (
        <div className="flex items-center bg-gray40 border border-gray50 px-3 h-[43px] w-full mt-3 rounded-lg overflow-hidden">
          <input
            className="bg-inherit h-full px-2 w-full "
            name={SelectMethod.Minimum}
            type={isNft ? "text" : "number"}
            inputMode="numeric"
            pattern="[0-9]"
            min={0}
            value={methodValues.minimum}
            onChange={(e: any) =>
              setMethodValues({
                ...methodValues,
                minimum: isNft
                  ? e.target.value.replace(/[^0-9]/g, "")
                  : e.target.value,
              })
            }
          />
          <div className="flex flex-col gap-3">
            <Icon
              onClick={() => handleChangeMethodValues("increase")}
              className="cursor-pointer"
              iconSrc="/assets/images/provider-dashboard/arrow-top-dark.svg"
            />
            <Icon
              onClick={() => handleChangeMethodValues("decrease")}
              className="cursor-pointer"
              iconSrc="/assets/images/provider-dashboard/arrow-down-dark.svg"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default SelectMethodInput;
