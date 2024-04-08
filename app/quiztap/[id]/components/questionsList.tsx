import {
  restPeriod,
  statePeriod,
  useQuizContext,
} from "@/context/quizProvider";
import { FC, useEffect, useRef } from "react";

const QuestionsList = () => {
  return (
    <div className="mt-10 flex rounded-xl border-2 border-gray50 bg-gray20 p-4">
      <QuestionItem index={1} />
      <Separator index={1} />
      <QuestionItem index={2} />
      <Separator index={2} />
      <QuestionItem index={3} />
      <Separator index={3} />
      <QuestionItem index={4} />
      <Separator index={4} />
      <QuestionItem index={5} />
      <Separator index={5} />
      <QuestionItem index={6} />
      <Separator index={6} />
      <QuestionItem index={7} />
      <Separator index={7} />
      <QuestionItem index={8} />
      <Separator index={8} />
      <QuestionItem index={9} />
      <Separator index={9} />
      <QuestionItem index={10} />
    </div>
  );
};

const Separator: FC<{ index: number }> = ({ index }) => {
  const { stateIndex, timer, isRestTime } = useQuizContext();

  const width =
    isRestTime && index === stateIndex
      ? Math.min((28 * (restPeriod - timer)) / restPeriod, restPeriod)
      : 28;

  return (
    <div
      className="mx-2 my-auto h-[2px] rounded-lg bg-gray100"
      style={{
        width: `${width}px`,
      }}
    ></div>
  );
};

const QuestionItem: FC<{ index: number }> = ({ index }) => {
  const { stateIndex, timer, isRestTime } = useQuizContext();

  const ref = useRef<SVGRectElement>(null);

  useEffect(() => {
    var progress: any = ref.current;

    if (!progress) return;

    var borderLen = progress.getTotalLength() + 5,
      offset = borderLen;
    progress.style.strokeDashoffset = borderLen;
    progress.style.strokeDasharray = borderLen + "," + borderLen;

    const durationInSeconds =
      statePeriod / 1000 - (statePeriod / 1000 - timer / 1000);

    const framesPerSecond = 60;

    const totalFrames = durationInSeconds * framesPerSecond;
    const decrementAmount = borderLen / totalFrames;

    let frameCount = 0;
    let anim: number;

    function progressBar() {
      offset -= decrementAmount;
      progress.style.strokeDashoffset = offset;
      frameCount++;

      // Stop animation when duration is reached
      if (frameCount < totalFrames) {
        anim = window.requestAnimationFrame(progressBar);
      } else {
        window.cancelAnimationFrame(anim);
      }
    }

    // Start animation
    anim = window.requestAnimationFrame(progressBar);

    // Clean up on component unmount or state change
    return () => {
      window.cancelAnimationFrame(anim);
    };
  }, [stateIndex]);

  if (index > stateIndex || isRestTime)
    return (
      <div
        className={`relative grid h-9 w-9 place-content-center rounded-lg border-2 ${index > stateIndex ? "border-gray50" : "border-dark-space-green"} bg-gray20 text-gray100`}
      >
        {index}
      </div>
    );

  return (
    <div
      className={`progress relative  h-9 w-9  rounded-lg  ${index > stateIndex ? "border-2 border-gray50" : index === stateIndex ? "" : "border-2 border-dark-space-green"} bg-gray20 text-gray100`}
    >
      <div className="absolute inset-0 grid place-content-center text-sm">
        {index}
      </div>
      {index === stateIndex && (
        <svg
          width="36"
          height="36"
          viewBox="0 0 36 36"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect
            ref={ref}
            x="1"
            y="1"
            width="34"
            height="34"
            rx="7"
            stroke="#b5b5c6"
            stroke-width="2"
          />
        </svg>
      )}
    </div>
  );
};

export default QuestionsList;
