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
      <div className="fixed inset-0 bg-black/50 animate-in fade-in duration-300 z-40" />
      <div className="fixed inset-0 flex items-center justify-center z-50 animate-in fade-in zoom-in-95 duration-300">
        <div className="flex flex-col bg-bg w-full max-w-2xl border-2 border-border rounded-2xl overflow-hidden">
          <div className="flex items-center bg-surface shadow-2xl h-12 text-xl font-semibold font-poppins px-5 w-full text-text">
            {values.title}
          </div>
          <div className="flex items-center bg-surface-2 text-base p-5 w-full font-poppins text-text min-h-[80px]">
            {values.body}
          </div>
          <div className="flex flex-row items-center justify-end gap-2 p-3 bg-bg">
            <button type="button" className="btn-warning" onClick={values.onCancel}>
              Cancel
            </button>
            <button type="button" className="btn-primary" onClick={values.onConfirm}>
              {values.btnValue1}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}