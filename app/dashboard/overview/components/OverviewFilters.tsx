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
import useJobTitles from "@/hooks/use-job-titles";

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

interface AsyncFilterSelectProps {
  label: string;
  value: string;
  options: { label: string; value: string }[];
  onChange: (value: string) => void;
  triggerClassName?: string;
  showLabel?: boolean;
  isLoading?: boolean;
  isError?: boolean;
}
const AsyncFilterSelect = ({
  label,
  value,
  options = [],
  onChange,
  triggerClassName = "w-36",
  showLabel = false,
  isLoading = false,
  isError = false,
}: AsyncFilterSelectProps) => (
  <Select value={value} onValueChange={(val) => onChange(val)}>
    <SelectTrigger className={triggerClassName}>
      <div className="flex items-center gap-1">
        {showLabel && <span className="font-semibold">{label}:</span>}
        <SelectValue />
      </div>
    </SelectTrigger>
    <SelectContent>
      <SelectGroup>
        {isLoading && (
          <SelectItem value="loading" aria-label="Loading" disabled>
            Loading...
          </SelectItem>
        )}
        {isError && (
          <SelectItem
            className="text-red-500"
            value="error"
            disabled
            aria-label="Error loading options"
          >
            Error loading options
          </SelectItem>
        )}
        {options.map((option) => (
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
  setJobTitlesFilter: Dispatch<SetStateAction<string>>;
}
const OverviewFilters = (props: OverviewFiltersProps) => {
  const [localUsersFilter, setLocalUsersFilter] =
    useState<FilterOptionValue>("all");
  const [localSessionsFilter, setLocalSessionsFilter] =
    useState<FilterOptionValue>("all");
  const [localJobTitlesFilter, setLocalJobTitlesFilter] =
    useState<string>("all");
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  const handleApplyFilters = () => {
    props.setUsersFilter(localUsersFilter);
    props.setSessionsFilter(localSessionsFilter);
    props.setJobTitlesFilter(localJobTitlesFilter);
    setIsPopoverOpen(false);
  };

  const { data, isLoading, error } = useJobTitles();

  return (
    <>
      {/* Desktop view */}
      <div className="hidden lg:flex gap-2 items-center">
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
        <AsyncFilterSelect
          label="Job Title"
          value={localJobTitlesFilter}
          onChange={setLocalJobTitlesFilter}
          triggerClassName="w-42"
          showLabel
          isLoading={isLoading}
          isError={!!error}
          options={data}
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
      <div className="lg:hidden">
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
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold">Job Titles</label>
                <AsyncFilterSelect
                  label="Job Title"
                  value={localJobTitlesFilter}
                  onChange={setLocalJobTitlesFilter}
                  triggerClassName="w-full"
                  isLoading={isLoading}
                  isError={!!error}
                  options={data}
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
