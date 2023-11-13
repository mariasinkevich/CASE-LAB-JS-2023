import React from "react";
import { Input } from "@skbkontur/react-ui";
import { VehicleFilter, VehicleType} from "../data/vehicles/contracts";
import { VehicleTypeSelect } from "../components/VehicleTypeSelect";

interface FilterProps{
    filter: VehicleFilter,
    onChange: (filter: VehicleFilter) => void;
}

export const Filter: React.FC<FilterProps> = ({ filter, onChange }) => {
    const TitleChange = (title: string): void => {
        onChange({ ...filter, title });
    };

    const TypeChange = (type: VehicleType | null): void => {
        onChange({ ...filter, type });
    };
   
    return (
         <div>
      <h3>Фильтр по типу ТС</h3>
      <Input 
        value={filter.title}
        onValueChange={TitleChange} />
      <VehicleTypeSelect 
        value={filter.type}
        onChange={TypeChange} />
    </div>
    );
};


