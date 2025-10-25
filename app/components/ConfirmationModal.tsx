"use client";

import React from "react";

interface ConfirmModalProps {
  title?: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
  show: boolean;
}

export default function ConfirmationModal({
  title = "Confirm Action",
  message = "Are you sure?",
  confirmText = "Confirm",
  cancelText = "Cancel",
  onConfirm,
  onCancel,
  show,
}: ConfirmModalProps) {
  if (!show) return null;

  return (
    <>
      <div
        className="modal-backdrop fade show"
        onClick={onCancel}
        style={{ zIndex: 1040 }}
      ></div>

      <div
        className="modal fade show d-block"
        tabIndex={-1}
        role="dialog"
        style={{ zIndex: 1050 }}
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content border-0 shadow">
            <div className="modal-header border-0">
              <h5 className="modal-title">{title}</h5>
              <button
                type="button"
                className="btn-close"
                aria-label="Close"
                onClick={onCancel}
              ></button>
            </div>
            <div className="modal-body border-0">{message}</div>
            <div className="modal-footer border-0">
              <button className="btn btn-outline-secondary" onClick={onCancel}>
                {cancelText}
              </button>
              <button className="btn btn-outline-danger" onClick={onConfirm}>
                {confirmText}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
