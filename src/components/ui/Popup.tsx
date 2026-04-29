import { AlertTriangle } from "lucide-react";

export type PopupFormValues = {
  title: string;
  body: string;
  btnValue1: string;
  onCancel: () => void;
  onConfirm: () => void;
};

export default function Popup(values: PopupFormValues) {
  return (
    <>
      <div className="popup-overlay" onClick={values.onCancel} />
      <div className="fixed inset-0 flex items-center justify-center z-50 p-5">
        <div className="popup-box popup-animate">
          <div className="popup-header">
            <div className="popup-icon-danger">
              <AlertTriangle size={18} />
            </div>
            <div>
              <div className="popup-title">{values.title}</div>
            </div>
          </div>

          <div className="popup-body">{values.body}</div>

          <div className="popup-footer">
            <button type="button" className="btn-warning" onClick={values.onCancel}>
              Cancel
            </button>
            <button type="button" className="btn-danger" onClick={values.onConfirm}>
              {values.btnValue1}
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes popup-in {
          from { opacity: 0; transform: scale(0.94) translateY(8px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
        .popup-animate { animation: popup-in 0.2s ease; }
      `}</style>
    </>
  );
}
