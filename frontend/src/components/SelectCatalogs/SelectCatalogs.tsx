import { useState } from "react";
import styles from "./SelectCatalogs.module.scss";
import { CatalogType, allCatalogs } from "shared/catalogs";
import { CatalogItem } from "./CatalogItem";
import useAppStore, { setSelectedCatalogs } from "@/lib/appStore";

import { DndProvider } from "react-dnd-multi-backend";
import { HTML5toTouch } from "rdndmb-html5-to-touch";

export const SelectCatalogs = () => {
  const selected = useAppStore((state) => state.selectedCatalogs);
  const [orderedCatalogs, setOrderedCatalogs] = useState(allCatalogs);

  const toggleSelect = (catalog: CatalogType) => {
    const isSelected = selected.includes(catalog);
    const newSelected = isSelected
      ? selected.filter((id) => id !== catalog)
      : [...selected, catalog];
    setSelectedCatalogs(newSelected);
  };

  const moveCatalog = (fromIndex: number, toIndex: number) => {
    const updatedCatalogs = [...orderedCatalogs];
    const [movedItem] = updatedCatalogs.splice(fromIndex, 1);
    updatedCatalogs.splice(toIndex, 0, movedItem);
    setOrderedCatalogs(updatedCatalogs);
  };

  return (
    <div className={styles["catalog-container"]}>
      <h2>Catalogs:</h2>

      <div className={styles["catalog-list"]}>
        <DndProvider options={HTML5toTouch}>
          {orderedCatalogs.map((catalog, index) => (
            <CatalogItem
              key={catalog}
              catalog={catalog}
              index={index}
              moveCatalog={moveCatalog}
              toggleSelect={toggleSelect}
              isSelected={selected.includes(catalog)}
            />
          ))}
        </DndProvider>
      </div>
    </div>
  );
};
