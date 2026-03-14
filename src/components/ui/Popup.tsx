export type PopupFormValues = {
  title: string;
  body: string;
  btnValue1: string;
  onCancel: () => void,
  onConfirm: () => void,
};

export default function Popup(values: PopupFormValues) {
  return (
    <>
      <div className=" fixed inset-0 bg-black/50 animate-in fade-in duration-300 z-40"></div>
      <div className="fixed inset-0 flex items-center justify-center z-50 animate-in fade-in zoom-in-95 duration-300">
        <div className="flex bg-bg w-4xl h-1/3 border-2 rounded-2xl">
          <div className="flex flex-row w-full">
            <div className="flex flex-col w-full">
              <div className="flex items-center bg-surface shadow-2xl rounded-t-2xl h-12 text-3xl font-poppins p-5 w-full">
                {values.title}
              </div>
              <div className="flex items-center surface-2 text-2xl p-5 w-full font-poppins">
                {values.body}
              </div>
              <div className="flex flex-row flex-1 items-end justify-end gap-2 p-2">
                <button type="button" className="btn-warning" onClick={values.onCancel}>
                  Cancel
                </button>
                <button type="button" className="btn-primary" onClick={values.onConfirm}>
                  {values.btnValue1}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
