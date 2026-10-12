import React, { forwardRef, useCallback } from "react";
import { useSnackbar, SnackbarContent } from "notistack";
import { XCircleIcon, XIcon } from "@phosphor-icons/react";

const ErrorSnackbar = forwardRef(({ id, ...props }, ref) => {
  const { closeSnackbar } = useSnackbar();

  const handleDismiss = useCallback(() => {
    closeSnackbar(id);
  }, [id, closeSnackbar]);

  return (
    <SnackbarContent ref={ref}>
      <div className="flex flex-col w-full bg-danger50 py-3 px-4 rounded-md shadow-md">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <XCircleIcon className="text-danger500" size={24} />

            <p className="font-semibold text-base">{props.message}</p>
          </div>

          <a onClick={handleDismiss}>
            <XIcon className="text-neutral300" size={20} />
          </a>
        </div>

        <p className="text-sm ml-8">{props.subMessage}</p>
      </div>
    </SnackbarContent>
  );
});

export default ErrorSnackbar;
