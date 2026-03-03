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
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { MdFilterList } from "react-icons/md";

interface FilterSelectProps {
  label: string;
  value: FilterOptionValue;
  onChange: (value: FilterOptionValue) => void;
  triggerClassName?: string;
  showLabel?: boolean;
}
const FilterSelect = ({
  label,
  value,
  onChange,
  triggerClassName = "w-36",
  showLabel = false,
}: FilterSelectProps) => (
  <Select
    value={value}
    onValueChange={(val) => onChange(val as FilterOptionValue)}
  >
    <SelectTrigger className={triggerClassName}>
      <div className="flex items-center gap-1">
        {showLabel && <span className="font-semibold">{label}:</span>}
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
);

interface OverviewFiltersProps {
  setUsersFilter: Dispatch<SetStateAction<FilterOptionValue>>;
  setSessionsFilter: Dispatch<SetStateAction<FilterOptionValue>>;
}
const OverviewFilters = (props: OverviewFiltersProps) => {
  const [localUsersFilter, setLocalUsersFilter] =
    useState<FilterOptionValue>("all");
  const [localSessionsFilter, setLocalSessionsFilter] =
    useState<FilterOptionValue>("all");
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  const handleApplyFilters = () => {
    props.setUsersFilter(localUsersFilter);
    props.setSessionsFilter(localSessionsFilter);
    setIsPopoverOpen(false);
  };

  return (
    <>
      {/* Desktop view */}
      <div className="hidden sm:flex gap-2 items-center">
        <FilterSelect
          label="Users"
          value={localUsersFilter}
          onChange={setLocalUsersFilter}
          triggerClassName="w-36"
          showLabel
        />
        <FilterSelect
          label="Projects"
          value={localSessionsFilter}
          onChange={setLocalSessionsFilter}
          triggerClassName="w-36"
          showLabel
        />
        <Button
          onClick={handleApplyFilters}
          size="sm"
          className="min-w-20 font-semibold"
        >
          Apply
        </Button>
      </div>

      {/* Mobile view */}
      <div className="sm:hidden">
        <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
          <PopoverTrigger asChild>
            <Button size="sm" variant="outline">
              <MdFilterList />
              Filters
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-56">
            <div className="flex flex-col gap-3">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold">Users</label>
                <FilterSelect
                  label="Users"
                  value={localUsersFilter}
                  onChange={setLocalUsersFilter}
                  triggerClassName="w-full"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold">Projects</label>
                <FilterSelect
                  label="Projects"
                  value={localSessionsFilter}
                  onChange={setLocalSessionsFilter}
                  triggerClassName="w-full"
                />
              </div>
              <Button
                onClick={handleApplyFilters}
                size="sm"
                className="w-full font-semibold"
              >
                Apply
              </Button>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </>
  );
};

export default OverviewFilters;
