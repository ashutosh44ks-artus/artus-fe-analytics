import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FilterOptions, FilterOptionValue } from "./utils";
import { Dispatch, SetStateAction, useState } from "react";
import { Button } from "@/components/ui/button";

interface OverviewFiltersProps {
  setUsersFilter: Dispatch<SetStateAction<FilterOptionValue>>;
  setSessionsFilter: Dispatch<SetStateAction<FilterOptionValue>>;
}
const OverviewFilters = (props: OverviewFiltersProps) => {
  const [localUsersFilter, setLocalUsersFilter] =
    useState<FilterOptionValue>("all");
  const [localSessionsFilter, setLocalSessionsFilter] =
    useState<FilterOptionValue>("all");
  const handleApplyFilters = () => {
    props.setUsersFilter(localUsersFilter);
    props.setSessionsFilter(localSessionsFilter);
  };
  return (
    <div className="flex gap-2 items-center">
      <Select
        value={localUsersFilter}
        onValueChange={(value) =>
          setLocalUsersFilter(value as FilterOptionValue)
        }
      >
        <SelectTrigger className="w-36">
          <div className="flex items-center gap-1">
            <span className="font-semibold">Users:</span>
            <SelectValue />
          </div>
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {FilterOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
      <Select
        value={localSessionsFilter}
        onValueChange={(value) =>
          setLocalSessionsFilter(value as FilterOptionValue)
        }
      >
        <SelectTrigger className="w-36">
          <div className="flex items-center gap-1">
            <span className="font-semibold">Projects:</span>
            <SelectValue />
          </div>
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {FilterOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
      <Button
        onClick={handleApplyFilters}
        size="sm"
        className="min-w-20 font-semibold"
      >
        Apply
      </Button>
    </div>
  );
};

export default OverviewFilters;
