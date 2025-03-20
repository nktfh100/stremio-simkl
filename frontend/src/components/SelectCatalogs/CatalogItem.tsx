import { useDrag, useDrop } from "react-dnd";
import styles from "./CatalogItem.module.scss";
import { CatalogType, frontendCatalogNames } from "@shared/catalogs";
import { useRef } from "react";
import type { Identifier, XYCoord } from "dnd-core";
import { isMobileDevice } from "@/lib/utils";

type CatalogItemProps = {
  catalog: CatalogType;
  index: number;
  moveCatalog: (dragIndex: number, hoverIndex: number) => void;
  toggleSelect: (catalog: CatalogType) => void;
  isSelected: boolean;
};

type DragItem = {
  index: number;
  type: "CATALOG";
  catalog: CatalogType;
};

const isMobile = isMobileDevice();

export const CatalogItem = ({
  catalog,
  index,
  moveCatalog,
  toggleSelect,
  isSelected,
}: CatalogItemProps) => {
  const ref = useRef<HTMLDivElement>(null);

  const [{ handlerId }, drop] = useDrop<
    DragItem,
    void,
    { handlerId: Identifier | null }
  >({
    accept: "CATALOG",
    collect(monitor) {
      return {
        handlerId: monitor.getHandlerId(),
      };
    },
    hover(item: DragItem, monitor) {
      if (!ref.current) {
        return;
      }
      const dragIndex = item.index;
      const hoverIndex = index;

      if (dragIndex === hoverIndex) {
        return;
      }

      const hoverBoundingRect = ref.current?.getBoundingClientRect();

      const hoverMiddleY =
        (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;

      const clientOffset = monitor.getClientOffset();

      const hoverClientY = (clientOffset as XYCoord).y - hoverBoundingRect.top;

      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return;
      }

      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return;
      }

      moveCatalog(dragIndex, hoverIndex);

      item.index = hoverIndex;
    },
  });

  const [{ isDragging }, drag] = useDrag({
    type: "CATALOG",
    item: () => {
      return { index, catalog, type: "CATALOG" };
    },
    collect: (monitor: any) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const draggingOpacity = isMobile ? 1 : 0.3;
  const opacity = isDragging ? draggingOpacity : isSelected ? 1 : 0.3;

  drag(drop(ref));

  return (
    <div
      ref={ref}
      style={{
        opacity,
        backgroundColor: isMobile && isDragging ? "rgba(0, 0, 0, 0.15)" : "",
      }}
      className={styles["catalog-item"]}
      data-handler-id={handlerId}
    >
      <div
        className={styles["catalog-checkbox-container"]}
        onClick={() => toggleSelect(catalog)}
      >
        <input
          type="checkbox"
          checked={isSelected}
          onChange={() => toggleSelect(catalog)}
          className={styles["catalog-checkbox"]}
        />
      </div>
      <span className={styles["drag-handle"]}>☰</span>
      {frontendCatalogNames[catalog]}
    </div>
  );
};
