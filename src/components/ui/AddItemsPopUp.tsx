"use client";
import { useEffect, useState, useRef, useCallback } from "react";

interface Item {
  id: number;
  [key: string]: any;
}

type AddItemsPopUpProps = {
  title?: string;
  displayKey: string;
  selectedIds: number[];
  setSelectedIds: React.Dispatch<React.SetStateAction<number[]>>;
  onClose: () => void;
  fetchFunction: (
    page: number,
    keyword: string,
  ) => Promise<{ content: Item[]; last: boolean }>;
};

export default function AddItemsPopUp({
  title = "Assign Items",
  displayKey,
  selectedIds,
  setSelectedIds,
  onClose,
  fetchFunction,
}: AddItemsPopUpProps) {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [keyword, setKeyword] = useState("");
  const [localSelected, setLocalSelected] = useState<number[]>(selectedIds);
  const bottomRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const fetchItems = useCallback(
    async (pageNum: number, search: string, append = false) => {
      if (pageNum === 0) setLoading(true);
      else setLoadingMore(true);

      try {
        const data = await fetchFunction(pageNum, search);
        const content = data.content ?? data;
        setItems((prev) => (append ? [...prev, ...content] : content));
        setHasMore(!data.last);
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [fetchFunction],
  );

  useEffect(() => {
    fetchItems(0, "");
  }, [fetchItems]);

  // debounced search
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setPage(0);
      fetchItems(0, keyword);
    }, 400);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [keyword]);

  // infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loadingMore && !loading) {
          const nextPage = page + 1;
          setPage(nextPage);
          fetchItems(nextPage, keyword, true);
        }
      },
      { threshold: 1.0 },
    );
    if (bottomRef.current) observer.observe(bottomRef.current);
    return () => observer.disconnect();
  }, [hasMore, loadingMore, loading, page, keyword, fetchItems]);

  const toggleItem = (id: number) => {
    setLocalSelected((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    );
  };

  const handleDone = () => {
    setSelectedIds(localSelected);
    onClose();
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/50 animate-in fade-in duration-300 z-40" />
      <div className="fixed inset-0 flex items-center justify-center z-50 animate-in fade-in zoom-in-95 duration-300">
        <div className="flex flex-col bg-bg w-full max-w-3xl max-h-[80vh] border-2 border-border rounded-2xl overflow-hidden">
          {/* Header */}
          <div className="flex items-center bg-surface h-12 text-xl font-semibold font-poppins px-5 text-text">
            {title}
          </div>

          {/* Search */}
          <div className="px-5 py-3 bg-surface border-b border-border">
            <input
              type="text"
              className="input-text w-full"
              placeholder="Search..."
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            />
          </div>

          {/* List */}
          <div className="flex flex-col overflow-y-auto flex-1 min-h-0 bg-surface-2 p-5 gap-2">
            {loading ? (
              <div className="flex items-center justify-center h-40">
                <div className="w-8 h-8 border-4 border-brand border-t-transparent rounded-full animate-spin" />
              </div>
            ) : items.length === 0 ? (
              <div className="text-center text-muted py-8">No items found</div>
            ) : (
              <>
                {items.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => toggleItem(item.id)}
                    className="flex items-center gap-3 p-3 rounded-lg bg-surface border border-border cursor-pointer hover:border-brand transition"
                  >
                    <input
                      type="checkbox"
                      readOnly
                      checked={localSelected.includes(item.id)}
                      className="w-4 h-4 accent-brand"
                    />
                    <span className="text-text font-poppins">
                      {item[displayKey]}
                    </span>
                  </div>
                ))}

                <div ref={bottomRef} className="py-2 flex justify-center">
                  {loadingMore && (
                    <div className="w-6 h-6 border-4 border-brand border-t-transparent rounded-full animate-spin" />
                  )}
                </div>
              </>
            )}
          </div>

        
          <div className="flex items-center justify-between gap-2 p-3 bg-bg border-t border-border">
            <span className="text-muted text-sm font-poppins">
              {localSelected.length} selected
            </span>
            <div className="flex gap-2">
              <button type="button" className="btn-warning" onClick={onClose}>
                Cancel
              </button>
              <button
                type="button"
                className="btn-primary"
                onClick={handleDone}
              >
                Done
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
