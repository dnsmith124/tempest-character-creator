"use client";
import { ReactNode } from "react";

type FormStageProps = {
  title?: string;
  children: ReactNode;
  className?: string;
  progress?: number; // 0 to 1
  helpText?: string;
  actions?: ReactNode;
};

export const FormStage = ({ title, children, className = "", progress, helpText, actions }: FormStageProps) => {
  return (
    <div className={`flex flex-col h-auto bg-inherit rounded shadow ${className}`}>
      {/* Sticky header */}
      <div className="sticky top-0 z-10 bg-inherit pt-4 pb-2 px-4 border-b border-zinc-800  mb-3">
        {typeof progress === "number" && (
          <div className="flex items-center mb-2">
            <div className="w-full h-2 dark:bg-gray-200 bg-zinc-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-500 dark:bg-blue-400 transition-all"
                style={{ width: `${Math.round(progress * 100)}%` }}
              />
            </div>
            <span className="ml-3 text-xs text-gray-600 dark:text-zinc-300 min-w-[32px] text-right font-mono">
              {Math.round(progress * 100)}%
            </span>
          </div>
        )}
        {(title || helpText || actions) && (
          <div className="flex items-center justify-between gap-4">
            <div className="flex flex-col items-start flex-1 min-w-0">
              {title && <h2 className="font-bold text-lg dark:text-zinc-100 mb-0 leading-tight">{title}</h2>}
              {helpText && <div className="text-sm text-gray-500 dark:text-zinc-400 mt-0">{helpText}</div>}
            </div>
            {actions && <div className="flex-shrink-0 flex gap-2">{actions}</div>}
          </div>
        )}
      </div>
      {/* Scrollable content */}
      <div className="flex-1 px-4 pb-4 gap-4 flex flex-col ">
        {children}
      </div>
    </div>
  );
}; 