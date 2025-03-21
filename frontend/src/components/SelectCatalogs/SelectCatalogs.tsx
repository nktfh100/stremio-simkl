import { useState } from "react";
import styles from "./SelectCatalogs.module.scss";
import { CatalogType, allCatalogs, defaultCatalogs } from "@shared/catalogs";
import { CatalogItem } from "./CatalogItem";
import { setSelectedCatalogs } from "@/lib/appStore";

import { DndProvider } from "react-dnd-multi-backend";
import { HTML5toTouch } from "rdndmb-html5-to-touch";

export const SelectCatalogs = () => {
  const [orderedCatalogs, setOrderedCatalogs] = useState(
    allCatalogs.map((c) => ({
      name: c,
      selected: defaultCatalogs.includes(c),
    })),
  );

  const toggleSelect = (catalog: CatalogType) => {
    const newOrderedCatalogs = orderedCatalogs.map((c) =>
      c.name === catalog ? { ...c, selected: !c.selected } : c,
    );

    setOrderedCatalogs(newOrderedCatalogs);
    setSelectedCatalogs(
      newOrderedCatalogs.filter((c) => c.selected).map((c) => c.name),
    );
  };

  const moveCatalog = (fromIndex: number, toIndex: number) => {
    const updatedCatalogs = [...orderedCatalogs];
    const [movedItem] = updatedCatalogs.splice(fromIndex, 1);
    updatedCatalogs.splice(toIndex, 0, movedItem);

    setOrderedCatalogs(updatedCatalogs);
    setSelectedCatalogs(
      updatedCatalogs.filter((c) => c.selected).map((c) => c.name),
    );
  };

  return (
    <div className={styles["catalog-container"]}>
      <h2>Catalogs:</h2>

      <div className={styles["catalog-list"]}>
        <DndProvider options={HTML5toTouch}>
          {orderedCatalogs.map(({ name, selected }, index) => (
            <CatalogItem
              key={name}
              catalog={name}
              index={index}
              moveCatalog={moveCatalog}
              toggleSelect={toggleSelect}
              isSelected={selected}
            />
          ))}
        </DndProvider>
      </div>
    </div>
  );
};
