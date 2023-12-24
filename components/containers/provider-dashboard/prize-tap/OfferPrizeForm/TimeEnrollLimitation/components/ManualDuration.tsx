"use client";

import { ErrorProps } from "@/types";
import { usePrizeOfferFormContext } from "@/context/providerDashboardContext";
import Icon from "@/components/ui/Icon";
import DisplaySelectedDate from "./DisplaySelectedDate";
import EndDateComp from "./EndDateComp";

interface ManualDurationProp {
  showErrors: ErrorProps | null;
}

const ManualDuration = ({ showErrors }: ManualDurationProp) => {
  const { data, enrollmentDurations, handleSetEnrollDuration } =
    usePrizeOfferFormContext();

  return (
    <div className="w-full text-gray100">
      <p className="mb-2 text-xs">Set Enrollment Duration:</p>
      <div className=" w-full flex select-not enrollment-duration-wrap justify-between items-center h-[43px] bg-gray30 text-gray90 text-xs text-center border border-gray50 rounded-xl overflow-hidden">
        {enrollmentDurations.map((item) => (
          <div
            key={item.id}
            onClick={() => handleSetEnrollDuration(item.id)}
            className={`w-full h-full flex justify-center items-center enrollment-duration cursor-pointer  border-r-2 border-gray50 ${
              item.selected ? "text-white bg-gray40" : ""
            } `}
          >
            <div>{item.name}</div>
          </div>
        ))}
      </div>
      <div className="text-[14px] flex items-center justify-between mt-2">
        <div className="text-gray100  cursor-pointer underline w-full">
          <EndDateComp showErrors={showErrors} />
        </div>
        <div className="w-full ">
          {data.startTimeStamp && <DisplaySelectedDate />}
        </div>
      </div>
    </div>
  );
};

export default ManualDuration;
